import crypto from 'crypto'

/* ── Standard API response ── */
export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, ...data })

export const sendError = (res, message = 'Something went wrong', statusCode = 500) =>
  res.status(statusCode).json({ success: false, message })

/* ── Pagination helper ── */
export const paginate = (query, page = 1, limit = 12) => {
  const p    = Math.max(1, parseInt(page))
  const l    = Math.min(50, Math.max(1, parseInt(limit)))
  const skip = (p - 1) * l
  return { skip, limit: l, page: p }
}

export const paginateResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    total,
    page:      parseInt(page),
    limit:     parseInt(limit),
    pages:     Math.ceil(total / limit),
    hasNext:   page * limit < total,
    hasPrev:   page > 1,
  },
})

/* ── OTP generator ── */
export const generateOTP = (len = 6) =>
  Math.floor(10 ** (len - 1) + Math.random() * (9 * 10 ** (len - 1))).toString()

/* ── Crypto token ── */
export const generateCryptoToken = () => crypto.randomBytes(32).toString('hex')

/* ── Delivery charge calculator ── */
export const calcDeliveryCharge = (subtotal, pincode) => {
  if (subtotal >= 499) return 0
  return 49
}

/* ── Estimate delivery date ── */
export const estimateDelivery = (pincode) => {
  const d = new Date()
  d.setDate(d.getDate() + 1)          // next day default
  d.setHours(20, 0, 0, 0)
  return d
}

/* ── Slug generator ── */
export const toSlug = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')