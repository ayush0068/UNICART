import multer   from 'multer'
import path     from 'path'
import { v2 as cloudinary } from 'cloudinary'

/* ─────────────────────────────────────────────────────────
   Custom Cloudinary storage engine — no third-party pkg
   Works perfectly with ESM + Node 23
───────────────────────────────────────────────────────── */
class CloudinaryEngine {
  constructor (opts) {
    this.cloudinary = opts.cloudinary
    this.folder     = opts.folder
    this.transformation = opts.transformation || []
  }

  _handleFile (req, file, cb) {
    const uploadStream = this.cloudinary.uploader.upload_stream(
      {
        folder:         this.folder,
        transformation: this.transformation,
        resource_type:  'auto',
      },
      (error, result) => {
        if (error) return cb(error)
        cb(null, {
          path:      result.secure_url,
          filename:  result.public_id,
          size:      result.bytes,
        })
      }
    )
    file.stream.pipe(uploadStream)
  }

  _removeFile (req, file, cb) {
    this.cloudinary.uploader.destroy(file.filename, cb)
  }
}

/* ─── Cloudinary engines ─── */
const prescriptionEngine = new CloudinaryEngine({
  cloudinary,
  folder:         'medicart/prescriptions',
  transformation: [{ width: 1200, quality: 'auto' }],
})

const productEngine = new CloudinaryEngine({
  cloudinary,
  folder:         'medicart/products',
  transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
})

/* ─── Local disk fallback ─── */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'prescription'
      ? 'uploads/prescriptions'
      : 'uploads/products'
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
    cb(null, name)
  },
})

/* ─── File filter ─── */
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|pdf/
  const ext  = allowed.test(path.extname(file.originalname).toLowerCase())
  const mime = allowed.test(file.mimetype)
  if (ext && mime) cb(null, true)
  else cb(new Error('Only jpg, png, webp and PDF files allowed'), false)
}

const useCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY    &&
  process.env.CLOUDINARY_API_SECRET
)

export const uploadPrescription = multer({
  storage:   useCloudinary ? prescriptionEngine : diskStorage,
  limits:    { fileSize: 10 * 1024 * 1024 },
  fileFilter,
}).array('prescription', 4)

export const uploadProductImage = multer({
  storage:   useCloudinary ? productEngine : diskStorage,
  limits:    { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array('images', 5)