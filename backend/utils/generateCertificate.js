const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Make sure certificates folder exists
const CERT_DIR = path.join(__dirname, '../certificates');
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true });
}

/**
 * Generates a certificate PDF for a participant.
 * @param {Object} participant - { name, team_name, role }
 * @returns {Promise<string>} - Path to generated PDF
 */
function generateCertificate(participant) {
  return new Promise((resolve, reject) => {
    const { name, team_name, role } = participant;
    const EVENT_NAME = 'DropOutHacks Hackathon';

    // Sanitize filename
    const safeName = name.replace(/[^a-z0-9]/gi, '_');
    const fileName = `certificate_${safeName}_${Date.now()}.pdf`;
    const filePath = path.join(CERT_DIR, fileName);

    // A4 landscape
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 0,
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const W = 841.89; // A4 landscape width in pts
    const H = 595.28; // A4 landscape height in pts

    // ── BACKGROUND ──────────────────────────────────────────────
    // Deep navy base
    doc.rect(0, 0, W, H).fill('#0A0E2A');

    // Gold top border stripe
    doc.rect(0, 0, W, 12).fill('#C9A84C');
    // Gold bottom border stripe
    doc.rect(0, H - 12, W, 12).fill('#C9A84C');
    // Gold left border stripe
    doc.rect(0, 0, 12, H).fill('#C9A84C');
    // Gold right border stripe
    doc.rect(W - 12, 0, 12, H).fill('#C9A84C');

    // Inner border (thin gold line)
    doc
      .rect(28, 28, W - 56, H - 56)
      .lineWidth(1.5)
      .stroke('#C9A84C');

    // Decorative corner squares
    const corners = [
      [20, 20], [W - 40, 20], [20, H - 40], [W - 40, H - 40]
    ];
    corners.forEach(([x, y]) => {
      doc.rect(x, y, 20, 20).fill('#C9A84C');
    });

    // Subtle diagonal watermark-like background text
    doc.save();
    doc.rotate(-35, { origin: [W / 2, H / 2] });
    doc
      .fontSize(130)
      .fillColor('#C9A84C')
      .opacity(0.04)
      .font('Helvetica-Bold')
      .text('DROPOUTHACKS', W / 2 - 350, H / 2 - 70);
    doc.restore();
    doc.opacity(1);

    // ── HEADER ────────────────────────────────────────────────────
    // Event logo text
    doc
      .fontSize(13)
      .fillColor('#C9A84C')
      .font('Helvetica-Bold')
      .text('⬡  DROPOUTHACKS  ⬡', 0, 55, { align: 'center' });

    // "Certificate of" label
    doc
      .fontSize(16)
      .fillColor('#8A9BB8')
      .font('Helvetica')
      .text('C E R T I F I C A T E   O F', 0, 90, {
        align: 'center',
        characterSpacing: 4,
      });

    // Main title based on role
    const titleWord = role === 'Finalist' ? 'ACHIEVEMENT' : 'PARTICIPATION';
    doc
      .fontSize(52)
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .text(titleWord, 0, 115, { align: 'center' });

    // Gold divider line
    const lineY = 182;
    doc
      .moveTo(W / 2 - 160, lineY)
      .lineTo(W / 2 + 160, lineY)
      .lineWidth(1)
      .stroke('#C9A84C');

    // ── BODY ──────────────────────────────────────────────────────
    // "This is to certify that"
    doc
      .fontSize(14)
      .fillColor('#8A9BB8')
      .font('Helvetica')
      .text('This is to certify that', 0, 200, { align: 'center' });

    // Recipient Name
    doc
      .fontSize(38)
      .fillColor('#F5D78E')
      .font('Helvetica-Bold')
      .text(name, 0, 224, { align: 'center' });

    // Underline for name
    const nameWidth = doc.widthOfString(name, { fontSize: 38 });
    const nameX = (W - Math.min(nameWidth, 500)) / 2;
    doc
      .moveTo(nameX, 270)
      .lineTo(W - nameX, 270)
      .lineWidth(0.8)
      .stroke('#C9A84C');

    // Body text line 1
    doc
      .fontSize(14)
      .fillColor('#B0BFCF')
      .font('Helvetica')
      .text(
        `has successfully ${role === 'Finalist' ? 'reached the Finals at' : 'participated in'}`,
        0,
        285,
        { align: 'center' }
      );

    // Event name highlight
    doc
      .fontSize(22)
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .text(EVENT_NAME, 0, 308, { align: 'center' });

    // Team info
    doc
      .fontSize(13)
      .fillColor('#8A9BB8')
      .font('Helvetica')
      .text(`representing team  `, 0, 348, { align: 'center', continued: false });

    // Team name inline highlight
    const teamLabelWidth = doc.widthOfString('representing team  ', { fontSize: 13 });
    const teamNameWidth = doc.widthOfString(team_name, { fontSize: 13, font: 'Helvetica-Bold' });
    const teamLineTotal = teamLabelWidth + teamNameWidth + doc.widthOfString('  as  ') + doc.widthOfString(role);
    const teamStartX = (W - teamLineTotal) / 2;

    doc.fontSize(13).fillColor('#8A9BB8').font('Helvetica').text('representing team ', teamStartX, 348);
    doc
      .fontSize(13)
      .fillColor('#F5D78E')
      .font('Helvetica-Bold')
      .text(team_name, teamStartX + doc.widthOfString('representing team '), 348, { continued: false });

    // Role badge
    const badgeLabel = `Role: ${role}`;
    const badgeW = doc.widthOfString(badgeLabel, { fontSize: 12 }) + 24;
    const badgeX = (W - badgeW) / 2;
    const badgeY = 375;

    // Draw badge background
    doc.roundedRect(badgeX, badgeY, badgeW, 24, 4).fill(role === 'Finalist' ? '#7B3F00' : '#0D2B4E');
    doc
      .fontSize(12)
      .fillColor(role === 'Finalist' ? '#F5D78E' : '#7EC8E3')
      .font('Helvetica-Bold')
      .text(badgeLabel, badgeX + 12, badgeY + 6);

    // ── FOOTER ────────────────────────────────────────────────────
    // Two signature lines
    const sigY = 455;
    const sig1X = 180;
    const sig2X = W - 280;

    // Sig line 1
    doc.moveTo(sig1X, sigY).lineTo(sig1X + 160, sigY).lineWidth(0.8).stroke('#C9A84C');
    doc
      .fontSize(10)
      .fillColor('#8A9BB8')
      .font('Helvetica')
      .text('Event Director', sig1X, sigY + 6, { width: 160, align: 'center' });

    // Sig line 2
    doc.moveTo(sig2X, sigY).lineTo(sig2X + 160, sigY).lineWidth(0.8).stroke('#C9A84C');
    doc
      .fontSize(10)
      .fillColor('#8A9BB8')
      .font('Helvetica')
      .text('Lead Organizer', sig2X, sigY + 6, { width: 160, align: 'center' });

    // Bottom tagline
    doc
      .fontSize(10)
      .fillColor('#3A4A6B')
      .font('Helvetica')
      .text('DropOutHacks — Building the Future, One Hack at a Time', 0, H - 50, {
        align: 'center',
      });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = { generateCertificate };
