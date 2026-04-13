import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { ClientProfileValidation } from './client-profile.validation';
import { ClientProfileController } from './client-profile.controller';
import { checkAuth } from '../../middlewares/checkAuth';

const router = express.Router();

router
  .route('/')
  .post(
    checkAuth(USER_ROLES.CLIENT),
    validateRequest(ClientProfileValidation.createClientProfileSchema),
    ClientProfileController.createProfile
  )
  .get(checkAuth(USER_ROLES.ADMIN), ClientProfileController.getAllClientProfiles);


router
  .route('/me')
  .get(checkAuth(USER_ROLES.CLIENT), ClientProfileController.getMyProfile)
  .patch(
    checkAuth(USER_ROLES.CLIENT),
    validateRequest(ClientProfileValidation.updateClientProfileSchema),
    ClientProfileController.updateMyProfile
  );

router
  .route('/:userId')
  .get(
    checkAuth(USER_ROLES.ADMIN),
    ClientProfileController.getClientProfileByUserId
  );

  router
  .route('/:userId/suspend')
  .patch(
    checkAuth(USER_ROLES.ADMIN),
    ClientProfileController.toggleSuspendClient
  );


export const ClientProfileRoutes = router;