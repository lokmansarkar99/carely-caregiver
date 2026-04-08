import { Model, Document } from 'mongoose';
import { USER_ROLES, STATUS, VERIFICATION_STATUS } from '../../../enums/user';

export type IUser = {
  name:               string;
  role:               USER_ROLES;
  email:              string;
  phone?:             string | null;
  profileImage?:      string;
  password:           string;
  status:             STATUS;
  verified:           boolean;
  verificationStatus: VERIFICATION_STATUS;
  intakeCompleted:    boolean;
  isBlocked:          boolean;
  isDeleted:          boolean;
  lastLogin:          Date | null;
  fcmToken?:          string | null;  
  googleId?:          string | null;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode:     number | null;
    expiredAt:       Date   | null;
  };
};

export type UserModal = Model<IUser & Document> & {
  isExistUserById(id: string):                               Promise<IUser & Document | null>;
  isExistUserByEmail(email: string):                         Promise<IUser & Document | null>;
  isAccountCreated(id: string):                              Promise<IUser & Document | null>;
  isMatchPassword(password: string, hashPassword: string):   Promise<boolean>;
};