import { Types } from 'mongoose';

export enum BOOKING_STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  AUTO_RELEASED = 'AUTO_RELEASED',
}

export enum SHIFT_TYPE {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

export enum PAYMENT_STATUS {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export enum CANCELLED_BY {
  CLIENT = 'CLIENT',
  CAREGIVER = 'CAREGIVER',
  ADMIN = 'ADMIN',
}

export interface IBooking {
  client: Types.ObjectId;
  caregiver: Types.ObjectId;
  careRecipient: Types.ObjectId;
  serviceCategory: Types.ObjectId;
  date: Date;
  shift: SHIFT_TYPE;
  slotStartTime: string;
  slotEndTime: string;
  instructions: string | null;
  status: BOOKING_STATUS;
  heldUntil: Date;
  basePrice: number;
  serviceFee: number;
  totalAmount: number;
  paymentStatus: PAYMENT_STATUS;
  paymentIntentId: string | null;
  declineReason: string | null;
  cancelledBy: CANCELLED_BY | null;
  cancelReason: string | null;
  completedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}