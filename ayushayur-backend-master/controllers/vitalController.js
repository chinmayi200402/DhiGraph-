import asyncHandler from 'express-async-handler';
import Vital from '../models/Vital.js';

// @desc    Get all vitals
// @route   GET /api/vitals
// @access  Private
export const getVitals = asyncHandler(async (req, res) => {
  const { patient_id } = req.query;
  
  let query = {};
  if (patient_id) {
    query.patient_id = patient_id;
  }

  const vitals = await Vital.find(query)
    .populate('patient_id', 'name')
    .sort({ day_number: 1, recorded_at: -1 });

  res.status(200).json(vitals);
});

// @desc    Get single vital
// @route   GET /api/vitals/:id
// @access  Private
export const getVital = asyncHandler(async (req, res) => {
  const vital = await Vital.findById(req.params.id)
    .populate('patient_id');

  if (!vital) {
    res.status(404);
    throw new Error('Vital not found');
  }

  res.status(200).json(vital);
});

// @desc    Create new vital
// @route   POST /api/vitals
// @access  Private
export const createVital = asyncHandler(async (req, res) => {
  const vital = await Vital.create(req.body);
  const populatedVital = await Vital.findById(vital._id)
    .populate('patient_id', 'name');

  res.status(201).json(populatedVital);
});

// @desc    Update vital
// @route   PUT /api/vitals/:id
// @access  Private
export const updateVital = asyncHandler(async (req, res) => {
  const vital = await Vital.findById(req.params.id);

  if (!vital) {
    res.status(404);
    throw new Error('Vital not found');
  }

  const updatedVital = await Vital.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('patient_id', 'name');

  res.status(200).json(updatedVital);
});

// @desc    Delete vital
// @route   DELETE /api/vitals/:id
// @access  Private
export const deleteVital = asyncHandler(async (req, res) => {
  const vital = await Vital.findById(req.params.id);

  if (!vital) {
    res.status(404);
    throw new Error('Vital not found');
  }

  await vital.deleteOne();

  res.status(200).json({ id: req.params.id });
});
