import mongoose from 'mongoose';

const vitalSchema = mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Please add patient ID'],
    },
    day_number: {
      type: Number,
      required: [true, 'Please add day number'],
    },
    pulse: {
      type: Number,
    },
    bp_systolic: {
      type: Number,
    },
    bp_diastolic: {
      type: Number,
    },
    appetite: {
      type: String,
      enum: ['Good', 'Moderate', 'Poor'],
    },
    notes: {
      type: String,
    },
    recorded_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Vital = mongoose.model('Vital', vitalSchema);

export default Vital;
