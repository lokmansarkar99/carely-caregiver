import { z } from 'zod';

const sendMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().min(1, 'conversationId is required'),
    content:        z.string().max(5000).optional().default(''),
    contentType:    z.enum(['TEXT', 'IMAGE', 'FILE']).optional().default('TEXT'),
  }),
});

const getMessagesSchema = z.object({
  params: z.object({
    conversationId: z.string().min(1, 'conversationId is required'),
  }),
  query: z.object({
    page:  z.string().optional().default('1'),
    limit: z.string().optional().default('30'),
  }),
});

const seenSchema = z.object({
  params: z.object({
    conversationId: z.string().min(1, 'conversationId is required'),
  }),
});

const messageIdSchema = z.object({
  params: z.object({
    messageId: z.string().min(1, 'messageId is required'),
  }),
});

export const MessageValidation = {
  sendMessageSchema,
  getMessagesSchema,
  seenSchema,
  messageIdSchema,
};