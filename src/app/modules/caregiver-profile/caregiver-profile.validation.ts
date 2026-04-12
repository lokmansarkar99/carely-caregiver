import { z } from 'zod';
import { VERIFICATION_STATUS } from '../../../enums/user';

const setup = z.object({
  body: z.object({
    bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional(),
    specialties: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    experience: z.coerce.number().min(0).max(60).optional(),
    hourlyRate: z.coerce.number().min(1, 'Hourly rate must be at least $1').optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    country: z.string().trim().max(100).optional(),
    languages: z.array(z.string()).optional(),
  }),
});

const update = setup;

// Admin can only VERIFY or REJECT — not set back to UNVERIFIED or PENDING
const adminVerify = z.object({
  body: z.object({
    status: z.enum([VERIFICATION_STATUS.VERIFIED, VERIFICATION_STATUS.REJECTED]),
  }),
});

export type ISetupProfilePayload = z.infer<typeof setup>['body'];
export type IUpdateProfilePayload = z.infer<typeof update>['body'];
export type IAdminVerifyPayload = z.infer<typeof adminVerify>['body'];

export const CaregiverProfileValidation = { setup, update, adminVerify };