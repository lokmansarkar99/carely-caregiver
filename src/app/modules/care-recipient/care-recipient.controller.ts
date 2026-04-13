import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import CareRecipientService from "./care-recipient.service";

const createRecipient = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.user!.id;
  const files = req.files as Record<string, Express.Multer.File[]>;
  const result = await CareRecipientService.createRecipient(
    clientId,
    req.body,
    files,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Care recipient added successfully",
    data: result,
  });
});

const getMyRecipients = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.user!.id;
  const result = await CareRecipientService.getMyRecipients(clientId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Care recipients retrieved successfully",
    data: result,
  });
});

const getSingleRecipient = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.user!.id;
  const { id } = req.params;
  const result = await CareRecipientService.getSingleRecipient(
    clientId,
    id as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Care recipient retrieved successfully",
    data: result,
  });
});

const updateRecipient = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.user!.id;
  const { id } = req.params;
  const files = req.files as Record<string, Express.Multer.File[]>;
  const result = await CareRecipientService.updateRecipient(
    clientId,
    id as string,
    req.body,
    files,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Care recipient updated successfully",
    data: result,
  });
});

const deleteRecipient = catchAsync(async (req: Request, res: Response) => {
  const clientId = req.user!.id;
  const { id } = req.params;
  await CareRecipientService.deleteRecipient(clientId, id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Care recipient removed successfully",
    data: null,
  });
});

const CareRecipientController = {
  createRecipient,
  getMyRecipients,
  getSingleRecipient,
  updateRecipient,
  deleteRecipient,
};

export default CareRecipientController;
