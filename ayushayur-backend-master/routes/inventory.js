import express from 'express';
import {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(optionalAuth, getInventoryItems).post(optionalAuth, createInventoryItem);
router
  .route('/:id')
  .get(optionalAuth, getInventoryItem)
  .put(optionalAuth, updateInventoryItem)
  .delete(optionalAuth, deleteInventoryItem);

export default router;
