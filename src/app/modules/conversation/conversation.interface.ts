import { Document, Model, Types } from 'mongoose';

export type IConversation = {
  participants:         Types.ObjectId[];
  lastMessage:          Types.ObjectId | null;
  lastMessageAt:        Date | null;
  clientUnreadCount:    number;
  caregiverUnreadCount: number;
  isActive:             boolean;
};

export type IConversationDocument = IConversation & Document;
export type IConversationModel    = Model<IConversationDocument>;