const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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
const aiLearningRoutes = require('./routes/aiLearningRoutes');
<<<<<<< HEAD
const aiRoutes = require('./routes/aiRoutes');
=======
const suggestionRoutes = require('./routes/suggestionRoutes');
>>>>>>> d752cdba909d5797a255efc4be0fcff08e4df843

const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://eduhive-lac.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (typeof origin === 'string' && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// API Routes Mount Points
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

app.use('/users', userRoutes);
app.use('/api/users', userRoutes);

app.use('/subjects', subjectRoutes);
app.use('/api/subjects', subjectRoutes);

app.use('/posts', postRoutes);
app.use('/api/posts', postRoutes);

app.use('/comments', commentRoutes);
app.use('/api/comments', commentRoutes);

app.use('/resources', resourceRoutes);
app.use('/api/resources', resourceRoutes);

app.use('/notifications', notificationRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/votes', voteRoutes);
app.use('/api/votes', voteRoutes);

app.use('/search', searchRoutes);
app.use('/api/search', searchRoutes);

app.use('/ai-learning', aiLearningRoutes);
app.use('/api/ai-learning', aiLearningRoutes);

<<<<<<< HEAD
app.use('/api/ai', aiRoutes);
=======
app.use('/api', suggestionRoutes);
>>>>>>> d752cdba909d5797a255efc4be0fcff08e4df843

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to EduHive REST API');
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
