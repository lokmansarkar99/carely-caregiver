import { Schema, model } from 'mongoose';
import { IServiceCategory } from './category.interface';

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

serviceCategorySchema.index({ name: 'text' });
serviceCategorySchema.index({ isActive: 1 });

export const ServiceCategory = model<IServiceCategory>(
  'ServiceCategory',
  serviceCategorySchema
);