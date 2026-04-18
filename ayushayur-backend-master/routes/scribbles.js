import express from 'express';
import { saveScribble, getScribblesByPatient } from '../controllers/scribbleController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(optionalAuth, saveScribble);
router.route('/:patientId').get(optionalAuth, getScribblesByPatient);

export default router;
