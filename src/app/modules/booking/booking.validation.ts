import { z } from 'zod';
import { SHIFT_TYPE } from './booking.interface';
import mongoose from 'mongoose';

const objectIdSchema = (label: string) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: `${label} must be a valid ID`,
  });

const timeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Must be in HH:MM format (e.g. 08:00)');

const bookingIdParam = z.object({
  params: z.object({
    id: objectIdSchema('Booking ID'),
  }),
});

const createBookingSchema = z.object({
  body: z
    .object({
      caregiver: objectIdSchema('Caregiver ID'),
      careRecipient: objectIdSchema('Care recipient ID'),
      serviceCategory: objectIdSchema('Service category ID'),
      date: z.string().date('Date must be in YYYY-MM-DD format'),
      shift: z.nativeEnum(SHIFT_TYPE, { message: 'Invalid shift type' }),
      slotStartTime: timeSchema,
      slotEndTime: timeSchema,
      instructions: z.string().optional(),
    })
    .refine(
      (data) => {
        const [sh, sm] = data.slotStartTime.split(':').map(Number);
        const [eh, em] = data.slotEndTime.split(':').map(Number);
        return eh * 60 + em > sh * 60 + sm;
      },
      { message: 'slotEndTime must be after slotStartTime', path: ['slotEndTime'] },
    ),
});

const declineBookingSchema = z.object({
  params: z.object({ id: objectIdSchema('Booking ID') }),
  body: z.object({
    declineReason: z.string().min(3, 'Decline reason must be at least 3 characters'),
  }),
});

const cancelBookingSchema = z.object({
  params: z.object({ id: objectIdSchema('Booking ID') }),
  body: z.object({
    cancelReason: z.string().optional(),
  }),
});

export const BookingValidation = {
  bookingIdParam,
  createBookingSchema,
  declineBookingSchema,
  cancelBookingSchema,
};