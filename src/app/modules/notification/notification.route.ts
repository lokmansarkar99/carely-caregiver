import express from 'express';
import { checkAuth }       from '../../middlewares/checkAuth';
import { USER_ROLES }      from '../../../enums/user';
import validateRequest     from '../../middlewares/validateRequest';
import { NotificationController } from './notification.controller';
import { NotificationValidation } from './notification.validation';

const router = express.Router();
const auth = checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER, USER_ROLES.ADMIN);

// Static routes — must be declared BEFORE /:id
router.get('/my',           auth, NotificationController.getMyNotifications);
router.get('/recent',       auth, NotificationController.getRecent);
router.get('/unread-count', auth, NotificationController.getUnreadCount);
router.patch('/read-all',   auth, NotificationController.markAllAsRead);

// Parameterized routes
router.patch(
  '/:id/read',
  auth,
  validateRequest(NotificationValidation.notificationIdSchema),
  NotificationController.markOneAsRead,
);

router.delete(
  '/:id',
  auth,
  validateRequest(NotificationValidation.notificationIdSchema),
  NotificationController.deleteOne,
);

export const NotificationRoutes = router;