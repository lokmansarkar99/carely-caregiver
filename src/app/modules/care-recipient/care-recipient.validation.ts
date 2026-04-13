import { z } from "zod";

const createCareRecipientSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters"),
    relationship: z.string().trim().min(1, "Relationship is required"),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.enum(["Male", "Female", "Other"]).optional().nullable(),
    primaryLanguage: z
      .enum(["English", "Spanish", "Other"])
      .optional()
      .default("English"),
    medicalConditions: z.string().optional().nullable(),
    allergies: z.string().optional().nullable(),
    mobilityStatus: z
      .enum(["Independent", "Walker", "Wheelchair", "Bedridden", "Other"])
      .optional()
      .nullable(),
    careNeeds: z.array(z.string()).optional().default([]),
    notes: z.string().optional().nullable(),
  }),
});

const updateCareRecipientSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).optional(),
    relationship: z.string().trim().min(1).optional(),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.enum(["Male", "Female", "Other"]).optional().nullable(),
    primaryLanguage: z.enum(["English", "Spanish", "Other"]).optional(),
    medicalConditions: z.string().optional().nullable(),
    allergies: z.string().optional().nullable(),
    mobilityStatus: z
      .enum(["Independent", "Walker", "Wheelchair", "Bedridden", "Other"])
      .optional()
      .nullable(),
    careNeeds: z.array(z.string()).optional(),
    notes: z.string().optional().nullable(),
  }),
});

const CareRecipientValidation = {
  createCareRecipientSchema,
  updateCareRecipientSchema,
};

export default CareRecipientValidation;
