import asyncHandler from 'express-async-handler';
import PrakritiAssessment from '../models/PrakritiAssessment.js';

// @desc    Get all prakriti assessments
// @route   GET /api/prakriti
// @access  Private
export const getPrakritiAssessments = asyncHandler(async (req, res) => {
  const { patient_id } = req.query;
  
  let query = {};
  if (patient_id) {
    query.patient_id = patient_id;
  }

  const assessments = await PrakritiAssessment.find(query)
    .populate('patient_id', 'name')
    .sort({ assessment_date: -1 });

  res.status(200).json(assessments);
});

// @desc    Get single prakriti assessment
// @route   GET /api/prakriti/:id
// @access  Private
export const getPrakritiAssessment = asyncHandler(async (req, res) => {
  const assessment = await PrakritiAssessment.findById(req.params.id)
    .populate('patient_id');

  if (!assessment) {
    res.status(404);
    throw new Error('Prakriti assessment not found');
  }

  res.status(200).json(assessment);
});

// @desc    Create new prakriti assessment
// @route   POST /api/prakriti
// @access  Private
export const createPrakritiAssessment = asyncHandler(async (req, res) => {
  const assessment = await PrakritiAssessment.create(req.body);
  const populatedAssessment = await PrakritiAssessment.findById(assessment._id)
    .populate('patient_id', 'name');

  res.status(201).json(populatedAssessment);
});

// @desc    Update prakriti assessment
// @route   PUT /api/prakriti/:id
// @access  Private
export const updatePrakritiAssessment = asyncHandler(async (req, res) => {
  const assessment = await PrakritiAssessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error('Prakriti assessment not found');
  }

  const updatedAssessment = await PrakritiAssessment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate('patient_id', 'name');

  res.status(200).json(updatedAssessment);
});

// @desc    Delete prakriti assessment
// @route   DELETE /api/prakriti/:id
// @access  Private
export const deletePrakritiAssessment = asyncHandler(async (req, res) => {
  const assessment = await PrakritiAssessment.findById(req.params.id);

  if (!assessment) {
    res.status(404);
    throw new Error('Prakriti assessment not found');
  }

  await assessment.deleteOne();

  res.status(200).json({ id: req.params.id });
});
