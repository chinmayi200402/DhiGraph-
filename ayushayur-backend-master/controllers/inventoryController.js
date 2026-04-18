import asyncHandler from 'express-async-handler';
import Inventory from '../models/Inventory.js';

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
export const getInventoryItems = asyncHandler(async (req, res) => {
  const { category, low_stock } = req.query;
  
  let query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (low_stock === 'true') {
    // This will be handled after fetching
  }

  let items = await Inventory.find(query).sort({ created_at: -1 });

  if (low_stock === 'true') {
    items = items.filter(item => item.quantity < item.min_stock_level);
  }

  res.status(200).json(items);
});

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
export const getInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }

  res.status(200).json(item);
});

// @desc    Create new inventory item
// @route   POST /api/inventory
// @access  Private
export const createInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.create(req.body);
  res.status(201).json(item);
});

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
export const updateInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }

  // If quantity is being updated, update last_restocked_at
  if (req.body.quantity && req.body.quantity > item.quantity) {
    req.body.last_restocked_at = new Date();
  }

  const updatedItem = await Inventory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedItem);
});

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
export const deleteInventoryItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Inventory item not found');
  }

  await item.deleteOne();

  res.status(200).json({ id: req.params.id });
});
