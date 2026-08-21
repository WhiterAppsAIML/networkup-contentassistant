const mongoose = require('mongoose');

// Base model only - not wired to routes yet (Phase 2).
const frameworkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true }, // e.g. "Problem → Solution"
    structure: { type: [String], required: true }, // ordered section labels
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Framework', frameworkSchema);
