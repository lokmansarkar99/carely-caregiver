import { model, Schema } from 'mongoose';
import { EARNING_STATUS, IEarning } from './earning.interface';

const earningSchema = new Schema<IEarning>(
  {
    caregiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking:   { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    amount:    { type: Number, required: true },
    status:    { type: String, enum: Object.values(EARNING_STATUS), default: EARNING_STATUS.PENDING },
    paidAt:    { type: Date, default: null },
    payoutMethod:    { type: String, default: null },
    payoutReference: { type: String, default: null },
    preferredPayoutMethod: { type: String, default: null },
  },
  { timestamps: true },
);

earningSchema.index({ caregiver: 1, status: 1 });
earningSchema.index({ caregiver: 1, createdAt: -1 });

const Earning = model<IEarning>('Earning', earningSchema);
export default Earning;