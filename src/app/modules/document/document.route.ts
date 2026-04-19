import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { DocumentValidation } from './document.validation';
import { DocumentController } from './document.controller';

const router = express.Router();

router.post(
  '/upload',
  checkAuth(USER_ROLES.CAREGIVER),
  fileUploadHandler,
  validateRequest(DocumentValidation.uploadDocumentSchema),
  DocumentController.upload,
);

router.get(
  '/me',
  checkAuth(USER_ROLES.CAREGIVER),
  DocumentController.getMyDocuments,
);

router.delete(
  '/:id',
  checkAuth(USER_ROLES.CAREGIVER),
  validateRequest(DocumentValidation.documentIdParam),
  DocumentController.deleteDocument,
);

router.get(
  '/',
  checkAuth(USER_ROLES.ADMIN),
  DocumentController.getAllDocuments,
);

router.patch(
  '/:id/approve',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(DocumentValidation.documentIdParam),
  DocumentController.approveDocument,
);

router.patch(
  '/:id/reject',
  checkAuth(USER_ROLES.ADMIN),
  validateRequest(DocumentValidation.rejectDocumentSchema),
  DocumentController.rejectDocument,
);

export const DocumentRoutes = router;