import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { addShiftSchema, updateShiftSchema } from './availability.validation';
import { AvailabilityController } from './availability.controller';
import { Availability } from './availability.model';

const router = express.Router();

// CAREGIVER — add shift to a date (creates record if date does not exist)
router.post(
  '/',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(addShiftSchema),
  AvailabilityController.addShift,
);

// CAREGIVER — get own availability with optional date range
router.get(
  '/me',
  checkAuth(USER_ROLES.CAREGIVER),
  AvailabilityController.getMyAvailability,
);

// CAREGIVER — update a specific shift on a date
router.patch(
  '/:id/shift/:shiftId',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(updateShiftSchema),
  AvailabilityController.updateShift,
);

// CAREGIVER — remove a single shift from a date
router.delete(
  '/:id/shift/:shiftId',
  checkAuth(USER_ROLES.CAREGIVER),
  AvailabilityController.removeShift,
);

// CAREGIVER — delete entire availability record for a date
router.delete(
  '/:id',
  checkAuth(USER_ROLES.CAREGIVER),
  AvailabilityController.deleteAvailability,
);

// PUBLIC — get a caregiver's available dates and slots (used by client booking UI)
router.get('/:caregiverId', AvailabilityController.getCaregiverAvailability);

export const AvailabilityRoutes = router;
