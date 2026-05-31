import { Router } from 'express'
import {
  register, login, verifyEmail, resendOtp,
  forgotPassword, resetPassword,
  getMe, updateProfile, changePassword,
  addAddress, updateAddress, deleteAddress,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import {
  registerRules, loginRules, forgotPasswordRules,
  resetPasswordRules, addressRules, validate,
} from '../middleware/validator.js'

const router = Router()

router.post('/register',         registerRules,        validate, register)
router.post('/login',            loginRules,           validate, login)
router.post('/forgot-password',  forgotPasswordRules,  validate, forgotPassword)
router.put ('/reset-password/:token', resetPasswordRules, validate, resetPassword)

/* protected */
router.use(protect)
router.post('/verify-email',     verifyEmail)
router.post('/resend-otp',       resendOtp)
router.get ('/me',               getMe)
router.put ('/update-profile',   updateProfile)
router.put ('/change-password',  changePassword)

/* addresses */
router.post  ('/address',        addressRules, validate, addAddress)
router.put   ('/address/:id',    addressRules, validate, updateAddress)
router.delete('/address/:id',    deleteAddress)

export default router