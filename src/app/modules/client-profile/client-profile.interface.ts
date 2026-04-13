import { Document, Model, Types } from 'mongoose';

export type INotificationPreferences = {
  enableNotifications: boolean;
  bookingAlerts: boolean;
  paymentAlerts: boolean;
  messages: boolean;
};

export type IClientProfile = {
  user: Types.ObjectId;
  city: string | null;
  state: string | null;
  medicalConditionsAndAllergies: string | null;
  notificationPreferences: INotificationPreferences;
};

export type IClientProfileModel = Model<IClientProfile & Document>;