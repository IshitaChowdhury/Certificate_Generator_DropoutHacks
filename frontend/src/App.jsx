import { useState, useEffect, useRef } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000";

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "rgba(255,255,255,",   // white
      "rgba(255,255,255,",   // white (more frequent)
      "rgba(168,85,247,",    // violet/purple
      "rgba(139,92,246,",    // purple
      "rgba(0,210,255,",     // cyan
      "rgba(100,160,255,",   // blue
      "rgba(220,180,255,",   // lavender
    ];

    const NUM = 90;
    const particles = Array.from({ length: NUM }, () => ({
      x:    Math.random() * window.innerWidth,
      y:    Math.random() * window.innerHeight,
      r:    Math.random() * 2.2 + 0.4,
      vx:   (Math.random() - 0.5) * 0.35,
      vy:   (Math.random() - 0.5) * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.6 + 0.25,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: 0.008 + Math.random() * 0.015,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.flicker += p.flickerSpeed;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.flicker));

        if (p.x < -5) p.x = canvas.width  + 5;
        if (p.x > canvas.width  + 5) p.x = -5;
        if (p.y < -5) p.y = canvas.height + 5;
        if (p.y > canvas.height + 5) p.y = -5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${a.toFixed(2)})`;
        ctx.fill();

        // soft glow on larger particles
        if (p.r > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${(a * 0.12).toFixed(3)})`;
          ctx.fill();
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

function App() {
  const [email, setEmail]       = useState("");
  const [status, setStatus]     = useState("idle"); // idle | loading | success | error
  const [message, setMessage]   = useState("");
  const [certData, setCertData] = useState(null);
  const [blobUrl, setBlobUrl]   = useState(null);

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
      const res = await fetch(`${API_BASE}/api/generate-certificate`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
        return;
      }

      // Read cert data from response headers
      const name      = decodeURIComponent(res.headers.get("X-Cert-Name") || "");
      const team_name = decodeURIComponent(res.headers.get("X-Cert-Team") || "");
      const role      = decodeURIComponent(res.headers.get("X-Cert-Role") || "");

      // Store blob in memory for manual download
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      setBlobUrl(url);

      setCertData({ name, team_name, role });
      setStatus("success");
      setMessage("");
    } catch {
      setStatus("error");
      setMessage("Cannot connect to server. Make sure the backend is running on port 5000.");
    }
  };

  const handleDownload = () => {
    if (!blobUrl || !certData) return;
    const link = document.createElement("a");
    link.href     = blobUrl;
    link.download = `DropOutHacks_Certificate_${certData.name.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleReset = () => {
    if (blobUrl) window.URL.revokeObjectURL(blobUrl);
    setEmail("");
    setStatus("idle");
    setMessage("");
    setCertData(null);
    setBlobUrl(null);
  };

  const statusLabel = {
    idle:    "AWAITING_INPUT",
    loading: "PROCESSING...",
    success: "ACCESS_GRANTED",
    error:   "ACCESS_DENIED",
  }[status] ?? "AWAITING_INPUT";

  const statusDot = {
    idle:    "dot-idle",
    loading: "dot-loading",
    success: "dot-success",
    error:   "dot-error",
  }[status] ?? "dot-idle";

  return (
    <div className="root">
      {/* Backgrounds */}
      <ParticleCanvas />
      <div className="glow glow-cyan" />
      <div className="glow glow-red" />

      {/* Logo */}
      <img src="/logo.png" alt="DropOutHacks" className="site-logo" />

      {/* Two-column layout */}
      <main className="main-layout">

        {/* ── Left ─────────────────────────────── */}
        <div className="left-col">
          <div className="event-badge">Kolkata's Mega Buildathon</div>

          <h1 className="hero-title">
            <span className="title-line1">CLAIM YOUR</span>
            <span className="title-line2">CERTIFICATE</span>
          </h1>

          <p className="hero-sub">
            You survived the chaos. You built across dimensions.<br />
            Enter your email to claim your <span className="text-red">official certificate.</span>
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">48</span>
              <span className="stat-label">Hours of Hacking</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">∞</span>
              <span className="stat-label">Dimensions Explored</span>
            </div>
          </div>
        </div>

        {/* ── Right card ───────────────────────── */}
        <div className="intel-card">

          {/* Cyan banner */}
          <div className="card-banner">HACKCERTIFY</div>

          <div className="card-body">
            <p className="card-label">CERTIFICATE GENERATOR</p>

            {status !== "success" ? (
              <div className="form-area">
                <h2 className="card-heading">
                  {status === "loading" ? "PROCESSING_" : "ENTER EMAIL ID"}
                </h2>

                <div className="input-group">
                  <label className="input-label" htmlFor="email-input">
                    Registered Email
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    className={`email-input${status === "error" ? " input-error" : ""}`}
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
                  <div className="error-msg">⚠ {message}</div>
                )}

                <button
                  className="btn-access"
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <><span className="spinner" /> GENERATING...</>
                  ) : (
                    "GENERATE CERTIFICATE →"
                  )}
                </button>
              </div>
            ) : (
              <div className="success-area">
                <h2 className="card-heading success-name">{certData.name}</h2>

                <div className="cert-details">
                  <div className="cert-row">
                    <span className="cert-key">TEAM</span>
                    <span className="cert-val">{certData.team_name}</span>
                  </div>
                  <div className="cert-row">
                    <span className="cert-key">ROLE</span>
                    <span className={`cert-role ${certData.role === "Finalist" ? "role-finalist" : "role-participant"}`}>
                      {certData.role}
                    </span>
                  </div>
                  <div className="cert-row">
                    <span className="cert-key">EVENT</span>
                    <span className="cert-val">DropOutHacks</span>
                  </div>
                </div>

                <button className="btn-download" onClick={handleDownload}>
                  ↓ DOWNLOAD CERTIFICATE
                </button>

                <button className="btn-back" onClick={handleReset}>
                  ← GENERATE ANOTHER
                </button>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="card-status">
            <span className={`status-dot ${statusDot}`} />
            <span className="status-text">{statusLabel}</span>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
