import express from 'express';
import {
  getVitals,
  getVital,
  createVital,
  updateVital,
  deleteVital,
} from '../controllers/vitalController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getVitals).post(optionalAuth, createVital);
router
  .route('/:id')
  .get(optionalAuth, getVital)
  .put(optionalAuth, updateVital)
  .delete(optionalAuth, deleteVital);

export default router;
