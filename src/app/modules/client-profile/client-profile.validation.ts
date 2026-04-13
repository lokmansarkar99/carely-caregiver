import { z } from 'zod';

const notificationPreferencesSchema = z
  .object({
    enableNotifications: z.boolean().optional(),
    bookingAlerts: z.boolean().optional(),
    paymentAlerts: z.boolean().optional(),
    messages: z.boolean().optional(),
  })
  .strict();

const createClientProfileSchema = z.object({
  body: z
    .object({
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      medicalConditionsAndAllergies: z.string().trim().optional(),
    })
    .strict(),
});

const updateClientProfileSchema = z.object({
  body: z
    .object({
      city: z.string().trim().nullable().optional(),
      state: z.string().trim().nullable().optional(),
      medicalConditionsAndAllergies: z.string().trim().nullable().optional(),
      notificationPreferences: notificationPreferencesSchema.optional(),
    })
    .strict(),
});

const suspendClientSchema = z.object({
  params: z.object({ userId: z.string().min(1) }),
});

export type ICreateClientProfilePayload = z.infer<
  typeof createClientProfileSchema
>['body'];

export type IUpdateClientProfilePayload = z.infer<
  typeof updateClientProfileSchema
>['body'];

export const ClientProfileValidation = {
  createClientProfileSchema,
  updateClientProfileSchema,
  suspendClientSchema,
};