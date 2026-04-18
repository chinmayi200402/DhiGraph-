import mongoose from 'mongoose';

const therapySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add therapy name'],
    },
    duration_minutes: {
      type: Number,
      required: true,
      default: 60,
    },
    base_cost: {
      type: Number,
      required: true,
      default: 0,
    },
    gender_restriction: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Therapy = mongoose.model('Therapy', therapySchema);

export default Therapy;
