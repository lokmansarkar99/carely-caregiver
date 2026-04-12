import { Router } from 'express';
import { USER_ROLES } from '../../../enums/user';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { CaregiverProfileController } from './caregiver-profile.controller';
import { CaregiverProfileValidation } from './caregiver-profile.validation';

const router = Router();

// Caregiver — own profile
router.post(
  '/',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(CaregiverProfileValidation.setup),
  CaregiverProfileController.setupProfile
);

router.get(
  '/me',
  checkAuth(USER_ROLES.CAREGIVER),
  CaregiverProfileController.getOwnProfile
);

router.patch(
  '/me',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(CaregiverProfileValidation.update),
  CaregiverProfileController.updateOwnProfile
);

// Admin
router.get(
  '/admin',
  checkAuth(USER_ROLES.ADMIN),
  CaregiverProfileController.adminGetAllCaregivers
);

router.patch(
  '/:id/verify',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(CaregiverProfileValidation.adminVerify),
  CaregiverProfileController.adminVerifyCaregiver
);

router.patch(
  '/:id/badge',
  checkAuth(USER_ROLES.ADMIN),
  CaregiverProfileController.adminToggleBadge
);

// Client — search and view
router.get(
  '/',
  checkAuth(USER_ROLES.CLIENT),
  CaregiverProfileController.searchCaregivers
);

router.get(
  '/:id',
  checkAuth(USER_ROLES.CLIENT),
  CaregiverProfileController.getCaregiverById
);

export const CaregiverProfileRoutes = router;