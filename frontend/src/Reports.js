import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PageLayout from "./components/PageLayout";
import "./Reports.css";

export default function Reports() {

const [patients, setPatients] = useState([]);
const [selectedPatient, setSelectedPatient] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [summary, setSummary] = useState(null);
const [vitals, setVitals] = useState([]);

  const generateReport = async () => {
  try {

    const summaryRes = await axios.get(
      `http://localhost:5000/report/patient-summary`,
      {
        params: {
          patientId: selectedPatient,
          from: fromDate,
          to: toDate
        }
      }
    );

    const vitalsRes = await axios.get(
      `http://localhost:5000/report/patient-vitals`,
      {
        params: {
          patientId: selectedPatient,
          from: fromDate,
          to: toDate
        }
      }
    );

    setSummary(summaryRes.data);
    setVitals(vitalsRes.data);

  } catch (err) {
    console.error(err);
  }
};

const exportCSV = () => {

  if (vitals.length === 0) {
    alert("No report data available");
    return;
  }

const headers =
  "Time,Heart Rate,SpO2,Temperature,IV Fluid\n";

const rows = vitals.map((vital) =>
  [
    new Date(vital.recorded_at).toLocaleString(),
    vital.heart_rate,
    vital.spo2,
    vital.temperature,
    vital.weight
  ].join(",")
  );

  const csvContent =
    headers + rows.join("\n");

  const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const link =
    document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download =
    `Patient_Report_${selectedPatient}.csv`;

  link.click();
};

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/report/patients"
      );

      console.log("PATIENTS API:", res.data);

      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

const exportPDF = () => {

  if (vitals.length === 0) {
    alert("No report data available");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(
    "IAF Vital Monitoring System",
    14,
    20
  );

  doc.setFontSize(12);

  doc.text(
    `Patient ID: ${selectedPatient}`,
    14,
    35
  );

  doc.text(
    `Period: ${fromDate} to ${toDate}`,
    14,
    43
  );

  doc.text(
    `Avg HR: ${summary?.avg_hr || 0}`,
    14,
    55
  );

  doc.text(
    `Avg SpO2: ${summary?.avg_spo2 || 0}%`,
    14,
    63
  );

  doc.text(
    `Avg Temp: ${summary?.avg_temp || 0}°C`,
    14,
    71
  );

  autoTable(doc, {
    startY: 85,

    head: [[
      "Time",
      "Heart Rate",
      "SpO2",
      "Temperature",
      "IV Fluid"
    ]],

    body: vitals.map(v => [
      new Date(v.recorded_at)
        .toLocaleString(),
      v.heart_rate,
      v.spo2,
      v.temperature,
      v.weight
    ])
  });

  doc.save(
    `Patient_Report_${selectedPatient}.pdf`
  );
};

  return (
    <PageLayout
      activeItem="Reports"
      onNavigate={(item) => {
        if (item === "Dashboard")
          window.location.hash = "#/dashboard";

        if (item === "Reports")
          window.location.hash = "#/reports";

        if (item === "Logout") {
          localStorage.removeItem("clinician");
          window.location.hash = "#/";
        }
      }}
    >
      <div className="reports-page">
        <div className="reports-header">

  <div>
    <h1>Clinical Reports Center</h1>

    <p>
      Generate patient monitoring summaries, exports and audit-ready reports.
    </p>
  </div>

</div>

    <div className="report-filter-card">

  <div className="report-toolbar">

    <div className="report-filters">

      <div className="filter-group">
        <label>Patient</label>

        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">Select Patient</option>

          {patients.map((patient) => (
            <option
              key={patient.patient_id}
              value={patient.patient_id}
            >
              {patient.patient_code} - {patient.full_name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>From Date</label>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>To Date</label>

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

    </div>

    <div className="report-actions">

      <button onClick={generateReport}>
        Generate Report
      </button>

      <button onClick={exportCSV}>
        Export CSV
      </button>

      <button onClick={exportPDF}>
        Export PDF
      </button>

    </div>

  </div>

</div> {/* report-toolbar */}

{summary && (
  <div className="report-kpi-grid">
    <div className="report-kpi-card">
      <h4>Avg Heart Rate</h4>
      <h2>{summary.avg_hr || 0}</h2>
    </div>

    <div className="report-kpi-card">
      <h4>Avg SpO₂</h4>
      <h2>{summary.avg_spo2 || 0}%</h2>
    </div>

    <div className="report-kpi-card">
      <h4>Avg Temperature</h4>
      <h2>{summary.avg_temp || 0}°C</h2>
    </div>

    <div className="report-kpi-card">
      <h4>Min IV Fluid</h4>
      <h2>{summary.min_iv || 0} ml</h2>
    </div>

    <div className="report-kpi-card">
      <h4>Total Alerts</h4>
      <h2>{summary.total_alerts || 0}</h2>
    </div>

    <div className="report-kpi-card">
      <h4>Total Records</h4>
      <h2>{summary.total_records || 0}</h2>
    </div>
  </div>
)}

</div> {/* report-filter-card ends here */}
    </PageLayout>
  );
}