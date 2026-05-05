import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = (label: string) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: `${label} must be a valid ID`,
  });

const setPayoutMethodSchema = z.object({
  body: z.object({
    payoutMethod: z.string().min(2, 'Payout method is required'),
  }),
});

const releaseEarningSchema = z.object({
  params: z.object({
    id: objectIdSchema('Earning ID'),
  }),
  body: z.object({
    payoutReference: z.string().min(2, 'Payout reference is required'),
    payoutMethod: z.string().optional(),
  }),
});

const earningIdParam = z.object({
  params: z.object({
    id: objectIdSchema('Earning ID'),
  }),
});

export const EarningValidation = {
  setPayoutMethodSchema,
  releaseEarningSchema,
  earningIdParam,
};