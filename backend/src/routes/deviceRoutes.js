const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all devices with patient info
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.device_id,
        d.device_code,
        d.status,
        p.patient_id,
        p.full_name
      FROM devices d
      JOIN patients p
      ON d.patient_id = p.patient_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Test Route
router.get("/test", (req, res) => {
  res.send("Device Route Working");
});

router.get("/patient/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM devices WHERE patient_id = $1",
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/assign", async (req, res) => {
  try {
    const { patient_id, device_code } = req.body;

    const result = await pool.query(
      `INSERT INTO devices (patient_id, device_code)
       VALUES ($1, $2)
       RETURNING *`,
      [patient_id, device_code]
    );

    await pool.query(
      `
      UPDATE devices
      SET last_seen = NOW()
      WHERE device_code = $1
      `,
      [device_code]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;