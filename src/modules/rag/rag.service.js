const RagDocument = require('../../models/RagDocument.model');
const { generateEmbedding, EMBEDDING_DIMENSIONS } = require('./embedding.service');
const AppError = require('../../utils/AppError');

function chunkText(text, maxChunkSize = 1000, overlap = 100) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += maxChunkSize - overlap;
  }
  return chunks;
}

async function addDocument(userId, { sourceId, sourceType, title, content, metadata, chunkIndex }) {
  const chunks = chunkText(content);
  const documents = [];

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);
    const doc = await RagDocument.create({
      userId,
      sourceId,
      sourceType,
      title,
      content: chunks[i],
      embedding,
      metadata,
      chunkIndex: chunkIndex + i,
    });
    documents.push(doc);
  }

  return documents;
}

async function addDocumentsBatch(userId, { documents }) {
  const allResults = [];
  for (const doc of documents) {
    const results = await addDocument(userId, doc);
    allResults.push(...results);
  }
  return allResults;
}

async function search(userId, { query, topK = 5, sourceId, minScore = 0.7 }) {
  const queryEmbedding = await generateEmbedding(query);

  const filter = { userId };
  if (sourceId) filter.sourceId = sourceId;

  const pipeline = [
    { $match: filter },
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: queryEmbedding,
        numCandidates: topK * 10,
        limit: topK,
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        sourceId: 1,
        sourceType: 1,
        title: 1,
        content: 1,
        metadata: 1,
        chunkIndex: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
    { $match: { score: { $gte: minScore } } },
  ];

  try {
    return await RagDocument.aggregate(pipeline);
  } catch (err) {
    if (err.message.includes('vector index')) {
      throw new AppError(
        'Atlas Vector Search index "vector_index" not found. Create it in MongoDB Atlas: ' +
        'Database > Atlas Search > Create Search Index > Vector Search. ' +
        `Path: "embedding", Dimensions: ${EMBEDDING_DIMENSIONS}, Similarity: cosine`,
        500
      );
    }
    throw err;
  }
}

async function list(userId, { page = 1, limit = 20, sourceId }) {
  const skip = (page - 1) * limit;
  const filter = { userId };
  if (sourceId) filter.sourceId = sourceId;

  const [items, total] = await Promise.all([
    RagDocument.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-embedding'),
    RagDocument.countDocuments(filter),
  ]);

  return { items, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) || 1 } };
}

async function removeBySource(userId, sourceId) {
  return RagDocument.deleteMany({ userId, sourceId });
}

async function removeById(userId, id) {
  const doc = await RagDocument.findOneAndDelete({ _id: id, userId });
  if (!doc) throw new AppError('Document not found.', 404);
}

module.exports = { addDocument, addDocumentsBatch, search, list, removeBySource, removeById };