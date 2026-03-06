const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const PDFDocument = require('pdfkit');

const CSV_PATH = path.join(__dirname, '../data/participants.csv');
const CERT_DIR = path.join(__dirname, '../certificates');

// Ensure certificates directory exists
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true });
}

// ─── Helper: Read all CSV rows ────────────────────────────────────────────────
function readCSV() {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

// ─── Helper: Write all rows back to CSV ──────────────────────────────────────
function writeCSV(rows) {
  return new Promise((resolve, reject) => {
    const writer = createObjectCsvWriter({
      path: CSV_PATH,
      header: [
        { id: 'email', title: 'email' },
        { id: 'name', title: 'name' },
        { id: 'team_name', title: 'team_name' },
        { id: 'role', title: 'role' },
        { id: 'used', title: 'used' },
      ],
    });
    writer.writeRecords(rows).then(resolve).catch(reject);
  });
}

// ─── Helper: Generate PDF Certificate ────────────────────────────────────────
function generateCertificate(participant) {
  return new Promise((resolve, reject) => {
    const safeEmail = participant.email.replace(/[@.]/g, '_');
    const filename = `certificate_${safeEmail}.pdf`;
    const filepath = path.join(CERT_DIR, filename);

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    const W = doc.page.width;   // 841.89
    const H = doc.page.height;  // 595.28

    // ── Background ────────────────────────────────────────────────────────────
    // Deep navy base
    doc.rect(0, 0, W, H).fill('#0A0E1A');

    // Subtle grid lines
    doc.strokeColor('#1A2040').lineWidth(0.5);
    for (let x = 0; x <= W; x += 40) {
      doc.moveTo(x, 0).lineTo(x, H).stroke();
    }
    for (let y = 0; y <= H; y += 40) {
      doc.moveTo(0, y).lineTo(W, y).stroke();
    }

    // Glowing corner accent — top-left
    const grad1 = doc.linearGradient(0, 0, 200, 200);
    grad1.stop(0, '#6C63FF', 0.6).stop(1, '#0A0E1A', 0);
    doc.rect(0, 0, 200, 200).fill(grad1);

    // Glowing corner accent — bottom-right
    const grad2 = doc.linearGradient(W, H, W - 200, H - 200);
    grad2.stop(0, '#00D4FF', 0.5).stop(1, '#0A0E1A', 0);
    doc.rect(W - 200, H - 200, 200, 200).fill(grad2);

    // Outer border frame
    doc.rect(20, 20, W - 40, H - 40)
      .lineWidth(2)
      .strokeColor('#6C63FF')
      .stroke();

    // Inner border frame
    doc.rect(28, 28, W - 56, H - 56)
      .lineWidth(0.5)
      .strokeColor('#00D4FF')
      .stroke();

    // ── Header: Event Logo / Title ────────────────────────────────────────────
    doc.fontSize(11)
      .fillColor('#00D4FF')
      .font('Helvetica')
      .text('✦  D R O P O U T H A C K S  ✦', 0, 50, { align: 'center' });

    // Divider line under event name
    doc.moveTo(W / 2 - 160, 72).lineTo(W / 2 + 160, 72)
      .lineWidth(1)
      .strokeColor('#6C63FF')
      .stroke();

    // ── "Certificate of" ──────────────────────────────────────────────────────
    doc.fontSize(14)
      .fillColor('#8892B0')
      .font('Helvetica')
      .text('C E R T I F I C A T E   O F', 0, 88, { align: 'center' });

    // ── Role as big headline ──────────────────────────────────────────────────
    const roleColor = participant.role === 'Finalist' ? '#FFD700' : '#00D4FF';
    doc.fontSize(52)
      .fillColor(roleColor)
      .font('Helvetica-Bold')
      .text(participant.role.toUpperCase(), 0, 108, { align: 'center' });

    // ── Divider ───────────────────────────────────────────────────────────────
    doc.moveTo(W / 2 - 200, 178).lineTo(W / 2 + 200, 178)
      .lineWidth(1)
      .strokeColor(roleColor)
      .stroke();

    // ── "This is to certify that" ─────────────────────────────────────────────
    doc.fontSize(12)
      .fillColor('#8892B0')
      .font('Helvetica')
      .text('This is to proudly certify that', 0, 194, { align: 'center' });

    // ── Participant Name ──────────────────────────────────────────────────────
    doc.fontSize(40)
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .text(participant.name, 0, 216, { align: 'center' });

    // Name underline flourish
    const nameWidth = Math.min(participant.name.length * 20, 400);
    doc.moveTo(W / 2 - nameWidth / 2, 265)
      .lineTo(W / 2 + nameWidth / 2, 265)
      .lineWidth(1.5)
      .strokeColor('#6C63FF')
      .stroke();

    // ── "participated as ... in team ..." ─────────────────────────────────────
    doc.fontSize(13)
      .fillColor('#8892B0')
      .font('Helvetica')
      .text('has successfully participated as a', 0, 276, { align: 'center' });

    doc.fontSize(16)
      .fillColor(roleColor)
      .font('Helvetica-Bold')
      .text(participant.role, 0, 296, { align: 'center' });

    doc.fontSize(13)
      .fillColor('#8892B0')
      .font('Helvetica')
      .text('representing the team', 0, 320, { align: 'center' });

    doc.fontSize(22)
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .text(participant.team_name, 0, 340, { align: 'center' });

    doc.fontSize(13)
      .fillColor('#8892B0')
      .font('Helvetica')
      .text('at the DropOutHacks Hackathon', 0, 372, { align: 'center' });

    // ── Bottom section ────────────────────────────────────────────────────────
    // Divider
    doc.moveTo(60, H - 100).lineTo(W - 60, H - 100)
      .lineWidth(0.5)
      .strokeColor('#1A2040')
      .stroke();

    // Date (left)
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    doc.fontSize(10).fillColor('#8892B0').font('Helvetica')
      .text('Date of Issue', 80, H - 88)
      .fontSize(11).fillColor('#FFFFFF')
      .text(today, 80, H - 74);

    // Signature line (center)
    doc.moveTo(W / 2 - 70, H - 68).lineTo(W / 2 + 70, H - 68)
      .lineWidth(1).strokeColor('#6C63FF').stroke();
    doc.fontSize(10).fillColor('#8892B0').font('Helvetica')
      .text('Authorized Signature', 0, H - 60, { align: 'center' });

    // Certificate ID (right)
    const certId = `DOH-${Date.now().toString(36).toUpperCase()}`;
    doc.fontSize(10).fillColor('#8892B0').font('Helvetica')
      .text('Certificate ID', W - 180, H - 88)
      .fontSize(11).fillColor('#FFFFFF')
      .text(certId, W - 180, H - 74);

    // ── Finalize ──────────────────────────────────────────────────────────────
    doc.end();
    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/generate-certificate
// Body: { email: "user@example.com" }
// ─────────────────────────────────────────────────────────────────────────────
router.post('/generate-certificate', async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Validate input
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Read database
    const rows = await readCSV();

    // 3. Find participant
    const participant = rows.find(
      (r) => r.email.trim().toLowerCase() === normalizedEmail
    );

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Email not registered.' });
    }

    // 4. Block organizers (and any non-allowed roles)
    const allowedRoles = ['Participant', 'Finalist'];
    if (!allowedRoles.includes(participant.role)) {
      return res.status(403).json({
        success: false,
        message: `Role "${participant.role}" is not eligible to receive a certificate.`,
      });
    }


    // 6. Generate PDF certificate
    const filename = await generateCertificate(participant);

    // 7. Mark as used in CSV
    const updatedRows = rows.map((r) => {
      if (r.email.trim().toLowerCase() === normalizedEmail) {
        return { ...r, used: 'true' };
      }
      return r;
    });
    await writeCSV(updatedRows);

    // 8. Return download URL
    res.json({
      success: true,
      message: 'Certificate generated successfully!',
      name: participant.name,
      team_name: participant.team_name,
      role: participant.role,
      downloadUrl: `/certificates/${filename}`,
    });
  } catch (err) {
    console.error('Error generating certificate:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/check-email?email=...
// Quick check without generating (for UX preview)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email required.' });

    const rows = await readCSV();
    const participant = rows.find(
      (r) => r.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!participant) {
      return res.json({ found: false, message: 'Email not registered.' });
    }

    const allowedRoles = ['Participant', 'Finalist'];
    if (!allowedRoles.includes(participant.role)) {
      return res.json({ found: true, eligible: false, message: `Role "${participant.role}" is not eligible.` });
    }

    res.json({
      found: true,
      eligible: true,
      used: participant.used === 'true',
      name: participant.name,
      role: participant.role,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
