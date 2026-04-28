import { model, Schema } from 'mongoose';
import { BOOKING_STATUS, CANCELLED_BY, IBooking, PAYMENT_STATUS, SHIFT_TYPE } from './booking.interface';

const bookingSchema = new Schema<IBooking>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    caregiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    careRecipient: { type: Schema.Types.ObjectId, ref: 'CareRecipient', required: true },
    serviceCategory: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    date: { type: Date, required: true },
    shift: { type: String, enum: Object.values(SHIFT_TYPE), required: true },
    slotStartTime: { type: String, required: true },
    slotEndTime: { type: String, required: true },
    instructions: { type: String, default: null },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    heldUntil: { type: Date, required: true },
    basePrice: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    paymentIntentId: { type: String, default: null },
    declineReason: { type: String, default: null },
    cancelledBy: {
      type: String,
      enum: Object.values(CANCELLED_BY),
      default: null,
    },
    cancelReason: { type: String, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

bookingSchema.index({ client: 1, status: 1, createdAt: -1 });
bookingSchema.index({ caregiver: 1, status: 1, date: 1 });
bookingSchema.index({ status: 1, heldUntil: 1 });

const Booking = model<IBooking>('Booking', bookingSchema);
export default Booking;