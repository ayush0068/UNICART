import jwt from 'jsonwebtoken'

export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

export const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' })

export const sendTokenResponse = (user, statusCode, res) => {
  const token        = generateToken(user._id)
  const refreshToken = generateRefreshToken(user._id)

  res.status(statusCode).json({
    success:      true,
    token,
    refreshToken,
    user: {
      _id:        user._id,
      name:       user.name,
      email:      user.email,
      phone:      user.phone,
      role:       user.role,
      avatar:     user.avatar,
      isVerified: user.isVerified,
      addresses:  user.addresses,
    },
  })
}