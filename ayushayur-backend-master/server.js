import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Import Routes
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import therapistRoutes from './routes/therapists.js';
import roomRoutes from './routes/rooms.js';
import therapyRoutes from './routes/therapies.js';
import appointmentRoutes from './routes/appointments.js';
import prakritiRoutes from './routes/prakriti.js';
import treatmentJourneyRoutes from './routes/treatmentJourney.js';
import vitalRoutes from './routes/vitals.js';
import inventoryRoutes from './routes/inventory.js';
import dashboardRoutes from './routes/dashboard.js';
import scribbleRoutes from './routes/scribbles.js';
import aiRoutes from './routes/ai.js';

// Load environment variables
dotenv.config();

const app = express();

const validateAiConfiguration = () => {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const fallbackKey = process.env.AI_ASSISTANT_API_KEY?.trim();
  const activeKey = geminiKey || fallbackKey;

  if (!activeKey) {
    console.warn('[AI CONFIG] Missing key. Set GEMINI_API_KEY in .env for AI routes to work.');
    return;
  }

  if (!geminiKey && fallbackKey) {
    console.warn('[AI CONFIG] Using AI_ASSISTANT_API_KEY fallback. Prefer GEMINI_API_KEY for Gemini SDK calls.');
  }

  // Gemini API keys commonly begin with "AIza". Warn if the provided key looks incompatible.
  if (activeKey && !activeKey.startsWith('AIza')) {
    console.warn('[AI CONFIG] Active key does not look like a Gemini API key (expected prefix "AIza"). Requests may fail.');
  }
};

validateAiConfiguration();

// Middleware
// CORS configuration - allow all origins in development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CORS_ORIGIN || 'http://localhost:8080')
    : true, // Allow all origins in development (includes localhost:8080, localhost:5173, etc.)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/therapies', therapyRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prakriti', prakritiRoutes);
app.use('/api/treatment-journey', treatmentJourneyRoutes);
app.use('/api/vitals', vitalRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/scribbles', scribbleRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Debug database counts
    const PatientModel = mongoose.model('Patient');
    const pCount = await PatientModel.countDocuments();
    console.log(`ON STARTUP -> Patient Count: ${pCount}`);
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.log("Server will continue running in fallback mode. Ensure your IP is whitelisted on MongoDB Atlas.");
    // process.exit(1); // Removed to prevent crashing when Atlas rejects the IP!
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
