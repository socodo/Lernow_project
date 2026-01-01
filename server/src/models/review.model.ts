import mongoose, { Document, Schema } from 'mongoose'

export type IReview = Document & {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
};

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
)

// Compound index to ensure one review per user per course
ReviewSchema.index({ userId: 1, courseId: 1 }, { unique: true })

// Indexes for queries
ReviewSchema.index({ courseId: 1, rating: -1 })
ReviewSchema.index({ courseId: 1, createdAt: -1 })
ReviewSchema.index({ userId: 1, createdAt: -1 })

export const Review = mongoose.model<IReview>('Review', ReviewSchema)
