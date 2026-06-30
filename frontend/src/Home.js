import './Home.css';
import airforceLogo from './image.png';
import { ShieldPlus } from "lucide-react";

function HeartbeatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h4l2-4 3 8 2-4h5" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero home-simple-hero">
        <div className="home-hero-copy">
          <div className="home-center-content">
  <img
    src={airforceLogo}
    alt="Indian Air Force"
    className="home-logo"
  />

  <h1>IAF Vital Monitoring System</h1>

  <p className="home-subtitle">
    Telemetry for ward monitoring, patient oversight, and device visibility
  </p>
</div>
</div>
      </section>
    </div>
  );
}
