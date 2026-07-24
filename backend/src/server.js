const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const postRoutes = require('./routes/postRoutes');
const voteRoutes = require('./routes/voteRoutes');
const searchRoutes = require('./routes/searchRoutes');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/subjects', subjectRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/posts', postRoutes);
app.use('/api/posts', postRoutes);
app.use('/votes', voteRoutes);
app.use('/api/votes', voteRoutes);
app.use('/search', searchRoutes);
app.use('/api/search', searchRoutes);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to EduHive API');
});

// Error & Not Found Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

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

if (require.main === module) {
  startServer();
}

module.exports = app;

