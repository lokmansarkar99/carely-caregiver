import { Schema, model } from 'mongoose';
import { IAvailability } from './availability.interface';

const SlotSchema = new Schema(
  {
    startTime: { type: String, required: true },
    status: {
      type: String,
      enum: ['AVAILABLE', 'HELD', 'BOOKED'],
      default: 'AVAILABLE',
    },
    heldUntil: { type: Date, default: null },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', default: null },
  },
  { _id: true },
);

const ShiftSchema = new Schema(
  {
    shiftType: {
      type: String,
      enum: ['MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    slots: { type: [SlotSchema], default: [] },
  },
  { _id: true },
);

const AvailabilitySchema = new Schema<IAvailability>(
  {
    caregiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    shifts: {
      type: [ShiftSchema],
      default: [],
    },
    isDayBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// One availability document per caregiver per date
AvailabilitySchema.index({ caregiver: 1, date: 1 }, { unique: true });
// Booking module queries by caregiver + date + isDayBlocked
AvailabilitySchema.index({ caregiver: 1, date: 1, isDayBlocked: 1 });
// Public caregiver availability calendar queries
AvailabilitySchema.index({ caregiver: 1, isDayBlocked: 1 });

export const Availability = model<IAvailability>('Availability', AvailabilitySchema);