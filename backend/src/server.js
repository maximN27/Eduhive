const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduHive API Server is running' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to EduHive API');
});

const PORT = process.env.PORT || 5000;

// Start Server & Connect Database
const startServer = async () => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else {
    console.warn('Warning: MONGODB_URI is not defined in environment. Skipping database connection.');
  }

  app.listen(PORT, () => {
    console.log(`EduHive Backend Server running on port ${PORT}`);
  });
};

startServer();
