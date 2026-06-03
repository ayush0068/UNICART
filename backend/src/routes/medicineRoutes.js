import { Router } from 'express'
import {
  getMedicines, getFeaturedMedicines, getCategories,
  getMedicineById, getMedicineBySlug, getRelatedMedicines,
  addReview,
  createMedicine, updateMedicine, deleteMedicine, getNearExpiryMedicines,
} from '../controllers/medicineController.js'
import { protect, authorize, optionalAuth } from '../middleware/auth.js'
import { reviewRules, validate }            from '../middleware/validator.js'
import { uploadProductImage }               from '../middleware/upload.js'

const router = Router()

/* ── Public ── */
router.get('/featured',   getFeaturedMedicines)
router.get('/categories', getCategories)
router.get('/',           optionalAuth, getMedicines)   // optionalAuth — admin sees inactive too

/* ── Admin only ── */
router.get   ('/admin/near-expiry', protect, authorize('admin'), getNearExpiryMedicines)
router.get   ('/id/:id',            protect, authorize('admin'), getMedicineById)
router.post  ('/',                  protect, authorize('admin'), uploadProductImage, createMedicine)
router.put   ('/:id',               protect, authorize('admin'), updateMedicine)
router.delete('/:id',               protect, authorize('admin'), deleteMedicine)

/* ── Public (slug — after /id/:id to avoid conflict) ── */
router.get('/:slug',       optionalAuth, getMedicineBySlug)
router.get('/:id/related', getRelatedMedicines)

/* ── User protected ── */
router.post('/:id/review', protect, reviewRules, validate, addReview)

export default router