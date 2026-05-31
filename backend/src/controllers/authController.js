import asyncHandler from 'express-async-handler'
import crypto       from 'crypto'
import User         from '../models/User.js'
import { sendTokenResponse }       from '../utils/jwt.js'
import { generateOTP }             from '../utils/helpers.js'
import { sendOtpEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email.js'

/* ── POST /api/auth/register ── */
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) { res.status(400); throw new Error('Email already registered') }

  const otp    = generateOTP()
  const expiry = new Date(Date.now() + 10 * 60 * 1000)   // 10 min

  const user = await User.create({
    name, email, phone, password,
    emailOtp: otp, emailOtpExpiry: expiry,
  })

  await sendOtpEmail(email, otp).catch(() => {})
  await sendWelcomeEmail(user).catch(() => {})

  sendTokenResponse(user, 201, res)
})

/* ── POST /api/auth/login ── */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password')
  }
  if (!user.isActive) { res.status(401); throw new Error('Account deactivated') }

  user.lastLogin = new Date()
  await user.save({ validateBeforeSave: false })

  sendTokenResponse(user, 200, res)
})

/* ── POST /api/auth/verify-email ── */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body
  const user = await User.findById(req.user._id).select('+emailOtp +emailOtpExpiry')

  if (!user.emailOtp || user.emailOtp !== otp) {
    res.status(400); throw new Error('Invalid OTP')
  }
  if (user.emailOtpExpiry < new Date()) {
    res.status(400); throw new Error('OTP expired')
  }

  user.isVerified    = true
  user.emailOtp      = undefined
  user.emailOtpExpiry = undefined
  await user.save({ validateBeforeSave: false })

  res.json({ success: true, message: 'Email verified successfully' })
})

/* ── POST /api/auth/resend-otp ── */
export const resendOtp = asyncHandler(async (req, res) => {
  const user   = await User.findById(req.user._id)
  const otp    = generateOTP()
  const expiry = new Date(Date.now() + 10 * 60 * 1000)

  user.emailOtp       = otp
  user.emailOtpExpiry = expiry
  await user.save({ validateBeforeSave: false })
  await sendOtpEmail(user.email, otp)

  res.json({ success: true, message: 'OTP sent to your email' })
})

/* ── POST /api/auth/forgot-password ── */
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) { res.status(404); throw new Error('No account with that email') }

  const token  = crypto.randomBytes(32).toString('hex')
  const hashed = crypto.createHash('sha256').update(token).digest('hex')

  user.resetPasswordToken  = hashed
  user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000)   // 15 min
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`
  await sendPasswordResetEmail(user.email, resetUrl)

  res.json({ success: true, message: 'Password reset link sent to email' })
})

/* ── PUT /api/auth/reset-password/:token ── */
export const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({
    resetPasswordToken:  hashed,
    resetPasswordExpiry: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpiry')

  if (!user) { res.status(400); throw new Error('Invalid or expired reset link') }

  user.password            = req.body.password
  user.resetPasswordToken  = undefined
  user.resetPasswordExpiry = undefined
  await user.save()

  res.json({ success: true, message: 'Password reset successful' })
})

/* ── GET /api/auth/me ── */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  res.json({ success: true, user })
})

/* ── PUT /api/auth/update-profile ── */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  )
  res.json({ success: true, user })
})

/* ── PUT /api/auth/change-password ── */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findById(req.user._id).select('+password')

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400); throw new Error('Current password incorrect')
  }
  user.password = newPassword
  await user.save()

  res.json({ success: true, message: 'Password changed successfully' })
})

/* ── POST /api/auth/address ── */
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const addr = req.body

  if (addr.isDefault || user.addresses.length === 0) {
    user.addresses.forEach(a => { a.isDefault = false })
    addr.isDefault = true
  }
  user.addresses.push(addr)
  await user.save()

  res.status(201).json({ success: true, addresses: user.addresses })
})

/* ── PUT /api/auth/address/:id ── */
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  const addr = user.addresses.id(req.params.id)
  if (!addr) { res.status(404); throw new Error('Address not found') }

  if (req.body.isDefault) user.addresses.forEach(a => { a.isDefault = false })
  Object.assign(addr, req.body)
  await user.save()

  res.json({ success: true, addresses: user.addresses })
})

/* ── DELETE /api/auth/address/:id ── */
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id)
  await user.save()
  res.json({ success: true, addresses: user.addresses })
})