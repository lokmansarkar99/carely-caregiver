import { Request, Response } from 'express';
import { StatusCodes }        from 'http-status-codes';
import catchAsync             from '../../../shared/catchAsync';
import sendResponse           from '../../../shared/sendResponse';
import { NotificationService } from './notification.service';

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getMyNotifications(
    req.user!.id,
    req.query as Record<string, unknown>,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Notifications fetched',
    data:       result.data,
    meta:       result.meta,
  });
});

const getRecent = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getRecent(req.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Recent notifications fetched',
    data:       result,
  });
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getUnreadCount(req.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Unread count fetched',
    data:       result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.markAllAsRead(req.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    `${result.updatedCount} notifications marked as read`,
    data:       result,
  });
});

const markOneAsRead = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.markOneAsRead(req.params.id as string, req.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Notification marked as read',
    data:       result,
  });
});

const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.deleteOne(req.params.id as string, req.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Notification deleted',
    data:       result,
  });
});

export const NotificationController = {
  getMyNotifications,
  getRecent,
  getUnreadCount,
  markAllAsRead,
  markOneAsRead,
  deleteOne,
};