# 🎓 Certificate Generator — DropOutHacks

A full-stack web app that generates personalized PDF certificates for DropOutHacks hackathon participants, verified by email lookup in a CSV database.

PDFs are generated **in memory** on the server and sent directly to the browser — no files are saved to disk.

---

## 🛠 Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18 + Vite |
| Backend  | Node.js + Express |
| Database | CSV (csv-parser) |
| PDF      | PDFKit (in-memory) |

---

## 🚀 How to Run

### Prerequisites
- Node.js v16 or higher — https://nodejs.org

### Step 1 — Start the Backend

```bash
cd backend
npm install
node server.js
```

Server starts at **http://localhost:5000**

### Step 2 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at **http://localhost:3000**

---

## 👤 How It Works

1. User enters their registered email
2. Backend checks it against `backend/data/participants.csv`
3. If found and eligible (Participant or Finalist), a PDF certificate is generated in memory
4. User sees their name, team and role — then clicks **Download Certificate** to save the PDF

---

## 📋 CSV Format

File: `backend/data/participants.csv`

```csv
email,name,team_name,role,used
alice@example.com,Abc Name,Team Alpha,Participant,
bob@example.com,Bob Smith,Team Beta,Finalist,
```

Eligible roles: `Participant`, `Finalist`

---

## 🔌 API Endpoints

### `POST /api/generate-certificate`
Verifies email and streams a PDF certificate.

**Request body:**
```json
{ "email": "you@example.com" }
```

**Success:** Returns binary PDF (`application/pdf`) with headers:
- `X-Cert-Name` — participant name
- `X-Cert-Team` — team name
- `X-Cert-Role` — role

**Error responses:**

| Status | Reason |
|--------|--------|
| 400 | Email is required |
| 404 | Email not registered |
| 403 | Role not eligible |
| 500 | Server error |

---

### `GET /api/check-email?email=...`
Check registration status without generating a certificate.

**Response:**
```json
{ "found": true, "eligible": true, "name": "Your_name", "team_name": "Team Alpha", "role": "Participant" }
```

