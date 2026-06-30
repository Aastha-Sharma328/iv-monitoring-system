const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// GET /alert
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
a.*,
p.patient_code,
p.full_name,
v.heart_rate,
v.spo2,
v.temperature,
v.weight
FROM alerts a

LEFT JOIN patients p
ON a.patient_id = p.patient_id

LEFT JOIN (
  SELECT DISTINCT ON (patient_id)
    patient_id,
    heart_rate,
    spo2,
    temperature,
    weight
  FROM vitals
  ORDER BY patient_id, recorded_at DESC
) v
ON a.patient_id = v.patient_id

ORDER BY a.alert_time DESC`);

console.log(result.rows[0]);

 res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:patientId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM alerts WHERE patient_id = $1 ORDER BY alert_time DESC",
      [req.params.patientId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/fluid/count", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) AS count
      FROM alerts
      WHERE alert_type = 'LOW_IV_FLUID'
    `);

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;