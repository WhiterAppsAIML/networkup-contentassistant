const mongoose = require('mongoose');

// Base model only - Module 7 (Content Library) endpoints that read/write this
// are Phase 2. Shipped now so Content Generation has somewhere to eventually
// log CTA performance without a schema migration later.
const ctaSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    type: { type: String, default: 'custom' }, // maps to Module 1's CTA enum, or 'custom'
    performance: {
      timesUsed: { type: Number, default: 0 },
      avgEngagement: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CTA', ctaSchema);
