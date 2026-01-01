import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import auth from '@/router/auth.router'
import { connectDB } from '@/config/db'
import { authenticate, authorize } from '@/middlewares/auth.middleware'
import courseRouter from '@/router/course.router'
import exploreRouter from '@/router/explore.router'
import adminRouter from '@/router/admin.router'
import user from '@/router/user.router'
import filesRouter from '@/router/filesUpload'
import sectionRouter from '@/router/section.router'
import lessonRouter from '@/router/lesson.router'
import enrollmentRouter from '@/router/enrollment.router'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080

// ==================== MIDDLEWARE ====================

// CORS - Allow cross-origin requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true // Allow cookies
  })
)

// Body parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookie parser
app.use(cookieParser())

// Static files
app.use(express.static('public'))

// ==================== DATABASE ====================
connectDB()

// ==================== ROUTES ====================

// 1. PUBLIC ROUTES - No authentication required
app.use('/api/auth', auth)
app.use('/api/explore', exploreRouter)
app.use('/api/files', filesRouter);

// 2. PROTECTED ROUTES - Authentication required for all routes below
app.use('/api/courses', authenticate, courseRouter)
app.use('/api/section', authenticate, sectionRouter)
app.use('/api/lesson', authenticate, lessonRouter)
app.use('/api/enrollments', enrollmentRouter)
app.use('/api/admin', authenticate, authorize('ADMIN'), adminRouter) // Placeholder for admin routes

app.use('/api/user', authenticate, user)



// Root route
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

export default app