import express from 'express';
import {
  getTreatmentJourneys,
  getTreatmentJourney,
  createTreatmentJourney,
  updateTreatmentJourney,
  deleteTreatmentJourney,
} from '../controllers/treatmentJourneyController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getTreatmentJourneys).post(optionalAuth, createTreatmentJourney);
router
  .route('/:id')
  .get(optionalAuth, getTreatmentJourney)
  .put(optionalAuth, updateTreatmentJourney)
  .delete(optionalAuth, deleteTreatmentJourney);

export default router;
