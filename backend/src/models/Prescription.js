import mongoose from 'mongoose'

const prescriptionItemSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  saltName:     { type: String, default: '' },
  strength:     { type: String, default: '' },      // 650mg
  dosage:       { type: String, default: '' },      // 1-0-1
  frequency:    { type: String, default: '' },      // twice daily
  duration:     { type: String, default: '' },      // 5 days
  quantity:     { type: Number, default: 1 },
  instructions: { type: String, default: '' },      // after food

  // mapped medicine from inventory
  mappedMedicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', default: null },
  isMapped:       { type: Boolean, default: false },
  isAvailable:    { type: Boolean, default: false },
}, { _id: true })

const prescriptionSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // uploaded image
  images:   [{ url: String, public_id: String }],

  // doctor info
  doctorName:       { type: String, default: '' },
  doctorRegNo:      { type: String, default: '' },
  hospitalName:     { type: String, default: '' },
  consultationDate: { type: Date,   default: null },

  // parsed medicines
  medicines:  [prescriptionItemSchema],
  notes:      { type: String, default: '' },

  status: {
    type:    String,
    enum:    ['pending', 'under_review', 'verified', 'rejected', 'expired'],
    default: 'pending',
  },
  verifiedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  verifiedAt:  { type: Date, default: null },
  rejectReason:{ type: String, default: '' },

  // validity
  validTill:   { type: Date, default: null },
  isExpired:   { type: Boolean, default: false },

  // UniCare integration
  fromUniCare:          { type: Boolean, default: false },
  unicarePrescriptionId:{ type: String, default: null },
  unicarePatientId:     { type: String, default: null },

  // linked orders
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, {
  timestamps: true,
})

prescriptionSchema.index({ user: 1, createdAt: -1 })
prescriptionSchema.index({ status: 1 })
prescriptionSchema.index({ unicarePrescriptionId: 1 })

export default mongoose.model('Prescription', prescriptionSchema)