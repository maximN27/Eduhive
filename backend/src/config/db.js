const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    const dbUri = uri || process.env.MONGODB_URI;
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

module.exports = connectDB;

