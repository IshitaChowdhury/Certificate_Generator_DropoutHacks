import { useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [email, setEmail]         = useState("");
  const [status, setStatus]       = useState("idle"); // idle | loading | success | error
  const [message, setMessage]     = useState("");
  const [certData, setCertData]   = useState(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");
    setCertData(null);

    try {
      const res  = await fetch(`${API_BASE}/api/generate-certificate`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setCertData(data);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Cannot connect to server. Make sure the backend is running on port 5000.");
    }
  };

  const handleDownload = () => {
    window.open(`${API_BASE}${certData.downloadUrl}`, "_blank");
  };

  const handleReset = () => {
    setEmail("");
    setStatus("idle");
    setMessage("");
    setCertData(null);
  };

  return (
    <div className="root">
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="card">
        {/* Header */}
        <div className="card-header">
          <div className="badge">DropOutHacks Hackathon</div>
          <h1 className="title">
            Certificate<br />
            <span className="title-accent">Generator</span>
          </h1>
          <p className="subtitle">
            Enter your registered email to generate and download<br />
            your personalized participation certificate.
          </p>
        </div>

        {/* Form / Result */}
        {status !== "success" ? (
          <div className="form-section">
            <div className="input-group">
              <label className="label" htmlFor="email-input">
                Registered Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="email-input"
                  type="email"
                  className={`input ${status === "error" ? "input-error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") { setStatus("idle"); setMessage(""); }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <div className="error-msg">
                  <span className="error-icon">⚠</span>
                  {message}
                </div>
              )}
            </div>

            <button
              className={`btn-generate ${status === "loading" ? "btn-loading" : ""}`}
              onClick={handleSubmit}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <span className="spinner" />
                  Generating Certificate…
                </>
              ) : (
                <>
                  <span className="btn-icon">⬡</span>
                  Generate Certificate
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="success-section">
            <div className="success-icon-wrap">
              <div className="success-ring" />
              <span className="success-icon">✓</span>
            </div>

            <h2 className="success-title">Certificate Ready!</h2>
            <p className="success-sub">Your certificate has been generated successfully.</p>

            <div className="cert-info">
              <div className="cert-field">
                <span className="cert-label">Name</span>
                <span className="cert-value">{certData.name}</span>
              </div>
              <div className="cert-divider" />
              <div className="cert-field">
                <span className="cert-label">Team</span>
                <span className="cert-value">{certData.team_name}</span>
              </div>
              <div className="cert-divider" />
              <div className="cert-field">
                <span className="cert-label">Role</span>
                <span className={`cert-value cert-role ${certData.role === "Finalist" ? "role-finalist" : "role-participant"}`}>
                  {certData.role}
                </span>
              </div>
            </div>

            <button className="btn-download" onClick={handleDownload}>
              <span>↓</span>
              Download Certificate (PDF)
            </button>

            <button className="btn-back" onClick={handleReset}>
              ← Generate Another
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <span>Powered by DropOutHacks ·</span>
          <span> Certificates are issued once per email</span>
        </div>
      </div>
    </div>
  );
}

export default App;
