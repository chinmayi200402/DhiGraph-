import express from 'express';
import { queryAi, getAiContext } from '../controllers/aiController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/query').post(optionalAuth, queryAi);
router.route('/context/:patientId').get(optionalAuth, getAiContext);

export default router;
