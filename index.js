const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

dotenv.config()

const app = express();
app.use(cors());
const port = 3000;

// PostgreSQL connection pool
// const pool = new Pool({
//   user: 'postgres', // Replace with your PostgreSQL username
//   host: 'localhost',
//   database: 'guestbook',
//   password: 'Gopinath_7_moorthy', // Replace with your PostgreSQL password
//   port: 5432,
// });

// const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const pool = (() => {
// if (process.env.NODE_ENV !== 'production') {
//     return new Pool({
//         connectionString: process.env.DATABASE_URL,
//         ssl: false
//     });
// } else {
//     return new Pool({
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//             rejectUnauthorized: false
//           }
//     });
// } })();

module.exports = pool;

app.use(bodyParser.json());
app.use(express.static('public'));

// API endpoint to get all guestbook entries
// app.get('/api/entries', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM entries ORDER BY created_at DESC');
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // API endpoint to add a new guestbook entry
// app.post('/api/entries', async (req, res) => {
//   try {
//     const { name, message } = req.body;
//     const { rows } = await pool.query(
//       'INSERT INTO entries (name, message) VALUES ($1, $2) RETURNING *',
//       [name, message]
//     );
//     res.status(201).json(rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
app.get('/api/entries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM guestbook ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({err}); // return empty array on error
  }
});

app.post('/api/entries', async (req, res) => {
  const { name, message } = req.body;
  try {
    await pool.query('INSERT INTO guestbook (name, message) VALUES ($1, $2)', [name, message]);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error inserting entry');
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

