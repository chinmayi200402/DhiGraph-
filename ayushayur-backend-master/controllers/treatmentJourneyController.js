import asyncHandler from 'express-async-handler';
import TreatmentJourney from '../models/TreatmentJourney.js';

// @desc    Get all treatment journey entries
// @route   GET /api/treatment-journey
// @access  Private
export const getTreatmentJourneys = asyncHandler(async (req, res) => {
  const { patient_id } = req.query;
  
  let query = {};
  if (patient_id) {
    query.patient_id = patient_id;
  }

  const journeys = await TreatmentJourney.find(query)
    .populate('patient_id', 'name')
    .populate('therapy_id', 'name')
    .sort({ day_number: 1 });

  res.status(200).json(journeys);
});

// @desc    Get single treatment journey entry
// @route   GET /api/treatment-journey/:id
// @access  Private
export const getTreatmentJourney = asyncHandler(async (req, res) => {
  const journey = await TreatmentJourney.findById(req.params.id)
    .populate('patient_id')
    .populate('therapy_id');

  if (!journey) {
    res.status(404);
    throw new Error('Treatment journey entry not found');
  }

  res.status(200).json(journey);
});

// @desc    Create new treatment journey entry
// @route   POST /api/treatment-journey
// @access  Private
export const createTreatmentJourney = asyncHandler(async (req, res) => {
  const journey = await TreatmentJourney.create(req.body);
  const populatedJourney = await TreatmentJourney.findById(journey._id)
    .populate('patient_id', 'name')
    .populate('therapy_id', 'name');

  res.status(201).json(populatedJourney);
});

// @desc    Update treatment journey entry
// @route   PUT /api/treatment-journey/:id
// @access  Private
export const updateTreatmentJourney = asyncHandler(async (req, res) => {
  const journey = await TreatmentJourney.findById(req.params.id);

  if (!journey) {
    res.status(404);
    throw new Error('Treatment journey entry not found');
  }

  // If marking as completed, set completed_at
  if (req.body.session_completed && !journey.session_completed) {
    req.body.completed_at = new Date();
  }

  const updatedJourney = await TreatmentJourney.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('patient_id', 'name')
    .populate('therapy_id', 'name');

  res.status(200).json(updatedJourney);
});

// @desc    Delete treatment journey entry
// @route   DELETE /api/treatment-journey/:id
// @access  Private
export const deleteTreatmentJourney = asyncHandler(async (req, res) => {
  const journey = await TreatmentJourney.findById(req.params.id);

  if (!journey) {
    res.status(404);
    throw new Error('Treatment journey entry not found');
  }

  await journey.deleteOne();

  res.status(200).json({ id: req.params.id });
});
