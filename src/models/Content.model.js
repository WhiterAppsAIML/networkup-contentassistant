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

const CONTENT_STATUSES = [
  'draft',
  'angles_generated',
  'hooks_generated',
  'hook_selected',
  'content_generated',
  'improved', // Module 6 — at least one Improve action has been applied
  'published',
  'archived',
];

const improvementSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // one of IMPROVE_ACTIONS keys, see improve.prompt.js
    appliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
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

    // Module 6 — Improve Content: every applied action, most recent last.
    // generatedContent above always holds the current version; this is the audit trail.
    improvementHistory: { type: [improvementSchema], default: [] },

    status: {
      type: String,
      enum: CONTENT_STATUSES,
      default: 'draft',
    },
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);
Content.STATUSES = CONTENT_STATUSES; // shared enum - library.schema.js reuses this instead of duplicating it

module.exports = Content;
