import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { CmsPage } from './cms.model';

const getBySlug = async (slug: string) => {
  // Fetches a single CMS page by its slug for public display, throws 404 if not found
  const page = await CmsPage.findOne({ slug: slug.toLowerCase() }).select(
    'slug title content updatedAt',
  );
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Page not found');
  }
  return page;
};

const upsertPage = async (
  slug: string,
  payload: { title: string; content: string },
  adminId: string,
) => {
  // Creates a new CMS page or fully replaces an existing one by slug, records which admin made the last update
  const page = await CmsPage.findOneAndUpdate(
    { slug: slug.toLowerCase() },
    {
      slug: slug.toLowerCase(),
      title: payload.title,
      content: payload.content,
      updatedBy: adminId,
    },
    { upsert: true, new: true, runValidators: true },
  );
  return page;
};

const listAll = async () => {
  // Returns all CMS pages for the admin panel without content body, used for listing
  return CmsPage.find().select('slug title updatedAt updatedBy').sort({ slug: 1 });
};

export const CmsService = {
  getBySlug,
  upsertPage,
  listAll,
};