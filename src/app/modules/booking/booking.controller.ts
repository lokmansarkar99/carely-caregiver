import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookingService } from './booking.service';

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.createBooking(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Booking request sent successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getMyBookings(req.user, req.query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

const getCaregiverBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getCaregiverBookings(req.user, req.query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getSingleBooking(req.params.id as string, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking retrieved successfully',
    data: result,
  });
});

const acceptBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.acceptBooking(req.params.id as string, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking accepted successfully',
    data: result,
  });
});

const declineBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.declineBooking(req.params.id as string, req.user, req.body.declineReason);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking declined',
    data: result,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.cancelBooking(req.params.id as string, req.user, req.body.cancelReason);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking cancelled successfully',
    data: result,
  });
});

const completeBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.completeBooking(req.params.id as string, req.user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking marked as completed',
    data: result,
  });
});

const getAllBookingsAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.getAllBookingsAdmin(req.query as Record<string, string>);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All bookings retrieved successfully',
    data: result,
  });
});

const adminCancelBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingService.adminCancelBooking(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking force-cancelled by admin',
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  getCaregiverBookings,
  getSingleBooking,
  acceptBooking,
  declineBooking,
  cancelBooking,
  completeBooking,
  getAllBookingsAdmin,
  adminCancelBooking,
};