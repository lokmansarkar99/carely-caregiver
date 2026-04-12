import { Types }       from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import ApiError        from '../../../errors/ApiErrors';
import { QueryBuilder } from '../../buillder/queryBuilder';
import { Notification } from './notification.model';

// GET /my?type=booking_confirmed&isRead=false&page=1&limit=20
const getMyNotifications = async (userId: string, query: Record<string, unknown>) => {
  const builder = new QueryBuilder(
    Notification.find({ recipient: new Types.ObjectId(userId) }),
    query,
  )
    .filter()    // supports ?type= and ?isRead=
    .sort()      // default: -createdAt
    .paginate();

  const [data, meta] = await Promise.all([builder.modelQuery, builder.countTotal()]);

  // Always include unreadCount — used for bell badge
  const unreadCount = await Notification.countDocuments({
    recipient: new Types.ObjectId(userId),
    isRead:    false,
  });

  return { data, meta: { ...meta, unreadCount } };
};

// GET /recent — last 5 for activity feed widget
const getRecent = async (userId: string) => {
  return Notification.find({ recipient: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
};

// GET /unread-count — bell badge
const getUnreadCount = async (userId: string) => {
  const unreadCount = await Notification.countDocuments({
    recipient: new Types.ObjectId(userId),
    isRead:    false,
  });
  return { unreadCount };
};

// PATCH /:id/read
const markOneAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOne({
    _id:       new Types.ObjectId(notificationId),
    recipient: new Types.ObjectId(userId), // ownership check
  });

  if (!notification) throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found');
  if (notification.isRead) return notification; // no-op if already read

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();
  return notification;
};

// PATCH /read-all
const markAllAsRead = async (userId: string) => {
  const result = await Notification.updateMany(
    { recipient: new Types.ObjectId(userId), isRead: false },
    { $set: { isRead: true, readAt: new Date() } },
  );
  return { updatedCount: result.modifiedCount };
};

// DELETE /:id
const deleteOne = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndDelete({
    _id:       new Types.ObjectId(notificationId),
    recipient: new Types.ObjectId(userId), // ownership check
  });

  if (!notification) throw new ApiError(StatusCodes.NOT_FOUND, 'Notification not found');
  return { deleted: true, notificationId };
};

export const NotificationService = {
  getMyNotifications,
  getRecent,
  getUnreadCount,
  markOneAsRead,
  markAllAsRead,
  deleteOne,
};