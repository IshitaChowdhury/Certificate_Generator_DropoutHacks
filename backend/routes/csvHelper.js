const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const CSV_PATH = path.join(__dirname, "../data/participants.csv");

/**
 * Read all participants from CSV file
 * Returns a Promise that resolves to an array of participant objects
 */
function readParticipants() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

/**
 * Find a single participant by email (case-insensitive)
 */
async function findParticipantByEmail(email) {
  const participants = await readParticipants();
  return (
    participants.find(
      (p) => p.email.trim().toLowerCase() === email.trim().toLowerCase()
    ) || null
  );
}

/**
 * Mark a participant's certificate as used by updating the CSV
 */
async function markCertificateUsed(email) {
  const participants = await readParticipants();

  // Update the matching participant
  const updated = participants.map((p) => {
    if (p.email.trim().toLowerCase() === email.trim().toLowerCase()) {
      return { ...p, used: "true" };
    }
    return p;
  });

  // Re-write CSV manually (csv-writer would work too, but this keeps it simple)
  const headers = "email,name,team_name,role,used\n";
  const rows = updated
    .map((p) => `${p.email},${p.name},${p.team_name},${p.role},${p.used}`)
    .join("\n");

  fs.writeFileSync(CSV_PATH, headers + rows + "\n", "utf8");
}

module.exports = { findParticipantByEmail, markCertificateUsed };
