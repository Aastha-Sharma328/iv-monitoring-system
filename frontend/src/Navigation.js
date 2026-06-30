import { useEffect, useState } from 'react';
import './Navigation.css';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5Z" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17v-2h4v-6h-4V7l-5 5 5 5Zm8-12H12V3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6v-2h6V5Z" />
    </svg>
  );
}

function RegisterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function Navigation() {
  const [activeHash, setActiveHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const update = () => setActiveHash(window.location.hash || '#/');
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  return (
    <nav className="navbar">

      <div className="navbar-brand">
  <span>IAF Vital Monitoring</span>
</div>
      <ul className="navbar-menu">
        <li>
          <a className={activeHash === '#/' ? 'active' : ''} href="#/">
  Home
</a>
        </li>

        <li>
          <a className={activeHash === '#/login' ? 'active' : ''} href="#/login">
            <LoginIcon />
            Login
          </a>
        </li>

        <li>
          <a className={activeHash === '#/register' ? 'active' : ''} href="#/register">
            <RegisterIcon />
            Sign Up
          </a>
        </li>
      </ul>

    </nav>
  );
}