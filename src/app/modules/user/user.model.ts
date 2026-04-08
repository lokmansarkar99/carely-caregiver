import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { IUser, UserModal } from './user.interface';
import { STATUS, USER_ROLES, VERIFICATION_STATUS } from '../../../enums/user';

const userSchema = new Schema<IUser, UserModal>(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },

    role: {
      type:     String,
      enum:     Object.values(USER_ROLES),
      required: true,
    },

    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
    },

    phone: {
      type:    String,
      default: null,
    },

    profileImage: {
      type:    String,
      default: '',
    },

    password: {
      type:      String,
      required:  true,
      select:    false,
      minlength: 8,
    },

    status: {
      type:    String,
      enum:    Object.values(STATUS),
      default: STATUS.ACTIVE,
    },

    verified: {
      type:    Boolean,
      default: false,
    },

    // CLIENT → VERIFIED on register | CAREGIVER → UNVERIFIED (needs admin approval)
    verificationStatus: {
      type:    String,
      enum:    Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.UNVERIFIED,
    },

    // true once user completes profile onboarding after registration
    intakeCompleted: {
      type:    Boolean,
      default: false,
    },

    isBlocked: {
      type:    Boolean,
      default: false,
    },

    isDeleted: {
      type:    Boolean,
      default: false,
    },

    lastLogin: {
      type:    Date,
      default: null,
    },

    // FCM device token — updated on every login, used for push notifications
    fcmToken: {
      type:    String,
      default: null,
      select:  false, // never expose in queries unless explicitly selected
    },

    googleId: {
      type:    String,
      default: null,
      select:  false,
    },

    // OTP storage — select: false so it never leaks in normal queries
    authentication: {
      type: {
        isResetPassword: { type: Boolean, default: false },
        oneTimeCode:     { type: Number,  default: null  },
        expiredAt:       { type: Date,    default: null  },
      },
      default: {
        isResetPassword: false,
        oneTimeCode:     null,
        expiredAt:       null,
      },
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON:  { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ verificationStatus: 1 });

// ── Statics ───────────────────────────────────────────────────────────────────
userSchema.statics.isExistUserById = async (id: string) => {
  return User.findById(id);
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  return User.findOne({ email });
};

userSchema.statics.isAccountCreated = async (id: string) => {
  return User.findById(id);
};

userSchema.statics.isMatchPassword = async (
  password:     string,
  hashPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashPassword);
};

// ── Password hashing middleware ────────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (this.isNew && this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  } else if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
});

// ── Virtuals ──────────────────────────────────────────────────────────────────
// Populated when needed: User.findById(id).populate('caregiverProfile')
userSchema.virtual('caregiverProfile', {
  ref:        'CaregiverProfile',
  localField:  '_id',
  foreignField: 'user',
  justOne:     true,
});

// Populated when needed: User.findById(id).populate('clientProfile')
userSchema.virtual('clientProfile', {
  ref:        'ClientProfile',
  localField:  '_id',
  foreignField: 'user',
  justOne:     true,
});

export const User = model<IUser, UserModal>('User', userSchema);