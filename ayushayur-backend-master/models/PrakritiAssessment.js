import mongoose from 'mongoose';

const prakritiAssessmentSchema = mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Please add patient ID'],
    },
    vata_score: {
      type: Number,
      required: true,
      default: 0,
    },
    pitta_score: {
      type: Number,
      required: true,
      default: 0,
    },
    kapha_score: {
      type: Number,
      required: true,
      default: 0,
    },
    assessment_date: {
      type: Date,
      default: Date.now,
    },
    responses: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const PrakritiAssessment = mongoose.model('PrakritiAssessment', prakritiAssessmentSchema);

export default PrakritiAssessment;
