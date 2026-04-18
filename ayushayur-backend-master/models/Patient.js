import mongoose from 'mongoose';

const patientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a patient name'],
    },
    age: {
      type: Number,
      required: [true, 'Please add patient age'],
    },
    gender: {
      type: String,
      required: [true, 'Please add gender'],
      enum: ['Male', 'Female', 'Other'],
    },
    contact: {
      type: String,
      required: [true, 'Please add contact number'],
    },
    blood_group: {
      type: String,
    },
    address: {
      type: String,
    },
    serial_no: {
      type: String,
    },
    abha_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    nfc_tag: {
      type: String,
      unique: true,
      sparse: true,
    },
    resident_status: {
      type: String,
    },
    socio_economic_status: {
      type: String,
    },
    education: {
      type: String,
    },
    occupation: {
      type: String,
    },
    opd_no: {
      type: String,
    },
    ipd_no: {
      type: String,
    },
    chief_complaint: {
      type: String,
    },
    registration_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
