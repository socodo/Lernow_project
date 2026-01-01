import mongoose, { Document, Schema } from 'mongoose'

export type ICourse = Document & {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  thumbnailUrl?: string;
  whyChooseThisCourse?: string;
  requirements?: string[];
  whatYouWillLearn?: string[];
  language?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  state: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  price: {
    amount: number;
    currency: 'USD' | 'VND';
  };
  averageRating: number;
  totalReviews: number;
  totalEnrollments: number;
  totalLessons: number;
  totalDuration: number;
  tags?: string[];
  creatorId: mongoose.Types.ObjectId;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalDescrypt?: String;
  approvalReason?: string;
  decidedBy: mongoose.Types.ObjectId;
  refundPolicy?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: 'text'
    },
    description: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String
    },
    whyChooseThisCourse: {
      type: String
    },
    requirements: {
      type: [String],
      default: []
    },
    whatYouWillLearn: {
      type: [String],
      default: []
    },
    language: {
      type: String,
      enum: ['en', 'vi', 'es', 'fr', 'de', 'zh', 'ja', 'ko'],
      default: 'en'
    },
    level: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      default: 'BEGINNER',
      index: true
    },
    state: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true
    },
    price: {
      amount: {
        type: Number,
        required: true,
        default: 0, // Free by default
        min: 0
      },
      currency: {
        type: String,
        enum: ['USD', 'VND'],
        default: 'VND'
      }
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    totalEnrollments: {
      type: Number,
      default: 0,
      min: 0
    },
    totalLessons: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDuration: {
      type: Number,
      default: 0,
      min: 0
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    decidedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: false
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    approvalDescrypt: {
      type: String
    },
    approvalReason: {
      type: String
    },
    refundPolicy: {
      type: String
    },
    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)
// Indexes for performance
CourseSchema.index({ title: 'text', tags: 'text' })
CourseSchema.index({ state: 1, approvalStatus: 1 })
CourseSchema.index({ creatorId: 1, state: 1 })
CourseSchema.index({ averageRating: -1 })
CourseSchema.index({ totalEnrollments: -1 })

export const Course = mongoose.model<ICourse>('Course', CourseSchema)
