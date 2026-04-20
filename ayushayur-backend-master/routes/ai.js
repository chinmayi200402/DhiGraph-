import express from 'express';
import { queryAi, getAiContext, transcribeScribble } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/query').post(optionalAuth, queryAi);
router.route('/context/:patientId').get(optionalAuth, getAiContext);
router.route('/transcribe-scribble').post(optionalAuth, transcribeScribble);

export default router;
