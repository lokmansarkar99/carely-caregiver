import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { QueryBuilder } from '../../buillder/queryBuilder';
import ApiError from '../../../errors/ApiErrors';
import { ServiceCategory } from './category.model';
import unlinkFile from '../../../shared/unLinkFIle';

import { ICreateCategoryPayload, IUpdateCategoryPayload } from './category.validation';


const createCategory = async (payload: ICreateCategoryPayload, createdBy: string) => {
  const exists = await ServiceCategory.findOne({
    name: { $regex: new RegExp(`^${payload.name}$`, 'i') },
  });

  if (exists) {
    throw new ApiError(StatusCodes.CONFLICT, 'Category with this name already exists');
  }

  return await ServiceCategory.create({
    ...payload,
    createdBy: new Types.ObjectId(createdBy),
  });
};
const getAllCategories = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(
    ServiceCategory.find(),
    query
  )
    .search(['name', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await categoryQuery.modelQuery;
  const meta = await categoryQuery.countTotal();

  return { data, meta };
};

const getActiveCategories = async () => {
  return await ServiceCategory.find({ isActive: true })
    .select('_id name description icon')
    .sort({ name: 1 });
};

const getCategoryById = async (id: string) => {
  const category = await ServiceCategory.findById(id);

  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  return category;
};

const updateCategory = async (id: string, payload: IUpdateCategoryPayload) => {
  const category = await ServiceCategory.findById(id);

  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  if (payload.name) {
    const duplicate = await ServiceCategory.findOne({
      name: { $regex: new RegExp(`^${payload.name}$`, 'i') },
      _id: { $ne: id },
    });

    if (duplicate) {
      throw new ApiError(StatusCodes.CONFLICT, 'Category name already in use');
    }
  }

  // delete old icon from disk if a new one is uploaded
  if (payload.icon && category.icon) {
    unlinkFile(category.icon);
  }

  return await ServiceCategory.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const toggleStatus = async (id: string) => {
  const category = await ServiceCategory.findById(id);

  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  return await ServiceCategory.findByIdAndUpdate(
    id,
    { isActive: !category.isActive },
    { new: true }
  );
};

const deleteCategory = async (id: string) => {
  const category = await ServiceCategory.findById(id);

  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  await ServiceCategory.findByIdAndDelete(id);
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  updateCategory,
  toggleStatus,
  deleteCategory,
};