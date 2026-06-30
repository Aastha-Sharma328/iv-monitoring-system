import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';
import Navigation from './Navigation';
import Home from './Home';
import Dashboard from './Dashboard';
import Register from './Register';
import PatientDetails from './PatientDetails';
import { ShieldPlus, Eye, EyeOff } from "lucide-react";
import UserManagement from './UserManagement';
import Reports from "./Reports";
import Settings from "./Settings";


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

function LoginPage() {
  const [userID, setuserID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/user/login', {
        user_id: Number(userID),
        password
      });

      localStorage.setItem('clinician', JSON.stringify(response.data));
      if (rememberMe) {
        localStorage.setItem('clinicianRemembered', 'true');
      }
      window.location.hash = '#/dashboard';
    } catch (err) {
      alert('Invalid Email or Password');
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
            Centralized ward monitoring for patient vitals, device status, and alert response.
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Sign in to continue</h2>
            <p>Access the medical dashboard for live monitoring.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              User ID
              <div className="input-group">
                <span className="input-icon"><UserIcon /></span>
                <input
                  type="number"
                  placeholder="Enter your user ID"
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
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="#/register">Create account</a>
            </div>

            <button type="submit" className="primary-button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.slice(1) || '/';
      setRoute(hash);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  let content;

const clinician = JSON.parse(localStorage.getItem('clinician')) || {};

if (route === '/users') {
  if (clinician.role !== 'Admin') {
    content = <h2>Access Denied</h2>;
  } else {
    content = <UserManagement />;
  }
}

else if (route.startsWith('/patient/')) {
  if (clinician.role !== 'Admin' && clinician.role !== 'Clinician') {
    content = <h2 style={{ padding: '20px' }}>Access Denied</h2>;
  } else {
    const patientId = route.split('/')[2];
    content = <PatientDetails patientId={patientId} />;
  }
}

else {
  switch (route) {
    case '/':
      content = <Home />;
      break;

    case '/login':
      content = <LoginPage />;
      break;

    case '/register':
      content = <Register />;
      break;

    case '/dashboard':
      content = <Dashboard />;
      break;

    case '/patients':
      content = <Dashboard />;
      break;

    case '/alerts':
      content = <Dashboard />;
      break;

    case '/reports':
      content = <Reports />;
      break;

    case '/settings':
      content = <Settings />;
      break;

    default:
      content = <Home />;
  }
}

  const showNavigation = route === '/' || route === '/login' || route === '/register';

  return (
    <div>
      {showNavigation && <Navigation />}
      {content}
    </div>
  );
}
