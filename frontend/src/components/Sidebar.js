import './ui.css';

function HeartbeatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h4l2-4 3 8 2-4h5" />
      <path d="M3 12h2l1.5-3 3 6 2.5-5 2 4h7" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-16v5h7V4h-7Z" />
    </svg>
  );
}

function PatientsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11Zm-8 0c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.67 0-8 1.34-8 4v3h10v-3c0-1.28.47-2.42 1.23-3.33C10.02 13.26 8.44 13 8 13Zm8 0c-.44 0-2.02.26-3.23.67A5.98 5.98 0 0 1 14 17v3h10v-3c0-2.66-5.33-4-8-4Z" />
    </svg>
  );
}

function AlertsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22a2.25 2.25 0 0 0 2.2-2h-4.4A2.25 2.25 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Zm-7-12a5 5 0 0 1 5 5v6H7V9a5 5 0 0 1 5-5Z" />
    </svg>
  );
}

function DevicesIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h14a2 2 0 0 1 2 2v6h-2V6H5v12h6v2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm13 8h3a1 1 0 0 1 1 1v5a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3v-5a1 1 0 0 1 1-1h2Zm-1 2v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4h-3Z" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2ZM8 8h4v2H8V8Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m19.14 12.94.03-.94-.03-.94 2.03-1.58a.5.5 0 0 0 .12-.63l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.17 7.17 0 0 0-1.62-.94l-.36-2.54A.5.5 0 0 0 14.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.57.22-1.11.53-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L3.72 8.44a.5.5 0 0 0 .12.63l2.03 1.58-.03.94.03.94-2.03 1.58a.5.5 0 0 0-.12.63l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.41 1.05.72 1.62.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.57-.22 1.11-.53 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.63l-2.03-1.58ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
    </svg>
  );
}

function UserManagementIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11Z" />
      <path d="M8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Z" />
      <path d="M8 13c-2.67 0-8 1.34-8 4v3h10v-3c0-1.28.47-2.42 1.23-3.33" />
      <path d="M14 13c2.67 0 8 1.34 8 4v3H14v-3c0-2.66 5.33-4 8-4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17v-2h4v-6h-4V7l-5 5 5 5Zm8-14H12v2h6v14h-6v2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
    </svg>
  );
}

const iconMap = {
  Dashboard: <DashboardIcon />,
  Patients: <PatientsIcon />,
  Alerts: <AlertsIcon />,
  Devices: <DevicesIcon />,
  Reports: <ReportsIcon />,
  Settings: <SettingsIcon />,
  "User Management": <UserManagementIcon />,
  Logout: <LogoutIcon />
};

export default function Sidebar({ activeItem = 'Dashboard', onNavigate }) {

  const clinician =
    JSON.parse(localStorage.getItem('clinician')) || {};

  const isAdmin = clinician.role === 'Admin';
  const items = isAdmin
  ? [
      'Dashboard',
      'Reports',
      'User Management',
      'Settings',
      'Logout'
    ]
  : [
      'Dashboard',
      'Patients',
      'Alerts',
      'Logout'
    ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <HeartbeatIcon />
        </div>
        <div className="sidebar-brand-copy">
          <div className="sidebar-brand-title">IAF Vital Monitoring</div>
          <div className="sidebar-brand-subtitle">Clinical telemetry network</div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className={`sidebar-nav-item ${activeItem === item ? 'active' : ''}`}
            onClick={() => onNavigate?. (item)}>
            <span className="sidebar-nav-icon">{iconMap[item]}</span>
            <span className="sidebar-nav-label">{item}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
