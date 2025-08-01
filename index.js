const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: 'your_postgres_user', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'guestbook',
  password: 'your_postgres_password', // Replace with your PostgreSQL password
  port: 5432,
});

app.use(bodyParser.json());
app.use(express.static('public'));

// API endpoint to get all guestbook entries
app.get('/api/entries', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM entries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to add a new guestbook entry
app.post('/api/entries', async (req, res) => {
  try {
    const { name, message } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO entries (name, message) VALUES ($1, $2) RETURNING *',
      [name, message]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
