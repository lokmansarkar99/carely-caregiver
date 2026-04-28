import cron from 'node-cron';
import { BookingService } from './booking.service';

export const startBookingCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await BookingService.autoReleaseExpiredBookings();
    } catch (err) {
      console.error('[BookingCron] Auto-release error:', err);
    }
  });
};