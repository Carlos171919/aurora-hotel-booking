import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { listRooms, getRoom, availableRooms } from '../controllers/rooms.controller';

const router = Router();
router.get('/', asyncHandler(listRooms));
router.get('/availability', asyncHandler(availableRooms));
router.get('/:id', asyncHandler(getRoom));
export default router;
