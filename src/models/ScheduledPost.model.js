const mongoose = require('mongoose');

// Base model only - not wired to routes yet (Phase 2).
const scheduledPostSchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
    userId: { type: String, required: true, index: true },
    scheduledFor: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'posted', 'cancelled', 'failed'], default: 'scheduled' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScheduledPost', scheduledPostSchema);
