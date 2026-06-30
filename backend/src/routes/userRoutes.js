const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all users (for debug/dev)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, full_name, role, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// POST create a new user
router.post('/', async (req, res) => {
  try {
    const { user_id, full_name, password, role } = req.body;

    if (!full_name || !user_id || !password) {
      return res.status(400).json('full_name, userID and password are required');
    }

    // For now store provided password in password_hash column (dev only)
    const result = await pool.query(
      `INSERT INTO users (user_id, full_name, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, full_name, role, created_at`,
      [user_id, full_name, password, 'Clinician']
    );

    res.json(result.rows[0]);
  } catch (err) {
    // If DB throws (e.g. unique constraint), forward message
    res.status(500).json(err.message);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { user_id, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users
       WHERE user_id = $1
       AND password_hash = $2`,
      [user_id, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.put('/promote/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users
       SET role = 'Admin'
       WHERE user_id = $1
       RETURNING *`,
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.put('/demote/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users
       SET role = 'Clinician'
       WHERE user_id = $1
       RETURNING *`,
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.put('/reset-password/:id', async (req, res) => {
  try {

    const result = await pool.query(
      `UPDATE users
       SET password_hash = 'User@890'
       WHERE user_id = $1
       RETURNING user_id, full_name`,
      [req.params.id]
    );

    res.json({
      message: 'Password reset successfully',
      user: result.rows[0]
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {

    const result = await pool.query(
      `DELETE FROM users
       WHERE user_id = $1
       RETURNING user_id, full_name`,
      [req.params.id]
    );

    res.json({
      message: 'User deleted successfully',
      user: result.rows[0]
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
