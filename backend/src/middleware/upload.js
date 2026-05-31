import multer   from 'multer'
import path     from 'path'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

/* ─── Cloudinary storage for prescriptions ─── */
const prescriptionStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'medicart/prescriptions',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
    transformation: [{ width: 1200, quality: 'auto' }],
  },
})

/* ─── Cloudinary storage for product images ─── */
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'medicart/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
})

/* ─── local disk fallback (dev without cloudinary) ─── */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'prescription' ? 'uploads/prescriptions' : 'uploads/products'
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
    cb(null, name)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|pdf/
  const ext     = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime    = allowed.test(file.mimetype)
  if (ext && mime) cb(null, true)
  else cb(new Error('Only images (jpg, png, webp) and PDF files are allowed'), false)
}

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY    &&
  process.env.CLOUDINARY_API_SECRET
)

export const uploadPrescription = multer({
  storage:   useCloudinary ? prescriptionStorage : diskStorage,
  limits:    { fileSize: 10 * 1024 * 1024 },   // 10 MB
  fileFilter,
}).array('prescription', 4)

export const uploadProductImage = multer({
  storage:   useCloudinary ? productStorage : diskStorage,
  limits:    { fileSize: 5 * 1024 * 1024 },    // 5 MB
  fileFilter,
}).array('images', 5)