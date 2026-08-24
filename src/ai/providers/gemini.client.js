const { GoogleGenAI } = require('@google/genai');
const { geminiApiKey } = require('../../config/env');

const client = new GoogleGenAI({ apiKey: geminiApiKey });

module.exports = client;
