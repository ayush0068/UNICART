import 'dotenv/config'
import express      from 'express'
import cors         from 'cors'
import helmet       from 'helmet'
import morgan       from 'morgan'
import rateLimit    from 'express-rate-limit'
import path         from 'path'
import { fileURLToPath } from 'url'

import connectDB    from './config/db.js'
import authRoutes   from './routes/authRoutes.js'
import medicineRoutes from './routes/medicineRoutes.js'
import { cartRouter, orderRouter, prescriptionRouter } from './routes/otherRoutes.js'
import { notFound, errorHandler } from './middleware/error.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/* ── Connect DB ── */
await connectDB()

const app = express()

/* ── Security ── */
app.use(helmet())
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

/* ── Rate limiting ── */
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min
  max:      20,
  message:  { success: false, message: 'Too many requests, please try again later' },
}))

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      200,
}))

/* ── Body parsing ── */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* ── Logging ── */
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

/* ── Static uploads (dev fallback) ── */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

/* ── Health check ── */
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'MediCart API running', env: process.env.NODE_ENV })
)

/* ── Routes ── */
app.use('/api/auth',          authRoutes)
app.use('/api/medicines',     medicineRoutes)
app.use('/api/cart',          cartRouter)
app.use('/api/orders',        orderRouter)
app.use('/api/prescriptions', prescriptionRouter)

/* ── Error handlers ── */
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 MediCart API running on port ${PORT} [${process.env.NODE_ENV}]`)
})

export default app