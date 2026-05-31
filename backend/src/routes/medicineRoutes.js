import { Router } from 'express'
import {
  getMedicines, getFeaturedMedicines, getCategories,
  getMedicineBySlug, getRelatedMedicines,
  addReview, createMedicine, updateMedicine, deleteMedicine,
} from '../controllers/medicineController.js'
import { protect, authorize, optionalAuth } from '../middleware/auth.js'
import { reviewRules, validate }            from '../middleware/validator.js'
import { uploadProductImage }               from '../middleware/upload.js'

const router = Router()

router.get('/',             getMedicines)
router.get('/featured',     getFeaturedMedicines)
router.get('/categories',   getCategories)
router.get('/:slug',        optionalAuth, getMedicineBySlug)
router.get('/:id/related',  getRelatedMedicines)

router.post('/:id/review',  protect, reviewRules, validate, addReview)

/* admin */
router.post  ('/',    protect, authorize('admin'), uploadProductImage, createMedicine)
router.put   ('/:id', protect, authorize('admin'), updateMedicine)
router.delete('/:id', protect, authorize('admin'), deleteMedicine)

export default router