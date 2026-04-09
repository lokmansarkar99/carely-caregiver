import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { IUser, UserModal } from './user.interface';
import { STATUS, USER_ROLES, VERIFICATION_STATUS } from '../../../enums/user';

const userSchema = new Schema<IUser, UserModal>(
  {
    name: { type: String, required: true, trim: true },

    role: { type: String, enum: Object.values(USER_ROLES), required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: { type: String, default: null },

    profileImage: { type: String, default: '' },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },

    verified: { type: Boolean, default: false },

    // CLIENT → VERIFIED on register | CAREGIVER → UNVERIFIED until admin approves docs
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.UNVERIFIED,
    },

    intakeCompleted: { type: Boolean, default: false },

    isBlocked: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },

    lastLogin: { type: Date, default: null },

    // One token per device — $addToSet on login, $pull on logout
    fcmTokens: {
      type: [String],
      default: [],
      select: false,
    },

    googleId: { type: String, default: null, select: false },

    authentication: {
      type: {
        isResetPassword: { type: Boolean, default: false },
        oneTimeCode: { type: Number, default: null },
        expiredAt: { type: Date, default: null },
      },
      default: { isResetPassword: false, oneTimeCode: null, expiredAt: null },
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
userSchema.index({ role: 1, status: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ verificationStatus: 1 });
userSchema.index({ isDeleted: 1 });

// Statics
userSchema.statics.isExistUserById = (id: string) => User.findById(id);
userSchema.statics.isExistUserByEmail = (email: string) => User.findOne({ email });
userSchema.statics.isAccountCreated = (id: string) => User.findById(id);
userSchema.statics.isMatchPassword = (password: string, hashPassword: string): Promise<boolean> =>
  bcrypt.compare(password, hashPassword);

// Password hashing
userSchema.pre('save', async function () {
  if ((this.isNew || this.isModified('password')) && this.password) {
    this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
  }
});

// Virtuals — populate explicitly when needed
userSchema.virtual('caregiverProfile', {
  ref: 'CaregiverProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: true,
});

userSchema.virtual('clientProfile', {
  ref: 'ClientProfile',
  localField: '_id',
  foreignField: 'user',
  justOne: true,
});

export const User = model<IUser, UserModal>('User', userSchema);