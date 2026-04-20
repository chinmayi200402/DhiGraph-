import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './models/Patient.js';
import Appointment from './models/Appointment.js';

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("URI being used:", uri);

const checkDB = async () => {
    try {
        await mongoose.connect(uri);
        const pcount = await Patient.countDocuments();
        const acount = await Appointment.countDocuments();
        console.log("Patients count:", pcount);
        console.log("Appointments count:", acount);
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
checkDB();
