import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  name:     { type: String, required: true },
  image:    { type: String, default: '' },
  price:    { type: Number, required: true },
  mrp:      { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  requiresPrescription: { type: Boolean, default: false },
}, { _id: true })

const orderSchema = new mongoose.Schema({
  orderId: {
    type:    String,
    unique:  true,
  },
  user: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  items:        [orderItemSchema],

  shippingAddress: {
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    line1:   { type: String, required: true },
    line2:   { type: String, default: '' },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true },
  },

  paymentMethod:  { type: String, enum: ['razorpay', 'cod', 'upi', 'card', 'netbanking'], required: true },
  paymentStatus:  { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId:{ type: String, default: null },
  razorpayPaymentId:{ type: String, default: null },
  razorpaySignature:{ type: String, default: null },
  paidAt:         { type: Date, default: null },

  itemsPrice:     { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  discount:       { type: Number, default: 0 },
  couponCode:     { type: String, default: null },
  totalPrice:     { type: Number, required: true },

  status: {
    type:    String,
    enum:    ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed',
  },

  statusHistory: [{
    status:    String,
    message:   String,
    timestamp: { type: Date, default: Date.now },
  }],

  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', default: null },
  fromPrescription: { type: Boolean, default: false },

  estimatedDelivery: { type: Date },
  deliveredAt:       { type: Date, default: null },
  cancelledAt:       { type: Date, default: null },
  cancellationReason:{ type: String, default: '' },

  deliveryPartner:   { type: String, default: '' },
  trackingId:        { type: String, default: '' },

  notes: { type: String, default: '' },
}, {
  timestamps: true,
})

/* auto-generate readable order ID */
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const ts  = Date.now().toString().slice(-8)
    const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    this.orderId = `MC${ts}${rnd}`
  }
  /* push to statusHistory on status change */
  if (this.isModified('status')) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() })
  }
  next()
})

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderId: 1 })
orderSchema.index({ status: 1 })

export default mongoose.model('Order', orderSchema)