import { Document, Types } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}