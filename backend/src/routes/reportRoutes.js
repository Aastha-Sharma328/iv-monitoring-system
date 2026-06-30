const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const PDFDocument =
require("pdfkit")

// Get all patients for dropdown
router.get("/patients", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
      patient_id,
      patient_code,
      full_name
      FROM patients
      ORDER BY patient_code
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Patient Report Summary
router.get("/patient-summary", async (req, res) => {
  try {
    const { patientId, from, to } = req.query;

    const summary = await pool.query(
      `
      SELECT
        ROUND(AVG(heart_rate),2) AS avg_hr,
        ROUND(AVG(spo2),2) AS avg_spo2,
        ROUND(AVG(temperature),2) AS avg_temp,
        MIN(weight) AS min_iv,
        COUNT(*) AS total_records
      FROM vitals
      WHERE patient_id = $1
      AND recorded_at BETWEEN $2 AND $3
      `,
      [patientId, from, to]
    );

    const alerts = await pool.query(
      `
      SELECT COUNT(*) AS total_alerts
      FROM alerts
      WHERE patient_id = $1
      AND alert_time BETWEEN $2 AND $3
      `,
      [patientId, from, to]
    );

    res.json({
      ...summary.rows[0],
      total_alerts: alerts.rows[0].total_alerts
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Patient Vitals Report
router.get("/patient-vitals", async (req, res) => {
  try {
    const { patientId, from, to } = req.query;

    const result = await pool.query(
      `
      SELECT
        recorded_at,
        heart_rate,
        spo2,
        temperature,
        weight
      FROM vitals
      WHERE patient_id = $1
      AND recorded_at BETWEEN $2 AND $3
      ORDER BY recorded_at DESC
      `,
      [patientId, from, to]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Daily Summary Report
router.get("/daily-summary", async (req, res) => {
  try {
    const { date } = req.query;

    const vitals = await pool.query(
      `
      SELECT COUNT(*) AS total_vitals,
             COUNT(DISTINCT patient_id) AS patients_monitored
      FROM vitals
      WHERE DATE(recorded_at) = $1
      `,
      [date]
    );

    const alerts = await pool.query(
      `
      SELECT COUNT(*) AS total_alerts
      FROM alerts
      WHERE DATE(alert_time) = $1
      `,
      [date]
    );

    res.json({
      patients_monitored:
        vitals.rows[0].patients_monitored,
      total_vitals:
        vitals.rows[0].total_vitals,
      total_alerts:
        alerts.rows[0].total_alerts
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/export-pdf", async (req, res) => {
  try {
    const { patientId, from, to } = req.query;

    const patient = await pool.query(
      `
      SELECT *
      FROM patients
      WHERE patient_id = $1
      `,
      [patientId]
    );

    const vitals = await pool.query(
      `
      SELECT *
      FROM vitals
      WHERE patient_id = $1
      AND recorded_at BETWEEN $2 AND $3
      ORDER BY recorded_at DESC
      `,
      [patientId, from, to]
    );

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Patient_Report_${patientId}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20)
       .text("Patient Monitoring Report");

    doc.moveDown();

    doc.fontSize(12)
       .text(
         `Patient: ${patient.rows[0].full_name}`
       );

    doc.text(`Period: ${from} to ${to}`);

    doc.moveDown();

    vitals.rows.forEach((v) => {
      doc.text(
        `${v.recorded_at}
         | HR:${v.heart_rate}
         | SpO2:${v.spo2}
         | Temp:${v.temperature}
         | IV:${v.weight}`
      );
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;