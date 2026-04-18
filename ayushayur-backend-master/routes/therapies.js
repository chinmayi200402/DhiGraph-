import express from 'express';
import {
  getTherapies,
  getTherapy,
  createTherapy,
  updateTherapy,
  deleteTherapy,
} from '../controllers/therapyController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getTherapies).post(optionalAuth, createTherapy);
router
  .route('/:id')
  .get(optionalAuth, getTherapy)
  .put(optionalAuth, updateTherapy)
  .delete(optionalAuth, deleteTherapy);

export default router;
