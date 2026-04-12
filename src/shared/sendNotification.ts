import { Types }               from 'mongoose';
import { Notification }        from '../app/modules/notification/notification.model';
import { User }                from '../app/modules/user/user.model';
import { getIO }               from '../socket/socket';
import { sendFCMNotification } from '../config/firebase.config';
import { NOTIFICATION_TYPE, REFERENCE_MODEL } from '../enums/notification';

export interface ISendNotificationPayload {
  recipientId:     string;
  type:            NOTIFICATION_TYPE;
  title:           string;
  body:            string;
  referenceId?:    string | null;
  referenceModel?: REFERENCE_MODEL | null;
  data?:           Record<string, string>; // FCM deep-link data (bookingId, screen, etc.)
}

// Layer 1 → DB | Layer 2 → Socket room | Layer 3 → FCM push
const sendNotification = async (payload: ISendNotificationPayload): Promise<void> => {
  const {
    recipientId,
    type,
    title,
    body,
    referenceId    = null,
    referenceModel = null,
    data           = {},
  } = payload;

  // Layer 1: Always persist — offline users fetch on next app open
  const notification = await Notification.create({
    recipient:      new Types.ObjectId(recipientId),
    type,
    title,
    body,
    referenceId:    referenceId ? new Types.ObjectId(referenceId) : null,
    referenceModel: referenceModel ?? null,
  });

  // Layer 2: Socket — user joined personal room named after their userId
  try {
    const io = getIO();
    io.to(recipientId).emit('notification:new', {
      _id:            notification._id,
      type,
      title,
      body,
      isRead:         false,
      referenceId,
      referenceModel,
      createdAt:      notification.createdAt,
      data,
    });
  } catch {
    // Socket unavailable — FCM handles offline delivery
  }

  // Layer 3: FCM — push to all registered devices
  try {
    const user = await User.findById(recipientId).select('+fcmTokens');
    if (user?.fcmTokens?.length) {
      await sendFCMNotification(
        user.fcmTokens,   // string[]
        title,
        body,
        { type, notificationId: notification._id.toString(), ...data },
      );
    }
  } catch {
    // FCM errors never block notification flow
  }
};

// Send same notification to multiple recipients in parallel
const sendBulkNotification = async (
  recipientIds: string[],
  payload: Omit<ISendNotificationPayload, 'recipientId'>,
): Promise<void> => {
  await Promise.allSettled(
    recipientIds.map((id) => sendNotification({ ...payload, recipientId: id })),
  );
};

export { sendNotification, sendBulkNotification };