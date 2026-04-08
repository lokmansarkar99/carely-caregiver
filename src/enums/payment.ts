/** Status of client payment held by admin */
export enum PAYMENT_STATUS {
  HELD     = 'held',     // Admin holds after booking confirmed
  RELEASED = 'released', // Admin manually released to caregiver
  REFUNDED = 'refunded', // Refunded on decline / cancellation
}

/** Caregiver earnings payout status */
export enum PAYOUT_STATUS {
  PENDING = 'pending',
  PAID    = 'paid',
}

/** Wallet / ledger transaction types */
export enum TRANSACTION_TYPE {
  BOOKING_PAYMENT = 'booking_payment',
  PAYOUT          = 'payout',
  REFUND          = 'refund',
}