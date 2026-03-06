import React, { useState } from 'react';
import './CertificateForm.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

function CertificateForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | checking | preview | downloading | success | error
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null); // { name, team_name, role }

  // Step 1: Verify email and show preview
  const handleCheck = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setMessage('Please enter your email address.');
      setStatus('error');
      return;
    }

    setStatus('checking');
    setMessage('');
    setPreview(null);

    try {
      const res = await fetch(`${API_BASE}/api/check-email?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (data.success) {
        setPreview(data.data);
        setStatus('preview');
      } else {
        setMessage(data.message);
        setStatus('error');
      }
    } catch (err) {
      setMessage('Cannot connect to server. Make sure the backend is running.');
      setStatus('error');
    }
  };

  // Step 2: Confirm and download certificate
  const handleDownload = async () => {
    setStatus('downloading');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/generate-certificate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || 'Something went wrong.');
        setStatus('error');
        return;
      }

      // Trigger file download in browser
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DropOutHacks_Certificate_${preview.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setStatus('success');
      setMessage(`🎉 Your certificate has been downloaded! Congratulations, ${preview.name}!`);
    } catch (err) {
      setMessage('Download failed. Please try again.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setEmail('');
    setStatus('idle');
    setMessage('');
    setPreview(null);
  };

  const roleBadgeClass = preview?.role === 'Finalist' ? 'badge-finalist' : 'badge-participant';

  return (
    <div className="page-wrapper">
      {/* Background decoration */}
      <div className="bg-hex bg-hex-1">⬡</div>
      <div className="bg-hex bg-hex-2">⬡</div>
      <div className="bg-hex bg-hex-3">⬡</div>

      <div className="card">
        {/* Header */}
        <div className="card-header">
          <div className="logo-badge">⬡ DOH ⬡</div>
          <h1 className="card-title">Certificate Generator</h1>
          <p className="card-subtitle">DropOutHacks Hackathon 2024</p>
        </div>

        {/* Body */}
        <div className="card-body">
          {status === 'success' ? (
            // Success state
            <div className="success-state">
              <div className="success-icon">🏆</div>
              <p className="success-message">{message}</p>
              <div className="cert-preview-box">
                <div className="preview-field"><span className="preview-label">Name</span><span className="preview-value">{preview.name}</span></div>
                <div className="preview-field"><span className="preview-label">Team</span><span className="preview-value">{preview.team_name}</span></div>
                <div className="preview-field"><span className="preview-label">Role</span><span className={`role-badge ${roleBadgeClass}`}>{preview.role}</span></div>
              </div>
              <button className="btn btn-secondary" onClick={handleReset}>Generate Another</button>
            </div>
          ) : (
            <>
              {/* Step 1: Email form */}
              {(status === 'idle' || status === 'checking' || (status === 'error' && !preview)) && (
                <form onSubmit={handleCheck} className="email-form">
                  <p className="form-description">
                    Enter your registered email to fetch and download your personalized certificate.
                  </p>
                  <div className="input-group">
                    <label htmlFor="email" className="input-label">Registered Email Address</label>
                    <input
                      id="email"
                      type="email"
                      className="email-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'checking'}
                      autoFocus
                    />
                  </div>

                  {message && status === 'error' && (
                    <div className="alert alert-error">{message}</div>
                  )}

                  <button
                    type="submit"
                    className={`btn btn-primary ${status === 'checking' ? 'btn-loading' : ''}`}
                    disabled={status === 'checking'}
                  >
                    {status === 'checking' ? (
                      <><span className="spinner"></span> Verifying…</>
                    ) : (
                      'Verify Email →'
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Preview & confirm */}
              {(status === 'preview' || status === 'downloading' || (status === 'error' && preview)) && (
                <div className="preview-state">
                  <div className="preview-header">
                    <div className="check-icon">✓</div>
                    <p className="preview-intro">Email verified! Here's your certificate preview:</p>
                  </div>

                  <div className="cert-preview-box">
                    <div className="preview-field">
                      <span className="preview-label">Name</span>
                      <span className="preview-value">{preview.name}</span>
                    </div>
                    <div className="preview-field">
                      <span className="preview-label">Team</span>
                      <span className="preview-value">{preview.team_name}</span>
                    </div>
                    <div className="preview-field">
                      <span className="preview-label">Event</span>
                      <span className="preview-value">DropOutHacks Hackathon</span>
                    </div>
                    <div className="preview-field">
                      <span className="preview-label">Role</span>
                      <span className={`role-badge ${roleBadgeClass}`}>{preview.role}</span>
                    </div>
                  </div>

                  <p className="download-note">
                    ⚠️ Each email can only download a certificate once. Make sure the details above are correct.
                  </p>

                  {message && status === 'error' && (
                    <div className="alert alert-error">{message}</div>
                  )}

                  <div className="btn-row">
                    <button className="btn btn-ghost" onClick={handleReset} disabled={status === 'downloading'}>
                      ← Back
                    </button>
                    <button
                      className={`btn btn-primary ${status === 'downloading' ? 'btn-loading' : ''}`}
                      onClick={handleDownload}
                      disabled={status === 'downloading'}
                    >
                      {status === 'downloading' ? (
                        <><span className="spinner"></span> Generating PDF…</>
                      ) : (
                        '⬇ Download Certificate'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="card-footer">
          <p>Only Participants and Finalists are eligible &nbsp;·&nbsp; Each certificate can be downloaded once</p>
        </div>
      </div>
    </div>
  );
}

export default CertificateForm;
