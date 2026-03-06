const { createCanvas, registerFont } = require("canvas");
const path = require("path");
const fs = require("fs");

// Ensure certificates directory exists
const CERT_DIR = path.join(__dirname, "../certificates");
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true });
}

/**
 * Draw a beautiful certificate using HTML5 Canvas
 * Returns the file path of the generated certificate PNG
 */
async function generateCertificate({ name, team_name, role }) {
  const WIDTH = 1100;
  const HEIGHT = 780;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // ─── BACKGROUND ───────────────────────────────────────────────
  // Deep navy gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGrad.addColorStop(0, "#0a0e27");
  bgGrad.addColorStop(0.5, "#0d1b3e");
  bgGrad.addColorStop(1, "#0a0e27");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ─── DECORATIVE CORNER ACCENTS ────────────────────────────────
  drawCornerAccents(ctx, WIDTH, HEIGHT);

  // ─── OUTER BORDER ─────────────────────────────────────────────
  ctx.strokeStyle = "#c9a84c";
  ctx.lineWidth = 3;
  roundRect(ctx, 20, 20, WIDTH - 40, HEIGHT - 40, 12);
  ctx.stroke();

  // ─── INNER BORDER ─────────────────────────────────────────────
  ctx.strokeStyle = "rgba(201, 168, 76, 0.4)";
  ctx.lineWidth = 1;
  roundRect(ctx, 32, 32, WIDTH - 64, HEIGHT - 64, 8);
  ctx.stroke();

  // ─── TOP DECORATIVE BAR ───────────────────────────────────────
  const barGrad = ctx.createLinearGradient(40, 0, WIDTH - 40, 0);
  barGrad.addColorStop(0, "transparent");
  barGrad.addColorStop(0.2, "#c9a84c");
  barGrad.addColorStop(0.5, "#f0d080");
  barGrad.addColorStop(0.8, "#c9a84c");
  barGrad.addColorStop(1, "transparent");
  ctx.fillStyle = barGrad;
  ctx.fillRect(40, 55, WIDTH - 80, 2);

  // ─── STARS / SPARKLE DECORATION ───────────────────────────────
  drawStars(ctx, WIDTH, HEIGHT);

  // ─── EVENT LOGO / TITLE BADGE ─────────────────────────────────
  ctx.save();
  ctx.shadowColor = "rgba(201, 168, 76, 0.6)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "rgba(201, 168, 76, 0.12)";
  roundRect(ctx, WIDTH / 2 - 180, 65, 360, 50, 25);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "#c9a84c";
  ctx.lineWidth = 1.5;
  roundRect(ctx, WIDTH / 2 - 180, 65, 360, 50, 25);
  ctx.stroke();

  ctx.font = "bold 15px Georgia, serif";
  ctx.fillStyle = "#f0d080";
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("✦  D R O P O U T H A C K S  ✦", WIDTH / 2, 97);

  // ─── CERTIFICATE OF PARTICIPATION TITLE ───────────────────────
  ctx.font = "italic 18px Georgia, serif";
  ctx.fillStyle = "rgba(201, 168, 76, 0.8)";
  ctx.fillText("Certificate of", WIDTH / 2, 160);

  // Big title
  ctx.save();
  ctx.shadowColor = "rgba(201, 168, 76, 0.5)";
  ctx.shadowBlur = 15;
  ctx.font = "bold 58px Georgia, serif";
  const titleGrad = ctx.createLinearGradient(
    WIDTH / 2 - 250,
    0,
    WIDTH / 2 + 250,
    0
  );
  titleGrad.addColorStop(0, "#c9a84c");
  titleGrad.addColorStop(0.5, "#f5e6a3");
  titleGrad.addColorStop(1, "#c9a84c");
  ctx.fillStyle = titleGrad;
  ctx.fillText(
    role === "Finalist" ? "Achievement" : "Participation",
    WIDTH / 2,
    230
  );
  ctx.restore();

  // ─── DIVIDER LINE ─────────────────────────────────────────────
  const divGrad = ctx.createLinearGradient(150, 0, WIDTH - 150, 0);
  divGrad.addColorStop(0, "transparent");
  divGrad.addColorStop(0.3, "#c9a84c");
  divGrad.addColorStop(0.7, "#c9a84c");
  divGrad.addColorStop(1, "transparent");
  ctx.fillStyle = divGrad;
  ctx.fillRect(150, 252, WIDTH - 300, 1);

  // ─── "THIS CERTIFIES THAT" ────────────────────────────────────
  ctx.font = "16px Georgia, serif";
  ctx.fillStyle = "rgba(200, 200, 220, 0.75)";
  ctx.fillText("This is to certify that", WIDTH / 2, 300);

  // ─── PARTICIPANT NAME ─────────────────────────────────────────
  ctx.save();
  ctx.shadowColor = "rgba(201, 168, 76, 0.7)";
  ctx.shadowBlur = 25;
  ctx.font = "bold 52px 'Palatino Linotype', Palatino, serif";
  const nameGrad = ctx.createLinearGradient(
    WIDTH / 2 - 300,
    0,
    WIDTH / 2 + 300,
    0
  );
  nameGrad.addColorStop(0, "#e8d5a0");
  nameGrad.addColorStop(0.5, "#ffffff");
  nameGrad.addColorStop(1, "#e8d5a0");
  ctx.fillStyle = nameGrad;
  ctx.fillText(name, WIDTH / 2, 375);
  ctx.restore();

  // Name underline flourish
  const nameWidth = ctx.measureText(name).width * 0.55;
  const nlGrad = ctx.createLinearGradient(
    WIDTH / 2 - nameWidth,
    0,
    WIDTH / 2 + nameWidth,
    0
  );
  nlGrad.addColorStop(0, "transparent");
  nlGrad.addColorStop(0.5, "#c9a84c");
  nlGrad.addColorStop(1, "transparent");
  ctx.fillStyle = nlGrad;
  ctx.fillRect(WIDTH / 2 - nameWidth, 385, nameWidth * 2, 1.5);

  // ─── BODY TEXT ────────────────────────────────────────────────
  ctx.font = "17px Georgia, serif";
  ctx.fillStyle = "rgba(200, 200, 220, 0.85)";
  ctx.fillText(
    "has successfully participated as a",
    WIDTH / 2,
    425
  );

  // ─── ROLE BADGE ───────────────────────────────────────────────
  const roleColor = role === "Finalist" ? "#ff9f43" : "#54a0ff";
  const roleBg =
    role === "Finalist"
      ? "rgba(255, 159, 67, 0.15)"
      : "rgba(84, 160, 255, 0.15)";

  ctx.save();
  ctx.shadowColor = roleColor;
  ctx.shadowBlur = 15;
  ctx.fillStyle = roleBg;
  roundRect(ctx, WIDTH / 2 - 90, 440, 180, 44, 22);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = roleColor;
  ctx.lineWidth = 1.5;
  roundRect(ctx, WIDTH / 2 - 90, 440, 180, 44, 22);
  ctx.stroke();

  ctx.font = "bold 20px Georgia, serif";
  ctx.fillStyle = roleColor;
  ctx.fillText(role.toUpperCase(), WIDTH / 2, 468);

  // ─── TEAM / EVENT INFO ────────────────────────────────────────
  ctx.font = "16px Georgia, serif";
  ctx.fillStyle = "rgba(200, 200, 220, 0.75)";
  ctx.fillText("representing team", WIDTH / 2, 515);

  ctx.font = "bold 26px Georgia, serif";
  ctx.fillStyle = "#c9a84c";
  ctx.fillText(team_name, WIDTH / 2, 548);

  ctx.font = "16px Georgia, serif";
  ctx.fillStyle = "rgba(200, 200, 220, 0.65)";
  ctx.fillText("at the  DropOutHacks Hackathon", WIDTH / 2, 580);

  // ─── BOTTOM DECORATIVE BAR ────────────────────────────────────
  ctx.fillStyle = barGrad;
  ctx.fillRect(40, HEIGHT - 57, WIDTH - 80, 2);

  // ─── DATE & SIGNATURE AREA ────────────────────────────────────
  ctx.font = "13px Georgia, serif";
  ctx.fillStyle = "rgba(160, 160, 180, 0.7)";
  ctx.textAlign = "left";
  ctx.fillText(
    `Issued: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    70,
    HEIGHT - 30
  );

  ctx.textAlign = "right";
  ctx.fillText("DropOutHacks Organizing Committee", WIDTH - 70, HEIGHT - 30);

  ctx.textAlign = "center";

  // ─── BOTTOM WATERMARK ─────────────────────────────────────────
  ctx.font = "italic 12px Georgia, serif";
  ctx.fillStyle = "rgba(201, 168, 76, 0.35)";
  ctx.fillText("dropouthacks.com  •  Verified Certificate", WIDTH / 2, HEIGHT - 30);

  // ─── SAVE FILE ────────────────────────────────────────────────
  const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const fileName = `certificate_${safeName}_${Date.now()}.png`;
  const filePath = path.join(CERT_DIR, fileName);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);

  return fileName;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCornerAccents(ctx, W, H) {
  const size = 40;
  const offset = 22;
  ctx.strokeStyle = "#c9a84c";
  ctx.lineWidth = 2;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(offset, offset + size);
  ctx.lineTo(offset, offset);
  ctx.lineTo(offset + size, offset);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(W - offset - size, offset);
  ctx.lineTo(W - offset, offset);
  ctx.lineTo(W - offset, offset + size);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(offset, H - offset - size);
  ctx.lineTo(offset, H - offset);
  ctx.lineTo(offset + size, H - offset);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(W - offset - size, H - offset);
  ctx.lineTo(W - offset, H - offset);
  ctx.lineTo(W - offset, H - offset - size);
  ctx.stroke();
}

function drawStars(ctx, W, H) {
  const positions = [
    [80, 140],
    [W - 80, 140],
    [80, H - 140],
    [W - 80, H - 140],
    [W / 2 - 250, 250],
    [W / 2 + 250, 250],
  ];
  ctx.fillStyle = "rgba(201, 168, 76, 0.5)";
  for (const [x, y] of positions) {
    drawStar(ctx, x, y, 6, 3);
  }
}

function drawStar(ctx, cx, cy, outerR, innerR) {
  const spikes = 5;
  const step = Math.PI / spikes;
  ctx.beginPath();
  for (let i = 0; i < 2 * spikes; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

module.exports = { generateCertificate };
