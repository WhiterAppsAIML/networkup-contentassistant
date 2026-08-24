const LeadMagnet = require('../../models/LeadMagnet.model');
const AppError = require('../../utils/AppError');
const { generateJSON } = require('../../ai/ai.service');
const { buildLeadMagnetPrompt } = require('../../ai/prompts/lead-magnet.prompt');

// Unlike the main content pipeline, the vision doc describes lead magnets as
// a single form -> single output flow (no angle/hook staging), so create
// and generate happen in one call rather than a multi-step pipeline.
async function createAndGenerate(userId, payload) {
  const { system, prompt, schema } = buildLeadMagnetPrompt(payload);
  const result = await generateJSON({ system, prompt, schema, maxTokens: 2200, temperature: 0.75 });

  return LeadMagnet.create({
    userId,
    ...payload,
    generated: {
      title: result.title || '',
      outline: result.outline || [],
      landingPageCopy: result.landingPageCopy || '',
      emailSequence: result.emailSequence || [],
      linkedinPromotionPost: result.linkedinPromotionPost || '',
      cta: result.cta || '',
    },
    status: 'generated',
  });
}

async function getOrThrow(id, userId) {
  const lm = await LeadMagnet.findOne({ _id: id, userId });
  if (!lm) throw new AppError('Lead magnet not found.', 404);
  return lm;
}

async function list(userId, { page, limit }) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    LeadMagnet.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    LeadMagnet.countDocuments({ userId }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
}

module.exports = { createAndGenerate, getOrThrow, list };
