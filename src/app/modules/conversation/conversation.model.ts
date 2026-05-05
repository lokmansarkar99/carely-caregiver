import { Schema, model } from 'mongoose';
import { IConversationDocument, IConversationModel } from './conversation.interface';

const conversationSchema = new Schema<IConversationDocument>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User' },
    ],
    lastMessage: {
      type:    Schema.Types.ObjectId,
      ref:     'Message',
      default: null,
    },
    lastMessageAt:        { type: Date,    default: null },
    clientUnreadCount:    { type: Number,  default: 0 },
    caregiverUnreadCount: { type: Number,  default: 0 },
    isActive:             { type: Boolean, default: true },
  },
  { timestamps: true },
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export const Conversation = model<IConversationDocument, IConversationModel>(
  'Conversation',
  conversationSchema,
);