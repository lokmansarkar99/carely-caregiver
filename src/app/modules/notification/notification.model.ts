import { Schema, model }  from 'mongoose';
import { INotificationDocument, INotificationModel } from './notification.interface';
import { NOTIFICATION_TYPE, REFERENCE_MODEL }        from '../../../enums/notification';

const notificationSchema = new Schema<INotificationDocument>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    type:  { type: String, enum: Object.values(NOTIFICATION_TYPE), required: true },
    title: { type: String, required: true, trim: true },
    body:  { type: String, default: '',    trim: true },

    referenceId: {
      type:    Schema.Types.ObjectId,
      refPath: 'referenceModel',
      default: null,
    },
    referenceModel: {
      type:    String,
      enum:    [...Object.values(REFERENCE_MODEL), null],
      default: null,
    },

    isRead: { type: Boolean, default: false },
    readAt: { type: Date,    default: null  },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, isRead: 1 });      // unread count queries
notificationSchema.index({ recipient: 1, createdAt: -1 });  // paginated list queries

export const Notification = model<INotificationDocument, INotificationModel>(
  'Notification',
  notificationSchema,
);