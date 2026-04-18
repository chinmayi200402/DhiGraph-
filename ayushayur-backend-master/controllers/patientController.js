import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';
import PrakritiAssessment from '../models/PrakritiAssessment.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
export const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find().sort({ created_at: -1 });

  // Get prakriti assessments
  const assessments = await PrakritiAssessment.find();
  const prakritiMap = new Map();
  
  assessments.forEach((a) => {
    const scores = [
      { name: 'Vata', score: a.vata_score },
      { name: 'Pitta', score: a.pitta_score },
      { name: 'Kapha', score: a.kapha_score },
    ].sort((x, y) => y.score - x.score);

    const total = a.vata_score + a.pitta_score + a.kapha_score;
    if (total === 0) return;

    const primary = scores[0];
    const secondary = scores[1];
    const diff = ((primary.score - secondary.score) / total) * 100;

    const prakritiType = diff < 10 
      ? `${primary.name}-${secondary.name}` 
      : primary.name;

    prakritiMap.set(a.patient_id.toString(), prakritiType);
  });

  // Get appointments for status
  const appointments = await Appointment.find();
  const statusMap = new Map();
  
  appointments.forEach((apt) => {
    const patientId = apt.patient_id.toString();
    const current = statusMap.get(patientId);
    
    if (apt.status === 'In Progress') {
      statusMap.set(patientId, 'In Treatment');
    } else if (apt.status === 'Scheduled' && current !== 'In Treatment') {
      statusMap.set(patientId, 'Scheduled');
    } else if (apt.status === 'Completed' && !current) {
      statusMap.set(patientId, 'Completed');
    }
  });

  // Enrich patients with prakriti and status
  const enrichedPatients = patients.map((p) => ({
    ...p.toObject(),
    prakriti: prakritiMap.get(p._id.toString()) || null,
    status: statusMap.get(p._id.toString()) || 'New',
  }));

  res.status(200).json(enrichedPatients);
});

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
export const getPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  res.status(200).json(patient);
});

// @desc    Get single patient by NFC Tag
// @route   GET /api/patients/nfc/:tagId
// @access  Private
export const getPatientByNfc = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ nfc_tag: req.params.tagId });

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  res.status(200).json(patient);
});

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private
export const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create(req.body);
  res.status(201).json(patient);
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  const updatedPatient = await Patient.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedPatient);
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
export const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);

  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  await patient.deleteOne();

  res.status(200).json({ id: req.params.id });
});
