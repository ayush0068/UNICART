import { Router as R } from 'express'
import {
  getCart, addToCart, updateCartItem, removeCartItem,
  clearCart, applyCoupon, removeCoupon,
} from '../controllers/cartController.js'
import {
  placeOrder, verifyPayment, getMyOrders,
  getOrder, cancelOrder, updateOrderStatus,
} from '../controllers/orderController.js'
import {
  uploadPrescription, getMyPrescriptions, getPrescription,
  createCartFromPrescription, getPendingPrescriptions,
  verifyPrescription, receiveUniCarePrescription,
} from '../controllers/prescriptionController.js'
import { protect, authorize }    from '../middleware/auth.js'
import { orderRules, validate }  from '../middleware/validator.js'
import { uploadPrescription as rxUploadMiddleware } from '../middleware/upload.js'

/* ── Cart ── */
export const cartRouter = R()
cartRouter.use(protect)
cartRouter.get   ('/',            getCart)
cartRouter.post  ('/',            addToCart)
cartRouter.put   ('/:itemId',     updateCartItem)
cartRouter.delete('/:itemId',     removeCartItem)
cartRouter.delete('/',            clearCart)
cartRouter.post  ('/coupon',      applyCoupon)
cartRouter.delete('/coupon',      removeCoupon)

/* ── Orders ── */
export const orderRouter = R()
orderRouter.use(protect)
orderRouter.post  ('/',                   orderRules, validate, placeOrder)
orderRouter.post  ('/verify-payment',     verifyPayment)
orderRouter.get   ('/',                   getMyOrders)
orderRouter.get   ('/:id',                getOrder)
orderRouter.put   ('/:id/cancel',         cancelOrder)
orderRouter.put   ('/:id/status',         authorize('admin', 'pharmacist'), updateOrderStatus)

/* ── Prescriptions ── */
export const prescriptionRouter = R()
prescriptionRouter.post  ('/unicare',         receiveUniCarePrescription)   // webhook — no auth, sig check inside
prescriptionRouter.use(protect)
prescriptionRouter.post  ('/',                rxUploadMiddleware, uploadPrescription)
prescriptionRouter.get   ('/',                getMyPrescriptions)
prescriptionRouter.get   ('/pending',         authorize('admin', 'pharmacist'), getPendingPrescriptions)
prescriptionRouter.get   ('/:id',             getPrescription)
prescriptionRouter.post  ('/:id/create-cart', createCartFromPrescription)
prescriptionRouter.put   ('/:id/verify',      authorize('admin', 'pharmacist'), verifyPrescription)