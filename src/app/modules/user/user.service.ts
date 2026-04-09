import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import unlinkFile from "../../../shared/unLinkFIle";
import { getSingleFilePath } from "../../../shared/getFilePath";
import { QueryBuilder } from "../../buillder/queryBuilder";
import { User } from "./user.model";
import { STATUS, USER_ROLES } from "../../../enums/user";
import type {
  UpdateMyProfilePayload,
  UpdateUserStatusPayload,
  BlockUnblockUserPayload,
} from "./user.validation";

const MAX_FCM_TOKENS = 5;

const getMyProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-__v");
  if (!user || user.isDeleted)
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

const updateMyProfile = async (
  userId: string,
  payload: UpdateMyProfilePayload,
  files: any,
) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted)
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  const newImagePath = getSingleFilePath(files, "profileImage");
  if (newImagePath) {
    if (user.profileImage) unlinkFile(user.profileImage);
    (payload as any).profileImage = newImagePath;
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: payload },
    { new: true, runValidators: true },
  ).select("-__v");

  return updated;
};

// Called from mobile app on every login
const addFcmToken = async (userId: string, fcmToken: string) => {
  const user = await User.findById(userId).select("+fcmTokens");
  if (!user || user.isDeleted)
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  // Keep array bounded — remove oldest if at limit
  if (
    user.fcmTokens.length >= MAX_FCM_TOKENS &&
    !user.fcmTokens.includes(fcmToken)
  ) {
    await User.findByIdAndUpdate(userId, { $pop: { fcmTokens: -1 } }); // remove oldest
  }

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { fcmTokens: fcmToken } },
    { new: true },
  );
};

// Called on logout
const removeFcmToken = async (userId: string, fcmToken: string) => {
  await User.findByIdAndUpdate(userId, { $pull: { fcmTokens: fcmToken } });
};

// Admin: get single user
const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-__v");
  if (!user || user.isDeleted)
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  return user;
};

// Admin: update status
const updateUserStatus = async (
  userId: string,
  payload: UpdateUserStatusPayload,
) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted)
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  user.status = payload.status as STATUS;
  await user.save();
  return user;
};

// Admin: block / unblock
const blockUnblockUser = async (
  userId: string,
  payload: BlockUnblockUserPayload,
) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted)
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  user.isBlocked = payload.isBlocked;
  await user.save();
  return user
};

// Admin: soft delete
const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || user.isDeleted)
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  user.isDeleted = true;
  await user.save();
  return user;
};

// Admin: all users 
const getAllUsers = async (query: Record<string, unknown>) => {
  const builder = new QueryBuilder(
    User.find({ isDeleted: false }).select(
      "name email profileImage role status verificationStatus isBlocked createdAt",
    ),
    query,
  )
    .search(["name", "email"])
    .filter()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    builder.modelQuery,
    builder.countTotal(),
  ]);
  return { data, meta };
};

// CLIENT: browse verified caregivers for messaging — 
const getAllCaregivers = async (query: Record<string, unknown>) => {
  const builder = new QueryBuilder(
    User.find({
      role: USER_ROLES.CAREGIVER,
      status: STATUS.ACTIVE,
      verified: true,
      isDeleted: false,
    }).select("name email profileImage role"),
    query,
  )
    .search(["name", "email"])
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    builder.modelQuery,
    builder.countTotal(),
  ]);
  return { data, meta };
};

// CAREGIVER: browse clients for messaging 
const getAllClients = async (query: Record<string, unknown>) => {
  const builder = new QueryBuilder(
    User.find({
      role: USER_ROLES.CLIENT,
      status: STATUS.ACTIVE,
      isDeleted: false,
    }).select("name email profileImage role"),
    query,
  )
    .search(["name", "email"])
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    builder.modelQuery,
    builder.countTotal(),
  ]);
  return { data, meta };
};

export const UserService = {
  getMyProfile,
  updateMyProfile,
  addFcmToken,
  removeFcmToken,
  getUserById,
  updateUserStatus,
  blockUnblockUser,
  deleteUser,
  getAllUsers,
  getAllCaregivers,
  getAllClients,
};
