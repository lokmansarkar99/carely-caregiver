export enum NOTIFICATION_TYPE {
  // ── Booking lifecycle ───────────────────────────────────────────
  BOOKING_REQUEST       = 'booking_request',       // → Caregiver: new pending booking
  BOOKING_CONFIRMED     = 'booking_confirmed',     // → Both: caregiver accepted
  BOOKING_DECLINED      = 'booking_declined',      // → Client: caregiver declined
  BOOKING_AUTO_RELEASED = 'booking_auto_released', // → Client: 30-min hold expired
  BOOKING_COMPLETED     = 'booking_completed',     // → Both: service done
  BOOKING_CANCELLED     = 'booking_cancelled',     // → Both: booking cancelled

  // ── Payment & Earnings ──────────────────────────────────────────
  PAYMENT_HELD     = 'payment_held',     // → Caregiver: payment held by admin
  PAYMENT_RELEASED = 'payment_released', // → Caregiver: admin released earnings

  // ── Caregiver account ────────────────────────────────────────────
  CAREGIVER_APPROVED = 'caregiver_approved', // → Caregiver: account approved
  CAREGIVER_REJECTED = 'caregiver_rejected', // → Caregiver: account rejected
  DOCUMENT_VERIFIED  = 'document_verified',  // → Caregiver: specific doc approved
  DOCUMENT_REJECTED  = 'document_rejected',  // → Caregiver: specific doc rejected
  DOCUMENT_APPROVED = 'DOCUMENT_APPROVED',


  // ── Messaging ────────────────────────────────────────────────────
  NEW_MESSAGE = 'new_message',

  // ── System ──────────────────────────────────────────────────────
  SYSTEM = 'system',
}

export enum REFERENCE_MODEL {
  BOOKING           = 'Booking',
  MESSAGE           = 'Message',
  CAREGIVER_PROFILE = 'CaregiverProfile',
  DOCUMENT          = 'Document',
  EARNING           = 'Earning',
  CAREGIVER_DOCUMENT = 'CaregiverDocument',

}