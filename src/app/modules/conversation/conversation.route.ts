import express         from 'express';
import { checkAuth }   from '../../middlewares/checkAuth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES }  from '../../../enums/user';
import { ConversationController } from './conversation.controller';
import { ConversationValidation } from './conversation.validation';

const router = express.Router();

const auth = checkAuth(USER_ROLES.CLIENT, USER_ROLES.CAREGIVER);

// search-users BEFORE /:id to avoid param collision
router.get('/search-users', auth, ConversationController.searchUsersToMessage);

router.post(
  '/',
  auth,
  validateRequest(ConversationValidation.startConversationSchema),
  ConversationController.startConversation,
);

router.get('/', auth, ConversationController.getMyInbox);

router.get(
  '/:id',
  auth,
  validateRequest(ConversationValidation.conversationParamSchema),
  ConversationController.getSingleConversation,
);

export const ConversationRoutes = router;