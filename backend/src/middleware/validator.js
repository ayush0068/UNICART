import { body, validationResult } from 'express-validator'

/* run validation and send errors */
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors:  errors.array(),
    })
  }
  next()
}

/* ── Auth validators ── */
export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Min 2 characters'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Valid Indian phone required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
]

export const loginRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

export const forgotPasswordRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
]

export const resetPasswordRules = [
  body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
]

/* ── Address validators ── */
export const addressRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone required'),
  body('line1').trim().notEmpty().withMessage('Address line 1 is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').isPostalCode('IN').withMessage('Valid 6-digit pincode required'),
]

/* ── Review validators ── */
export const reviewRules = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('comment').trim().notEmpty().withMessage('Comment is required').isLength({ min: 10 }).withMessage('Min 10 characters'),
]

/* ── Order validators ── */
export const orderRules = [
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod').isIn(['razorpay', 'cod', 'upi', 'card', 'netbanking']).withMessage('Invalid payment method'),
]