import express            from 'express';
import { checkAuth }      from '../../middlewares/checkAuth';
import validateRequest    from '../../middlewares/validateRequest';
import fileUploadHandler  from '../../middlewares/fileUploadHandler';
import { USER_ROLES }     from '../../../enums/user';
import { MessageController }  from './message.controller';
import { MessageValidation }  from './message.validation';

const router = express.Router();

const auth = checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER);

router.post(
  '/',
  auth,
  fileUploadHandler,
  validateRequest(MessageValidation.sendMessageSchema),
  MessageController.sendMessage,
);

// /:conversationId/seen BEFORE /:conversationId to avoid param conflict
router.patch(
  '/:conversationId/seen',
  auth,
  validateRequest(MessageValidation.seenSchema),
  MessageController.markConversationSeen,
);

router.get(
  '/:conversationId',
  auth,
  validateRequest(MessageValidation.getMessagesSchema),
  MessageController.getMessages,
);

router.delete(
  '/:messageId',
  auth,
  validateRequest(MessageValidation.messageIdSchema),
  MessageController.softDeleteMessage,
);

export const MessageRoutes = router;