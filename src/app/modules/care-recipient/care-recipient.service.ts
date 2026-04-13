import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { getSingleFilePath } from "../../../shared/getFilePath";
import unlinkFile from "../../../shared/unLinkFIle";
import CareRecipient from "./care-recipient.model";
import { ICareRecipient } from "./care-recipient.interface";

// Creates a new care recipient under the authenticated client
const createRecipient = async (
  clientId: string,
  body: Partial<ICareRecipient>,
  files?: Record<string, Express.Multer.File[]>,
): Promise<ICareRecipient> => {
  const photo = getSingleFilePath(files, "careRecipientPhoto");

  const recipient = await CareRecipient.create({
    ...body,
    client: clientId,
    ...(photo && { photo }),
  });

  return recipient;
};
// Returns all active care recipients
const getMyRecipients = async (clientId: string): Promise<ICareRecipient[]> => {
  const recipients = await CareRecipient.find({
    client: clientId,
    isActive: true,
  })
    .select("fullName photo relationship dateOfBirth gender careNeeds")
    .sort({ createdAt: -1 })
    .lean();

  return recipients;
};
// Returns full detail of a single care recipient,
const getSingleRecipient = async (
  clientId: string,
  recipientId: string,
): Promise<ICareRecipient> => {
  const recipient = await CareRecipient.findOne({
    _id: recipientId,
    client: clientId,
    isActive: true,
  }).lean();

  if (!recipient) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Care recipient not found");
  }

  return recipient;
};
// Updates care recipient fields and replaces
const updateRecipient = async (
  clientId: string,
  recipientId: string,
  body: Partial<ICareRecipient>,
  files?: Record<string, Express.Multer.File[]>,
): Promise<ICareRecipient> => {
  const recipient = await CareRecipient.findOne({
    _id: recipientId,
    client: clientId,
    isActive: true,
  });

  if (!recipient) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Care recipient not found");
  }

  const newPhoto = getSingleFilePath(files, "careRecipientPhoto");
  if (newPhoto) {
    if (recipient.photo) {
      unlinkFile(recipient.photo);
    }
    body.photo = newPhoto;
  }

  const updated = await CareRecipient.findByIdAndUpdate(
    recipientId,
    { $set: body },
    { new: true, runValidators: true },
  ).lean();

  return updated as ICareRecipient;
};
// Soft-deletes a care recipient by setting isActive to false
const deleteRecipient = async (
  clientId: string,
  recipientId: string,
): Promise<void> => {
  const recipient = await CareRecipient.findOne({
    _id: recipientId,
    client: clientId,
    isActive: true,
  });

  if (!recipient) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Care recipient not found");
  }

  await CareRecipient.findByIdAndUpdate(recipientId, { isActive: false });
};

const CareRecipientService = {
  createRecipient,
  getMyRecipients,
  getSingleRecipient,
  updateRecipient,
  deleteRecipient,
};

export default CareRecipientService;
