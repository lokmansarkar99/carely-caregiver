import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = (label: string) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: `${label} must be a valid ID`,
  });

const createReviewSchema = z.object({
  body: z.object({
    bookingId: objectIdSchema('Booking ID'),
    rating: z
      .number()
      .int({ message: 'Rating must be a whole number' })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    comment: z.string().trim().optional(),
  }),
});

const reviewIdParam = z.object({
  params: z.object({
    id: objectIdSchema('Review ID'),
  }),
});

const caregiverIdParam = z.object({
  params: z.object({
    caregiverId: objectIdSchema('Caregiver ID'),
  }),
});

export const ReviewValidation = {
  createReviewSchema,
  reviewIdParam,
  caregiverIdParam,
};