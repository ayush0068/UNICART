import jwt    from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User   from '../models/User.js'

/* ── verify JWT and attach user to req ── */
export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized — no token')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      res.status(401)
      throw new Error('User not found')
    }
    if (!req.user.isActive) {
      res.status(401)
      throw new Error('Account deactivated')
    }
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized — invalid token')
  }
})

/* ── role-based access ── */
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403)
    throw new Error(`Role '${req.user.role}' is not authorized for this route`)
  }
  next()
}

/* ── optional auth (doesn't fail if no token) ── */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
    } catch {}
  }
  next()
})