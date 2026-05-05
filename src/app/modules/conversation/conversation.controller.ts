import { Request, Response } from 'express';
import { StatusCodes }       from 'http-status-codes';
import catchAsync            from '../../../shared/catchAsync';
import sendResponse          from '../../../shared/sendResponse';
import { ConversationService } from './conversation.service';

const getUserId = (req: Request): string =>
  (req.user!.id || (req.user as any)._id)?.toString();

const startConversation = catchAsync(async (req: Request, res: Response) => {
  const myId       = getUserId(req);
  const { receiverId } = req.body;

  const result = await ConversationService.getOrCreateConversation(myId, receiverId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Conversation ready',
    data:       result,
  });
});

const getMyInbox = catchAsync(async (req: Request, res: Response) => {
  const myId   = getUserId(req);
  const result = await ConversationService.getMyInbox(myId, req.query as Record<string, unknown>);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Inbox fetched successfully',
    data:       result,
  });
});

const getSingleConversation = catchAsync(async (req: Request, res: Response) => {
  const myId   = getUserId(req);
  const result = await ConversationService.getSingleConversation(req.params.id as string, myId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Conversation fetched successfully',
    data:       result,
  });
});

const searchUsersToMessage = catchAsync(async (req: Request, res: Response) => {
  const myId    = getUserId(req);
  const myRole  = (req.user as any).role as string;
  const result  = await ConversationService.searchUsersToMessage(
    myId,
    myRole,
    req.query as Record<string, unknown>,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success:    true,
    message:    'Users fetched successfully',
    data:       result,
  });
});

export const ConversationController = {
  startConversation,
  getMyInbox,
  getSingleConversation,
  searchUsersToMessage,
};