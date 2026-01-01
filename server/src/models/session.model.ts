import mongoose, { Document } from 'mongoose'

export type ISession = Document & {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  refreshToken: string
  isActive: boolean
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// TTL Index: Tự động xóa document sau khi expiresAt
// MongoDB sẽ check mỗi 60 giây và xóa documents đã hết hạn
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Compound index for performance
SessionSchema.index({ userId: 1, isActive: 1 })

export const Session = mongoose.model<ISession>('Session', SessionSchema)
