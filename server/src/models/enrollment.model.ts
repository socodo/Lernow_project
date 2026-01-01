import mongoose, { Document, Schema } from 'mongoose'

export type IEnrollment = Document & {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  progress: number;
  status: 'ENROLLED' | 'COMPLETED' | 'DROPPED';
  completedDate?: Date;
  lastWatchedLessonId?: mongoose.Types.ObjectId;
  lastWatchedAt?: Date;
  enrolledAt: Date;
  enrollmentType: 'PAID' | 'FREE' | 'GIFTED';
  createdAt: Date;
  updatedAt: Date;
};

const EnrollmentSchema = new Schema<IEnrollment>(
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
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ['ENROLLED', 'COMPLETED', 'DROPPED'],
      default: 'ENROLLED',
      index: true
    },
    completedDate: {
      type: Date
    },
    lastWatchedLessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    lastWatchedAt: {
      type: Date
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    enrollmentType: {
      type: String,
      enum: ['PAID', 'FREE', 'GIFTED'],
      default: 'PAID',
      index: true
    }
  },
  {
    timestamps: true
  }
)

// Compound index to ensure one enrollment per user per course
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

// Indexes for common queries
EnrollmentSchema.index({ userId: 1, status: 1 })
EnrollmentSchema.index({ courseId: 1, status: 1 })
EnrollmentSchema.index({ enrolledAt: -1 })

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema)
