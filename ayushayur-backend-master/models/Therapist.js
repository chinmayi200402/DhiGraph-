import mongoose from 'mongoose';

const therapistSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add therapist name'],
    },
    gender: {
      type: String,
      required: [true, 'Please add gender'],
      enum: ['Male', 'Female'],
    },
    specialization: {
      type: String,
    },
    contact: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Therapist = mongoose.model('Therapist', therapistSchema);

export default Therapist;
