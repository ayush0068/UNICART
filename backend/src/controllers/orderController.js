import asyncHandler from 'express-async-handler'
import Razorpay      from 'razorpay'
import crypto        from 'crypto'
import Order         from '../models/Order.js'
import Cart          from '../models/Cart.js'
import Coupon        from '../models/Coupon.js'
import Medicine      from '../models/Medicine.js'
import { calcDeliveryCharge, estimateDelivery, paginate, paginateResponse } from '../utils/helpers.js'
import { sendOrderConfirmationEmail } from '../utils/email.js'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

/* ── POST /api/orders ── place order ── */
export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, notes } = req.body

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.medicine')
  if (!cart || cart.items.length === 0) { res.status(400); throw new Error('Cart is empty') }

  /* check stock */
  for (const item of cart.items) {
    if (!item.medicine?.isActive) throw new Error(`${item.name} is no longer available`)
    if (item.medicine.stock < item.quantity) throw new Error(`Only ${item.medicine.stock} units of ${item.name} available`)
  }

  const deliveryCharge = calcDeliveryCharge(cart.subtotal)
  const totalPrice     = +(cart.subtotal - cart.couponDiscount + deliveryCharge).toFixed(2)

  /* create razorpay order if online payment */
  let razorpayOrderId = null
  if (paymentMethod !== 'cod') {
    const rOrder = await razorpay.orders.create({
      amount:   Math.round(totalPrice * 100),
      currency: 'INR',
      receipt:  `mc_${Date.now()}`,
    })
    razorpayOrderId = rOrder.id
  }

  /* create order in DB */
  const order = await Order.create({
    user:             req.user._id,
    items:            cart.items.map(i => ({
      medicine:             i.medicine._id,
      name:                 i.name,
      image:                i.image,
      price:                i.price,
      mrp:                  i.mrp,
      quantity:             i.quantity,
      requiresPrescription: i.requiresPrescription,
    })),
    shippingAddress,
    paymentMethod,
    paymentStatus:    paymentMethod === 'cod' ? 'pending' : 'pending',
    razorpayOrderId,
    itemsPrice:       cart.subtotal,
    deliveryCharge,
    discount:         cart.couponDiscount,
    couponCode:       cart.couponCode,
    totalPrice,
    estimatedDelivery:estimateDelivery(),
    notes,
    fromPrescription: cart.fromPrescription,
    prescription:     cart.prescriptionId,
  })

  /* decrement stock */
  for (const item of cart.items) {
    await Medicine.findByIdAndUpdate(item.medicine._id, { $inc: { stock: -item.quantity } })
  }

  /* mark coupon as used */
  if (cart.couponCode) {
    await Coupon.findOneAndUpdate(
      { code: cart.couponCode },
      { $inc: { usedCount: 1 }, $push: { usedBy: req.user._id } }
    )
  }

  /* clear cart */
  cart.items          = []
  cart.couponCode     = null
  cart.couponDiscount = 0
  await cart.save()

  await sendOrderConfirmationEmail(req.user, order).catch(() => {})

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data:    order,
    ...(razorpayOrderId && { razorpayOrderId, razorpayKeyId: process.env.RAZORPAY_KEY_ID }),
  })
})

/* ── POST /api/orders/verify-payment ── */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body

  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex')

  if (expectedSig !== razorpaySignature) {
    res.status(400); throw new Error('Payment verification failed')
  }

  const order = await Order.findById(orderId)
  if (!order) { res.status(404); throw new Error('Order not found') }

  order.paymentStatus       = 'paid'
  order.status              = 'confirmed'
  order.razorpayPaymentId   = razorpayPaymentId
  order.razorpaySignature   = razorpaySignature
  order.paidAt              = new Date()
  await order.save()

  res.json({ success: true, message: 'Payment verified', data: order })
})

/* ── GET /api/orders ── my orders ── */
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query
  const filter = { user: req.user._id }
  if (status) filter.status = status

  const { page: pg, limit: lim } = paginate(page, page, limit)
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((pg - 1) * lim).limit(lim),
    Order.countDocuments(filter),
  ])

  res.json({ success: true, ...paginateResponse(orders, total, pg, lim) })
})

/* ── GET /api/orders/:id ── single order ── */
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone')
  if (!order) { res.status(404); throw new Error('Order not found') }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized')
  }
  res.json({ success: true, data: order })
})

/* ── PUT /api/orders/:id/cancel ── */
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (!order) { res.status(404); throw new Error('Order not found') }
  if (order.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized') }

  const cancellable = ['placed', 'confirmed']
  if (!cancellable.includes(order.status)) {
    res.status(400); throw new Error(`Cannot cancel order in '${order.status}' status`)
  }

  /* restore stock */
  for (const item of order.items) {
    await Medicine.findByIdAndUpdate(item.medicine, { $inc: { stock: item.quantity } })
  }

  order.status             = 'cancelled'
  order.cancellationReason = req.body.reason || 'Cancelled by user'
  order.cancelledAt        = new Date()
  await order.save()

  res.json({ success: true, message: 'Order cancelled', data: order })
})

/* ── ADMIN: PUT /api/orders/:id/status ── */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, message, trackingId, deliveryPartner } = req.body
  const order = await Order.findById(req.params.id)
  if (!order) { res.status(404); throw new Error('Order not found') }

  order.status = status
  if (message)         order.statusHistory[order.statusHistory.length - 1].message = message
  if (trackingId)      order.trackingId    = trackingId
  if (deliveryPartner) order.deliveryPartner = deliveryPartner
  if (status === 'delivered') order.deliveredAt = new Date()
  await order.save()

  res.json({ success: true, data: order })
})