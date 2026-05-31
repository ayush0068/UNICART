import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true })

const medicineSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  slug:         { type: String, unique: true },
  brand:        { type: String, required: true, trim: true },
  genericName:  { type: String, trim: true },
  description:  { type: String, default: '' },
  category:     {
    type: String,
    required: true,
    enum: [
      'Pain Relief', 'Fever', 'Antibiotics', 'Vitamins & Supplements',
      'Diabetes', 'Heart Care', 'Skincare', 'Baby Care', 'Ayurveda',
      'Cold & Cough', 'Digestive', 'Eye Care', 'Dental', 'Mental Wellness',
      'Sports & Fitness', 'Nutrition', 'Sexual Wellness', 'Lab Tests', 'Other',
    ],
  },

  images:       [{ url: String, public_id: String }],

  price:        { type: Number, required: true, min: 0 },
  mrp:          { type: Number, required: true, min: 0 },
  discount:     { type: Number, default: 0 },           // percentage

  stock:        { type: Number, required: true, default: 0, min: 0 },
  unit:         { type: String, default: 'strip' },       // strip / bottle / box / tube
  packSize:     { type: String, default: '10 tablets' },  // "10 tablets", "200ml"

  requiresPrescription: { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  isFeatured:   { type: Boolean, default: false },

  manufacturer: { type: String, default: '' },
  composition:  { type: String, default: '' },     // active ingredients
  dosageForm:   { type: String, default: '' },     // tablet / syrup / injection
  sideEffects:  { type: String, default: '' },
  howToUse:     { type: String, default: '' },
  storageInfo:  { type: String, default: 'Store below 25°C' },

  tags:         [String],

  reviews:      [reviewSchema],
  rating:       { type: Number, default: 0 },
  numReviews:   { type: Number, default: 0 },

  // For UniCare prescription auto-mapping
  saltName:     { type: String, default: '' },   // e.g. "Paracetamol"
  strength:     { type: String, default: '' },   // e.g. "650mg"
}, {
  timestamps: true,
})

/* auto-calculate discount */
medicineSchema.pre('save', function (next) {
  if (this.mrp > 0) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100)
  }
  next()
})

/* update rating on review change */
medicineSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating     = 0
    this.numReviews = 0
  } else {
    this.numReviews = this.reviews.length
    this.rating     = +(this.reviews.reduce((a, r) => a + r.rating, 0) / this.numReviews).toFixed(1)
  }
}

medicineSchema.index({ name: 'text', genericName: 'text', brand: 'text', saltName: 'text', tags: 'text' })
medicineSchema.index({ category: 1, isActive: 1 })
medicineSchema.index({ slug: 1 })

export default mongoose.model('Medicine', medicineSchema)