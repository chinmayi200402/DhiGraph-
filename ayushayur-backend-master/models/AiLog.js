import mongoose from 'mongoose';

const aiLogSchema = mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    context_used: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const AiLog = mongoose.model('AiLog', aiLogSchema);

export default AiLog;
