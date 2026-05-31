import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const addressSchema = new mongoose.Schema({
  label:    { type: String, default: 'Home' },       // Home / Work / Other
  name:     { type: String, required: true },
  phone:    { type: String, required: true },
  line1:    { type: String, required: true },
  line2:    { type: String, default: '' },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
  isDefault:{ type: Boolean, default: false },
}, { _id: true })

const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Name is required'],
    trim:     true,
  },
  email: {
    type:      String,
    required:  [true, 'Email is required'],
    unique:    true,
    lowercase: true,
    trim:      true,
    match:     [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  phone: {
    type:  String,
    match: [/^[6-9]\d{9}$/, 'Invalid Indian phone number'],
  },
  password: {
    type:     String,
    required: [true, 'Password is required'],
    minlength: 6,
    select:   false,
  },
  avatar:       { type: String, default: '' },
  role:         { type: String, enum: ['user', 'admin', 'pharmacist'], default: 'user' },
  isVerified:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  addresses:    [addressSchema],

  // OTP fields
  emailOtp:     { type: String, select: false },
  emailOtpExpiry:{ type: Date,  select: false },
  phoneOtp:     { type: String, select: false },
  phoneOtpExpiry:{ type: Date,  select: false },

  // Password reset
  resetPasswordToken:  { type: String, select: false },
  resetPasswordExpiry: { type: Date,   select: false },

  // UniCare integration
  unicarePatientId: { type: String, default: null },

  lastLogin: { type: Date },
}, {
  timestamps: true,
})

/* hash password before save */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

/* compare password */
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password)
}

/* remove sensitive fields from JSON output */
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.emailOtp
  delete obj.emailOtpExpiry
  delete obj.phoneOtp
  delete obj.phoneOtpExpiry
  delete obj.resetPasswordToken
  delete obj.resetPasswordExpiry
  return obj
}

export default mongoose.model('User', userSchema)