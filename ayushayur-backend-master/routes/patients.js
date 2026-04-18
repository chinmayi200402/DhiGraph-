import express from 'express';
import {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientByNfc,
} from '../controllers/patientController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getPatients).post(optionalAuth, createPatient);
router.route('/nfc/:tagId').get(optionalAuth, getPatientByNfc);
router
  .route('/:id')
  .get(optionalAuth, getPatient)
  .put(optionalAuth, updatePatient)
  .delete(optionalAuth, deletePatient);

export default router;
