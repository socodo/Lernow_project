import mongoose, { Document, Schema } from 'mongoose'

export type ICart = Document & {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseIds: mongoose.Types.ObjectId[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    courseIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Course',
      default: []
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
)

// Index for user cart lookup
CartSchema.index({ userId: 1 })

export const Cart = mongoose.model<ICart>('Cart', CartSchema)
