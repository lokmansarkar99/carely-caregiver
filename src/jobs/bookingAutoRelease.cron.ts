// src/jobs/bookingAutoRelease.cron.ts
import cron from 'node-cron';
import { BookingService } from '../app/modules/booking/booking.service';

export const startBookingAutoReleaseCron = () => {
  cron.schedule('* * * * *', async () => {
    await BookingService.autoReleaseExpiredBookings();
  });
};