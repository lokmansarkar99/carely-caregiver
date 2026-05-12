import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { AdminController } from './admin.controller';
import { AdminValidation } from './admin.validation';

const router = express.Router();

router.get(
  '/stats',
  checkAuth(USER_ROLES.ADMIN),
  AdminController.getStats,
);

router.get(
  '/revenue-chart',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(AdminValidation.revenueChartQuery),
  AdminController.getRevenueChart,
);

router.get(
  '/users',
  checkAuth(USER_ROLES.ADMIN),
  AdminController.getAllUsers,
);

router.patch(
  '/users/:id/block',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(AdminValidation.userIdParam),
  AdminController.blockUser,
);

router.delete(
  '/users/:id',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(AdminValidation.userIdParam),
  AdminController.softDeleteUser,
);

router.post(
  '/invite-caregiver',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(AdminValidation.inviteCaregiverSchema),
  AdminController.inviteCaregiver,
);

export const AdminRoutes = router;