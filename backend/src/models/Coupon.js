import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  description:   { type: String, default: '' },
  type:          { type: String, enum: ['percent', 'flat'], required: true },
  value:         { type: Number, required: true },       // 20 = 20% or ₹20
  minOrderValue: { type: Number, default: 0 },
  maxDiscount:   { type: Number, default: null },        // cap for percent coupons
  usageLimit:    { type: Number, default: null },        // total uses allowed
  usedCount:     { type: Number, default: 0 },
  perUserLimit:  { type: Number, default: 1 },
  usedBy:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive:      { type: Boolean, default: true },
  expiresAt:     { type: Date, required: true },
}, { timestamps: true })

export default mongoose.model('Coupon', couponSchema)