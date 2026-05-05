import { Document, Model, Types } from 'mongoose';

export type IContentType = 'TEXT' | 'IMAGE' | 'FILE';

export type IMessage = {
  conversation: Types.ObjectId;
  sender:       Types.ObjectId;
  content:      string;
  contentType:  IContentType;
  attachment:   string | null;
  isRead:       boolean;
  readAt:       Date | null;
  deliveredAt:  Date | null;
  isDeleted:    boolean;
};

export type IMessageDocument = IMessage & Document;
export type IMessageModel    = Model<IMessageDocument>;