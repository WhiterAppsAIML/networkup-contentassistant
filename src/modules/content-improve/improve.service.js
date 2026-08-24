const Content = require('../../models/Content.model');
const AppError = require('../../utils/AppError');
const { generateJSON } = require('../../ai/ai.service');
const { buildImprovePrompt } = require('../../ai/prompts/improve.prompt');

// Content must have gone through Module 4 (or a prior improve pass) before
// it can be improved again - there's nothing to edit otherwise.
const IMPROVABLE_STATUSES = ['content_generated', 'improved'];

async function improveContent(contentId, userId, action) {
  const content = await Content.findOne({ _id: contentId, userId });
  if (!content) throw new AppError('Content not found.', 404);

  if (!IMPROVABLE_STATUSES.includes(content.status)) {
    throw new AppError('Generate content (Module 4) before requesting an improvement.', 400);
  }

  const { system, prompt, schema } = buildImprovePrompt({
    action,
    currentContent: content.generatedContent,
    experienceNotes: content.experienceNotes,
    tone: content.tone,
    audience: content.audience,
  });

  const result = await generateJSON({ system, prompt, schema, maxTokens: 1800, temperature: 0.7 });

  content.generatedContent = {
    hook: result.hook || '',
    problem: result.problem || '',
    experience: result.experience || '',
    insight: result.insight || '',
    takeaway: result.takeaway || '',
    cta: result.cta || '',
    fullText: result.fullText || '',
  };
  content.improvementHistory.push({ action, appliedAt: new Date() });
  content.status = 'improved';
  await content.save();

  return content;
}

module.exports = { improveContent };
