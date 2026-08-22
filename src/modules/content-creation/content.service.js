const Content = require('../../models/Content.model');
const Hook = require('../../models/Hook.model');
const AppError = require('../../utils/AppError');
const { generateJSON } = require('../../ai/ai.service');
const { buildContentPrompt } = require('../../ai/prompts/content.prompt');
const { checkContentQuality } = require('../ai-quality-check/quality-check.service');

async function createDraft(userId, payload) {
  return Content.create({ userId, ...payload, status: 'draft' });
}

async function getDraftOrThrow(contentId, userId) {
  const content = await Content.findOne({ _id: contentId, userId });
  if (!content) throw new AppError('Content not found.', 404);
  return content;
}

// Module 4 — Content Generation.
// Module 5 — AI Quality Check runs automatically after content generation.
async function generateContent(contentId, userId) {
  const content = await getDraftOrThrow(contentId, userId);

  if (!content.selectedAngleId) {
    throw new AppError('Select an angle before generating content.', 400);
  }
  if (!content.selectedHookId) {
    throw new AppError('Select a hook before generating content.', 400);
  }

  const selectedAngle = content.angles.id(content.selectedAngleId);
  if (!selectedAngle) {
    throw new AppError('Selected angle could not be found on this draft.', 400);
  }

  const hook = await Hook.findOne({ _id: content.selectedHookId, contentId: content._id });
  if (!hook) {
    throw new AppError('Selected hook could not be found on this draft.', 400);
  }

  const { system, prompt, schema } = buildContentPrompt({
    selectedHookText: hook.text,
    selectedAngleText: selectedAngle.text,
    experienceNotes: content.experienceNotes,
    topic: content.topic,
    audience: content.audience,
    tone: content.tone,
    postType: content.postType,
    cta: content.cta,
  });

  const result = await generateJSON({ system, prompt, schema, maxTokens: 1800, temperature: 0.75 });

  content.generatedContent = {
    hook: result.hook || '',
    problem: result.problem || '',
    experience: result.experience || '',
    insight: result.insight || '',
    takeaway: result.takeaway || '',
    cta: result.cta || '',
    fullText: result.fullText || '',
  };

  content.status = 'content_generated';

  await content.save();

  const qualityResult = await checkContentQuality(content._id, userId);

  content.qualityReview = {
    hookStrength: qualityResult.scores.hookStrength,
    specificity: qualityResult.scores.specificity,
    humanVoice: qualityResult.scores.humanVoice,
    credibility: qualityResult.scores.credibility,
    practicalValue: qualityResult.scores.practicalValue,
    readability: qualityResult.scores.readability,
    promotionalRisk: qualityResult.scores.promotionalRisk,
    overall: qualityResult.overall,
    autoImproved: false,
  };

  await content.save();

  hook.performance.timesUsed += 1;
  await hook.save();

  return content;
}

module.exports = { createDraft, getDraftOrThrow, generateContent };
