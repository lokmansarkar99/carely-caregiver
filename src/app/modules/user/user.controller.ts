import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMyProfile(req.user!.id);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'Profile fetched', data: result });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateMyProfile(req.user!.id, req.body, req.files);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'Profile updated', data: result });
});

// Mobile app sends its FCM token after login
const updateFcmToken = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.addFcmToken(req.user!.id, req.body.fcmToken);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'FCM token registered', data: null });
});

// Called on logout — body: { fcmToken }
const removeFcmToken = catchAsync(async (req: Request, res: Response) => {
  await UserService.removeFcmToken(req.user!.id, req.body.fcmToken);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'FCM token removed', data: null });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id as string);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'User fetched', data: result });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUserStatus(req.params.id as string, req.body);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: `User status updated to ${req.body.status}`, data: result });
});

const blockUnblockUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.blockUnblockUser(req.params.id as string, req.body);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: `User ${req.body.isBlocked ? "blocked" : "unblocked"} successfully`, data: result });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUser(req.params.id as string);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'User deleted successfully', data: result });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'Users fetched', data: result.data, meta: result.meta });
});

const getAllCaregivers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllCaregivers(req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'Caregivers fetched', data: result.data, meta: result.meta });
});

const getAllClients = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllClients(req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: StatusCodes.OK, success: true, message: 'Clients fetched', data: result.data, meta: result.meta });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
  updateFcmToken,
  removeFcmToken,
  getUserById,
  updateUserStatus,
  blockUnblockUser,
  deleteUser,
  getAllUsers,
  getAllCaregivers,
  getAllClients,
};