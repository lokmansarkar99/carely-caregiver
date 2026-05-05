import { Schema, model } from 'mongoose';
import { IMessageDocument, IMessageModel } from './message.interface';

const messageSchema = new Schema<IMessageDocument>(
  {
    conversation: {
      type:     Schema.Types.ObjectId,
      ref:      'Conversation',
      required: true,
    },
    sender: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    content:     { type: String, default: '' },
    contentType: {
      type:    String,
      enum:    ['TEXT', 'IMAGE', 'FILE'],
      default: 'TEXT',
    },
    attachment:  { type: String, default: null },
    isRead:      { type: Boolean, default: false },
    readAt:      { type: Date,    default: null },
    deliveredAt: { type: Date,    default: null },
    isDeleted:   { type: Boolean, default: false },
  },
  { timestamps: true },
);

messageSchema.index({ conversation: 1, createdAt: -1 });

export const Message = model<IMessageDocument, IMessageModel>('Message', messageSchema);