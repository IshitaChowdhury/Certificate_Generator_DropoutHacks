# DropOutHacks Certificate Generator

Generate personalized PDF certificates for registered DropOutHacks participants using a React frontend and an Express backend.

## Stack

- Frontend: React 18, Vite
- Backend: Node.js, Express
- Data: CSV (`backend/data/participants.csv`)
- PDF: `pdf-lib` + `@pdf-lib/fontkit`

## Quick Start

### 1) Run backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## API

### POST /api/generate-certificate

Request:

```json
{ "email": "you@example.com" }
```

Success:
- Status `200`
- Returns PDF (`application/pdf`)
- Headers: `X-Cert-Name`, `X-Cert-Team`, `X-Cert-Role`

Errors:
- `400`: Email missing
- `404`: Email not registered
- `403`: Role not eligible
- `500`: Server error

### GET /api/check-email?email=...

Checks registration and eligibility without generating a PDF.

## CSV Format

```csv
email,name,team_name,role,used
alice@example.com,Alice Doe,Team Alpha,Participant,
bob@example.com,Bob Smith,Team Beta,Participant,true
```

Eligible role: `Participant`.

