import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { USER_ROLES } from '../../../enums/user';
import { StripeController } from './stripe.controller';
import { StripeValidation } from './stripe.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  StripeController.handleWebhook,
);

router.post(
  '/create-checkout-session',
  checkAuth(USER_ROLES.CLIENT),
  validateRequest(StripeValidation.createCheckoutSessionSchema),
  StripeController.createCheckoutSession,
);

router.get(
  '/payment-status/:bookingId',
  checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER),
  StripeController.getPaymentStatus,
);

export const StripeRoutes = router;