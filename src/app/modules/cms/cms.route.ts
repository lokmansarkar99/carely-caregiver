import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { CmsController } from './cms.controller';
import { CmsValidation } from './cms.validation';

const router = express.Router();

router.get(
  '/',
  checkAuth(USER_ROLES.ADMIN),
  CmsController.listAll,
);

router.put(
  '/:slug',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(CmsValidation.upsertPageSchema),
  CmsController.upsertPage,
);

router.get(
  '/:slug',
  validateRequest(CmsValidation.slugParam),
  CmsController.getBySlug,
);

export const CmsRoutes = router;