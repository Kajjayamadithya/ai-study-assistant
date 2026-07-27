const mongoose = require('mongoose');

/**
 * Connects Express application to MongoDB Atlas instance.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('your_mongodb_atlas_uri_here')) {
    console.warn('⚠️ MONGODB_URI is not set. Database persistence will be disabled.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(` MongoDB Atlas Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(` MongoDB Atlas Connection Error: ${error.message}`);
    return false;
  }
}

module.exports = connectDB;
