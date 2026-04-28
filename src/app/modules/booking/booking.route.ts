import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { BookingController } from './booking.controller';
import { BookingValidation } from './booking.validation';

const router = express.Router();

router.post(
  '/',
  checkAuth(USER_ROLES.CLIENT),
  validateRequest(BookingValidation.createBookingSchema),
  BookingController.createBooking,
);

router.get(
  '/',
  checkAuth(USER_ROLES.ADMIN),
  BookingController.getAllBookingsAdmin,
);

router.get(
  '/my',
  checkAuth(USER_ROLES.CLIENT),
  BookingController.getMyBookings,
);

router.get(
  '/caregiver',
  checkAuth(USER_ROLES.CAREGIVER),
  BookingController.getCaregiverBookings,
);

router.get(
  '/:id',
  checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER),
  validateRequest(BookingValidation.bookingIdParam),
  BookingController.getSingleBooking,
);

router.patch(
  '/:id/accept',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(BookingValidation.bookingIdParam),
  BookingController.acceptBooking,
);

router.patch(
  '/:id/decline',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(BookingValidation.declineBookingSchema),
  BookingController.declineBooking,
);

router.patch(
  '/:id/cancel',
  checkAuth(USER_ROLES.CLIENT),
  validateRequest(BookingValidation.cancelBookingSchema),
  BookingController.cancelBooking,
);

router.patch(
  '/:id/complete',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(BookingValidation.bookingIdParam),
  BookingController.completeBooking,
);

router.patch(
  '/:id/admin-cancel',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(BookingValidation.bookingIdParam),
  BookingController.adminCancelBooking,
);

export const BookingRoutes = router;