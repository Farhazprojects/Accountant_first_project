require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/index.js');
const cron = require('node-cron');
const RecurringWorkflowEngineService = require('./services/RecurringWorkflowEngineService');
const AutoAssignService = require('./services/AutoAssignService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads for local fallback development
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Accountant First API Engine is up and running!' });
});

app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message);
  res.status(500).json({
    error: 'An internal server error occurred. Please try again later.',
  });
});

const startServer = async () => {
  let dbConnected = false;
  try {
    await sequelize.authenticate();
    console.log('✅ Connected successfully to PostgreSQL database!');
    await sequelize.sync({ alter: true });
    dbConnected = true;
  } catch (err) {
    console.error('⚠️ Database connection failed:', err.message);
    console.error('Continuing to start the server without DB. Some endpoints may fail until DB is available.');
  }

  // Only schedule cron tasks if database connected
  if (dbConnected) {
    // Schedule recurring workflow generation (e.g., daily at 2 AM)
    cron.schedule('0 2 * * *', async () => {
      console.log('Running scheduled task: generateRecurringWorkflows');
      await RecurringWorkflowEngineService.generateRecurringWorkflows();
    });

    // Schedule auto-assignment of tasks (e.g., every 30 minutes)
    cron.schedule('*/30 * * * *', async () => {
      console.log('Running scheduled task: autoAssignTasksToStaff');
      await AutoAssignService.autoAssignTasksToStaff();
    });
  }

  // Attempt to listen on the desired port, but try fallback ports if in use
  const startPort = parseInt(PORT, 10) || 5000;
  const maxTries = 5;
  const tryListen = (port, attemptsLeft) => {
    const server = app.listen(port);
    server.on('listening', () => {
      console.log(`🚀 Backend Server is actively running on port ${port}`);
      if (!dbConnected) console.log('⚠️ Database not connected; operating in degraded mode.');
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
        console.warn(`Port ${port} in use, trying port ${port + 1}...`);
        tryListen(port + 1, attemptsLeft - 1);
      } else {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
      }
    });
  };

  tryListen(startPort, maxTries);
};

if (require.main === module) {
  startServer();
}

module.exports = app;
