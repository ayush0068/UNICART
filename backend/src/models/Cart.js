import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  medicine:    { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  mrp:         { type: Number, required: true },
  image:       { type: String, default: '' },
  quantity:    { type: Number, required: true, min: 1, default: 1 },
  requiresPrescription: { type: Boolean, default: false },
}, { _id: true })

const cartSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items:        [cartItemSchema],
  couponCode:   { type: String, default: null },
  couponDiscount:{ type: Number, default: 0 },

  // For UniCare prescription-based cart
  fromPrescription: { type: Boolean, default: false },
  prescriptionId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', default: null },
}, {
  timestamps: true,
  toJSON:     { virtuals: true },
  toObject:   { virtuals: true },
})

/* virtuals */
cartSchema.virtual('subtotal').get(function () {
  return +this.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)
})

cartSchema.virtual('totalMRP').get(function () {
  return +this.items.reduce((sum, i) => sum + i.mrp * i.quantity, 0).toFixed(2)
})

cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, i) => sum + i.quantity, 0)
})

cartSchema.virtual('hasPrescriptionItems').get(function () {
  return this.items.some(i => i.requiresPrescription)
})

export default mongoose.model('Cart', cartSchema)