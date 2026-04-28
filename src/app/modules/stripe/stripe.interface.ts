export type TCreateCheckoutSessionPayload = {
  bookingId: string;
};

export type TCheckoutSessionMetadata = {
  bookingId: string;
  clientId: string;
  caregiverId: string;
  shift: string;
  slotStartTime: string;
  slotEndTime: string;
  bookingDate: string;
};