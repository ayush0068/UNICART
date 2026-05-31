import asyncHandler from 'express-async-handler'
import Medicine      from '../models/Medicine.js'
import { paginate, paginateResponse, toSlug } from '../utils/helpers.js'

/* ── GET /api/medicines ── */
export const getMedicines = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, search, sort, minPrice, maxPrice, prescription } = req.query

  const filter = { isActive: true }

  if (category && category !== 'All') filter.category = category
  if (prescription !== undefined)     filter.requiresPrescription = prescription === 'true'
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  if (search) filter.$text = { $search: search }

  /* sorting */
  let sortObj = { isFeatured: -1, createdAt: -1 }
  if (sort === 'price_asc')    sortObj = { price: 1 }
  if (sort === 'price_desc')   sortObj = { price: -1 }
  if (sort === 'rating')       sortObj = { rating: -1 }
  if (sort === 'discount')     sortObj = { discount: -1 }
  if (sort === 'newest')       sortObj = { createdAt: -1 }
  if (search)                  sortObj = { score: { $meta: 'textScore' }, ...sortObj }

  const { skip, limit: lim, page: pg } = paginate(page, page, limit)
  const [medicines, total] = await Promise.all([
    Medicine.find(filter)
      .sort(sortObj)
      .skip((pg - 1) * lim)
      .limit(lim)
      .select('-reviews'),
    Medicine.countDocuments(filter),
  ])

  res.json({ success: true, ...paginateResponse(medicines, total, pg, lim) })
})

/* ── GET /api/medicines/featured ── */
export const getFeaturedMedicines = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find({ isActive: true, isFeatured: true })
    .limit(8).select('-reviews')
  res.json({ success: true, data: medicines })
})

/* ── GET /api/medicines/categories ── */
export const getCategories = asyncHandler(async (_req, res) => {
  const cats = await Medicine.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
  res.json({ success: true, data: cats })
})

/* ── GET /api/medicines/:slug ── */
export const getMedicineBySlug = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findOne({ slug: req.params.slug, isActive: true })
    .populate('reviews.user', 'name avatar')
  if (!medicine) { res.status(404); throw new Error('Medicine not found') }
  res.json({ success: true, data: medicine })
})

/* ── GET /api/medicines/:id/related ── */
export const getRelatedMedicines = asyncHandler(async (req, res) => {
  const med = await Medicine.findById(req.params.id)
  if (!med) { res.status(404); throw new Error('Medicine not found') }

  const related = await Medicine.find({
    category: med.category,
    _id:      { $ne: med._id },
    isActive: true,
  }).limit(6).select('-reviews')

  res.json({ success: true, data: related })
})

/* ── POST /api/medicines/:id/review ── */
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const medicine = await Medicine.findById(req.params.id)
  if (!medicine) { res.status(404); throw new Error('Medicine not found') }

  const already = medicine.reviews.find(r => r.user.toString() === req.user._id.toString())
  if (already) { res.status(400); throw new Error('You already reviewed this product') }

  medicine.reviews.push({ user: req.user._id, name: req.user.name, rating, comment })
  medicine.updateRating()
  await medicine.save()

  res.status(201).json({ success: true, message: 'Review added', rating: medicine.rating, numReviews: medicine.numReviews })
})

/* ── ADMIN: POST /api/medicines ── */
export const createMedicine = asyncHandler(async (req, res) => {
  const data = { ...req.body }
  data.slug  = toSlug(`${data.name}-${data.brand}-${data.packSize || ''}`)

  if (req.files?.length) {
    data.images = req.files.map(f => ({
      url:       f.path || f.secure_url,
      public_id: f.filename || f.public_id,
    }))
  }

  const medicine = await Medicine.create(data)
  res.status(201).json({ success: true, data: medicine })
})

/* ── ADMIN: PUT /api/medicines/:id ── */
export const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  })
  if (!medicine) { res.status(404); throw new Error('Medicine not found') }
  res.json({ success: true, data: medicine })
})

/* ── ADMIN: DELETE /api/medicines/:id ── */
export const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id)
  if (!medicine) { res.status(404); throw new Error('Medicine not found') }
  medicine.isActive = false
  await medicine.save()
  res.json({ success: true, message: 'Medicine removed' })
})