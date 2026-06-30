import { useState } from 'react';
import axios from 'axios';
import './App.css';
import { ShieldPlus, Eye, EyeOff } from "lucide-react";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
      <rect x="5" y="11" width="14" height="10" rx="2" />
    </svg>
  );
}

function RoleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  );
}

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [userID, setuserID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 4) {
      alert('Password must be at least 4 characters');
      return;
    }

    try {
      const resp = await axios.post('http://localhost:5000/user', {
        full_name: fullName,
        user_id: Number(userID),
        password,
        role: 'Clinician',
      });

      const created = resp.data;
      localStorage.setItem('clinician', JSON.stringify({
        full_name: created.full_name,
        userID: created.userID,
        role: created.role,
      }));

      window.location.hash = '#/dashboard';
    } catch (err) {
      const msg = err.response && err.response.data ? err.response.data : err.message;
      alert(`Registration failed: ${msg}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-logo">
        <ShieldPlus size={42} strokeWidth={2.5} />
          <div className="auth-brand-block">
            <h1>IAF Vital Monitoring System</h1>
            <p>Telemetry Network</p>
          </div>
          <div className="auth-copy">
            Create secure clinician access for the medical monitoring dashboard.
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create clinician account</h2>
            <p>Professional registration for hospital operations.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <div className="input-group">
                <span className="input-icon"><UserIcon /></span>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ankush Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              User ID
              <div className="input-group">
                <span className="input-icon"><UserIcon /></span>
                <input
                  type="number"
                  placeholder="User ID"
                  value={userID}
                  onChange={(e) => setuserID(e.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              Password
              <div className="input-group">
                <span className="input-icon"><LockIcon /></span>
                <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter your password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
              </div>
            </label>

            <div className="auth-row">
              <span className="checkbox-row">Already registered?</span>
              <a href="#/login">Sign in</a>
            </div>

            <button type="submit" className="primary-button">
              Register Credentials
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
