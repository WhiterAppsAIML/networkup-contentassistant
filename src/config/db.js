const mongoose = require('mongoose');
const { mongoUri } = require('./env');
const logger = require('../utils/logger');

mongoose.set('strictQuery', true);
// Fail fast instead of silently queueing queries forever when not connected -
// without this, a hit to a DB-backed route with no Mongo configured just hangs.
mongoose.set('bufferCommands', false);

async function connectDB() {
  if (!mongoUri) {
    logger.warn('MONGO_URI not set — skipping DB connection. Content/Hook persistence will fail until configured.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected');
  } catch (err) {
    logger.error('MongoDB connection failed:', err.message);
  }
}

module.exports = connectDB;
