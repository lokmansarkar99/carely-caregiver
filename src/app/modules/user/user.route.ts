import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { USER_ROLES } from '../../../enums/user';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { UserValidation } from './user.validation';

const router = express.Router();

// Own Profile 
router
  .route('/my-profile')
  .get(
    checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER, USER_ROLES.ADMIN),
    UserController.getMyProfile,
  )
  .patch(
    checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER, USER_ROLES.ADMIN),
    fileUploadHandler,
    validateRequest(UserValidation.updateMyProfileSchema),
    UserController.updateMyProfile,
  );

// FCM Token 
router.patch(
  '/fcm-token',
  checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER),
  validateRequest(UserValidation.updateFcmTokenSchema),
  UserController.updateFcmToken,
);

router.delete(
  '/fcm-token',
  checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER),
  validateRequest(UserValidation.updateFcmTokenSchema),
  UserController.removeFcmToken,
);

// ── Messaging: browse users
router.get(
  '/caregivers',
  checkAuth(USER_ROLES.CLIENT, USER_ROLES.ADMIN),
  UserController.getAllCaregivers,
);

router.get(
  '/clients',
  checkAuth(USER_ROLES.CAREGIVER, USER_ROLES.ADMIN),
  UserController.getAllClients,
);

// ── Admin: User Management
router.get(
  '/users',
  checkAuth(USER_ROLES.ADMIN),
  UserController.getAllUsers,
);

router
  .route('/users/:id')
  .get(
    checkAuth(USER_ROLES.ADMIN),
    validateRequest(UserValidation.getUserByIdSchema),
    UserController.getUserById,
  )
  .delete(
    checkAuth(USER_ROLES.ADMIN),
    validateRequest(UserValidation.deleteUserSchema),
    UserController.deleteUser,
  );

router.patch(
  '/users/:id/status',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(UserValidation.updateUserStatusSchema),
  UserController.updateUserStatus,
);

router.patch(
  '/users/:id/block',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(UserValidation.blockUnblockUserSchema),
  UserController.blockUnblockUser,
);

export const UserRoutes = router;