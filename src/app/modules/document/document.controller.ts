import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DocumentService } from './document.service';
import { DOCUMENT_TYPE, DOCUMENT_STATUS } from '../../../enums/document';

const upload = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.uploadDocument(
    req.user.id,
    req.body.documentType as DOCUMENT_TYPE,
    req.files,
  );
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Document uploaded successfully',
    data: result,
  });
});

const getMyDocuments = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.getMyDocuments(req.user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Documents fetched successfully',
    data: result,
  });
});

const deleteDocument = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.deleteDocument(req.params.id as string, req.user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Document deleted successfully',
    data: result,
  });
});

const getAllDocuments = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.getAllDocuments({
    status: req.query.status as DOCUMENT_STATUS | undefined,
    documentType: req.query.documentType as DOCUMENT_TYPE | undefined,
    caregiverId: req.query.caregiverId as string | undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Documents fetched successfully',
    data: result,
  });
});

const approveDocument = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.approveDocument(req.params.id as string, req.user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Document approved successfully',
    data: result,
  });
});

const rejectDocument = catchAsync(async (req: Request, res: Response) => {
  const result = await DocumentService.rejectDocument(
    req.params.id as string,
    req.body.rejectionReason,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Document rejected',
    data: result,
  });
});

export const DocumentController = {
  upload,
  getMyDocuments,
  deleteDocument,
  getAllDocuments,
  approveDocument,
  rejectDocument,
};