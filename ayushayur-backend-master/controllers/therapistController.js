import asyncHandler from 'express-async-handler';
import Therapist from '../models/Therapist.js';

// @desc    Get all therapists
// @route   GET /api/therapists
// @access  Private
export const getTherapists = asyncHandler(async (req, res) => {
  const therapists = await Therapist.find().sort({ created_at: -1 });
  res.status(200).json(therapists);
});

// @desc    Get single therapist
// @route   GET /api/therapists/:id
// @access  Private
export const getTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  if (!therapist) {
    res.status(404);
    throw new Error('Therapist not found');
  }

  res.status(200).json(therapist);
});

// @desc    Create new therapist
// @route   POST /api/therapists
// @access  Private
export const createTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.create(req.body);
  res.status(201).json(therapist);
});

// @desc    Update therapist
// @route   PUT /api/therapists/:id
// @access  Private
export const updateTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  if (!therapist) {
    res.status(404);
    throw new Error('Therapist not found');
  }

  const updatedTherapist = await Therapist.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedTherapist);
});

// @desc    Delete therapist
// @route   DELETE /api/therapists/:id
// @access  Private
export const deleteTherapist = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findById(req.params.id);

  if (!therapist) {
    res.status(404);
    throw new Error('Therapist not found');
  }

  await therapist.deleteOne();

  res.status(200).json({ id: req.params.id });
});
