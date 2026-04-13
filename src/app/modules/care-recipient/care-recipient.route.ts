import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import { USER_ROLES } from "../../../enums/user";
import CareRecipientValidation from "./care-recipient.validation";
import CareRecipientController from "./care-recipient.controller";

const router = Router();

router.post(
  "/",
  checkAuth(USER_ROLES.CLIENT),
  fileUploadHandler,
  validateRequest(CareRecipientValidation.createCareRecipientSchema),
  CareRecipientController.createRecipient,
);

router.get(
  "/",
  checkAuth(USER_ROLES.CLIENT),
  CareRecipientController.getMyRecipients,
);

router.get(
  "/:id",
  checkAuth(USER_ROLES.CLIENT),
  CareRecipientController.getSingleRecipient,
);

router.patch(
  "/:id",
  checkAuth(USER_ROLES.CLIENT),
  fileUploadHandler,
  validateRequest(CareRecipientValidation.updateCareRecipientSchema),
  CareRecipientController.updateRecipient,
);

router.delete(
  "/:id",
  checkAuth(USER_ROLES.CLIENT),
  CareRecipientController.deleteRecipient,
);

const CareRecipientRoutes = router;
export default CareRecipientRoutes;
