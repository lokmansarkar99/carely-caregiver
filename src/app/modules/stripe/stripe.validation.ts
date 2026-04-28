import { z } from 'zod';

const createCheckoutSessionSchema = z.object({
  body: z.object({
    bookingId: z.string({
      message: 'Booking ID is required',
    }),
  }),
});

export const StripeValidation = {
  createCheckoutSessionSchema,
};
