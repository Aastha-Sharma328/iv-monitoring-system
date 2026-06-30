import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import './PatientDetails.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Patients', icon: 'patients' },
  { label: 'Alerts', icon: 'alerts' },
  { label: 'Devices', icon: 'devices' },
  { label: 'Reports', icon: 'reports' },
  { label: 'Settings', icon: 'settings' },
  { label: 'Logout', icon: 'logout' }
];

function DashboardIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-16v5h7V4h-7Z" /></svg>; }
function PatientsIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11Zm-8 0c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.67 0-8 1.34-8 4v3h10v-3c0-1.28.47-2.42 1.23-3.33C10.02 13.26 8.44 13 8 13Zm8 0c-.44 0-2.02.26-3.23.67A5.98 5.98 0 0 1 14 17v3h10v-3c0-2.66-5.33-4-8-4Z" /></svg>; }
function AlertsIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a2.25 2.25 0 0 0 2.2-2h-4.4A2.25 2.25 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Zm-7-12a5 5 0 0 1 5 5v6H7V9a5 5 0 0 1 5-5Z" /></svg>; }
function DevicesIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v6h-2V6H5v12h6v2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm13 8h3a1 1 0 0 1 1 1v5a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3v-5a1 1 0 0 1 1-1h2Zm-1 2v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4h-3Z" /></svg>; }
function ReportsIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5ZM8 12h8v2H8v-2Zm0 4h8v2H8v-2ZM8 8h4v2H8V8Z" /></svg>; }
function SettingsIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m19.14 12.94.03-.94-.03-.94 2.03-1.58a.5.5 0 0 0 .12-.63l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.17 7.17 0 0 0-1.62-.94l-.36-2.54A.5.5 0 0 0 14.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.57.22-1.11.53-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L3.72 8.44a.5.5 0 0 0 .12.63l2.03 1.58-.03.94.03.94-2.03 1.58a.5.5 0 0 0-.12.63l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.41 1.05.72 1.62.94l.36 2.54a.5.5 0 0 0 .49.42h3.8a.5.5 0 0 0 .49-.42l.36-2.54c.57-.22 1.11-.53 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.63l-2.03-1.58ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>; }
function LogoutIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17v-2h4v-6h-4V7l-5 5 5 5Zm8-14H12v2h6v14h-6v2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" /></svg>; }
function HeartIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A5.4 5.4 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09A6.1 6.1 0 0 1 16.5 3 5.4 5.4 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z" /></svg>; }
function WaterDropIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2s6 6.08 6 11a6 6 0 0 1-12 0c0-4.92 6-11 6-11Zm0 18a4.5 4.5 0 0 0 4.5-4.5h-2A2.5 2.5 0 0 1 12 18v2Z" /></svg>; }
function ThermometerIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 14.76V5a2 2 0 1 0-4 0v9.76a4.5 4.5 0 1 0 4 0ZM10 5a2 2 0 1 1 4 0v10.4l.28.2A3.5 3.5 0 1 1 10 15.6l.28-.2V5Z" /></svg>; }
function IvBottleIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4v2h-1v3.5l4.6 4.6A4.5 4.5 0 0 1 19 15.3V20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4.7a4.5 4.5 0 0 1 1.4-3.2L11 7.5V4h-1V2Zm-1.8 12.6A2.5 2.5 0 0 0 7.5 16.4V20h9v-3.6a2.5 2.5 0 0 0-.7-1.8L12 11.4l-3.8 3.2Z" /></svg>; }
function PersonIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" /></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10Z" /></svg>; }
function GenderIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.41l-3.2 3.2a6 6 0 1 1-1.41-1.41l3.2-3.2H14V3ZM8 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /></svg>; }
function BedIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h8a4 4 0 0 1 4 4v2h4v4h2V4h-2v8h-1a5 5 0 0 0-5-4H4V4H2v16h2v-10Zm2 0h6a3 3 0 0 1 3 3v3H6v-6Z" /></svg>; }
function PhoneIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C9.85 21 3 14.15 3 5a1 1 0 0 1 1-1h3.47a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.24 1l-2.2 2.2Z" /></svg>; }
function RefreshIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 13.65-6.65Z" /></svg>; }

function Sparkline({ data, dataKey, stroke }) {
  const values = (data || []).map((entry) => Number(entry?.[dataKey])).filter((value) => Number.isFinite(value));

  if (values.length < 2) {
    return (
      <svg viewBox="0 0 120 40" className="sparkline" aria-hidden="true">
        <path d="M8 20h104" />
      </svg>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 120;
  const height = 40;
  const padding = 6;
  const step = (width - padding * 2) / (values.length - 1);
  const points = values
    .map((value, index) => {
      const x = padding + index * step;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 120 40" className="sparkline" aria-hidden="true">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatValue(value, suffix = '') {
  if (value === null || value === undefined || value === '') return '-';
  return `${value}${suffix}`;
}

function getBadgeTone(value) {
  const normalized = String(value || '').toLowerCase();

  if (normalized.includes('critical') || normalized.includes('high')) {
    return 'critical';
  }

  if (normalized.includes('warning') || normalized.includes('pending')) {
    return 'warning';
  }

  if (normalized.includes('resolved') || normalized.includes('normal') || normalized.includes('online')) {
    return 'success';
  }

  return 'neutral';
}

function getAlertParameter(alert) {
  const alertType = String(alert?.alert_type || '').toLowerCase();

  if (alertType.includes('heart')) return 'Heart Rate';
  if (alertType.includes('spo2') || alertType.includes('oxygen')) return 'SpO₂';
  if (alertType.includes('temp')) return 'Temperature';
  if (alertType.includes('fluid') || alertType.includes('weight')) return 'IV Fluid';

  return alert?.alert_type || 'Alert';
}

function getAlertValue(alert) {
  if (alert?.heart_rate !== null && alert?.heart_rate !== undefined) {
    return `${alert.heart_rate} BPM`;
  }

  if (alert?.spo2 !== null && alert?.spo2 !== undefined) {
    return `${alert.spo2}%`;
  }

  if (alert?.temperature !== null && alert?.temperature !== undefined) {
    return `${alert.temperature} °C`;
  }

  if (alert?.weight !== null && alert?.weight !== undefined) {
    return `${alert.weight} ml`;
  }

  return alert?.message || '-';
}

function getAlertStatus(alert) {
  const explicitStatus = String(alert?.status || alert?.alert_status || '').toLowerCase();

  if (explicitStatus.includes('resolved')) return 'Resolved';
  if (explicitStatus.includes('critical')) return 'Critical';
  if (explicitStatus.includes('warning')) return 'Warning';
  if (explicitStatus.includes('open')) return 'Critical';
  if (String(alert?.alert_type || '').toLowerCase().includes('low_iv_fluid')) return 'Critical';

  return 'Warning';
}

function InfoField({ icon, label, value }) {
  return (
    <div className="info-field">
      <div className="info-field-icon">{icon}</div>
      <div>
        <div className="info-field-label">{label}</div>
        <div className="info-field-value">{value}</div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, icon, tone, data, dataKey, stroke }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-card-top">
        <div className="metric-card-icon">{icon}</div>
        <span className="metric-card-title">{title}</span>
      </div>
      <div className="metric-card-value-row">
        <div className="metric-card-value">{value}</div>
        <div className="metric-card-unit">{unit}</div>
      </div>
      <Sparkline data={data} dataKey={dataKey} stroke={stroke} />
    </article>
  );
}

export default function PatientDetails({ patientId }) {
  const clinician = JSON.parse(localStorage.getItem('clinician')) || {};
  const [patient, setPatient] = useState(null);
  const [device, setDevice] = useState(null);
  const [deviceCode, setDeviceCode] = useState('');
  const [latestVital, setLatestVital] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [activeChart, setActiveChart] = useState('heart_rate');

  const hrCriticalAreas = [];

  for (let i = 0; i < graphData.length; i++) {
    const point = graphData[i];

    if (point.heart_rate > 120 || point.heart_rate < 60) {
      hrCriticalAreas.push(point);
    }
  }

  const spo2CriticalAreas = [];

  for (let i = 0; i < graphData.length; i++) {
    const point = graphData[i];

    if (point.spo2 < 95) {
      spo2CriticalAreas.push(point);
    }
  }

  const tempCriticalAreas = [];

  for (let i = 0; i < graphData.length; i++) {
    const point = graphData[i];

    if (point.temperature > 38 || point.temperature < 35) {
      tempCriticalAreas.push(point);
    }
  }

  const weightCriticalAreas = [];

  for (let i = 0; i < graphData.length; i++) {
    const point = graphData[i];

    if (point.weight < 100) {
      weightCriticalAreas.push(point);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [patientId]);

  const assignDevice = async () => {
    try {
      await axios.post('http://localhost:5000/device/assign', {
        patient_id: patientId,
        device_code: deviceCode
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async () => {
    try {
      const patientRes = await axios.get(`http://localhost:5000/patient/${patientId}`);
      setPatient(patientRes.data);

      const vitalRes = await axios.get(`http://localhost:5000/vital/latest/${patientId}`);
      setLatestVital(vitalRes.data);

      const vitalsRes = await axios.get(`http://localhost:5000/vital/${patientId}`);
      setVitals(vitalsRes.data);

      const deviceRes = await axios.get(`http://localhost:5000/device/patient/${patientId}`);
      if (deviceRes.data && deviceRes.data.length > 0) {
        setDevice(deviceRes.data[0]);
      } else {
        setDevice(null);
      }

      const alertRes = await axios.get(`http://localhost:5000/alert/${patientId}`);
      setAlerts(alertRes.data);

      const graphRes = await axios.get(`http://localhost:5000/vital/graph/${patientId}`);

      console.log('GRAPH DATA:', graphRes.data);

      setGraphData(Array.isArray(graphRes.data) ? graphRes.data : []);
    } catch (err) {
      console.error('Load Data Error:', err);
    }
  };

  const latestRecordedAt = latestVital?.recorded_at || vitals?.[0]?.recorded_at || graphData?.[graphData.length - 1]?.recorded_at;
  const latestHeartRate = latestVital?.heart_rate ?? graphData?.[graphData.length - 1]?.heart_rate ?? '-';
  const latestSpo2 = latestVital?.spo2 ?? graphData?.[graphData.length - 1]?.spo2 ?? '-';
  const latestTemperature = latestVital?.temperature ?? graphData?.[graphData.length - 1]?.temperature ?? '-';
  const latestFluid = latestVital?.weight ?? graphData?.[graphData.length - 1]?.weight ?? '-';

  const statusMetrics = {
    heartRate: Number(latestHeartRate),
    spo2: Number(latestSpo2),
    temperature: Number(latestTemperature),
    fluid: Number(latestFluid)
  };

  const criticalStatus =
    (Number.isFinite(statusMetrics.heartRate) && (statusMetrics.heartRate > 120 || statusMetrics.heartRate < 60)) ||
    (Number.isFinite(statusMetrics.spo2) && statusMetrics.spo2 < 95) ||
    (Number.isFinite(statusMetrics.temperature) && (statusMetrics.temperature > 38 || statusMetrics.temperature < 35)) ||
    (Number.isFinite(statusMetrics.fluid) && statusMetrics.fluid < 100);

  const warningStatus =
    !criticalStatus && (
      (Number.isFinite(statusMetrics.heartRate) && (statusMetrics.heartRate >= 100 || statusMetrics.heartRate <= 70)) ||
      (Number.isFinite(statusMetrics.spo2) && statusMetrics.spo2 < 97) ||
      (Number.isFinite(statusMetrics.temperature) && (statusMetrics.temperature >= 37.5 || statusMetrics.temperature <= 35.5)) ||
      (Number.isFinite(statusMetrics.fluid) && statusMetrics.fluid < 150)
    );

  const patientStatus = criticalStatus
    ? { label: 'Critical', tone: 'critical', description: 'Immediate medical attention recommended' }
    : warningStatus
      ? { label: 'Warning', tone: 'warning', description: 'Patient require close monitoring' }
      : { label: 'Stable', tone: 'success', description: 'Patient vitals are stable' };

  const deviceStatus = String(device?.status || 'offline').toLowerCase();
  const deviceTone = deviceStatus.includes('online') || deviceStatus.includes('active') ? 'success' : 'critical';
  const lastSyncTime = device?.last_seen || device?.updated_at || device?.created_at;
  const sparkData = graphData.slice(-12);

  const renderHeartRateChart = () => (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={graphData}>
        <CartesianGrid stroke="#dbe7f3" strokeDasharray="3 3" />
        <XAxis dataKey="recorded_at" tickFormatter={(value) => new Date(value).toLocaleTimeString()} interval="preserveStartEnd" minTickGap={80} stroke="#94a3b8" />
        <YAxis domain={[50, 150]} tickCount={6} stroke="#94a3b8" />
        <Tooltip formatter={(value) => [`${value} BPM`, 'Heart Rate']} labelFormatter={(value) => formatDateTime(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #dbe7f3', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }} />
        <ReferenceLine y={120} stroke="#ef4444" />
        <ReferenceLine y={60} stroke="#f59e0b" />
        <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="5 5" label="High" />
        <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="5 5" label="Low" />
        <ReferenceArea y1={120} y2={150} fill="#ef4444" fillOpacity={0.12} />
        <ReferenceArea y1={0} y2={60} fill="#ef4444" fillOpacity={0.12} />
        {hrCriticalAreas.map((point, index) => (
          <ReferenceArea key={index} x1={point.recorded_at} x2={graphData[Math.min(graphData.length - 1, graphData.indexOf(point) + 1)]?.recorded_at} y1={point.heart_rate > 120 ? 120 : 0} y2={point.heart_rate > 120 ? 150 : 60} fill="#ef4444" fillOpacity={0.12} />
        ))}
        <Line type="monotone" dataKey="heart_rate" stroke="#2563eb"  strokeWidth={3} dot={false} connectNulls={true} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderSpo2Chart = () => (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={graphData}>
        <CartesianGrid stroke="#dbe7f3" strokeDasharray="3 3" />
        <XAxis dataKey="recorded_at" tickFormatter={(value) => new Date(value).toLocaleTimeString()} stroke="#94a3b8" />
        <YAxis domain={[80, 100]} tickCount={6} stroke="#94a3b8" />
        <Tooltip formatter={(value) => [`${value}%`, 'SpO₂']} labelFormatter={(value) => formatDateTime(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #dbe7f3', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }} />
        <ReferenceLine y={95} stroke="#ef4444" strokeWidth={2} label="Alert" />
        <ReferenceArea y1={0} y2={95} fill="#ef4444" fillOpacity={0.12} />
        {spo2CriticalAreas.map((point, index) => (
          <ReferenceArea key={index} x1={point.recorded_at} x2={graphData[index + 1]?.recorded_at} y1={0} y2={95} fill="#ef4444" fillOpacity={0.12} />
        ))}
        <Line type="natural" dataKey="spo2" stroke="#0ea5e9" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderTemperatureChart = () => (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={graphData}>
        <CartesianGrid stroke="#dbe7f3" strokeDasharray="3 3" />
        <XAxis dataKey="recorded_at" tickFormatter={(value) => new Date(value).toLocaleTimeString()} stroke="#94a3b8" />
        <YAxis domain={[30, 42]} tickCount={6} stroke="#94a3b8" />
        <Tooltip labelFormatter={(value) => formatDateTime(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #dbe7f3', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }} />
        <ReferenceLine y={38} stroke="#ef4444" strokeWidth={2.5} label="High" />
        <ReferenceLine y={35} stroke="#f59e0b" strokeWidth={2.5} label="Low" />
        <ReferenceArea y1={38} y2={45} fill="#ef4444" fillOpacity={0.12} />
        <ReferenceArea y1={30} y2={35} fill="#ef4444" fillOpacity={0.12} />
        {tempCriticalAreas.map((point, index) => (
          <ReferenceArea key={index} x1={point.recorded_at} x2={graphData[index + 1]?.recorded_at} y1={point.temperature > 38 ? 38 : 30} y2={point.temperature > 38 ? 45 : 35} fill="#ef4444" fillOpacity={0.12} />
        ))}
        <Line type="natural" dataKey="temperature" stroke="#f59e0b" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderFluidChart = () => (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={graphData}>
        <CartesianGrid stroke="#dbe7f3" strokeDasharray="3 3" />
        <XAxis dataKey="recorded_at" tickFormatter={(value) => new Date(value).toLocaleTimeString()} stroke="#94a3b8" />
        <YAxis domain={[0, 1000]} tickCount={6} stroke="#94a3b8" />
        <Tooltip labelFormatter={(value) => formatDateTime(value)} contentStyle={{ borderRadius: '12px', border: '1px solid #dbe7f3', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }} />
        <ReferenceLine y={100} stroke="#ef4444" strokeWidth={2.5} label="Low Fluid" />
        <ReferenceArea y1={0} y2={100} fill="#ef4444" fillOpacity={0.12} />
        {weightCriticalAreas.map((point, index) => (
          <ReferenceArea key={index} x1={point.recorded_at} x2={graphData[index + 1]?.recorded_at} y1={0} y2={100} fill="#ef4444" fillOpacity={0.12} />
        ))}
        <Line type="natural" dataKey="weight" stroke="#16a34a" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderActiveChart = () => {
    switch (activeChart) {
      case 'spo2':
        return renderSpo2Chart();
      case 'temperature':
        return renderTemperatureChart();
      case 'iv_fluid':
        return renderFluidChart();
      case 'heart_rate':
      default:
        return renderHeartRateChart();
    }
  };

  if (!patient) return <div className="patient-loading">Loading...</div>;

  const navIconMap = {
    dashboard: <DashboardIcon />,
    patients: <PatientsIcon />,
    alerts: <AlertsIcon />,
    devices: <DevicesIcon />,
    reports: <ReportsIcon />,
    settings: <SettingsIcon />,
    logout: <LogoutIcon />
  };

  const recentAlerts = Array.isArray(alerts) ? alerts.slice(0, 8) : [];

  return (
    <div className="patient-dashboard-shell">
      <aside className="patient-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-mark"><HeartIcon /></div>
          <div>
            <div className="sidebar-brand-title">Hospital Monitor</div>
            <div className="sidebar-brand-subtitle">Clinical dashboard</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sidebar-nav-item ${item.label === 'Patients' ? 'active' : ''}`}
              onClick={() => {
                if (item.label === 'Dashboard') {
                  window.location.hash = '#/dashboard';
                }

                if (item.label === 'Logout') {
                  localStorage.removeItem('clinician');
                  window.location.hash = '#/login';
                }
              }}
            >
              <span className="sidebar-nav-icon">{navIconMap[item.icon]}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="patient-main-content">
        <header className="patient-topbar">
          <div className="patient-topbar-left">
            <button className="back-button" type="button" onClick={() => (window.location.hash = '#/dashboard')}>
              ← Back to Dashboard
            </button>
            <div>
              <h1 className="patient-details-title">Patient Details</h1>
              <p className="patient-details-subtitle">
  Real-time vital monitoring and telemetry analysis
</p>
            </div>
          </div>

          <div className="patient-topbar-right">
            <div className="timestamp-block">
              <span className="timestamp-label">Last Updated</span>
              <span className="timestamp-value">{formatDateTime(latestRecordedAt)}</span>
            </div>
            <button className="refresh-button" type="button" onClick={loadData} aria-label="Refresh patient data">
              <RefreshIcon />
              Refresh
            </button>
          </div>
        </header>

        <section className="hero-row">
          <div className="summary-grid">
            <MetricCard title="Heart Rate" value={formatValue(latestHeartRate)} unit="BPM" icon={<HeartIcon />} tone={Number(latestHeartRate) > 120 || Number(latestHeartRate) < 60 ? 'critical' : 'success'} data={sparkData} dataKey="heart_rate" stroke="#2563eb" />
            <MetricCard title="SpO₂" value={formatValue(latestSpo2)} unit="%" icon={<WaterDropIcon />} tone={Number(latestSpo2) < 95 ? 'critical' : 'success'} data={sparkData} dataKey="spo2" stroke="#0ea5e9" />
            <MetricCard title="Temperature" value={formatValue(latestTemperature)} unit="°C" icon={<ThermometerIcon />} tone={Number(latestTemperature) > 38 || Number(latestTemperature) < 35 ? 'critical' : 'warning'} data={sparkData} dataKey="temperature" stroke="#f59e0b" />
            <MetricCard title="IV Fluid" value={formatValue(latestFluid)} unit="ml" icon={<IvBottleIcon />} tone={Number(latestFluid) < 100 ? 'critical' : 'success'} data={sparkData} dataKey="weight" stroke="#16a34a" />
          </div>

          <article className={`status-banner tone-${patientStatus.tone}`}>
            <div className="status-banner-top">
              <span className="status-banner-label">Patient Status</span>
              <span className={`status-pill tone-${patientStatus.tone}`}>{patientStatus.label}</span>
            </div>
            <p className="status-banner-copy">{patientStatus.description}</p>
            <div className="status-banner-meta">
              <span>Monitor: {patient?.full_name}</span>
              <span>Bed: {patient?.bed_number || '-'}</span>
            </div>
          </article>
        </section>

        <section className="info-grid">
          <article className="dashboard-card patient-card">
            <div className="card-header">
              <div>
                <h2>Patient Information</h2>
                <p>Demographic and contact overview</p>
              </div>
            </div>
            <div className="info-fields-grid">
              <InfoField icon={<PersonIcon />} label="Name" value={patient.full_name || '-'} />
              <InfoField icon={<CalendarIcon />} label="Age" value={patient.age || '-'} />
              <InfoField icon={<GenderIcon />} label="Gender" value={patient.gender || '-'} />
              <InfoField icon={<BedIcon />} label="Bed Number" value={patient.bed_number || '-'} />
              <InfoField icon={<PhoneIcon />} label="Contact Number" value={patient.contact_number || '-'} />
            </div>
          </article>

          <article className="dashboard-card device-card">
            <div className="card-header">
              <div>
                <h2>Device Information</h2>
                <p>Assignment and sync status</p>
              </div>
              <span className={`status-pill tone-${deviceTone}`}>{deviceStatus.includes('online') ? 'Online' : 'Offline'}</span>
            </div>

            <div className="device-metadata">
              <InfoField icon={<DevicesIcon />} label="Device Code" value={device?.device_code || 'Not Assigned'} />
              <InfoField icon={<RefreshIcon />} label="Status" value={device?.status || '-'} />
              <InfoField icon={<CalendarIcon />} label="Last Sync Time" value={formatDateTime(lastSyncTime)} />
            </div>

            {clinician.role === 'Admin' && (
              <div className="device-assign-panel">
                <div className="assign-panel-title">Assign Device</div>
                <div className="assign-panel-controls">
                  <input type="text" placeholder="ESP001" value={deviceCode} onChange={(e) => setDeviceCode(e.target.value)} />
                  <button type="button" className="assign-button" onClick={assignDevice}>Assign Device</button>
                </div>
              </div>
            )}
          </article>
        </section>

        <section className="dashboard-card trends-card">
          <div className="card-header trends-header">
            <div>
              <h2>Trend Analysis</h2>
              <p>Review live traces with the existing Recharts data pipeline</p>
            </div>
            <div className="chart-tabs" role="tablist" aria-label="Vital sign charts">
              {[
                { key: 'heart_rate', label: 'Heart Rate' },
                { key: 'spo2', label: 'SpO₂' },
                { key: 'temperature', label: 'Temperature' },
                { key: 'iv_fluid', label: 'IV Fluid' }
              ].map((tab) => (
                <button key={tab.key} type="button" className={`chart-tab ${activeChart === tab.key ? 'active' : ''}`} onClick={() => setActiveChart(tab.key)}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-panel">{renderActiveChart()}</div>
        </section>

        <section className="dashboard-card alerts-card">
          <div className="card-header">
            <div>
              <h2>Recent Alerts</h2>
              <p>Latest patient monitoring events</p>
            </div>
          </div>

          <div className="alerts-table-wrap">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Parameter</th>
                  <th>Value</th>
                  <th>Alert Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert, index) => {
                    const status = getAlertStatus(alert);
                    return (
                      <tr key={alert.alert_id || index}>
                        <td>{formatDateTime(alert.alert_time || alert.created_at)}</td>
                        <td>{getAlertParameter(alert)}</td>
                        <td>{getAlertValue(alert)}</td>
                        <td>{alert.alert_type || '-'}</td>
                        <td><span className={`status-pill tone-${getBadgeTone(status)}`}>{status}</span></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">No recent alerts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
