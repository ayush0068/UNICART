import asyncHandler from 'express-async-handler'
import Cart          from '../models/Cart.js'
import Medicine      from '../models/Medicine.js'
import Coupon        from '../models/Coupon.js'
import { calcDeliveryCharge } from '../utils/helpers.js'

const populateCart = (cart) => cart.populate('items.medicine', 'name images price mrp stock isActive requiresPrescription')

/* ── GET /api/cart ── */
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] })
  await populateCart(cart)

  const delivery = calcDeliveryCharge(cart.subtotal)
  res.json({
    success: true,
    data: {
      ...cart.toJSON(),
      deliveryCharge: delivery,
      totalPrice: +(cart.subtotal - cart.couponDiscount + delivery).toFixed(2),
    },
  })
})

/* ── POST /api/cart ── add / update item ── */
export const addToCart = asyncHandler(async (req, res) => {
  const { medicineId, quantity = 1 } = req.body

  const medicine = await Medicine.findById(medicineId)
  if (!medicine)      { res.status(404); throw new Error('Medicine not found') }
  if (!medicine.isActive) { res.status(400); throw new Error('Medicine unavailable') }
  if (medicine.stock < 1) { res.status(400); throw new Error('Out of stock') }

  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] })

  const existingIdx = cart.items.findIndex(i => i.medicine.toString() === medicineId)

  if (existingIdx > -1) {
    const newQty = cart.items[existingIdx].quantity + Number(quantity)
    if (newQty > medicine.stock) {
      res.status(400); throw new Error(`Only ${medicine.stock} units available`)
    }
    cart.items[existingIdx].quantity = newQty
  } else {
    cart.items.push({
      medicine:             medicine._id,
      name:                 medicine.name,
      price:                medicine.price,
      mrp:                  medicine.mrp,
      image:                medicine.images?.[0]?.url || '',
      quantity:             Number(quantity),
      requiresPrescription: medicine.requiresPrescription,
    })
  }

  await cart.save()
  await populateCart(cart)

  res.json({ success: true, message: 'Added to cart', data: cart, totalItems: cart.totalItems })
})

/* ── PUT /api/cart/:itemId ── update quantity ── */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) { res.status(404); throw new Error('Cart not found') }

  const item = cart.items.id(req.params.itemId)
  if (!item) { res.status(404); throw new Error('Item not found in cart') }

  if (Number(quantity) <= 0) {
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId)
  } else {
    item.quantity = Number(quantity)
  }

  await cart.save()
  await populateCart(cart)
  res.json({ success: true, data: cart, totalItems: cart.totalItems })
})

/* ── DELETE /api/cart/:itemId ── */
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) { res.status(404); throw new Error('Cart not found') }

  cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId)
  await cart.save()
  await populateCart(cart)
  res.json({ success: true, message: 'Item removed', data: cart, totalItems: cart.totalItems })
})

/* ── DELETE /api/cart ── clear cart ── */
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: null, couponDiscount: 0 })
  res.json({ success: true, message: 'Cart cleared' })
})

/* ── POST /api/cart/coupon ── apply coupon ── */
export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart || cart.items.length === 0) { res.status(400); throw new Error('Cart is empty') }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, expiresAt: { $gt: new Date() } })
  if (!coupon) { res.status(400); throw new Error('Invalid or expired coupon') }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(400); throw new Error('Coupon usage limit reached')
  }
  if (coupon.usedBy.includes(req.user._id)) {
    res.status(400); throw new Error('Coupon already used by you')
  }
  if (cart.subtotal < coupon.minOrderValue) {
    res.status(400); throw new Error(`Minimum order ₹${coupon.minOrderValue} required`)
  }

  let discount = coupon.type === 'percent'
    ? (cart.subtotal * coupon.value) / 100
    : coupon.value

  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount)

  cart.couponCode     = coupon.code
  cart.couponDiscount = +discount.toFixed(2)
  await cart.save()

  res.json({
    success:  true,
    message:  `Coupon applied — you save ₹${discount.toFixed(0)}`,
    discount: cart.couponDiscount,
    code:     cart.couponCode,
  })
})

/* ── DELETE /api/cart/coupon ── remove coupon ── */
export const removeCoupon = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { couponCode: null, couponDiscount: 0 })
  res.json({ success: true, message: 'Coupon removed' })
})