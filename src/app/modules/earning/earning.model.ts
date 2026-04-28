import { model, Schema, Types } from 'mongoose';

export interface IEarning {
  caregiver: Types.ObjectId;
  booking: Types.ObjectId;
  amount: number;
  status: 'pending' | 'released';
  releasedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const earningSchema = new Schema<IEarning>(
  {
    caregiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'released'], default: 'pending' },
    releasedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const Earning = model<IEarning>('Earning', earningSchema);
export default Earning;