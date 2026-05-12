import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

const getStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getStats();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Stats retrieved successfully',
    data: result,
  });
});

const getRevenueChart = catchAsync(async (req: Request, res: Response) => {
  const period = (req.query.period as 'week' | 'month') || 'month';
  const result = await AdminService.getRevenueChart(period);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Revenue chart data retrieved successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers(req.query as Record<string, unknown>);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.blockUser(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: result.message,
    data: { _id: result._id, isBlocked: result.isBlocked },
  });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.softDeleteUser(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const inviteCaregiver = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.inviteCaregiver(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Invitation sent successfully',
    data: result,
  });
});

export const AdminController = {
  getStats,
  getRevenueChart,
  getAllUsers,
  blockUser,
  softDeleteUser,
  inviteCaregiver,
};