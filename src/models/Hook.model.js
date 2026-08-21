const mongoose = require('mongoose');

const hookSchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    category: {
      type: String,
      enum: ['curiosity', 'contrarian', 'story', 'question'],
      required: true,
    },
    text: { type: String, required: true },
    performance: {
      timesUsed: { type: Number, default: 0 },
      avgEngagement: { type: Number, default: null }, // populated once Analytics (Module 11) exists
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hook', hookSchema);
