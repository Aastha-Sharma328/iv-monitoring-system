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
        p.full_name
      FROM alerts a
      LEFT JOIN patients p
      ON a.patient_id = p.patient_id
      ORDER BY a.alert_time DESC
    `);

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

module.exports = router;