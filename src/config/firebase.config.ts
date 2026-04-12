import admin        from 'firebase-admin';
import config       from './index';
import { errorLogger } from '../shared/logger';

let initialized = false;

export const initFirebase = (): void => {
  if (initialized) return;
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   config.firebase.projectId   as string,
        clientEmail: config.firebase.clientEmail  as string,
        privateKey:  (config.firebase.privateKey as string)?.replace(/\\n/g, '\n'),
      }),
    });
    initialized = true;
    console.log('[Firebase] Initialized successfully');
  } catch (err: any) {
    errorLogger.error(`[Firebase] Init failed: ${err.message}`);
  }
};

// Send push notification to one or multiple device tokens
// Uses sendEachForMulticast — handles batch delivery + individual failure logging
export const sendFCMNotification = async (
  tokens: string | string[],
  title:  string,
  body:   string,
  data?:  Record<string, string>,
): Promise<void> => {
  if (!initialized) return;

  const tokenList = Array.isArray(tokens) ? tokens.filter(Boolean) : [tokens];
  if (!tokenList.length) return;

  try {
    const message: admin.messaging.MulticastMessage = {
      tokens: tokenList,
      notification: { title, body },
      data:         data ?? {},
      android:      { priority: 'high' },
      apns:         { payload: { aps: { sound: 'default', badge: 1 } } },
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    // Log individual token failures (stale tokens — clean from DB in user service)
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          errorLogger.error(`[FCM] Token failed: ${tokenList[idx]} | ${resp.error?.message}`);
        }
      });
    }
  } catch (err: any) {
    errorLogger.error(`[FCM] Push failed: ${err.message}`);
  }
};