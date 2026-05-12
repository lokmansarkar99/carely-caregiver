import { Types } from 'mongoose';

export interface ICmsPage {
  slug: string;
  title: string;
  content: string;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}