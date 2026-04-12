import { z } from 'zod';
import { checkValidID } from '../../../shared/chackValid';

const notificationIdSchema = z.object({
  params: z.object({
    id: checkValidID('Invalid notification ID'),
  }),
});

export const NotificationValidation = { notificationIdSchema };