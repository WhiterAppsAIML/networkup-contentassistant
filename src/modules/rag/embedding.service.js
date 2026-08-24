const { GoogleGenAI } = require('@google/genai');
const { geminiApiKey } = require('../../config/env');
const logger = require('../../utils/logger');

const client = new GoogleGenAI({ apiKey: geminiApiKey });
const EMBEDDING_MODEL = 'text-embedding-004';
const EMBEDDING_DIMENSIONS = 768;

async function generateEmbedding(text) {
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured for embeddings');
  }

  try {
    const result = await client.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: { outputDimensionality: EMBEDDING_DIMENSIONS },
    });

    return result.embeddings[0].values;
  } catch (err) {
    logger.error('Embedding generation failed:', err.message);
    throw new Error(`Failed to generate embedding: ${err.message}`);
  }
}

async function generateEmbeddingsBatch(texts) {
  const embeddings = [];
  for (const text of texts) {
    embeddings.push(await generateEmbedding(text));
  }
  return embeddings;
}

module.exports = { generateEmbedding, generateEmbeddingsBatch, EMBEDDING_DIMENSIONS };