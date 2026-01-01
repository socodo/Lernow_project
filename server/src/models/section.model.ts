import mongoose, { Document, Schema } from 'mongoose'

export type ISection = Document & {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  orderNo: number;
  createdAt: Date;
  updatedAt: Date;
};

const SectionSchema = new Schema<ISection>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    orderNo: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
)

// Compound index to ensure unique orderNo per course
SectionSchema.index({ courseId: 1, orderNo: 1 }, { unique: true })

// Index for querying sections by course
SectionSchema.index({ courseId: 1, orderNo: 1 })

export const Section = mongoose.model<ISection>('Section', SectionSchema)
