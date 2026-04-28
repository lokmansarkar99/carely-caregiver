import { User } from '../user/user.model';
import Stripe from 'stripe';
import httpStatus from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import stripe from '../../../config/stripe.config';
import Booking from '../booking/booking.model';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../booking/booking.interface';
import { emitBookingEvent } from '../../../socket/socketHandlers';

const createPaymentIntent = async (bookingId: string, clientId: string) => {
  // Creates a Stripe PaymentIntent for the booking total and attaches the PI ID to the booking
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  if (booking.client.toString() !== clientId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }
  if (booking.paymentStatus === PAYMENT_STATUS.PAID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Booking already paid');
  }
  if (booking.heldUntil < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Booking hold has expired');
  }

const client = await User.findById(clientId).select('email name')


  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalAmount * 100),
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never'
    },
    receipt_email: client?.email || undefined,
    metadata: {
      bookingId: booking._id.toString(),
      clientId,
    },
  });

  booking.paymentIntentId = paymentIntent.id;
  await booking.save();

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: booking.totalAmount,

  };
};

const handleWebhook = async (rawBody: Buffer, signature: string) => {
  // Verifies Stripe signature and processes payment lifecycle events
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Webhook secret not configured');
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Webhook signature failed: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const booking = await Booking.findOne({ paymentIntentId: pi.id });
      if (!booking) break;

      booking.paymentStatus = PAYMENT_STATUS.PAID;
      await booking.save();

      emitBookingEvent('booking:update', [booking.client.toString()], {
        bookingId: booking._id.toString(),
        status: booking.status as BOOKING_STATUS,
        paymentStatus: PAYMENT_STATUS.PAID,
        message: 'Payment received. Awaiting caregiver confirmation.',
        updatedAt: new Date().toISOString(),
      });
      break;
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const booking = await Booking.findOne({ paymentIntentId: pi.id });
      if (!booking) break;

      emitBookingEvent('booking:update', [booking.client.toString()], {
        bookingId: booking._id.toString(),
        status: booking.status as BOOKING_STATUS,
        message: 'Payment failed. Please try again.',
        updatedAt: new Date().toISOString(),
      });
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const booking = await Booking.findOne({
        paymentIntentId: charge.payment_intent as string,
      });
      if (!booking) break;

      booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
      await booking.save();
      break;
    }

    default:
      console.log(`WEBHOOK: Unhandled event type: ${event.type}`);
  }

  return { received: true };
};

const getPaymentStatus = async (bookingId: string, userId: string) => {
  // Returns the paymentStatus for a booking; accessible by the booking's client or caregiver
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  if (booking.client.toString() !== userId && booking.caregiver.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
  }
  return { paymentStatus: booking.paymentStatus };
};

export const StripeService = { createPaymentIntent, handleWebhook, getPaymentStatus };