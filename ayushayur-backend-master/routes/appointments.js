import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getAppointments).post(optionalAuth, createAppointment);
router
  .route('/:id')
  .get(optionalAuth, getAppointment)
  .put(optionalAuth, updateAppointment)
  .delete(optionalAuth, deleteAppointment);

export default router;
