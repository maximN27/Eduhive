const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Route Modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const voteRoutes = require('./routes/voteRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes Mount Points
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/search', searchRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduHive API Server is running' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to EduHive REST API');
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
