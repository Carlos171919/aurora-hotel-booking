import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import {
  createBooking,
  myBookings,
  payBooking,
  cancelBooking,
} from '../controllers/bookings.controller';

const router = Router();
router.use(authenticate);
router.get('/me', asyncHandler(myBookings));
router.post('/', asyncHandler(createBooking));
router.post('/:id/pay', asyncHandler(payBooking));
router.delete('/:id', asyncHandler(cancelBooking));
export default router;
