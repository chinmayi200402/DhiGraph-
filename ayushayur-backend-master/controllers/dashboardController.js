import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Inventory from '../models/Inventory.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get total patients count
  const totalPatients = await Patient.countDocuments();

  // Get today's appointments
  const todayAppointments = await Appointment.find({
    date: { $gte: today, $lt: tomorrow },
  });

  const completedToday = todayAppointments.filter(
    apt => apt.status === 'Completed'
  ).length;

  // Get inventory items
  const inventoryItems = await Inventory.find();
  const lowStockCount = inventoryItems.filter(
    item => item.quantity < item.min_stock_level
  ).length;

  res.status(200).json({
    totalPatients,
    todayAppointments: todayAppointments.length,
    completedToday,
    inventoryItems: inventoryItems.length,
    lowStockAlerts: lowStockCount,
  });
});
