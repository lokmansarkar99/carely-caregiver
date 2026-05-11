import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './review.service';

const submitReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.submitReview(req.body, req.user);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Review submitted successfully',
    data: result,
  });
});

const getCaregiverReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getCaregiverReviews(
    req.params.caregiverId as string,
    req.query as Record<string, unknown>,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.deleteReview(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const ReviewController = {
  submitReview,
  getCaregiverReviews,
  deleteReview,
};