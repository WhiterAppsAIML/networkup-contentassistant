const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
  { subject: { type: String, required: true }, body: { type: String, required: true } },
  { _id: false }
);

const leadMagnetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },

    // Module 8 inputs
    audience: { type: String, required: true },
    problem: { type: String, required: true },
    outcome: { type: String, required: true },
    assetType: { type: String, required: true },
    ctaGoal: { type: String, required: true },
    topic: { type: String, required: true },

    // Module 8 output: Title / Outline / Landing Page Copy / Email Sequence /
    // LinkedIn Promotion Post / CTA, per the vision doc
    generated: {
      title: { type: String, default: '' },
      outline: { type: [String], default: [] },
      landingPageCopy: { type: String, default: '' },
      emailSequence: { type: [emailSchema], default: [] },
      linkedinPromotionPost: { type: String, default: '' },
      cta: { type: String, default: '' },
    },

    status: { type: String, enum: ['draft', 'generated'], default: 'draft' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LeadMagnet', leadMagnetSchema);
