import mongoose from 'mongoose';

const treatmentJourneySchema = mongoose.Schema(
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
    therapy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapy',
    },
    prescribed_diet: {
      type: String,
    },
    session_completed: {
      type: Boolean,
      default: false,
    },
    completed_at: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TreatmentJourney = mongoose.model('TreatmentJourney', treatmentJourneySchema);

export default TreatmentJourney;
