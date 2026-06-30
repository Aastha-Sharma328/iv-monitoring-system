import './Dashboard.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import PageLayout from './components/PageLayout';
import StatCard from './components/StatCard';
import {
  Users,
  Bell,
  Droplets
} from "lucide-react";

function EmptyIcon({ type }) {
  const icons = {
    loading: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M4.2 4.2l2.1 2.1" />
        <path d="M17.7 17.7l2.1 2.1" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <path d="M4.2 19.8l2.1-2.1" />
        <path d="M17.7 6.3l2.1-2.1" />
      </svg>
    ),
    empty: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v12H4z" />
        <path d="M8 10h8" />
        <path d="M8 14h8" />
      </svg>
    ),
    none: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 9 9" />
        <path d="M21 3l-9 9" />
      </svg>
    )
  };

  return icons[type] || icons.empty;
}

function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export default function Dashboard() {
  const view = window.location.hash.includes('/patients') ? 'patients' : window.location.hash.includes('/alerts') ? 'alerts' : 'dashboard';
  const clinician = JSON.parse(localStorage.getItem('clinician')) || {};
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    patients: 0,
    alarms: 0,
    FluidDeficit: 0
  });
  const [patients, setPatients] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [monitoringData, setMonitoringData] = useState([]);
  const [LiveVitals, setLiveVitals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [patientsLoaded, setPatientsLoaded] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showPatientList, setShowPatientList] = useState(false);
  const [newPatient, setNewPatient] = useState({
    full_name: '',
    age: '',
    gender: '',
    bed_number: '',
    contact_number: ''
  });
  const [formMessage, setFormMessage] = useState('');
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('clinician')) || {};
    setUserData(user);

    loadAlerts();
    loadFluidDeficit();

    const alertInterval = setInterval(() => {
      loadAlerts();
      loadFluidDeficit();
    }, 5000);

    if (user.role === 'Clinician') {
      loadMonitoringData();
      loadLiveVitals();

      const monitorInterval = setInterval(() => {
        loadMonitoringData();
        loadLiveVitals();
      }, 1000);

      return () => {
        clearInterval(alertInterval);
        clearInterval(monitorInterval);
      };
    }

    return () => clearInterval(alertInterval);
  }, []);

  useEffect(() => {
    loadVitals();

    const interval = setInterval(() => {
      loadVitals();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await axios.get('http://localhost:5000/patient');
      setPatients(response.data);
      setPatientsLoaded(true);
      setStats((current) => ({
        ...current,
        patients: response.data.length
      }));
    } catch (error) {
      console.error('Failed to load patients:', error);
      setPatients([]);
      setPatientsLoaded(true);
    } finally {
      setLoadingPatients(false);
    }
  };

  const loadMonitoringData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/patient/monitoring/all');
      setMonitoringData(response.data);
      setStats((current) => ({
        ...current,
        patients: response.data.length
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const loadLiveVitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vital/live/all');
      setLiveVitals(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alert');
      setAlerts(response.data);
      setStats((current) => ({
        ...current,
        alarms: response.data.length
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const loadFluidDeficit = async () => {
    try {
      const response = await axios.get('http://localhost:5000/alert/fluid/count');
      setStats((current) => ({
        ...current,
        fluidDeficit: response.data.count || 0,
        FluidDeficit: response.data.count || 0
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const loadVitals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/vital');
      setVitals(response.data);
    } catch (error) {
      console.error('Failed to load vitals:', error);
    }
  };

  const handlePatientInput = (name, value) => {
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const submitNewPatient = async (event) => {
    event.preventDefault();
    setFormMessage('');

    if (!newPatient.full_name || !newPatient.age) {
      setFormMessage('Full name and age are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/patient', {
        full_name: newPatient.full_name,
        age: Number(newPatient.age),
        gender: newPatient.gender,
        bed_number: newPatient.bed_number,
        contact_number: newPatient.contact_number
      });

      setFormMessage(`Patient ${response.data.full_name} admitted successfully.`);
      setNewPatient({
        full_name: '',
        age: '',
        gender: '',
        bed_number: '',
        contact_number: ''
      });
      setShowPatientForm(false);
      setShowPatientList(true);
      await loadPatients();
    } catch (error) {
      console.error('Failed to admit patient:', error);
      const backendMsg = error.response && error.response.data ? error.response.data : null;
      setFormMessage(backendMsg || 'Failed to admit patient. Please check your input and try again.');
    }
  };

  useEffect(() => {
    if (!patientsLoaded) {
      setStats((current) => ({ ...current, patients: 0 }));
    }
  }, [patientsLoaded]);

  const handleLogout = () => {
    localStorage.removeItem('clinician');
    window.location.hash = '#/';
  };

  const isAdmin = userData?.role === 'Admin';
  const isClinician = userData?.role === 'Clinician';
  const lowFluidCount = stats.FluidDeficit ?? stats.fluidDeficit ?? 0;

  return (
    <PageLayout
      activeItem="Dashboard"
      onNavigate={(item) => {
        if (item === 'Dashboard') window.location.hash = '#/dashboard';
        if (item === 'Patients') document.getElementById('patient-section')?.scrollIntoView({ behavior: 'smooth' });
        if (item === 'Alerts') document.getElementById('active-alerts')?.scrollIntoView({ behavior: 'smooth' });
        if (item === 'Devices') document.getElementById('fluid-alerts')?.scrollIntoView({ behavior: 'smooth' });
        if (item === 'Reports') window.location.hash = 
        '#/reports';
        if (item === 'User Management') window.location.hash = '#/users';
        if (item === 'Settings') window.location.hash = '#/settings';
        if (item === 'Logout') handleLogout();
      }}
    >
      <div className="dashboard-page">
        <header className="dashboard-hero">
          <div>
            <div className="dashboard-kicker">Clinical Overview</div>
            <h1>IAF Vital Monitoring Dashboard</h1>
            <p>
              Clean, real-time ward visibility with patients, alerts, and device status in one place.
            </p>
          </div>
          <div className="dashboard-hero-actions">
            <button className="btn-secondary" onClick={() => window.location.hash = '#/dashboard'}>
              Refresh View
            </button>
            <button className="btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="kpi-grid">
<StatCard
  title="Patients"
  value={`${stats.patients} monitored`}
  icon={<Users size={34} strokeWidth={2.5} />}
  tone="primary"
  onClick={() => document.getElementById('patient-section')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <StatCard
            title="Active Alerts"
            value={`${stats.alarms} active`}
            icon={<Bell size={34} strokeWidth={2.5} />}
            tone="warning"
            onClick={() => document.getElementById('active-alerts')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <StatCard
            title="Low IV Fluid"
            value={`${lowFluidCount} cases`}
            icon={<Droplets size={34} strokeWidth={2.5} />}
            tone="danger"
            onClick={() => document.getElementById('fluid-alerts')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </section>

        <section className="dashboard-grid">
          {isClinician && (
            <article className="dashboard-card-ui monitoring-card">
              <div className="section-heading">
                <div>
                  <h2 className="section-title">Live Monitoring Table</h2>
                  <p className="section-subtitle">Active ward telemetry and device readings</p>
                </div>
              </div>

              <div className="table-scroll">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Device</th>
                      <th>Status</th>
                      <th>Heart Rate</th>
                      <th>SpO₂</th>
                      <th>Temperature</th>
                      <th>IV Fluid</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LiveVitals.map((patient) => {
                      const critical =
                        patient.heart_rate > 120 ||
                        patient.spo2 < 90 ||
                        patient.temperature > 38.5;

                      return (
                        <tr key={patient.patient_id} className={critical ? 'critical-row' : ''}>
                          <td>{patient.patient_code}</td>
                          <td>{patient.device_code || 'Not Assigned'}</td>
                          <td>
                            <Badge tone={patient.status === 'ACTIVE' ? 'success' : 'danger'}>
                              {patient.status}
                            </Badge>
                          </td>
                          <td>{patient.heart_rate ?? '--'}</td>
                          <td>{patient.spo2 ?? '--'}</td>
                          <td>{patient.temperature ?? '--'}</td>
                          <td>{patient.weight ?? '--'}</td>
                          <td>{patient.recorded_at ? new Date(patient.recorded_at).toLocaleString() : '--'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {isClinician && (
            <article id="patient-section" className="dashboard-card-ui patient-cards-card">
              <div className="section-heading">
                <div>
                  <h2 className="section-title">Patient Cards</h2>
                  <p className="section-subtitle">Ward view with current monitoring snapshot</p>
                </div>
              </div>

              <div className="patient-card-grid">
                {monitoringData.map((patient) => {
                  const critical =
                    patient.heart_rate > 120 ||
                    patient.spo2 < 90 ||
                    patient.temperature > 38.5;

                  return (
                    <article key={patient.patient_id} className={`patient-monitor-card ${critical ? 'critical' : 'normal'}`}>
                      <div className="patient-card-top">
                        <div>
                          <div className="patient-code">{patient.patient_code}</div>
                          <div className="patient-name">{patient.full_name}</div>
                        </div>
                        <Badge tone={patient.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {patient.status}
                        </Badge>
                      </div>

                      <div className="patient-card-body">
                        <div><span>Device</span><strong>{patient.device_code || 'Not Assigned'}</strong></div>
                        <div><span>Heart Rate</span><strong>{patient.heart_rate ?? '--'} BPM</strong></div>
                        <div><span>SpO₂</span><strong>{patient.spo2 ?? '--'}%</strong></div>
                        <div><span>Temperature</span><strong>{patient.temperature ?? '--'} °C</strong></div>
                        <div><span>IV Fluid</span><strong>{patient.weight ?? '--'} ml</strong></div>
                      </div>

                      <button
                        className="btn-secondary card-button"
                        onClick={() => (window.location.hash = `#/patient/${patient.patient_id}`)}
                      >
                        Patient Info
                      </button>
                    </article>
                  );
                })}
              </div>
            </article>
          )}

          {isClinician && (
            <article className="dashboard-card-ui alert-card" id="active-alerts">
              <div className="section-heading">
                <div>
                  <h2 className="section-title">Active Alerts Table</h2>
                  <p className="section-subtitle">Latest warnings and critical events</p>
                </div>
              </div>
              <div className="table-scroll">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Alert</th>
                      <th>Current Value</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.slice(0, 10).map((alert) => (
                      <tr key={alert.alert_id}>
                        <td>{alert.patient_code} - {alert.full_name}</td>
                        <td>{alert.message}</td>
                        <td>
                          {alert.alert_type === 'HIGH_HEART_RATE' && `${alert.heart_rate} BPM`}
                          {alert.alert_type === 'LOW_SPO2' && `${alert.spo2}%`}
                          {alert.alert_type === 'HIGH_TEMPERATURE' && `${alert.temperature} °C`}
                          {alert.alert_type === 'LOW_IV_FLUID' && `${alert.weight} ml`}
                        </td>
                        <td>{new Date(alert.alert_time).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {isClinician && (
            <article className="dashboard-card-ui alert-card" id="fluid-alerts">
              <div className="section-heading">
                <div>
                  <h2 className="section-title">Low IV Fluid Alerts</h2>
                  <p className="section-subtitle">Fluid deficit cases awaiting attention</p>
                </div>
              </div>
              <div className="table-scroll">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Alert</th>
                      <th>Current Value</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts
                      .filter((alert) => alert.alert_type === 'LOW_IV_FLUID')
                      .map((alert) => (
                        <tr key={alert.alert_id}>
                          <td>{alert.patient_code} - {alert.full_name}</td>
                          <td>{alert.message}</td>
                          <td>{alert.current_value ?? '--'}</td>
                          <td>{new Date(alert.alert_time).toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {isAdmin && (
            <article className="dashboard-card-ui management-card">
              <div className="section-heading">
                <div>
                  <h2 className="section-title">Patient Management</h2>
                  <p className="section-subtitle">Admit and review patient records</p>
                </div>
              </div>

              <div className="monitoring-controls">
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowPatientForm((prev) => !prev);
                    setShowPatientList(false);
                    setFormMessage('');
                  }}
                >
                  + Admit New Patient
                </button>
                <button
                  className="btn-secondary"
                  onClick={async () => {
                    const show = !showPatientList;
                    setShowPatientList(show);
                    setShowPatientForm(false);
                    setFormMessage('');
                    if (show) await loadPatients();
                  }}
                >
                  {showPatientList ? 'Hide Existing Patients' : 'View Existing Patients'}
                </button>
              </div>

              {showPatientForm && (
                <div className="patient-form-card">
                  <h3>New Patient Admission</h3>
                  <form className="patient-form" onSubmit={submitNewPatient}>
                    <div className="form-row single">
                      <label>
                        Full Name
                        <input type="text" value={newPatient.full_name} onChange={(e) => handlePatientInput('full_name', e.target.value)} required />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Age
                        <input type="number" min="0" value={newPatient.age} onChange={(e) => handlePatientInput('age', e.target.value)} required />
                      </label>
                      <label>
                        Gender
                        <select value={newPatient.gender} onChange={(e) => handlePatientInput('gender', e.target.value)}>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Bed Number
                        <input type="text" value={newPatient.bed_number} onChange={(e) => handlePatientInput('bed_number', e.target.value)} />
                      </label>
                      <label>
                        Contact Number
                        <input type="text" value={newPatient.contact_number} onChange={(e) => handlePatientInput('contact_number', e.target.value)} />
                      </label>
                    </div>
                    {formMessage && <div className="form-message">{formMessage}</div>}
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">Submit Patient</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowPatientForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="patient-table-shell">
                {!showPatientList && !showPatientForm && (
                  <div className="empty-state">
                    <div className="empty-icon"><EmptyIcon type="empty" /></div>
                    <p>Register a new patient or view existing database records.</p>
                    <p className="empty-hint">Use the buttons above to admit or view existing patients.</p>
                  </div>
                )}

                {showPatientList && !patientsLoaded && (
                  <div className="empty-state">
                    <div className="empty-icon"><EmptyIcon type="loading" /></div>
                    <p>Loading patient records...</p>
                  </div>
                )}

                {showPatientList && patientsLoaded && !loadingPatients && patients.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon"><EmptyIcon type="none" /></div>
                    <p>No patient records found in the database.</p>
                  </div>
                )}

                {showPatientList && !loadingPatients && patients.length > 0 && (
                  <div className="table-scroll">
                    <table className="app-table">
                      <thead>
                        <tr>
                          <th>Patient Code</th>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient) => (
                          <tr key={patient.patient_id}>
                            <td>{patient.patient_code}</td>
                            <td>{patient.full_name}</td>
                            <td>
                              {isAdmin && (
                                <button className="btn-secondary" onClick={() => (window.location.hash = `#/patient/${patient.patient_id}`)}>
                                  View Details
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </article>
          )}

          {isAdmin && (
            <article className="dashboard-card-ui quick-actions-card">
              <div className="section-heading">
                <div>
                  <h2 className="section-title">Quick Actions</h2>
                  <p className="section-subtitle">Common administrative tasks</p>
                </div>
              </div>
              <div className="action-buttons">
                <button className="btn-secondary">View Patient Records</button>
                <button className="btn-secondary">Manage Alarms</button>
                <button className="btn-secondary">Generate Reports</button>
                <button className="btn-secondary">Settings</button>
              </div>
            </article>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
