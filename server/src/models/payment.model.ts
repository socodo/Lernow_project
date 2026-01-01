import mongoose, { Document, Schema } from 'mongoose'

export type IPayment = Document & {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  amount: number;
  currency: 'USD' | 'VND';
  paymentMethod?: 'CREDIT_CARD' | 'MOMO' | 'ZALOPAY' | 'BANK_TRANSFER' | 'VNPAY';
  transactionId?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentGateway?: string;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

const PaymentSchema = new Schema<IPayment>(
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
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['USD', 'VND'],
      default: 'VND'
    },
    paymentMethod: {
      type: String,
      enum: ['CREDIT_CARD', 'MOMO', 'ZALOPAY', 'BANK_TRANSFER', 'VNPAY']
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true
    },
    paymentGateway: {
      type: String
    },
    gatewayResponse: {
      type: Schema.Types.Mixed
    },
    paidAt: {
      type: Date,
      index: true
    },
    refundedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

// Indexes for queries
PaymentSchema.index({ userId: 1, status: 1 })
PaymentSchema.index({ courseId: 1, status: 1 })
PaymentSchema.index({ status: 1, createdAt: -1 })
PaymentSchema.index({ transactionId: 1 })

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)
