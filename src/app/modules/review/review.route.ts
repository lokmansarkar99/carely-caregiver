import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.post(
  '/',
  checkAuth(USER_ROLES.CLIENT),
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.submitReview,
);

router.get(
  '/:caregiverId',
  validateRequest(ReviewValidation.caregiverIdParam),
  ReviewController.getCaregiverReviews,
);

router.delete(
  '/:id',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(ReviewValidation.reviewIdParam),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;