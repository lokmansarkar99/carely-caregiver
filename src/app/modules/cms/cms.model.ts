import { model, Schema } from 'mongoose';
import { ICmsPage } from './cms.interface';

const cmsPageSchema = new Schema<ICmsPage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
);

export const CmsPage = model<ICmsPage>('CmsPage', cmsPageSchema);