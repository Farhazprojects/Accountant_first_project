require('dotenv').config();

// Startup validation — fail fast before accepting any connections
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
  process.exit(1);
}
if (!process.env.DB_PASSWORD && !process.env.DB_PASS) {
  console.error('❌ FATAL: DB_PASSWORD environment variable is not set. Refusing to start.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { sequelize } = require('./models');
const apiRoutes = require('./routes/index.js');
const cron = require('node-cron');
const RecurringWorkflowEngineService = require('./services/RecurringWorkflowEngineService');
const AutoAssignService = require('./services/AutoAssignService');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust the first proxy (nginx) so rate-limiter uses real client IPs via X-Forwarded-For
app.set('trust proxy', 1);

// Security: HTTP headers
app.use(helmet());

// Security: CORS — restrict to configured origin(s) in production
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:80', 'http://localhost'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS policy: origin ${origin} is not allowed`));
  },
  credentials: true,
}));

// Security: rate-limit authentication endpoints (10 attempts per 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);

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
    // In production use sync() without alter to avoid accidental schema changes.
    // Run sequelize-cli migrations for schema changes in production.
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
    } else {
      await sequelize.sync();
    }
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
