import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ClientProfileService } from './client-profile.service';

// CLIENT — create own profile
const createProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ClientProfileService.createProfile(
    req.body,
    req.user!.id
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Client profile created successfully',
    data: result,
  });
});

// CLIENT — get own profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ClientProfileService.getMyProfile(req.user!.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

// CLIENT — update own profile
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ClientProfileService.updateMyProfile(
    req.user!.id,
    req.body
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

// ADMIN — paginated list with searchTerm + status + sort + page + limit
const getAllClientProfiles = catchAsync(async (req: Request, res: Response) => {
  const result = await ClientProfileService.getAllClientProfiles(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Client profiles retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

// ADMIN — single client detail panel
const getClientProfileByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ClientProfileService.getClientProfileByUserId(
      req.params.userId as string
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Client profile retrieved successfully',
      data: result,
    });
  }
);

// ADMIN — suspend / unsuspend (toggle)
const toggleSuspendClient = catchAsync(async (req: Request, res: Response) => {
  const result = await ClientProfileService.toggleSuspendClient(
    req.params.userId as string
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Client ${result.action} successfully`,
    data: result,
  });
});

export const ClientProfileController = {
  createProfile,
  getMyProfile,
  updateMyProfile,
  getAllClientProfiles,
  getClientProfileByUserId,
  toggleSuspendClient,
};