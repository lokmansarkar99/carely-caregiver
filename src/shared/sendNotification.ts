import { Types } from 'mongoose';
import { Notification } from '../app/modules/notification/notification.model';
import { NOTIFICATION_TYPE, REFERENCE_MODEL } from '../enums/notification';
import { getSocketId } from '../socket/onlineUsers';
import { getIO } from '../socket/socket';
import { sendFCMNotification } from '../config/firebase.config';
import { User } from '../app/modules/user/user.model';

interface ISendNotificationPayload {
  recipientId:    string | Types.ObjectId;
  type:           NOTIFICATION_TYPE;
  title:          string;
  body?:          string;
  referenceId?:   string | Types.ObjectId | null;
  referenceModel?: REFERENCE_MODEL | null;
}

/**
 * Unified Carely notification dispatcher.
 *
 * 3-step priority:
 *   1. DB persist   — always (offline users fetch on next app open)
 *   2. Socket.io    — if user is currently connected (real-time)
 *   3. FCM push     — if offline AND User.fcmToken exists
 *
 * NON-CRITICAL — never throws. Failures are logged only.
 * A notification error must NEVER crash the calling service (booking, payout, etc.)
 */
const sendNotification = async (
  payload: ISendNotificationPayload,
): Promise<void> => {
  try {
    const {
      recipientId,
      type,
      title,
      body           = '',
      referenceId    = null,
      referenceModel = null,
    } = payload;

    // ── STEP 1: Persist to DB (always) ──────────────────────────────────────
    const notification = await Notification.create({
      recipient: new Types.ObjectId(String(recipientId)),
      type,
      title,
      body,
      ...(referenceId    ? { referenceId:    new Types.ObjectId(String(referenceId)) } : {}),
      ...(referenceModel ? { referenceModel } : {}),
    });

    // ── STEP 2: Real-time via Socket.io (if online) ──────────────────────────
    const socketId = getSocketId(String(recipientId));
    if (socketId) {
      const io = getIO();
      io.to(socketId).emit('notification:new', {
        id:             notification.id,
        type:           notification.type,
        title:          notification.title,
        body:           notification.body,
        referenceId:    notification.referenceId,
        referenceModel: notification.referenceModel,
        isRead:         false,
        createdAt:      (notification as any).createdAt ?? new Date(),
      });
      // User is online → FCM not needed
      return;
    }

    // ── STEP 3: FCM push (offline user) ─────────────────────────────────────
    const user = await User.findById(String(recipientId))
      .select('fcmToken')
      .lean();

    if (user?.fcmToken) {
      await sendFCMNotification(
        user.fcmToken,
        title,
        body,
        {
          type,
          referenceId:    referenceId    ? String(referenceId)    : '',
          referenceModel: referenceModel ? String(referenceModel) : '',
          notificationId: String(notification._id),
        },
      );
    }
  } catch (err) {
    // Never re-throw — notification must NOT break the caller
    console.error('[sendNotification] Non-critical error:', (err as Error).message);
  }
};

export default sendNotification;