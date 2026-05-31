import asyncHandler  from 'express-async-handler'
import Prescription   from '../models/Prescription.js'
import Cart           from '../models/Cart.js'
import Medicine       from '../models/Medicine.js'
import { paginate, paginateResponse } from '../utils/helpers.js'

/* fuzzy-match medicine name to inventory */
const mapMedicinesToInventory = async (medicines) => {
  const results = []
  for (const item of medicines) {
    const query = item.saltName || item.medicineName
    const found = await Medicine.findOne({
      isActive: true,
      $or: [
        { saltName:    { $regex: query, $options: 'i' } },
        { name:        { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } },
      ],
    })
    results.push({
      ...item,
      mappedMedicine: found?._id || null,
      isMapped:       !!found,
      isAvailable:    found ? found.stock > 0 : false,
    })
  }
  return results
}

/* ── POST /api/prescriptions ── upload ── */
export const uploadPrescription = asyncHandler(async (req, res) => {
  if (!req.files?.length) { res.status(400); throw new Error('Please upload at least one prescription image') }

  const images = req.files.map(f => ({
    url:       f.path || f.secure_url || `/uploads/prescriptions/${f.filename}`,
    public_id: f.filename || f.public_id || f.originalname,
  }))

  let medicines = []
  if (req.body.medicines) {
    try { medicines = JSON.parse(req.body.medicines) } catch {}
  }
  if (medicines.length) medicines = await mapMedicinesToInventory(medicines)

  const prescription = await Prescription.create({
    user:        req.user._id,
    images,
    medicines,
    doctorName:  req.body.doctorName  || '',
    hospitalName:req.body.hospitalName|| '',
    notes:       req.body.notes       || '',
    validTill:   req.body.validTill   || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
  })

  res.status(201).json({
    success: true,
    message: 'Prescription uploaded — under review',
    data:    prescription,
  })
})

/* ── GET /api/prescriptions ── my list ── */
export const getMyPrescriptions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query
  const { page: pg, limit: lim } = paginate(page, page, limit)

  const [data, total] = await Promise.all([
    Prescription.find({ user: req.user._id })
      .sort({ createdAt: -1 }).skip((pg - 1) * lim).limit(lim),
    Prescription.countDocuments({ user: req.user._id }),
  ])
  res.json({ success: true, ...paginateResponse(data, total, pg, lim) })
})

/* ── GET /api/prescriptions/:id ── */
export const getPrescription = asyncHandler(async (req, res) => {
  const rx = await Prescription.findById(req.params.id)
    .populate('medicines.mappedMedicine', 'name price mrp images stock')
  if (!rx) { res.status(404); throw new Error('Prescription not found') }
  if (rx.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized')
  }
  res.json({ success: true, data: rx })
})

/* ── POST /api/prescriptions/:id/create-cart ── auto-fill cart ── */
export const createCartFromPrescription = asyncHandler(async (req, res) => {
  const rx = await Prescription.findById(req.params.id)
    .populate('medicines.mappedMedicine')
  if (!rx) { res.status(404); throw new Error('Prescription not found') }
  if (rx.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized') }
  if (rx.status !== 'verified') { res.status(400); throw new Error('Prescription not yet verified') }

  const availableItems = rx.medicines.filter(m => m.isMapped && m.isAvailable && m.mappedMedicine)

  if (!availableItems.length) {
    res.status(400); throw new Error('No available medicines found from this prescription')
  }

  let cart = await Cart.findOne({ user: req.user._id })
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] })

  /* clear and rebuild from prescription */
  cart.items = []
  for (const item of availableItems) {
    const med = item.mappedMedicine
    cart.items.push({
      medicine:             med._id,
      name:                 med.name,
      price:                med.price,
      mrp:                  med.mrp,
      image:                med.images?.[0]?.url || '',
      quantity:             item.quantity || 1,
      requiresPrescription: med.requiresPrescription,
    })
  }

  cart.fromPrescription = true
  cart.prescriptionId   = rx._id
  await cart.save()

  res.json({
    success: true,
    message: `${availableItems.length} medicines added to cart from prescription`,
    data:    cart,
    unavailable: rx.medicines.filter(m => !m.isMapped || !m.isAvailable).map(m => m.medicineName),
  })
})

/* ── ADMIN: GET /api/prescriptions/pending ── */
export const getPendingPrescriptions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query
  const { page: pg, limit: lim } = paginate(page, page, limit)
  const [data, total] = await Promise.all([
    Prescription.find({ status: 'pending' })
      .populate('user', 'name email phone')
      .sort({ createdAt: 1 }).skip((pg - 1) * lim).limit(lim),
    Prescription.countDocuments({ status: 'pending' }),
  ])
  res.json({ success: true, ...paginateResponse(data, total, pg, lim) })
})

/* ── ADMIN: PUT /api/prescriptions/:id/verify ── */
export const verifyPrescription = asyncHandler(async (req, res) => {
  const { status, rejectReason, medicines } = req.body
  const rx = await Prescription.findById(req.params.id)
  if (!rx) { res.status(404); throw new Error('Prescription not found') }

  rx.status       = status         // 'verified' or 'rejected'
  rx.verifiedBy   = req.user._id
  rx.verifiedAt   = new Date()
  rx.rejectReason = rejectReason || ''

  if (status === 'verified' && medicines?.length) {
    rx.medicines = await mapMedicinesToInventory(medicines)
  }
  await rx.save()

  res.json({ success: true, message: `Prescription ${status}`, data: rx })
})

/* ── UniCare webhook: POST /api/prescriptions/unicare ── */
export const receiveUniCarePrescription = asyncHandler(async (req, res) => {
  const sig = req.headers['x-unicare-signature']
  if (sig !== process.env.UNICARE_WEBHOOK_SECRET) {
    res.status(401); throw new Error('Invalid UniCare signature')
  }

  const { patientId, prescriptionId, medicines, doctorName, notes } = req.body
  const User = (await import('../models/User.js')).default
  const user = await User.findOne({ unicarePatientId: patientId })
  if (!user) { res.status(404); throw new Error('Patient not linked to MediCart account') }

  const mappedMeds = await mapMedicinesToInventory(medicines)

  const rx = await Prescription.create({
    user:                 user._id,
    medicines:            mappedMeds,
    doctorName,
    notes,
    status:               'verified',   // auto-verified from trusted source
    fromUniCare:          true,
    unicarePrescriptionId:prescriptionId,
    unicarePatientId:     patientId,
    validTill:            new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  })

  const checkoutUrl = `${process.env.CLIENT_URL}/cart?rx=${rx._id}`
  res.json({ success: true, prescriptionId: rx._id, checkoutUrl })
})