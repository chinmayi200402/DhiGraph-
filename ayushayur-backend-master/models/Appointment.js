import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Please add patient ID'],
    },
    therapist_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: [true, 'Please add therapist ID'],
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Please add room ID'],
    },
    therapy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapy',
      required: [true, 'Please add therapy ID'],
    },
    date: {
      type: Date,
      required: [true, 'Please add appointment date'],
    },
    start_time: {
      type: String,
      required: [true, 'Please add start time'],
    },
    end_time: {
      type: String,
      required: [true, 'Please add end time'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'In Progress'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
