import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { EarningController } from './earning.controller';
import { EarningValidation } from './earning.validation';

const router = express.Router();

router.get(
  '/me',
  checkAuth(USER_ROLES.CAREGIVER),
  EarningController.getMyEarnings,
);

router.get(
  '/me/summary',
  checkAuth(USER_ROLES.CAREGIVER),
  EarningController.getMySummary,
);

router.patch(
  '/payout-method',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(EarningValidation.setPayoutMethodSchema),
  EarningController.setPayoutMethod,
);

router.get(
  '/',
  checkAuth(USER_ROLES.ADMIN),
  EarningController.getAllEarningsAdmin,
);

router.patch(
  '/:id/release',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(EarningValidation.releaseEarningSchema),
  EarningController.releaseEarning,
);

export const EarningRoutes = router;