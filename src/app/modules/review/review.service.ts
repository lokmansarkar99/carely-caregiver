import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiErrors';
import { Review } from './review.model';
import Booking from '../booking/booking.model';
import { CaregiverProfile } from '../caregiver-profile/caregiver-profile.model';
import { BOOKING_STATUS } from '../booking/booking.interface';
import { QueryBuilder } from '../../buillder/queryBuilder';

const recalculateCaregiverRating = async (caregiverId: string): Promise<void> => {
  const result = await Review.aggregate([
    {
      $match: {
        caregiver: new Types.ObjectId(caregiverId),
        isVisible: true,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const averageRating = result.length
    ? parseFloat(result[0].averageRating.toFixed(1))
    : 0;
  const totalReviews = result.length ? result[0].totalReviews : 0;

  await CaregiverProfile.findOneAndUpdate(
    { user: new Types.ObjectId(caregiverId) },
    { averageRating, totalReviews },
  );
};

const submitReview = async (
  payload: { bookingId: string; rating: number; comment?: string },
  clientUser: JwtPayload,
) => {
  // Verifies booking belongs to the client and is COMPLETED, enforces one review per booking, creates review, recalculates caregiver average rating and total reviews
  const { bookingId, rating, comment } = payload;

  const booking = await Booking.findById(new Types.ObjectId(bookingId));
  if (!booking) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Booking not found');
  }

  if (booking.client.toString() !== clientUser.id) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to review this booking',
    );
  }

  if (booking.status !== BOOKING_STATUS.COMPLETED) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Reviews can only be submitted for completed bookings',
    );
  }

  const existing = await Review.findOne({
    booking: new Types.ObjectId(bookingId),
  });
  if (existing) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      'You have already submitted a review for this booking',
    );
  }

  const review = await Review.create({
    booking: new Types.ObjectId(bookingId),
    client: new Types.ObjectId(clientUser.id),
    caregiver: booking.caregiver,
    rating,
    comment: comment ?? null,
  });

  await recalculateCaregiverRating(booking.caregiver.toString());

  return review;
};

const getCaregiverReviews = async (
  caregiverId: string,
  query: Record<string, unknown>,
) => {
  // Returns all visible reviews for a caregiver with client name and photo, paginated newest first
  const baseQuery = Review.find({
    caregiver: new Types.ObjectId(caregiverId),
    isVisible: true,
  }).populate('client', 'name profileImage');

  const builder = new QueryBuilder(baseQuery, query).sort().paginate();

  const [data, meta] = await Promise.all([
    builder.modelQuery,
    builder.countTotal(),
  ]);

  return { meta, data };
};

const deleteReview = async (reviewId: string) => {
  // Admin permanently removes a review and immediately recalculates the caregiver average rating
  const review = await Review.findById(new Types.ObjectId(reviewId));
  if (!review) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
  }

  const caregiverId = review.caregiver.toString();

  await Review.findByIdAndDelete(new Types.ObjectId(reviewId));

  await recalculateCaregiverRating(caregiverId);

  return { deleted: true };
};

export const ReviewService = {
  submitReview,
  getCaregiverReviews,
  deleteReview,
};