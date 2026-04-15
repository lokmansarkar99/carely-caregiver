import { Document, Types } from 'mongoose';

export type TSlotStatus = 'AVAILABLE' | 'HELD' | 'BOOKED';
export type TShiftType = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export interface ISlot {
  _id: Types.ObjectId;
  startTime: string;
  status: TSlotStatus;
  heldUntil: Date | null;
  bookingId: Types.ObjectId | null;
}

export interface IShift {
  _id: Types.ObjectId;
  shiftType: TShiftType;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  slots: ISlot[];
}

export interface IAvailability extends Document {
  caregiver: Types.ObjectId;
  date: Date;
  shifts: IShift[];
  isDayBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}