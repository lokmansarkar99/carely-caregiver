import { Types } from 'mongoose';

export enum EARNING_STATUS {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export interface IEarning {
  caregiver: Types.ObjectId;
  booking: Types.ObjectId;
  amount: number;
  status: EARNING_STATUS;
  paidAt: Date | null;
  payoutMethod: string | null;
  payoutReference: string | null;
  createdAt?: Date;
  updatedAt?: Date;
   preferredPayoutMethod: string | null;
}