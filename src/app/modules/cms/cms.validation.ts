import { z } from 'zod';

const slugParam = z.object({
  params: z.object({
    slug: z
      .string()
      .trim()
      .min(1, 'Slug is required')
      .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  }),
});

const upsertPageSchema = z.object({
  params: z.object({
    slug: z
      .string()
      .trim()
      .min(1, 'Slug is required')
      .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  }),
  body: z.object({
    title: z.string().trim().min(2, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
  }),
});

export const CmsValidation = {
  slugParam,
  upsertPageSchema,
};