import { z } from 'zod';
import { STATUS } from '../../../enums/user';
import { checkValidID } from '../../../shared/chackValid';

const updateMyProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(60).optional(),
    phone: z.string().min(7).max(20).optional(),
    
  }),
});

const updateFcmTokenSchema = z.object({
  body: z.object({
    fcmToken: z.string().min(10, 'Invalid FCM token'),
  }),
});

const updateUserStatusSchema = z.object({
  params: z.object({ id: checkValidID('Invalid user ID') }),
  body: z.object({
    status: z.enum([STATUS.ACTIVE, STATUS.INACTIVE], {
      message: 'Status must be active or inactive',
    }),
  }),
});

const blockUnblockUserSchema = z.object({
  params: z.object({ id: checkValidID('Invalid user ID') }),
  body: z.object({ isBlocked: z.boolean() }),
});

const getUserByIdSchema = z.object({
  params: z.object({ id: checkValidID('Invalid user ID') }),
});

const deleteUserSchema = z.object({
  params: z.object({ id: checkValidID('Invalid user ID') }),
});

export const UserValidation = {
  updateMyProfileSchema,
  updateFcmTokenSchema,
  updateUserStatusSchema,
  blockUnblockUserSchema,
  getUserByIdSchema,
  deleteUserSchema,
};

export type UpdateMyProfilePayload  = z.infer<typeof updateMyProfileSchema>['body'];
export type UpdateFcmTokenPayload   = z.infer<typeof updateFcmTokenSchema>['body'];
export type UpdateUserStatusPayload = z.infer<typeof updateUserStatusSchema>['body'];
export type BlockUnblockUserPayload = z.infer<typeof blockUnblockUserSchema>['body'];