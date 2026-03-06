import React, { useState } from "react";

const API_BASE = "http://localhost:5000";

const styles = {
  // Page
  page: {
    minHeight: "100vh",
    background: "#070b14",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  // Glowing orbs
  orbBlue: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
    top: "-100px",
    left: "-100px",
    pointerEvents: "none",
  },
  orbGold: {
    position: "fixed",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)",
    bottom: "-50px",
    right: "-50px",
    pointerEvents: "none",
  },
  // Card
  card: {
    background: "rgba(15,21,38,0.95)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "20px",
    padding: "52px 48px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 120px rgba(201,168,76,0.05)",
    position: "relative",
  },
  cardCornerTL: {
    position: "absolute", top: "12px", left: "12px",
    width: "20px", height: "20px",
    borderTop: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c",
    borderRadius: "2px 0 0 0",
  },
  cardCornerTR: {
    position: "absolute", top: "12px", right: "12px",
    width: "20px", height: "20px",
    borderTop: "2px solid #c9a84c", borderRight: "2px solid #c9a84c",
    borderRadius: "0 2px 0 0",
  },
  cardCornerBL: {
    position: "absolute", bottom: "12px", left: "12px",
    width: "20px", height: "20px",
    borderBottom: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c",
    borderRadius: "0 0 0 2px",
  },
  cardCornerBR: {
    position: "absolute", bottom: "12px", right: "12px",
    width: "20px", height: "20px",
    borderBottom: "2px solid #c9a84c", borderRight: "2px solid #c9a84c",
    borderRadius: "0 0 2px 0",
  },
  // Badge
  badge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "rgba(201,168,76,0.1)",
    border: "1px solid rgba(201,168,76,0.3)",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "11px",
    letterSpacing: "2px",
    color: "#c9a84c",
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: "20px",
  },
  // Headings
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "32px",
    fontWeight: 800,
    color: "#ffffff",
    margin: "0 0 8px 0",
    lineHeight: 1.15,
  },
  titleAccent: { color: "#c9a84c" },
  subtitle: {
    fontSize: "14px",
    color: "#5a6a80",
    margin: "0 0 36px 0",
    lineHeight: 1.6,
  },
  // Form
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    color: "#8892a4",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  inputWrap: { position: "relative", marginBottom: "24px" },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "14px 18px 14px 46px",
    fontSize: "15px",
    color: "#e0e8f0",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },
  inputIcon: {
    position: "absolute", left: "15px", top: "50%",
    transform: "translateY(-50%)", pointerEvents: "none",
    fontSize: "17px",
  },
  // Button
  button: {
    width: "100%",
    background: "linear-gradient(135deg, #c9a84c 0%, #e8c96a 50%, #c9a84c 100%)",
    backgroundSize: "200% 200%",
    border: "none",
    borderRadius: "10px",
    padding: "16px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    color: "#0a0e1a",
    cursor: "pointer",
    textTransform: "uppercase",
    fontFamily: "'Syne', sans-serif",
    transition: "opacity 0.2s, transform 0.1s",
  },
  buttonDisabled: {
    opacity: 0.5, cursor: "not-allowed",
  },
  // Messages
  msgError: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "10px",
    padding: "14px 18px",
    color: "#f87171",
    fontSize: "14px",
    marginTop: "20px",
    display: "flex", alignItems: "center", gap: "10px",
  },
  msgWarn: {
    background: "rgba(234,179,8,0.08)",
    border: "1px solid rgba(234,179,8,0.25)",
    borderRadius: "10px",
    padding: "14px 18px",
    color: "#fbbf24",
    fontSize: "14px",
    marginTop: "20px",
    display: "flex", alignItems: "center", gap: "10px",
  },
  // Success card
  successCard: {
    background: "rgba(6,78,59,0.15)",
    border: "1px solid rgba(16,185,129,0.25)",
    borderRadius: "14px",
    padding: "28px",
    marginTop: "24px",
    textAlign: "center",
  },
  successIcon: { fontSize: "42px", marginBottom: "12px" },
  successTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "20px",
    fontWeight: 700,
    color: "#6ee7b7",
    marginBottom: "6px",
  },
  successName: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: "4px",
  },
  successTeam: { fontSize: "14px", color: "#8892a4", marginBottom: "16px" },
  roleBadge: (role) => ({
    display: "inline-block",
    padding: "4px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "20px",
    background: role === "Finalist" ? "rgba(255,215,0,0.1)" : "rgba(126,184,247,0.1)",
    border: `1px solid ${role === "Finalist" ? "rgba(255,215,0,0.3)" : "rgba(126,184,247,0.3)"}`,
    color: role === "Finalist" ? "#ffd700" : "#7eb8f7",
  }),
  downloadBtn: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "none",
    borderRadius: "8px",
    padding: "12px 28px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "0.5px",
    transition: "opacity 0.2s",
  },
  resetBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "13px",
    color: "#5a6a80",
    cursor: "pointer",
    marginTop: "12px",
    fontFamily: "'Inter', sans-serif",
    transition: "color 0.2s",
  },
  // Spinner
  spinner: {
    width: "18px", height: "18px",
    border: "2px solid rgba(10,14,26,0.3)",
    borderTop: "2px solid #0a0e1a",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
    marginRight: "8px",
    verticalAlign: "middle",
  },
  // Footer
  footer: {
    marginTop: "32px",
    fontSize: "12px",
    color: "#2a3a50",
    letterSpacing: "1px",
    textAlign: "center",
  },
};

export default function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/generate-certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        setResult({
          ...data.participant,
          downloadUrl: `${API_BASE}${data.downloadUrl}`,
        });
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setEmail("");
    setError("");
  };

  const isOrganiserError =
    error.toLowerCase().includes("organizer") ||
    error.toLowerCase().includes("organiser");

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: rgba(201,168,76,0.5) !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.08); }
        button:active { transform: scale(0.98); }
        a:hover { opacity: 0.85; }
      `}</style>

      <div style={styles.orbBlue} />
      <div style={styles.orbGold} />

      <div style={styles.card}>
        <div style={styles.cardCornerTL} />
        <div style={styles.cardCornerTR} />
        <div style={styles.cardCornerBL} />
        <div style={styles.cardCornerBR} />

        {!result ? (
          <>
            <div style={styles.badge}>✦ Certificate Portal</div>
            <h1 style={styles.title}>
              Generate Your<br />
              <span style={styles.titleAccent}>Certificate</span>
            </h1>
            <p style={styles.subtitle}>
              Enter your registered email to instantly generate and download your
              personalized DropOutHacks achievement certificate.
            </p>

            <label style={styles.label} htmlFor="email-input">
              Registered Email Address
            </label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>✉</span>
              <input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                style={{
                  ...styles.input,
                  borderColor: inputFocused ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)",
                }}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Generating...
                </>
              ) : (
                "Generate Certificate"
              )}
            </button>

            {error && (
              <div style={isOrganiserError ? styles.msgWarn : styles.msgError}>
                <span style={{ fontSize: "20px" }}>{isOrganiserError ? "🚫" : "⚠"}</span>
                <span>{error}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={styles.successCard}>
              <div style={styles.successIcon}>🎓</div>
              <div style={styles.successTitle}>Certificate Ready!</div>
              <div style={styles.successName}>{result.name}</div>
              <div style={styles.successTeam}>🏷 {result.team_name}</div>
              <div style={styles.roleBadge(result.role)}>{result.role}</div>
              <br />
              <a
                href={result.downloadUrl}
                download
                target="_blank"
                rel="noreferrer"
                style={styles.downloadBtn}
              >
                ⬇ Download Certificate
              </a>
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={handleReset} style={styles.resetBtn}>
                ← Generate another
              </button>
            </div>
          </>
        )}
      </div>

      <div style={styles.footer}>DROPOUTHACKS · HACKATHON · CERTIFICATE PORTAL</div>
    </div>
  );
}
