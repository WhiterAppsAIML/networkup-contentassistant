const mongoose = require('mongoose');

// Angles are embedded, not their own collection - the vision doc's Content
// Library (Module 7) only lists Content/Hooks/CTAs/Frameworks as tables, no
// separate Angles table, so they live as subdocuments on the draft that
// produced them.
const angleSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // mistake | surprise | framework | contrarian | lessons
    label: { type: String, required: true }, // e.g. "The mistake we made"
    text: { type: String, required: true },
  },
  { _id: true }
);

const contentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // placeholder until real auth lands

    // Module 1 — Create Content inputs
    contentGoal: { type: String, required: true },
    postType: { type: String, required: true },
    topic: { type: String, required: true },
    audience: { type: String, required: true },
    experienceNotes: { type: String, required: true }, // "most important field" per spec
    tone: { type: String, required: true },
    cta: { type: String, required: true },

    // Module 2 — Angle Generation
    angles: { type: [angleSchema], default: [] },
    selectedAngleId: { type: mongoose.Schema.Types.ObjectId, default: null },

    // Module 3 — Hook Generation (Hook documents live in their own collection)
    selectedHookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hook', default: null },

    // Module 4 — Content Generation
    generatedContent: {
      hook: { type: String, default: '' },
      problem: { type: String, default: '' },
      experience: { type: String, default: '' },
      insight: { type: String, default: '' },
      takeaway: { type: String, default: '' },
      cta: { type: String, default: '' },
      fullText: { type: String, default: '' },
    },

    status: {
      type: String,
      enum: ['draft', 'angles_generated', 'hooks_generated', 'hook_selected', 'content_generated', 'published', 'archived'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
