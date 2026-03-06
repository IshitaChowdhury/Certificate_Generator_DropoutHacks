# 🎓 Email-Verified Certificate Generator — DropOutHacks

A full-stack web application that generates personalized PDF certificates for DROPoutHacks hackathon participants, verified by email lookup in a CSV database.

---

## 🚀 How to Run (Step-by-Step)

### Prerequisites
- Node.js v16 or higher — download from https://nodejs.org
- npm (comes with Node.js)
- Two terminal windows

---

### Step 1 — Start the Backend

```bash
# Terminal 1
cd certificate-generator/backend
npm install
node server.js
```

You should see:
```
🚀 Server running → http://localhost:5000
📁 Certificates   → /path/to/backend/certificates
```

---

### Step 2 — Start the Frontend

```bash
# Terminal 2
cd certificate-generator/frontend
npm install
npm start
```

The app opens automatically at: **http://localhost:3000**

---

### To add participants:
Just add rows to the CSV. 

---

## 🔌 API Endpoints

### POST `/api/generate-certificate`
Verifies email and generates a PDF certificate.

**Request body:**
```json
{ "email": "chowdhuryi061@gmail.com" }
```

**Success response (200):**
```json
{
  "success": true,
  "message": "Certificate generated successfully!",
  "downloadUrl": "/certificates/certificate_Alice_Johnson_123456.pdf",
  "participant": {
    "name": "Ishita Chowdhury",
    "team_name": "Neural Ninjas",
    "role": "Participant"
  }
}
```

**Error responses:**
| Status | Message |
|--------|---------|
| 400    | Email is required |
| 404    | Email not registered |
| 403    | Organizers are not eligible |
| 409    | Certificate already generated |
| 500    | Internal server error |

---

### GET `/api/check-email?email= chowdhuryi061@gmail.com`
Check registration status without generating a certificate.

**Response:**
```json
{ "found": true, "name": "Ishita Chowdhury", "role": "Participant", "used": false }
```

---

### GET `/api/health`
Server health check.

---

## 🛠 Tech Stack

| Layer    | Technology                |
|----------|---------------------------|
| Frontend | React 18                  |
| Backend  | Node.js + Express         |
| Database | CSV (csv-parser, csv-writer)|
| PDF      | pdfkit                    |
| Styling  | Inline CSS (no dependencies)|

