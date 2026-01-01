import mongoose from 'mongoose'
import 'dotenv/config'

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI

  if (!mongoURI) {
    console.error('❌ Missing MONGO_URI in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000
    })

    console.log('✅ MongoDB connected successfully')
    console.log(`📍 Database: ${mongoose.connection.name}`)

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected')
    })
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
    })
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}
