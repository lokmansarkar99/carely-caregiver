import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { QueryBuilder } from '../../buillder/queryBuilder';
import ApiError from '../../../errors/ApiErrors';
import { User } from '../user/user.model';
import { ClientProfile } from './client-profile.model';
import type {
  ICreateClientProfilePayload,
  IUpdateClientProfilePayload,
} from './client-profile.validation';

const USER_FIELDS = 'name email phone profileImage createdAt';
const ADMIN_USER_FIELDS =
  'name email phone profileImage lastLogin isBlocked createdAt';

// Last 4 hex chars of the user ObjectId → "SK-A1B2"
const formatSeekerId = (id: Types.ObjectId | string): string =>
  `SK-${id.toString().slice(-4).toUpperCase()}`;


// CLIENT — create own profile (called once after registration)

const createProfile = async (
  payload: ICreateClientProfilePayload,
  userId: string
) => {
  const existing = await ClientProfile.findOne({
    user: new Types.ObjectId(userId),
  });

  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Client profile already exists');
  }

  const [profile] = await Promise.all([
    ClientProfile.create({ ...payload, user: new Types.ObjectId(userId) }),
    User.findByIdAndUpdate(userId, { intakeCompleted: true }),
  ]);

  return profile;
};


// CLIENT — get own profile

const getMyProfile = async (userId: string) => {
  const profile = await ClientProfile.findOne({
    user: new Types.ObjectId(userId),
  }).populate('user', USER_FIELDS);

  if (!profile) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Client profile not found. Please complete your profile setup.'
    );
  }

  return profile;
};

// CLIENT — update own profile

const updateMyProfile = async (
  userId: string,
  payload: IUpdateClientProfilePayload
) => {
  const profile = await ClientProfile.findOne({
    user: new Types.ObjectId(userId),
  });

  if (!profile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Client profile not found');
  }

  // Build flat $set — never overwrite the entire notificationPreferences object
  const $set: Record<string, unknown> = {};

  if (payload.city !== undefined) $set.city = payload.city;
  if (payload.state !== undefined) $set.state = payload.state;
  if (payload.medicalConditionsAndAllergies !== undefined) {
    $set.medicalConditionsAndAllergies = payload.medicalConditionsAndAllergies;
  }

  if (payload.notificationPreferences) {
    Object.entries(payload.notificationPreferences).forEach(([key, val]) => {
      if (val !== undefined) {
        $set[`notificationPreferences.${key}`] = val;
      }
    });
  }

  const updated = await ClientProfile.findByIdAndUpdate(
    profile._id,
    { $set },
    { new: true, runValidators: true }
  ).populate('user', USER_FIELDS);

  return updated;
};

// ─────────────────────────────────────────────
// ADMIN — paginated list of all clients
// NOTE: bookings & totalSpent are always 0 until the Booking module is built.
// Replace the placeholder block with an aggregation at that point.

const getAllClientProfiles = async (query: Record<string, unknown>) => {
  const searchTerm = query.searchTerm as string | undefined;
  const status = query.status as string | undefined;

  // resolve matching user IDs (cross-collection) ──
  const userFilter: Record<string, unknown> = { role: 'CLIENT' };

  if (searchTerm?.trim()) {
    userFilter.$or = [
      { name: { $regex: searchTerm.trim(), $options: 'i' } },
      { email: { $regex: searchTerm.trim(), $options: 'i' } },
    ];
  }

  if (status === 'active') userFilter.isBlocked = false;
  if (status === 'blocked') userFilter.isBlocked = true;

  const matchedUsers = await User.find(userFilter)
    .select(ADMIN_USER_FIELDS)
    .lean();

  const matchedUserIds = matchedUsers.map((u) => u._id);

  // build base query on ClientProfile ──
  const baseQuery = ClientProfile.find({
    user: { $in: matchedUserIds },
  }).populate('user', ADMIN_USER_FIELDS);

  //  QueryBuilder handles sort + paginate ──
  const queryBuilder = new QueryBuilder(baseQuery as any, query)
    .sort()
    .paginate();

  const [profiles, meta] = await Promise.all([
    queryBuilder.modelQuery.lean(),
    queryBuilder.countTotal(),
  ]);

  // ── Step 4: shape the list-view response (matches UI columns) ──
  // TODO: replace bookings: 0 with a Booking aggregation once that module exists
  const data = profiles.map((p: any) => {
    const user = p.user as Record<string, any>;
    return {
      _id: p._id,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage ?? null,
        isBlocked: user.isBlocked ?? false,
      },
      seekerId: formatSeekerId(user._id as Types.ObjectId),
      joinDate: user.createdAt,
      lastActivity: user.lastLogin ?? null,
      bookings: 0, 
      city: p.city ?? null,
      state: p.state ?? null,
    };
  });

  return { data, meta };
};

// ADMIN — single client detail panel
const getClientProfileByUserId = async (userId: string) => {
  const profile = await ClientProfile.findOne({
    user: new Types.ObjectId(userId),
  }).populate('user', ADMIN_USER_FIELDS + ' phone');

  if (!profile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Client profile not found');
  }

  const user = profile.user as Record<string, any>;

  // TODO: once Booking module exists, replace with:
  // const [bookingCount, totalSpent] = await Promise.all([
  //   Booking.countDocuments({ client: new Types.ObjectId(userId) }),
  //   Booking.aggregate([
  //     { $match: { client: new Types.ObjectId(userId), paymentStatus: 'PAID' } },
  //     { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  //   ]).then(r => r[0]?.total ?? 0),
  // ]);

  return {
    _id: profile._id,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      profileImage: user.profileImage ?? null,
      isBlocked: user.isBlocked ?? false,
    },
    seekerId: formatSeekerId(user._id as Types.ObjectId),
    joinDate: user.createdAt,
    lastActivity: user.lastLogin ?? null,
    address: {
      city: profile.city ?? null,
      state: profile.state ?? null,
    },
    medicalConditionsAndAllergies:
      profile.medicalConditionsAndAllergies ?? null,
    notificationPreferences: profile.notificationPreferences,
    totalBookings: 0, // ← placeholder
    totalSpent: 0,    // ← placeholder
  };
};


// ADMIN — suspend / unsuspend (toggle isBlocked on User)
const toggleSuspendClient = async (userId: string) => {
  const user = await User.findById(userId).select(
    '_id name email role isBlocked'
  );

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  if (user.role !== 'CLIENT') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Target user is not a client'
    );
  }

  const newBlockedState = !user.isBlocked;

  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: { isBlocked: newBlockedState } },
    { new: true }
  ).select('_id name email isBlocked');

  return {
    _id: updated!._id,
    name: updated!.name,
    email: updated!.email,
    isBlocked: updated!.isBlocked,
    action: newBlockedState ? 'suspended' : 'unsuspended',
  };
};

export const ClientProfileService = {
  createProfile,
  getMyProfile,
  updateMyProfile,
  getAllClientProfiles,
  getClientProfileByUserId,
  toggleSuspendClient,
};