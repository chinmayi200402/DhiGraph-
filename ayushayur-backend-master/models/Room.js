import mongoose from 'mongoose';

const roomSchema = mongoose.Schema(
  {
    room_number: {
      type: String,
      required: [true, 'Please add room number'],
      unique: true,
    },
    type: {
      type: String,
      required: [true, 'Please add room type'],
      enum: ['AC', 'Non-AC'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Occupied', 'Maintenance'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
