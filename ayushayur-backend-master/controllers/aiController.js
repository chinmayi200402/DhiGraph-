import asyncHandler from 'express-async-handler';
import AiLog from '../models/AiLog.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import TreatmentJourney from '../models/TreatmentJourney.js';
import Scribble from '../models/Scribble.js';
import Inventory from '../models/Inventory.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Simulate RAG call or execute real OpenAI call
export const queryAi = asyncHandler(async (req, res) => {
  // Initialize Gemini dynamically so dotenv processes .env before this runs
  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

  const { patient_id, user_id, query } = req.body;

  // --- RAG CONTEXT AGGREGATION PIPELINE ---
  let patientName = "Unknown Patient";
  let patientRecord = null;
  let contextBlocks = [];
  let context_used = [];

  try {
    if (patient_id && patient_id.length === 24) {
      patientRecord = await Patient.findById(patient_id);
      if (patientRecord) {
        patientName = patientRecord.name;
        context_used.push('patient_demographics');
        contextBlocks.push(`Patient Demographics: Name: ${patientRecord.name}, Age: ${patientRecord.age}, Gender: ${patientRecord.gender}, Prakriti (Body Type): ${patientRecord.prakriti || 'Not Mapped'}`);
        
        // Fetch Appointments
        const appointments = await Appointment.find({ patient_id }).populate('therapy_id').sort({ date: -1 }).limit(5);
        if (appointments.length > 0) {
          context_used.push('recent_appointments');
          const apptSummaries = appointments.map(a => `- Date: ${new Date(a.date).toLocaleDateString()}, Therapy: ${a.therapy_id?.name || 'Consultation'}, Status: ${a.status}`).join('\n');
          contextBlocks.push(`Recent Appointments:\n${apptSummaries}`);
        }

        // Fetch Treatment Journey
        const journeys = await TreatmentJourney.find({ patient_id }).populate('therapy_id').sort({ day_number: -1 }).limit(10);
        if (journeys.length > 0) {
          context_used.push('treatment_journey_vitals');
          const journeySummaries = journeys.map(j => `- Day ${j.day_number}: ${j.therapy_id?.name || 'Therapy'}, BP: ${j.vitals?.bp || 'N/A'}, Pulse: ${j.vitals?.pulse || 'N/A'}, Diet: ${j.diet_plan || 'N/A'}, Completed: ${j.session_completed}`).join('\n');
          contextBlocks.push(`Treatment Journey Timeline:\n${journeySummaries}`);
        }

        // Fetch Doctor Scribbles / Notes
        const scribbles = await Scribble.find({ patient_id }).sort({ createdAt: -1 }).limit(5);
        if (scribbles.length > 0) {
          context_used.push('doctor_clinical_notes');
          const scribbleSummaries = scribbles.map(s => `- Note (${new Date(s.createdAt).toLocaleDateString()}): ${s.notes || 'Visual diagram recorded without text.'}`).join('\n');
          contextBlocks.push(`Physician Notes/Scribbles:\n${scribbleSummaries}`);
        }
      }
    } else {
      patientName = "General Dashboard User";
      contextBlocks.push(`System Note: Operating in global hospital scope.`);
    }

    if (query) {
      const qLower = query.toLowerCase();
      if (qLower.includes('inventory') || qLower.includes('stock') || qLower.includes('patient') || qLower.includes('hospital') || qLower.includes('medication')) {
          const totalPatients = await Patient.countDocuments();
          const inventoryItems = await Inventory.find();
          const lowStockItems = inventoryItems.filter(item => item.quantity < item.min_stock_level);
          
          let appInfo = `Hospital & Application Overview:\n- Total Registered Patients in DhiGraph: ${totalPatients}\n- Total Inventory Components Tracked: ${inventoryItems.length}\n`;
          if (lowStockItems.length > 0) {
              appInfo += `- CRITICAL Low Stock Alerts: ${lowStockItems.map(i => `${i.item_name} (Only ${i.quantity} ${i.unit} left, requires minimum ${i.min_stock_level})`).join('; ')}`;
          } else {
              appInfo += `- All inventory items are sufficiently stocked across the system.`;
          }
          
          contextBlocks.push(appInfo);
          context_used.push('inventory_status');
      }
    }
  } catch (err) {
    console.error("Context aggregation failed:", err);
  }

  const compiledContext = contextBlocks.join('\n\n');

  // --- LLM GENERATION ---
  let responseText = "";

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const prompt = `You are an expert Ayurvedic clinical assistant inside the DhiGraph HMS. Provide clinical decision support based PRECISELY on the patient context provided. Do not invent medical facts. Format cleanly.

PATIENT CONTEXT:
${compiledContext}

DOCTOR QUERY:
${query}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      responseText = response.text();
    } catch (llmErr) {
      console.error("Gemini API Failed:", llmErr);
      responseText = "Error: " + (llmErr.message || "Unknown LLM integration failure.");
    }
  } else {
    // Elegant fallback Pseudo-RAG
    responseText = `[RAG Simulation Mode Active]\n\nBased on your database query for **${patientName}**, I have extracted the following context vectors:\n\n${compiledContext}\n\n**Note**: To enable real intelligence insights, please ensure \`GEMINI_API_KEY\` is active inside \`.env\`.`;
  }


  // We skip writing to AiLog if the IDs are invalid mock strings to avoid 500 crashes
  let logId = "mock-log-123";

  if (patient_id && patient_id.length === 24 && user_id && user_id.length === 24) {
    const aiLog = await AiLog.create({
      patient_id,
      user_id,
      query,
      response: responseText,
      context_used,
    });
    logId = aiLog._id;
  }

  res.status(200).json({ response: responseText, context: context_used, logId: logId });
});

// @desc    Get AI Context / Logs for a patient
// @route   GET /api/ai/context/:patientId
// @access  Private
export const getAiContext = asyncHandler(async (req, res) => {
  const logs = await AiLog.find({ patient_id: req.params.patientId }).sort({ createdAt: -1 });
  res.status(200).json(logs);
});

// @desc    Transcribe handwritten scribble into text
// @route   POST /api/ai/transcribe-scribble
// @access  Private
export const transcribeScribble = asyncHandler(async (req, res) => {
  const { image_data } = req.body;
  if (!image_data) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
  if (!genAI) {
    return res.status(500).json({ error: 'Gemini API not configured' });
  }

  try {
    const base64Data = image_data.replace(/^data:image\/[a-z]+;base64,/, "");

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = "Please act as an expert medical transcriptionist. Analyze this handwritten clinical note/scribble from a doctor and accurately transcribe the text. If there are clear sections (like vitals, symptoms, diagnosis, treatment), please structure them. Only return the transcribed text, nothing else. If it is completely unreadable or blank, just reply with 'No readable handwriting detected.'";

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png"
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ transcription: text });
  } catch (error) {
    console.error("Gemini Transcription failed:", error);
    res.status(500).json({ error: 'Failed to transcribe image' });
  }
});
