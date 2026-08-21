const Content = require('../../models/Content.model');
const AppError = require('../../utils/AppError');
const { generateJSON } = require('../../ai/ai.service');
const { buildAnglePrompt } = require('../../ai/prompts/angle.prompt');

async function generateAngles(contentId, userId) {
  const content = await Content.findOne({ _id: contentId, userId });
  if (!content) throw new AppError('Content not found.', 404);

  const { system, prompt, schema } = buildAnglePrompt({
    contentGoal: content.contentGoal,
    postType: content.postType,
    topic: content.topic,
    audience: content.audience,
    experienceNotes: content.experienceNotes,
    tone: content.tone,
  });

  const result = await generateJSON({ system, prompt, schema, maxTokens: 1000, temperature: 0.8 });

  if (!Array.isArray(result.angles) || result.angles.length !== 5) {
    throw new AppError('AI did not return 5 angles as expected.', 502);
  }

  content.angles = result.angles.map((a) => ({ type: a.type, label: a.label, text: a.text }));
  content.selectedAngleId = null; // reset in case this is a regeneration
  content.status = 'angles_generated';
  await content.save();

  return content;
}

async function selectAngle(contentId, userId, angleId) {
  const content = await Content.findOne({ _id: contentId, userId });
  if (!content) throw new AppError('Content not found.', 404);

  const angle = content.angles.id(angleId);
  if (!angle) throw new AppError('Angle not found on this draft.', 404);

  content.selectedAngleId = angle._id;
  await content.save();
  return content;
}

module.exports = { generateAngles, selectAngle };
