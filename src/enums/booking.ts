/**
 * Booking status lifecycle:
 *   PENDING → (caregiver accept) → CONFIRMED → (service done) → COMPLETED
 *   PENDING → (caregiver decline / cron auto-release after 30 min) → CANCELLED
 *   CONFIRMED → (admin/client cancel) → CANCELLED
 */
export enum BOOKING_STATUS {
  PENDING   = 'pending',   // 30-min hold — waiting caregiver response
  CONFIRMED = 'confirmed', // Caregiver accepted
  CANCELLED = 'cancelled', // Declined, auto-released by cron, or cancelled
  COMPLETED = 'completed', // Service delivered
}

/**
 * Shift types — booking a shift blocks the FULL DAY for that caregiver.
 * Slot start times shown at 2-hour intervals within each shift window.
 */
export enum SHIFT_TYPE {
  MORNING   = 'morning',   // 06:00–14:00 UTC
  AFTERNOON = 'afternoon', // 12:00–20:00 UTC
  EVENING   = 'evening',   // 16:00–22:00 UTC
  NIGHT     = 'night',     // 22:00–06:00 UTC (next day)
}

/** Service categories available on the platform */
export enum SERVICE_TYPE {
  ELDER_CARE        = 'elder_care',
  CHILD_CARE        = 'child_care',
  DISABILITY_CARE   = 'disability_care',
  POST_SURGERY_CARE = 'post_surgery_care',
  DEMENTIA_CARE     = 'dementia_care',
  PALLIATIVE_CARE   = 'palliative_care',
}