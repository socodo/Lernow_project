import mongoose, { Document, Schema } from 'mongoose'

export type IForum = Document & {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  parentId?: mongoose.Types.ObjectId;
  path: mongoose.Types.ObjectId[];
  upvotes: number;
  isPinned: boolean;
  isSolved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const ForumSchema = new Schema<IForum>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Forum',
      index: true
    },
    path: {
      type: [Schema.Types.ObjectId],
      default: [],
      index: true
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true
    },
    isSolved: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
)

// Indexes for common queries
ForumSchema.index({ courseId: 1, isPinned: -1, createdAt: -1 })
ForumSchema.index({ courseId: 1, isSolved: 1 })
ForumSchema.index({ parentId: 1, createdAt: 1 })
ForumSchema.index({ userId: 1, createdAt: -1 })

export const Forum = mongoose.model<IForum>('Forum', ForumSchema)
