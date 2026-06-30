import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import {
  createRoom,
  updateRoom,
  deleteRoom,
  allBookings,
  setBookingStatus,
} from '../controllers/admin.controller';

const router = Router();
router.use(authenticate, requireAdmin);
router.post('/rooms', asyncHandler(createRoom));
router.put('/rooms/:id', asyncHandler(updateRoom));
router.delete('/rooms/:id', asyncHandler(deleteRoom));
router.get('/bookings', asyncHandler(allBookings));
router.patch('/bookings/:id', asyncHandler(setBookingStatus));
export default router;
