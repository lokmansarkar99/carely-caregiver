import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';
import { getSingleFilePath } from '../../../shared/getFilePath';
const createCategory = catchAsync(async (req, res) => {
  const iconPath = getSingleFilePath(req.files, 'icon');

  const result = await CategoryService.createCategory({
    ...req.body,
    ...(iconPath && { icon: iconPath }),
    
  }, req.user!.id);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategories(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Categories retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getActiveCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getActiveCategories();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Active categories retrieved successfully',
    data: result,
  });
});

const getCategoryById = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategoryById(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const iconPath = getSingleFilePath(req.files, 'icon');

  const result = await CategoryService.updateCategory(req.params.id as string, {
    ...req.body,
    ...(iconPath && { icon: iconPath }),
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});


const toggleStatus = catchAsync(async (req, res) => {
  const result = await CategoryService.toggleStatus(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Category ${result?.isActive ? 'activated' : 'deactivated'} successfully`,
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  await CategoryService.deleteCategory(req.params.id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Category deleted successfully',
    data: null,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  updateCategory,
  toggleStatus,
  deleteCategory,
};