import mongoose from 'mongoose';

const scribbleSchema = mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image_data: {
      type: String,
      required: true, // Base64 encoding for MVP
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Scribble = mongoose.model('Scribble', scribbleSchema);

export default Scribble;
