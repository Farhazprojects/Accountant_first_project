const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use('/api/tasks', taskRoutes);

// Global Error Handler (Never expose stack traces per requirements)
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.message);
  res.status(500).json({ 
    error: 'An internal server error occurred. Please try again later.' 
  });
});

// Database Sync and Server Start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync models (Use { alter: true } for development, remove for production)
    await sequelize.sync({ alter: true });
    
    app.listen(PORT, () => {
      console.log(`Accountant First API is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();