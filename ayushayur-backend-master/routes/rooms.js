import express from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getRooms).post(optionalAuth, createRoom);
router
  .route('/:id')
  .get(optionalAuth, getRoom)
  .put(optionalAuth, updateRoom)
  .delete(optionalAuth, deleteRoom);

export default router;
