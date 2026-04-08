import admin from 'firebase-admin';
import config from '.';
import { errorLogger } from '../shared/logger';

let firebaseInitialized = false;

/**
 * Call once in server.ts — initialises Firebase Admin SDK for FCM.
 * Safe to call even if FCM env vars are missing (skips silently).
 */
export const initFirebase = (): void => {
  if (
    firebaseInitialized ||
    !config.firebase.projectId ||
    !config.firebase.privateKey ||
    !config.firebase.clientEmail
  ) {
    if (!config.firebase.projectId) {
      console.warn('[Firebase] FCM env vars not set — push notifications disabled.');
    }
    return;
  }
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   config.firebase.projectId,
        privateKey:  config.firebase.privateKey,
        clientEmail: config.firebase.clientEmail,
      }),
    });
    firebaseInitialized = true;
    console.log('[Firebase] FCM initialised ✓');
  } catch (err) {
    errorLogger.error('[Firebase] Init failed', err);
  }
};

/**
 * Send a single FCM push notification.
 * Non-critical — never throws; logs failure silently.
 *
 * @param fcmToken  Device FCM token stored on User.fcmToken
 * @param title     Notification title (shown on lock screen)
 * @param body      Notification body text
 * @param data      Optional key-value pairs for in-app deep-link handling
 */
export const sendFCMNotification = async (
  fcmToken: string,
  title:    string,
  body:     string,
  data?:    Record<string, string>,
): Promise<void> => {
  if (!firebaseInitialized) return;
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: data ?? {},
      android: {
        priority: 'high',
        notification: { sound: 'default', channelId: 'carely_default' },
      },
      apns: {
        payload: { aps: { sound: 'default', badge: 1 } },
      },
    });
  } catch (err) {
    // Stale / invalid tokens are common — just log, never throw
    console.error('[FCM] Send failed:', (err as Error).message);
  }
};