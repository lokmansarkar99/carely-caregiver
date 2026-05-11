import { Types } from 'mongoose';

export interface IReview {
  booking: Types.ObjectId;
  client: Types.ObjectId;
  caregiver: Types.ObjectId;
  rating: number;
  comment: string | null;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}