const mongoose = require('mongoose');

const ragDocumentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    sourceId: { type: String, required: true, index: true }, // e.g., "pricing.pdf", "case-study-1"
    sourceType: { type: String, enum: ['pdf', 'txt', 'md', 'url', 'manual'], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, // original text chunk
    embedding: { type: [Number], required: true, index: 'vector' }, // Atlas Vector Search
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    chunkIndex: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for user-scoped queries
ragDocumentSchema.index({ userId: 1, sourceId: 1 });

module.exports = mongoose.model('RagDocument', ragDocumentSchema);