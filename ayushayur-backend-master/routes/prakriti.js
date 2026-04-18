import express from 'express';
import {
  getPrakritiAssessments,
  getPrakritiAssessment,
  createPrakritiAssessment,
  updatePrakritiAssessment,
  deletePrakritiAssessment,
} from '../controllers/prakritiController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getPrakritiAssessments).post(optionalAuth, createPrakritiAssessment);
router
  .route('/:id')
  .get(optionalAuth, getPrakritiAssessment)
  .put(optionalAuth, updatePrakritiAssessment)
  .delete(optionalAuth, deletePrakritiAssessment);

export default router;
