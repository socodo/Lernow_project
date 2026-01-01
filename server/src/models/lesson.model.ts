import mongoose, { Document, Schema } from 'mongoose'

export type ILesson = Document & {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  sectionId: mongoose.Types.ObjectId;
  title: string;
  shortDesc?: string;
  orderNo: number;
  lessonType: 'VIDEO' | 'FILE';
  url?: string;
  publicId?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const LessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    shortDesc: {
      type: String,
      trim: true
    },
    orderNo: {
      type: Number,
      required: true,
      min: 0
    },
    lessonType: {
      type: String,
      enum: ['VIDEO', 'FILE'],
      required: true,
      index: true
    },
    url: {
      type: String,
      trim: true
    },
    publicId: {
      type: String,
      trim: true
    },
    isVisible: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
)

// Compound indexes
LessonSchema.index({ courseId: 1, orderNo: 1 })
LessonSchema.index({ sectionId: 1, orderNo: 1 })
LessonSchema.index({ courseId: 1, isVisible: 1 })

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema)
