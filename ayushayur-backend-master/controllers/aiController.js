import asyncHandler from 'express-async-handler';
import AiLog from '../models/AiLog.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import TreatmentJourney from '../models/TreatmentJourney.js';
import Scribble from '../models/Scribble.js';
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
      patientName = "Test Patient (Mock)";
      contextBlocks.push(`System Note: Operating in static mode. No structured DB records exist for ID: ${patient_id}`);
    }
  } catch (err) {
    console.error("Context aggregation failed:", err);
  }

  const compiledContext = contextBlocks.join('\n\n');

  // --- LLM GENERATION ---
  let responseText = "";

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
