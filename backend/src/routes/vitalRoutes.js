const express = require("express");
const router = express.Router();
const pool = require("../config/db");



// add vitals
router.post("/", async (req, res) => {
  try {
    const { patient_id, heart_rate, spo2, temperature, weight } = req.body;

    console.log(req.body);

    const result = await pool.query(
      `INSERT INTO vitals (patient_id, heart_rate, spo2, temperature, weight) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, heart_rate, spo2, temperature, weight]
    );
    
// Alert Generation
const existingAlert = await pool.query(
`
SELECT *
FROM alerts
WHERE patient_id = $1
AND alert_type = 'HIGH_HEART_RATE'
AND alert_time >
NOW() - INTERVAL '1 minute'
`,
[patient_id]
);

if (
heart_rate > 120 &&
existingAlert.rows.length === 0
){
  await pool.query(
`
INSERT INTO alerts
(patient_id, alert_type, message)
VALUES
($1,$2,$3)
`,
[
patient_id,
"HIGH_HEART_RATE",
"Heart rate exceeded threshold"
]
);
}
 if (temperature > 38.0 || (temperature < 35.0 && temperature > 0.0)) {
  await pool.query(
    `INSERT INTO alerts (patient_id, alert_type, message) VALUES ($1, $2, $3)`,
    [patient_id, "HIGH_TEMPERATURE", "High body temperature detected"]
  );
}

if (weight < 100.0 && weight > 0) { 
  await pool.query(
    `INSERT INTO alerts (patient_id, alert_type, message) VALUES ($1, $2, $3)`,
    [patient_id, "LOW IV Fluid", "IV bottle below 100 ml"]
  );
}

console.log("Patient ID received:", patient_id);

const updateResult = await pool.query(
`
UPDATE devices
SET last_seen = NOW()
WHERE patient_id = $1
RETURNING *
`,
[patient_id]
);

console.log("Device updated:", updateResult.rows);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


// all vitals
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vitals");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/latest/:patientId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM vitals
       WHERE patient_id = $1
       ORDER BY recorded_at DESC
       LIMIT 1`,
      [req.params.patientId]
    );

    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/live/all", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        p.patient_code,
        d.device_code,

        CASE
          WHEN d.last_seen IS NOT NULL
          AND d.last_seen > NOW() - INTERVAL '5 seconds'
          THEN 'ACTIVE'
          ELSE 'OFFLINE'
        END AS status,

        v.heart_rate,
        v.spo2,
        v.temperature,
        v.weight,
        v.recorded_at

      FROM vitals v

      JOIN patients p
      ON v.patient_id = p.patient_id

      LEFT JOIN devices d
      ON p.patient_id = d.patient_id

      ORDER BY v.recorded_at DESC
      LIMIT 100
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/graph/:patientId", async (req, res) => {
  try {

    console.log("GRAPH ROUTE HIT");
    console.log("PATIENT ID:", req.params.patientId);

    const result = await pool.query(
      `
      SELECT
      heart_rate,
      spo2,
      temperature,
      weight,
      recorded_at
      FROM vitals
      WHERE patient_id = $1
      ORDER BY recorded_at DESC
      LIMIT 120
      `,
      [req.params.patientId]
    );

    console.log("ROWS FOUND:", result.rows.length);

    res.json(result.rows.reverse());

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// GET /vital/:patientId
router.get("/:patientId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vitals WHERE patient_id = $1 ORDER BY recorded_at DESC",
      [req.params.patientId]
    );

    res.json(result.rows);
  } catch (err) {
  console.error(err);
  res.status(500).send(err.message);
}
});

module.exports = router;