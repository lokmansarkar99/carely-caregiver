import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { EarningService } from './earning.service';

const getMyEarnings = catchAsync(async (req: Request, res: Response) => {
  const result = await EarningService.getMyEarnings(
    req.user,
    req.query as Record<string, unknown>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Earnings retrieved successfully',
    data: result,
  });
});

const getMySummary = catchAsync(async (req: Request, res: Response) => {
  const result = await EarningService.getMySummary(req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Earnings summary retrieved successfully',
    data: result,
  });
});

const setPayoutMethod = catchAsync(async (req: Request, res: Response) => {
  const result = await EarningService.setPayoutMethod(
    req.user,
    req.body.payoutMethod,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payout method updated successfully',
    data: result,
  });
});

const getAllEarningsAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await EarningService.getAllEarningsAdmin(
    req.query as Record<string, unknown>,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All earnings retrieved successfully',
    data: result,
  });
});

const releaseEarning = catchAsync(async (req: Request, res: Response) => {
  const result = await EarningService.releaseEarning(
    req.params.id as string,
    req.body.payoutReference,
    req.body.payoutMethod,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Earning released successfully',
    data: result,
  });
});

export const EarningController = {
  getMyEarnings,
  getMySummary,
  setPayoutMethod,
  getAllEarningsAdmin,
  releaseEarning,
};