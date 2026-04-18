import express from 'express';
import {
  getTherapists,
  getTherapist,
  createTherapist,
  updateTherapist,
  deleteTherapist,
} from '../controllers/therapistController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getTherapists).post(optionalAuth, createTherapist);
router
  .route('/:id')
  .get(optionalAuth, getTherapist)
  .put(optionalAuth, updateTherapist)
  .delete(optionalAuth, deleteTherapist);

export default router;
