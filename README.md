# UPCHAAR – SmartFlow OPD & Patient Queue Management System

> **UPCHAAR** is a smart healthcare/OPD management platform designed to streamline patient appointments, doctor availability, reception check-in, live queues, consultations, prescriptions, medical history, and AI-assisted insights.

## Overview

Traditional OPD systems often rely on rigid appointment schedules and manual queue management. UPCHAAR focuses on **dynamic patient flow**: patients can book appointments, reception staff can verify arrivals through QR check-in, doctors can manage availability and consultations, and patients can monitor their appointment and medical information.

The project contains a **Next.js frontend** that communicates with a separate backend API.

### Core objectives

- Digitize OPD appointment management.
- Provide role-based portals for patients, doctors, reception staff, and administrators.
- Manage doctor availability and appointment slots.
- Provide real-time queue visibility.
- Support QR-based patient check-in.
- Manage consultations, diagnoses, and prescriptions.
- Provide AI-related prediction/insight interfaces.
- Improve the overall patient-flow experience.

---

## Features

### 1. Patient Portal

Patients can:

- Register and log in.
- View their dashboard.
- Search and view doctors.
- View doctor availability and appointment slots.
- Book appointments.
- View appointment details.
- Reschedule appointments.
- Cancel appointments.
- Track queue-related information.
- View diagnoses and medical history.
- View prescriptions and prescription details.
- Update their profile.
- Access AI-insight/prediction features exposed by the backend.

### 2. Doctor Portal

Doctors can:

- Access a dedicated doctor dashboard.
- Manage their availability.
- View appointments.
- Open individual appointment/consultation pages.
- Start and manage consultations.
- Save consultation information.
- End consultations.
- View patient information.
- Access AI insights.

### 3. Reception Portal

Reception staff can:

- Access the reception dashboard.
- Select a doctor and view the doctor's queue.
- Check patients in using an appointment ID.
- Scan QR codes using the browser camera.
- Mark patients as late.
- Mark appointments as emergency cases.
- Receive queue updates through Socket.IO.

### 4. Admin Portal

The application includes a dedicated admin dashboard route for administrative functionality.

### 5. Dynamic Queue Management

The frontend supports:

- Live queue retrieval.
- Patient check-in.
- Late-arrival handling.
- Emergency-priority handling.
- Real-time queue updates through Socket.IO.

### 6. Medical Records

Patients can access:

- Diagnoses.
- Medical history.
- Prescriptions.
- Prescription details.
- Medication information such as dosage, frequency, strength, and duration.

### 7. AI Integration

The frontend contains API integration points for:

- Demand prediction.
- Patient predictions.
- Self-prediction.
- Consultation prediction.

The actual AI/ML processing is **not contained in this frontend repository**; it must be provided by the backend/API architecture.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 16 |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| HTTP Client | Axios |
| Icons | Lucide React |
| QR Scanner | `@yudiel/react-qr-scanner` |
| QR Generation | `qrcode.react` |
| Real-Time Communication | Socket.IO Client |
| Utility | clsx, tailwind-merge |
| Package Manager | npm |

### Frontend architecture

```text
UPCHAAR
│
├── Next.js Application
│   ├── Public Landing Page
│   ├── Authentication
│   ├── Patient Portal
│   ├── Doctor Portal
│   ├── Reception Portal
│   └── Admin Portal
│
├── API Layer
│   ├── Authentication
│   ├── Appointments
│   ├── Doctors
│   ├── Hospitals
│   ├── Consultations
│   ├── Medical Records
│   ├── Queue
│   └── AI
│
└── Backend API
    ├── Authentication
    ├── Database
    ├── Appointment Management
    ├── Queue Engine
    ├── Consultation Management
    ├── Medical Records
    ├── AI/ML Services
    └── Socket.IO Server
```

---

## Project Structure

```text
Upchar-main/
│
├── public/
│   ├── upchar.jpg.jpeg
│   ├── upchar1.jpg.jpeg
│   └── ...
│
├── src/
│   │
│   ├── api/
│   │   ├── ai.ts
│   │   ├── apiConfig.ts
│   │   ├── appointments.ts
│   │   ├── auth.ts
│   │   ├── consultations.ts
│   │   ├── doctors.ts
│   │   ├── hospitals.ts
│   │   ├── medical.ts
│   │   └── queue.ts
│   │
│   ├── app/
│   │   ├── admin/
│   │   ├── doctor/
│   │   ├── patient/
│   │   ├── reception/
│   │   ├── login/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── components/
│       ├── SidebarLayout.tsx
│       ├── Skeleton.tsx
│       └── Spinner.tsx
│
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## User Roles

UPCHAAR supports four main application roles:

| Role | Main Responsibility |
|---|---|
| **PATIENT** | Book appointments, track appointments, view medical information |
| **DOCTOR** | Manage availability, consultations, patients, and clinical information |
| **RECEPTION** | Patient check-in and queue management |
| **ADMIN** | Administrative management |

After authentication, the frontend redirects users according to their role:

```text
PATIENT     → /patient
DOCTOR      → /doctor
RECEPTION   → /reception
ADMIN       → /admin
```

---

## How the System Works

### Patient appointment flow

```text
Patient
   │
   ▼
Login / Register
   │
   ▼
Search Doctor
   │
   ▼
View Doctor Availability
   │
   ▼
Select Date & Slot
   │
   ▼
Book Appointment
   │
   ▼
Appointment Confirmation
   │
   ▼
Visit Hospital
   │
   ▼
QR / Appointment Check-In
   │
   ▼
Dynamic Queue
   │
   ▼
Doctor Consultation
   │
   ▼
Diagnosis / Prescription
   │
   ▼
Patient Medical Records
```

### Reception queue flow

```text
Patient arrives
      │
      ▼
Reception scans QR / enters appointment ID
      │
      ▼
Backend validates appointment
      │
      ▼
Patient is checked in
      │
      ▼
Patient enters doctor's queue
      │
      ├───────────────┐
      ▼               ▼
Normal patient     Emergency case
      │               │
      ▼               ▼
Queue position     Priority handling
      │
      ▼
Doctor consultation
```

### Doctor consultation flow

```text
Doctor
  │
  ▼
View Appointments
  │
  ▼
Open Appointment
  │
  ▼
Start Consultation
  │
  ▼
Enter Consultation Data
  │
  ▼
Save Consultation
  │
  ▼
Diagnosis / Prescription
  │
  ▼
End Consultation
```

---

## API Configuration

The frontend uses an environment variable for the backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

If the variable is not defined, the application defaults to:

```text
http://localhost:4000
```

This value is used by the Axios API client in:

```text
src/api/apiConfig.ts
```

The frontend also attaches the authentication token stored in browser `localStorage`:

```text
Authorization: Bearer <token>
```

### Important

The uploaded project contains the **frontend only**. There is no backend server implementation, database configuration, or AI/ML server inside this archive.

Therefore, the following must exist separately for the complete application to work:

- Backend API server.
- Database.
- Authentication implementation.
- Socket.IO server.
- AI/ML service if AI features are enabled.

---

## API Endpoints Used by the Frontend

### Authentication

```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/:id
PUT    /api/auth/:id
```

### Appointments

```text
GET    /api/appointments/patient/:patientId
GET    /api/appointments/:appointmentId
POST   /api/appointments
POST   /api/appointments/:appointmentId/cancel
POST   /api/appointments/:appointmentId/reschedule
```

### Doctors

```text
GET    /api/doctors
GET    /api/doctors/:id
GET    /api/doctors/:doctorId/availability
POST   /api/doctors/:doctorId/availability
DELETE /api/doctors/availability/:id
GET    /api/doctors/:doctorId/slots?date=:date
```

### Hospitals and Departments

```text
GET    /api/hospitals
GET    /api/hospitals/:hospitalId/departments
```

### Consultations

```text
POST   /api/consultations/start
POST   /api/consultations/delay
POST   /api/consultations/:consultationId/save
POST   /api/consultations/:consultationId/end
```

### Queue

```text
GET    /api/queue/:doctorId
POST   /api/queue/checkin
POST   /api/queue/simulate-late
POST   /api/queue/emergency
```

### Medical Records

```text
GET    /api/diagnoses/patient/:patientId
GET    /api/prescriptions/patient/:patientId
GET    /api/prescriptions/:prescriptionId
```

### AI

```text
GET    /api/ai/demand
GET    /api/ai/predictions/:patientId
POST   /api/ai/self-predict
POST   /api/ai/predict
```

---

## Installation

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- A running UPCHAAR backend API

Check installation:

```bash
node --version
npm --version
```

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Upchar-main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a file named:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Replace the URL with your deployed backend URL when required.

### 4. Start the development server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

## Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

## Environment Variables

| Variable | Required | Example | Purpose |
|---|---:|---|---|
| `NEXT_PUBLIC_API_URL` | Yes for non-local deployment | `https://api.example.com` | Backend API base URL |

For local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

Do **not** place private database credentials, JWT secrets, API keys, or other server-side secrets in `NEXT_PUBLIC_*` variables. Next.js exposes `NEXT_PUBLIC_*` values to the browser.

---

## Real-Time Queue Updates

The reception portal uses Socket.IO:

```text
Socket.IO Client
       │
       ▼
Backend Socket.IO Server
       │
       ▼
Queue Update Event
       │
       ▼
Reception Dashboard
       │
       ▼
Updated Patient Queue
```

The frontend listens for:

```text
queueUpdate
```

The Socket.IO connection uses:

```env
NEXT_PUBLIC_API_URL
```

or falls back to:

```text
http://localhost:4000
```

The backend must therefore expose a compatible Socket.IO server.

---

## Authentication

After successful login, the frontend stores:

```text
token
user
```

in browser `localStorage`.

The token is automatically attached to API requests as:

```http
Authorization: Bearer <token>
```

Role-based routing is handled after authentication.

### Security note

For a production healthcare application, storing authentication tokens in `localStorage` is not the strongest security design because JavaScript-accessible storage can be exposed through XSS. A production implementation should strongly consider secure, `HttpOnly`, `Secure`, `SameSite` cookies and server-side session/token handling.

Because this application handles medical information, security cannot be treated as an optional improvement.

---

## QR Check-In

The reception portal uses:

```text
@yudiel/react-qr-scanner
```

to scan QR codes through a compatible camera.

The scanned value is passed to the check-in API:

```http
POST /api/queue/checkin
```

with an appointment identifier.

A working camera, browser permission, and compatible HTTPS/localhost environment are required for browser-based camera access.

---

## UI and Design

The interface uses:

- Tailwind CSS.
- Responsive layouts.
- Lucide icons.
- Loading skeletons.
- Spinners.
- Cards and dashboard layouts.
- Role-specific navigation.
- Responsive mobile/desktop views.

Brand assets are stored in:

```text
public/
```

---

## Current Repository Scope

This repository is specifically the **UPCHAAR frontend application**.

### Included

- Next.js application.
- React components.
- TypeScript source.
- Patient portal.
- Doctor portal.
- Reception portal.
- Admin route.
- Authentication UI.
- Appointment UI.
- Queue UI.
- QR scanning.
- Medical record UI.
- Prescription UI.
- API client functions.
- Socket.IO client integration.
- AI API integration.

### Not included

- Backend source code.
- Database schema.
- Database server.
- Backend authentication implementation.
- JWT secret/configuration.
- Socket.IO server.
- AI/ML model implementation.
- AI/ML model hosting.
- Production infrastructure configuration.

---

## Recommended Backend Architecture

For a complete deployment, the backend can be structured as:

```text
Backend
│
├── Authentication
│   ├── Login
│   ├── Registration
│   ├── JWT / Session
│   └── Role Authorization
│
├── User Management
│   ├── Patients
│   ├── Doctors
│   ├── Reception
│   └── Admin
│
├── Hospital Management
│   ├── Hospitals
│   └── Departments
│
├── Appointment Management
│   ├── Doctor Slots
│   ├── Booking
│   ├── Cancellation
│   └── Rescheduling
│
├── Queue Engine
│   ├── Check-in
│   ├── Normal Queue
│   ├── Late Patients
│   ├── Emergency Priority
│   └── Real-Time Updates
│
├── Consultation
│   ├── Start
│   ├── Save
│   ├── Delay
│   └── End
│
├── Medical Records
│   ├── Diagnoses
│   ├── Prescriptions
│   └── Medical History
│
└── AI Services
    ├── Demand Prediction
    ├── Patient Prediction
    └── Consultation Prediction
```

---

## Deployment

The frontend can be deployed on platforms that support Next.js, such as:

- Vercel
- Netlify
- Other Node.js/Next.js hosting platforms

The backend must be deployed separately if it is not part of the same application.

For production deployment, configure:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

The backend must also allow requests from the deployed frontend domain through its CORS configuration.

For Socket.IO, configure the backend to allow the production frontend origin as well.

---

## Development Workflow

Recommended development flow:

```text
1. Start Database
       ↓
2. Start Backend API
       ↓
3. Start Socket.IO Server
       ↓
4. Start AI/ML Service if required
       ↓
5. Start Next.js Frontend
       ↓
6. Login
       ↓
7. Test role-specific workflows
```

### Minimum functional test

After starting all required services, verify:

```text
✓ User registration
✓ User login
✓ Role-based routing
✓ Doctor listing
✓ Doctor availability
✓ Appointment booking
✓ Appointment cancellation
✓ Appointment rescheduling
✓ Reception check-in
✓ QR scanning
✓ Queue updates
✓ Doctor consultation
✓ Prescription retrieval
✓ Patient medical history
✓ AI endpoints
```

---

## Known Implementation Considerations

### Backend dependency

The frontend cannot function fully by itself. Most dashboard pages depend on API endpoints running on the backend.

If you see errors such as:

```text
Network Error
ERR_CONNECTION_REFUSED
404
CORS error
Socket connection failed
```

check the backend first.

### API URL

If the backend runs on port `4000` locally:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

If the backend runs elsewhere, update the environment variable.

### CORS

The backend must allow the frontend origin.

For local development this will normally be:

```text
http://localhost:3000
```

### Socket.IO

The frontend expects the backend Socket.IO server to be reachable from the configured API URL.

---

## Future Enhancements

Potential improvements include:

- Secure HttpOnly authentication cookies.
- Stronger role-based authorization.
- Hospital-wide multi-tenant support.
- Appointment reminders through SMS/email/WhatsApp.
- Automated queue notifications.
- Doctor workload analytics.
- Patient wait-time prediction.
- Hospital demand forecasting.
- Advanced AI clinical decision-support with appropriate safeguards.
- Prescription PDF generation.
- Medical report uploads.
- Audit logs.
- Encryption of sensitive data.
- Centralized error handling.
- Automated testing.
- CI/CD pipeline.
- Monitoring and observability.
- Production-grade database backups.
- Rate limiting and API security.
- Accessibility improvements.

---

## Important Disclaimer

UPCHAAR is a software project for healthcare workflow and OPD management.

Any AI-generated prediction, recommendation, or insight must **not** be treated as a substitute for qualified medical judgment. Clinical decisions should remain under the responsibility of appropriately qualified healthcare professionals.

---

## License

This project does not currently specify a license.

If this project is intended for public distribution, add an appropriate license file such as:

```text
MIT
Apache-2.0
GPL-3.0
```

Do not claim an open-source license unless one has actually been added to the repository.

---

## Author / Project

**Project:** UPCHAAR – SmartFlow OPD & Patient Queue Management System

**Domain:** Healthcare Technology / Hospital Management / Web Application

**Frontend:** Next.js + React + TypeScript + Tailwind CSS

**Purpose:** Digitalize OPD appointment management and improve patient flow through dynamic queue management, QR check-in, doctor availability, consultation management, and AI-assisted functionality.
