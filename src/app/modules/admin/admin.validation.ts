import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = (label: string) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: `${label} must be a valid ID`,
  });

const userIdParam = z.object({
  params: z.object({
    id: objectIdSchema('User ID'),
  }),
});

const inviteCaregiverSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().email('Valid email is required'),
    specialization: z.string().trim().optional(),
    personalMessage: z.string().trim().optional(),
  }),
});

const revenueChartQuery = z.object({
  query: z.object({
    period: z.enum(['week', 'month']).default('month'),
  }),
});

export const AdminValidation = {
  userIdParam,
  inviteCaregiverSchema,
  revenueChartQuery,
};