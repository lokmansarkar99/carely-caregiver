import { Query } from "mongoose";

//  All special query params
const EXCLUDE_FIELDS = [
  "searchTerm",
  "sort",
  "fields",
  "page",
  "limit",
  "dateRange",
  "minPrice",
  "maxPrice",
  "minRating",
  "date",
] as const;

type TQueryParam = Record<string, unknown>;

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: TQueryParam;

  constructor(modelQuery: Query<T[], T>, query: TQueryParam) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // SEARCH
  search(searchableFields: string[]): this {
    const searchTerm = (this.query.searchTerm as string)?.trim();

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      } as any);
    }

    return this;
  }

  //  FILTER
  filter(): this {
    const filterObj: TQueryParam = { ...this.query };

    // Remove all special/reserved params
    EXCLUDE_FIELDS.forEach((field) => delete filterObj[field]);

    Object.keys(filterObj).forEach((key) => {
      if (filterObj[key] === "true") filterObj[key] = true;
      if (filterObj[key] === "false") filterObj[key] = false;
    });

    const NUMERIC_FIELDS = [
      "averageRating",
      "experienceYears",
      "baseRate",
      "totalEarnings",
      "totalBookings",
    ];

    NUMERIC_FIELDS.forEach((key) => {
      if (filterObj[key] !== undefined && !isNaN(Number(filterObj[key]))) {
        filterObj[key] = Number(filterObj[key]);
      }
    });

    this.modelQuery = this.modelQuery.find(filterObj as any);
    return this;
  }

  // PRICE RANGE
  priceRange(): this {
    const min = this.query.minPrice;
    const max = this.query.maxPrice;

    if (min === undefined && max === undefined) return this;

    const priceFilter: Record<string, number> = {};
    if (min !== undefined && !isNaN(Number(min)))
      priceFilter.$gte = Number(min);
    if (max !== undefined && !isNaN(Number(max)))
      priceFilter.$lte = Number(max);

    if (Object.keys(priceFilter).length > 0) {
      this.modelQuery = this.modelQuery.find({
        baseRate: priceFilter,
      } as any);
    }

    return this;
  }

  //  RATING FILTER
  ratingFilter(): this {
    const minRating = this.query.minRating;

    if (minRating === undefined || isNaN(Number(minRating))) return this;

    this.modelQuery = this.modelQuery.find({
      averageRating: { $gte: Number(minRating) },
    } as any);

    return this;
  }

  // BOOKING DATE FILTER

  bookingDate(): this {
    const dateParam = this.query.date as string | undefined;

    if (!dateParam) return this;

    const parsed = new Date(dateParam);
    if (isNaN(parsed.getTime())) return this;

    // Start of day UTC
    const startOfDay = new Date(parsed);
    startOfDay.setUTCHours(0, 0, 0, 0);

    // End of day UTC
    const endOfDay = new Date(parsed);
    endOfDay.setUTCHours(23, 59, 59, 999);

    this.modelQuery = this.modelQuery.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    } as any);

    return this;
  }

  //DATE RANGE
  dateRange(): this {
    const range = this.query.dateRange as
      | "weekly"
      | "monthly"
      | "yearly"
      | undefined;
    if (!range) return this;

    const now = new Date();
    const startDate = new Date(now);

    switch (range) {
      case "weekly":
        startDate.setUTCDate(now.getUTCDate() - 7);
        break;
      case "monthly":
        startDate.setUTCMonth(now.getUTCMonth() - 1);
        break;
      case "yearly":
        startDate.setUTCFullYear(now.getUTCFullYear() - 1);
        break;
      default:
        return this;
    }

    this.modelQuery = this.modelQuery.find({
      createdAt: { $gte: startDate, $lte: now },
    } as any);

    return this;
  }

  //  SORT
  sort(): this {
    const sortParam = (this.query.sort as string) || "-createdAt";
    const sortString = sortParam.split(",").join(" ");
    this.modelQuery = this.modelQuery.sort(sortString);
    return this;
  }

  //  PAGINATE
  paginate(): this {
    const page = Math.max(Number(this.query.page) || 1, 1);
    const limit = Math.min(Number(this.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // FIELDS
  fields(): this {
    const requested = (this.query.fields as string)?.split(",").join(" ");
    this.modelQuery = this.modelQuery.select(requested || "-__v");
    return this;
  }

  //  COUNT TOTAL
  async countTotal(): Promise<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const filter = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(filter);

    const page = Math.max(Number(this.query.page) || 1, 1);
    const limit = Math.min(Number(this.query.limit) || 10, 100);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
