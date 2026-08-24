require('dotenv').config();

const required = ['GEMINI_API_KEY', 'MONGO_URI'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(
    `[env] Missing env vars: ${missing.join(', ')}. Server will still boot, but AI/DB-dependent routes will error until these are set in .env.`
  );
}

module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.7-flash',
  nodeEnv: process.env.NODE_ENV || 'development',
};
