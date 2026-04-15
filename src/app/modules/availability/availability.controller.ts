import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AvailabilityService } from './availability.service';
import ApiError from '../../../errors/ApiErrors';

const getCaregiverId = (req: Request): string => {
  const id = (req.user!.id || (req.user as any)._id)?.toString();
  if (!id) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid session. Please login again.');
  return id;
};

// POST /api/v1/availability
const addShift = catchAsync(async (req: Request, res: Response) => {
  const caregiverId = getCaregiverId(req);
  const result = await AvailabilityService.addShift(caregiverId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Shift added successfully',
    data: result,
  });
});

// GET /api/v1/availability/me
const getMyAvailability = catchAsync(async (req: Request, res: Response) => {
  const caregiverId = getCaregiverId(req);
  const result = await AvailabilityService.getMyAvailability(caregiverId, {
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Availability fetched successfully',
    data: result,
  });
});

// PATCH /api/v1/availability/:id/shift/:shiftId
const updateShift = catchAsync(async (req: Request, res: Response) => {
  const caregiverId = getCaregiverId(req);
  const result = await AvailabilityService.updateShift(
    caregiverId,
    req.params.id as string,
    req.params.shiftId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Shift updated successfully',
    data: result,
  });
});

// DELETE /api/v1/availability/:id/shift/:shiftId
const removeShift = catchAsync(async (req: Request, res: Response) => {
  const caregiverId = getCaregiverId(req);
  const result = await AvailabilityService.removeShift(
    caregiverId,
    req.params.id as string,
    req.params.shiftId as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Shift removed successfully',
    data: result,
  });
});

// DELETE /api/v1/availability/:id
const deleteAvailability = catchAsync(async (req: Request, res: Response) => {
  const caregiverId = getCaregiverId(req);
  const result = await AvailabilityService.deleteAvailability(caregiverId, req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Availability record deleted successfully',
    data: result,
  });
});

// GET /api/v1/availability/:caregiverId  (public)
const getCaregiverAvailability = catchAsync(async (req: Request, res: Response) => {
  const result = await AvailabilityService.getCaregiverAvailability(
    req.params.caregiverId as string,
    {
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    },
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Caregiver availability fetched successfully',
    data: result,
  });
});

export const AvailabilityController = {
  addShift,
  getMyAvailability,
  updateShift,
  removeShift,
  deleteAvailability,
  getCaregiverAvailability,
};