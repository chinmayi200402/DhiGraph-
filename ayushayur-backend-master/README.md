# DhiGraph Backend API

Backend REST API for DhiGraph Hospital Management System built with Node.js, Express.js, and MongoDB.

## Features

- RESTful API architecture
- MongoDB database with Mongoose ODM
- JWT-based authentication
- Comprehensive error handling
- Input validation
- Clean code structure (MVC pattern)

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://talktodhanush4554_db_user:$Dhanush4554@hms-1.dcfytub.mongodb.net/?appName=HMS-1
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Therapists
- `GET /api/therapists` - Get all therapists
- `GET /api/therapists/:id` - Get single therapist
- `POST /api/therapists` - Create therapist
- `PUT /api/therapists/:id` - Update therapist
- `DELETE /api/therapists/:id` - Delete therapist

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Therapies
- `GET /api/therapies` - Get all therapies
- `GET /api/therapies/:id` - Get single therapy
- `POST /api/therapies` - Create therapy
- `PUT /api/therapies/:id` - Update therapy
- `DELETE /api/therapies/:id` - Delete therapy

### Appointments
- `GET /api/appointments` - Get all appointments (supports query params: date, patient_id, therapist_id, status)
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment (with conflict checking)
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Prakriti Assessments
- `GET /api/prakriti` - Get all assessments (supports query param: patient_id)
- `GET /api/prakriti/:id` - Get single assessment
- `POST /api/prakriti` - Create assessment
- `PUT /api/prakriti/:id` - Update assessment
- `DELETE /api/prakriti/:id` - Delete assessment

### Treatment Journey
- `GET /api/treatment-journey` - Get all entries (supports query param: patient_id)
- `GET /api/treatment-journey/:id` - Get single entry
- `POST /api/treatment-journey` - Create entry
- `PUT /api/treatment-journey/:id` - Update entry
- `DELETE /api/treatment-journey/:id` - Delete entry

### Vitals
- `GET /api/vitals` - Get all vitals (supports query param: patient_id)
- `GET /api/vitals/:id` - Get single vital
- `POST /api/vitals` - Create vital
- `PUT /api/vitals/:id` - Update vital
- `DELETE /api/vitals/:id` - Delete vital

### Inventory
- `GET /api/inventory` - Get all items (supports query params: category, low_stock)
- `GET /api/inventory/:id` - Get single item
- `POST /api/inventory` - Create item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Project Structure

```
dhigraph-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── patientController.js
│   ├── therapistController.js
│   ├── roomController.js
│   ├── therapyController.js
│   ├── appointmentController.js
│   ├── prakritiController.js
│   ├── treatmentJourneyController.js
│   ├── vitalController.js
│   ├── inventoryController.js
│   └── dashboardController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── notFound.js
├── models/
│   ├── User.js
│   ├── Patient.js
│   ├── Therapist.js
│   ├── Room.js
│   ├── Therapy.js
│   ├── Appointment.js
│   ├── PrakritiAssessment.js
│   ├── TreatmentJourney.js
│   ├── Vital.js
│   └── Inventory.js
├── routes/
│   ├── auth.js
│   ├── patients.js
│   ├── therapists.js
│   ├── rooms.js
│   ├── therapies.js
│   ├── appointments.js
│   ├── prakriti.js
│   ├── treatmentJourney.js
│   ├── vitals.js
│   ├── inventory.js
│   └── dashboard.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Error Handling

The API uses consistent error responses:

```json
{
  "message": "Error message here"
}
```

## License

ISC
