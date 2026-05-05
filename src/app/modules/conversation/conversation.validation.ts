import { z } from 'zod';

const startConversationSchema = z.object({
  body: z.object({
    receiverId: z.string().min(1, 'receiverId is required'),
  }),
});

const conversationParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Conversation ID is required'),
  }),
});

export const ConversationValidation = {
  startConversationSchema,
  conversationParamSchema,
};