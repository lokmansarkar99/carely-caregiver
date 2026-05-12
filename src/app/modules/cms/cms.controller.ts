import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CmsService } from './cms.service';

const getBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await CmsService.getBySlug(req.params.slug as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Page retrieved successfully',
    data: result,
  });
});

const upsertPage = catchAsync(async (req: Request, res: Response) => {
  const result = await CmsService.upsertPage(req.params.slug as string, req.body, req.user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Page saved successfully',
    data: result,
  });
});

const listAll = catchAsync(async (_req: Request, res: Response) => {
  const result = await CmsService.listAll();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'CMS pages retrieved successfully',
    data: result,
  });
});

export const CmsController = {
  getBySlug,
  upsertPage,
  listAll,
};