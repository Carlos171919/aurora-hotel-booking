import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import { createBooking, myBookings, cancelBooking } from '../controllers/bookings.controller';

const router = Router();
router.use(authenticate);
router.get('/me', asyncHandler(myBookings));
router.post('/', asyncHandler(createBooking));
router.delete('/:id', asyncHandler(cancelBooking));
export default router;
