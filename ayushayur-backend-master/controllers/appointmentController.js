import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Therapist from '../models/Therapist.js';
import Room from '../models/Room.js';
import Therapy from '../models/Therapy.js';

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = asyncHandler(async (req, res) => {
  const { date, patient_id, therapist_id, status } = req.query;
  
  let query = {};
  
  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    query.date = { $gte: startOfDay, $lte: endOfDay };
  }
  
  if (patient_id) {
    query.patient_id = patient_id;
  }
  
  if (therapist_id) {
    query.therapist_id = therapist_id;
  }
  
  if (status) {
    query.status = status;
  }

  const appointments = await Appointment.find(query)
    .populate('patient_id', 'name gender')
    .populate('therapist_id', 'name gender')
    .populate('room_id', 'room_number type')
    .populate('therapy_id', 'name duration_minutes')
    .sort({ date: 1, start_time: 1 });

  res.status(200).json(appointments);
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient_id')
    .populate('therapist_id')
    .populate('room_id')
    .populate('therapy_id');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  res.status(200).json(appointment);
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = asyncHandler(async (req, res) => {
  // Check for conflicts
  const { patient_id, therapist_id, room_id, date, start_time, end_time } = req.body;

  // Check room availability
  const roomConflict = await Appointment.findOne({
    room_id,
    date: new Date(date),
    start_time: { $lte: end_time },
    end_time: { $gte: start_time },
    status: { $ne: 'Cancelled' },
  });

  if (roomConflict) {
    res.status(400);
    throw new Error('Room is already booked at this time');
  }

  // Check therapist availability
  const therapistConflict = await Appointment.findOne({
    therapist_id,
    date: new Date(date),
    start_time: { $lte: end_time },
    end_time: { $gte: start_time },
    status: { $ne: 'Cancelled' },
  });

  if (therapistConflict) {
    res.status(400);
    throw new Error('Therapist is already scheduled at this time');
  }

  // Check gender restriction
  const therapy = await Therapy.findById(req.body.therapy_id);
  const patient = await Patient.findById(patient_id);
  const therapist = await Therapist.findById(therapist_id);

  if (therapy?.gender_restriction && patient?.gender !== therapist?.gender) {
    res.status(400);
    throw new Error(`${therapy.name} requires same-gender therapist`);
  }

  const appointment = await Appointment.create(req.body);
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patient_id', 'name gender')
    .populate('therapist_id', 'name gender')
    .populate('room_id', 'room_number type')
    .populate('therapy_id', 'name duration_minutes');

  res.status(201).json(populatedAppointment);
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check for conflicts if time/date/room/therapist changed
  if (req.body.date || req.body.start_time || req.body.end_time || req.body.room_id || req.body.therapist_id) {
    const { date, start_time, end_time, room_id, therapist_id } = {
      ...appointment.toObject(),
      ...req.body,
    };

    // Check room availability
    const roomConflict = await Appointment.findOne({
      _id: { $ne: req.params.id },
      room_id: room_id || appointment.room_id,
      date: new Date(date || appointment.date),
      start_time: { $lte: end_time || appointment.end_time },
      end_time: { $gte: start_time || appointment.start_time },
      status: { $ne: 'Cancelled' },
    });

    if (roomConflict) {
      res.status(400);
      throw new Error('Room is already booked at this time');
    }

    // Check therapist availability
    const therapistConflict = await Appointment.findOne({
      _id: { $ne: req.params.id },
      therapist_id: therapist_id || appointment.therapist_id,
      date: new Date(date || appointment.date),
      start_time: { $lte: end_time || appointment.end_time },
      end_time: { $gte: start_time || appointment.start_time },
      status: { $ne: 'Cancelled' },
    });

    if (therapistConflict) {
      res.status(400);
      throw new Error('Therapist is already scheduled at this time');
    }
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate('patient_id', 'name gender')
    .populate('therapist_id', 'name gender')
    .populate('room_id', 'room_number type')
    .populate('therapy_id', 'name duration_minutes');

  res.status(200).json(updatedAppointment);
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  await appointment.deleteOne();

  res.status(200).json({ id: req.params.id });
});
