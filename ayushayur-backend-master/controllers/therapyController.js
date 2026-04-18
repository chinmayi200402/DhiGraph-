import asyncHandler from 'express-async-handler';
import Therapy from '../models/Therapy.js';

// @desc    Get all therapies
// @route   GET /api/therapies
// @access  Private
export const getTherapies = asyncHandler(async (req, res) => {
  const therapies = await Therapy.find().sort({ created_at: -1 });
  res.status(200).json(therapies);
});

// @desc    Get single therapy
// @route   GET /api/therapies/:id
// @access  Private
export const getTherapy = asyncHandler(async (req, res) => {
  const therapy = await Therapy.findById(req.params.id);

  if (!therapy) {
    res.status(404);
    throw new Error('Therapy not found');
  }

  res.status(200).json(therapy);
});

// @desc    Create new therapy
// @route   POST /api/therapies
// @access  Private
export const createTherapy = asyncHandler(async (req, res) => {
  const therapy = await Therapy.create(req.body);
  res.status(201).json(therapy);
});

// @desc    Update therapy
// @route   PUT /api/therapies/:id
// @access  Private
export const updateTherapy = asyncHandler(async (req, res) => {
  const therapy = await Therapy.findById(req.params.id);

  if (!therapy) {
    res.status(404);
    throw new Error('Therapy not found');
  }

  const updatedTherapy = await Therapy.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedTherapy);
});

// @desc    Delete therapy
// @route   DELETE /api/therapies/:id
// @access  Private
export const deleteTherapy = asyncHandler(async (req, res) => {
  const therapy = await Therapy.findById(req.params.id);

  if (!therapy) {
    res.status(404);
    throw new Error('Therapy not found');
  }

  await therapy.deleteOne();

  res.status(200).json({ id: req.params.id });
});
