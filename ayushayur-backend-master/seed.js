import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Patient from './models/Patient.js';
import Appointment from './models/Appointment.js';
import Inventory from './models/Inventory.js';
import Therapist from './models/Therapist.js';
import Room from './models/Room.js';
import Therapy from './models/Therapy.js';
import Vital from './models/Vital.js';
import PrakritiAssessment from './models/PrakritiAssessment.js';
import TreatmentJourney from './models/TreatmentJourney.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Saanvi", "Anya", "Aadhya", "Aaradhya", "Ananya", "Pari", "Diya", "Navya", "Aditi", "Isha", "Rahul", "Vikram", "Neha", "Pooja", "Amit", "Sneha", "Karan", "Riya", "Raj", "Kavya", "Mohan", "Nitin", "Nisha", "Swathi", "Sachin"];
const lastNames = ["Sharma", "Verma", "Gupta", "Nair", "Menon", "Singh", "Patel", "Reddy", "Kumar", "Iyer", "Rao", "Das", "Joshi", "Bhat", "Chaudhary", "Desai", "Pillai", "Shah", "Yadav", "Ghosh"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const complaints = ["Lower Back Pain", "Migraine", "Arthritis", "Digestive Issues", "Insomnia", "Joint Pain", "Skin Rash", "Stress", "Fatigue", "Asthma", "Hyperacidity", "Sciatica", "Hair Loss", "Spondylosis", "Obesity"];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generatePatients = (num) => {
    const patients = [];
    for (let i = 0; i < num; i++) {
        const name = `${firstNames[getRandomInt(0, firstNames.length - 1)]} ${lastNames[getRandomInt(0, lastNames.length - 1)]}`;
        patients.push({
            name,
            age: getRandomInt(18, 85),
            gender: Math.random() > 0.5 ? "Male" : "Female",
            contact: `9${getRandomInt(100000000, 999999999)}`,
            blood_group: bloodGroups[getRandomInt(0, bloodGroups.length - 1)],
            chief_complaint: complaints[getRandomInt(0, complaints.length - 1)],
            registration_date: new Date()
        });
    }
    return patients;
};

const seedDB = async () => {
    try {
        await connectDB();

        console.log("Clearing old data...");
        await Patient.deleteMany();
        await Inventory.deleteMany();
        await Appointment.deleteMany();
        await Therapist.deleteMany();
        await Room.deleteMany();
        await Therapy.deleteMany();
        await Vital.deleteMany();
        await PrakritiAssessment.deleteMany();
        await TreatmentJourney.deleteMany();

        console.log("Seeding base data...");

        // Add dummy Therapists
        const t1 = await Therapist.create({ name: 'Dr. Arjun Nair', gender: 'Male', specialization: 'Ayurveda', contact: '1112223333', email: 'arjun@dhigraph.com', availability_status: 'Available' });
        const t2 = await Therapist.create({ name: 'Dr. Meera Menon', gender: 'Female', specialization: 'Panchakarma', contact: '4445556666', email: 'meera@dhigraph.com', availability_status: 'Available' });
        const t3 = await Therapist.create({ name: 'Dr. Ramesh Kumar', gender: 'Male', specialization: 'Marma', contact: '7778889999', email: 'ramesh@dhigraph.com', availability_status: 'Available' });
        const therapists = [t1._id, t2._id, t3._id];

        // Add dummy Rooms
        const r1 = await Room.create({ room_number: '101', type: 'AC', status: 'Available' });
        const r2 = await Room.create({ room_number: '205', type: 'Non-AC', status: 'Available' });
        const r3 = await Room.create({ room_number: '302', type: 'AC', status: 'Available' });
        const rooms = [r1._id, r2._id, r3._id];

        // Add dummy Therapies
        const th1 = await Therapy.create({ name: 'Abhyanga', description: 'Ayurvedic Massage', duration_minutes: 60, cost: 1500 });
        const th2 = await Therapy.create({ name: 'Shirodhara', description: 'Hot oil treatment', duration_minutes: 45, cost: 2000 });
        const th3 = await Therapy.create({ name: 'Basti', description: 'Enema treatment', duration_minutes: 30, cost: 1200 });
        const th4 = await Therapy.create({ name: 'Nasya', description: 'Nasal administration', duration_minutes: 30, cost: 800 });
        const therapies = [th1._id, th2._id, th3._id, th4._id];

        // Add 100 Patients
        const dummyPatients = generatePatients(100);
        const createdPatients = await Patient.insertMany(dummyPatients);
        console.log(`Inserted ${createdPatients.length} patients.`);

        // Add Inventory
        const inventoryData = [
          { item_name: "Ashwagandha Churna", category: "Medication", quantity: 50, unit: "gm", min_stock_level: 20 },
          { item_name: "Dhanwantaram Tailam", category: "Oil", quantity: 5, unit: "bottle", min_stock_level: 10 },
          { item_name: "Triphala Guggulu", category: "Medication", quantity: 15, unit: "bottle", min_stock_level: 10 },
          { item_name: "Brahmi Vati", category: "Medication", quantity: 2, unit: "box", min_stock_level: 5 },
          { item_name: "Massage Towels", category: "Consumable", quantity: 120, unit: "pcs", min_stock_level: 50 },
          { item_name: "Ksheerabala Oil", category: "Oil", quantity: 8, unit: "bottle", min_stock_level: 12 },
          { item_name: "Chyawanprash", category: "Medication", quantity: 30, unit: "jar", min_stock_level: 15 }
        ];
        await Inventory.insertMany(inventoryData);

        // Populate dynamic data for ALL 100 patients
        const appointments = [];
        const vitals = [];
        const prakriti = [];
        const journeys = [];
        
        const today = new Date();
        const startOfToday = new Date(today.setHours(9, 0, 0, 0));

        for (let i = 0; i < createdPatients.length; i++) {
            const pId = createdPatients[i]._id;
            
            // Random Prakriti Assessment
            prakriti.push({
                patient_id: pId,
                vata_score: getRandomInt(20, 80),
                pitta_score: getRandomInt(20, 80),
                kapha_score: getRandomInt(20, 80),
                assessment_date: new Date(Date.now() - getRandomInt(0, 10) * 86400000)
            });

            // Random Vitals for day 1
            vitals.push({
                patient_id: pId,
                day_number: 1,
                pulse: getRandomInt(65, 95),
                bp_systolic: getRandomInt(110, 140),
                bp_diastolic: getRandomInt(70, 90),
                appetite: ['Good', 'Moderate', 'Poor'][getRandomInt(0, 2)]
            });

            // Random Treatment Journey
            journeys.push({
                patient_id: pId,
                day_number: 1,
                therapy_id: therapies[getRandomInt(0, 3)],
                prescribed_diet: "Avoid cold food, take warm water",
                session_completed: Math.random() > 0.5 ? true : false,
                notes: "Patient is responding well to initial therapy."
            });

            // Add at least 1 appointment per patient (some past, some future, some today)
            // Limit "today" appointments to a reasonable number to mimic live hospital
            let aptDate = new Date();
            let aptStatus = "Scheduled";
            
            if (i < 10) {
                // Today's appointments for first 10 patients
                aptDate = startOfToday;
                aptStatus = i < 4 ? "Completed" : "Scheduled";
            } else if (i < 50) {
                // Past appointments
                aptDate = new Date(Date.now() - getRandomInt(1, 14) * 86400000);
                aptStatus = "Completed";
            } else {
                // Future appointments
                aptDate = new Date(Date.now() + getRandomInt(1, 14) * 86400000);
            }

            appointments.push({
                patient_id: pId,
                therapist_id: therapists[getRandomInt(0, 2)],
                room_id: rooms[getRandomInt(0, 2)],
                therapy_id: therapies[getRandomInt(0, 3)],
                date: aptDate,
                start_time: "10:00 AM",
                end_time: "11:00 AM",
                status: aptStatus
            });
        }

        await PrakritiAssessment.insertMany(prakriti);
        await Vital.insertMany(vitals);
        await TreatmentJourney.insertMany(journeys);
        await Appointment.insertMany(appointments);

        console.log(`Inserted ${appointments.length} appointments, ${vitals.length} vitals, ${prakriti.length} prakriti assessments, and ${journeys.length} treatment journeys!`);

        // Re-generate CSV sheet
        let csvContent = "Name,Age,Gender,Contact,Blood Group,Chief Complaint\n";
        createdPatients.forEach(p => {
             csvContent += `"${p.name}",${p.age},${p.gender},${p.contact},${p.blood_group},"${p.chief_complaint}"\n`;
        });
        const publicDir = path.join(__dirname, '..', 'public');
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
        fs.writeFileSync(path.join(publicDir, 'patients_database.csv'), csvContent);

        console.log("Database perfectly seeded for ALL components!");
        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
