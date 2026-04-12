import { z } from 'zod';

const create = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    description: z
      .string()
      .trim()
      .max(300, 'Description cannot exceed 300 characters')
      .optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),
    description: z
      .string()
      .trim()
      .max(300, 'Description cannot exceed 300 characters')
      .optional(),
  }),
});

export const CategoryValidation = { create, update };

// icon is a file field — added by controller after multer, not from req.body
export type ICreateCategoryPayload = z.infer<typeof create>['body'] & { icon?: string };
export type IUpdateCategoryPayload = z.infer<typeof update>['body'] & { icon?: string };