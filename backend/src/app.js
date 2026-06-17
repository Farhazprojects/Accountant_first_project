const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const apiRoutes = require('./routes/index.js'); // Import your newly created routes tracker

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Global Middleware Setup
app.use(cors());
app.use(express.json());

// 2. Setup Database Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'accountant_first_dev',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'your_postgres_password_here',
});

// Test Database Connection on Startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error acquiring client from pool:', err.stack);
  }
  console.log('✅ Connected successfully to PostgreSQL database!');
  release();
});

// 3. Mount Your Specialized Modular Routes
app.use('/api', apiRoutes); // This routes everything to src/routes/index.js (e.g., /api/auth/login)

// 4. Base Server Health Check Root
app.get('/', (req, res) => {
  res.json({ message: "Accountant First API Engine is up and running!" });
});

// 5. CRITICAL: Keeps the server container alive and listening
app.listen(PORT, () => {
  console.log(`🚀 Backend Server is actively running on port ${PORT}`);
});