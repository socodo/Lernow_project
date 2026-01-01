import mongoose, { Document } from 'mongoose'

export type IUser = Document & {
  _id: mongoose.Types.ObjectId
  email: string
  fullName: string
  passwordHash: string
  dateOfBirth: Date
  profilePic?: string
  shortDesc?: string
  links?: {
    linkedin?: string
    googleScholar?: string
    instagram?: string
    facebook?: string
  }
  role: 'USER' | 'ADMIN'
  isEmailVerified: boolean
  balance: number
  isActive: boolean
  lastLoginAt?: Date
  emailVerificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      require: true
    },
    profilePic: {
      type: String
    },
    shortDesc: {
      type: String
    },
    links: {
      linkedin: { type: String },
      googleScholar: { type: String },
      instagram: { type: String },
      facebook: { type: String }
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      index: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    lastLoginAt: {
      type: Date
    },
    emailVerificationToken: {
      type: String
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

// Indexes for performance
// Email index được tạo tự động bởi unique: true
UserSchema.index({ role: 1, isActive: 1 })

export const User = mongoose.model<IUser>('User', UserSchema)
