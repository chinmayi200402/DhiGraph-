import asyncHandler from 'express-async-handler';
import Room from '../models/Room.js';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find().sort({ created_at: -1 });
  res.status(200).json(rooms);
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Private
export const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.status(200).json(room);
});

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private
export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json(room);
});

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private
export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedRoom);
});

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  await room.deleteOne();

  res.status(200).json({ id: req.params.id });
});
