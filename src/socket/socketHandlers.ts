import { Socket } from 'socket.io';
import { addUser, removeUser, getSocketId } from './onlineUsers';
import { getIO } from './socket';

interface CarelySocket extends Socket {
  userId?:    string;
  userEmail?: string;
  userRole?:  string;
}

/**
 * Register all socket event handlers for a connected user.
 * Called once per connection from socket.ts → initSocket().
 */
export const registerSocketHandlers = (socket: CarelySocket): void => {
  const userId = socket.userId;

  // Join personal room for direct notifications + booking events
  if (userId) {
    socket.join(userId);
    addUser(userId, socket.id);
    console.log(`[Socket] ${socket.userRole} connected: ${userId}`);
  }

  // ─── Messaging ──────────────────────────────────────────────────────────

  /** Join a conversation room to receive message:new events in real-time */
  socket.on('conversation:join', (conversationId: string) => {
    if (conversationId) socket.join(conversationId);
  });

  /** Leave a conversation room */
  socket.on('conversation:leave', (conversationId: string) => {
    if (conversationId) socket.leave(conversationId);
  });

  /** Broadcast typing:start to the other participant in the conversation */
  socket.on('typing:start', ({ conversationId }: { conversationId: string }) => {
    socket.to(conversationId).emit('typing:start', { userId, conversationId });
  });

  /** Broadcast typing:stop to the other participant */
  socket.on('typing:stop', ({ conversationId }: { conversationId: string }) => {
    socket.to(conversationId).emit('typing:stop', { userId, conversationId });
  });

  // ─── Notifications ──────────────────────────────────────────────────────

  /** Client ACKs receipt of a notification (for delivery analytics) */
  socket.on('notification:ack', ({ notificationId }: { notificationId: string }) => {
    console.log(`[Socket] notification:ack — user: ${userId}, id: ${notificationId}`);
  });

  // ─── Booking (Server → Client ONLY) ────────────────────────────────────
  //
  // Booking state changes are ALWAYS driven by API calls, never by client socket events.
  // The service layer emits these using emitBookingEvent() below.
  //
  //  ┌──────────────────────────────────┬──────────────────────────────────────┐
  //  │ Event                            │ Recipients                           │
  //  ├──────────────────────────────────┼──────────────────────────────────────┤
  //  │ booking:new                      │ Caregiver — new pending booking      │
  //  │ booking:confirmed                │ Client + Caregiver                   │
  //  │ booking:declined                 │ Client                               │
  //  │ booking:auto_released            │ Client — cron fired, hold expired    │
  //  │ booking:completed                │ Client + Caregiver                   │
  //  │ booking:cancelled                │ Client + Caregiver                   │
  //  └──────────────────────────────────┴──────────────────────────────────────┘
  //
  //  Payload shape:  { bookingId, status, message, updatedAt (UTC ISO string) }

  // ─── Disconnect ─────────────────────────────────────────────────────────

  socket.on('disconnect', () => {
    if (userId) {
      removeUser(userId);
      console.log(`[Socket] ${socket.userRole} disconnected: ${userId}`);
    }
  });
};

// ─────────────────────────────────────────────────────────────────────────────
//  BOOKING SOCKET HELPER
//  Import and call this from booking.service.ts to emit real-time booking events
// ─────────────────────────────────────────────────────────────────────────────

export interface IBookingSocketPayload {
  bookingId:  string;
  status:     string;
  message:    string;
  updatedAt:  string; // UTC ISO string
  [key: string]: unknown;
}

/**
 * Emit a booking event to one or more user IDs.
 * Safe to call even if no socket is connected (silently skips offline users).
 * Offline users are handled by sendNotification() FCM push in the service layer.
 */
export const emitBookingEvent = (
  event:   string,
  userIds: string[],
  payload: IBookingSocketPayload,
): void => {
  try {
    const io = getIO();
    userIds.forEach((uid) => {
      const sid = getSocketId(uid);
      if (sid) io.to(sid).emit(event, payload);
    });
  } catch {
    // Socket errors must never crash the booking service
  }
};