const Content = require('../../models/Content.model');
const Hook = require('../../models/Hook.model');
const AppError = require('../../utils/AppError');
const { generateJSON } = require('../../ai/ai.service');
const { buildHookPrompt } = require('../../ai/prompts/hook.prompt');

async function generateHooks(contentId, userId) {
  const content = await Content.findOne({ _id: contentId, userId });
  if (!content) throw new AppError('Content not found.', 404);

  if (!content.selectedAngleId) {
    throw new AppError('Select an angle before generating hooks.', 400);
  }

  const selectedAngle = content.angles.id(content.selectedAngleId);
  if (!selectedAngle) throw new AppError('Selected angle could not be found on this draft.', 400);

  const { system, prompt, schema } = buildHookPrompt({
    selectedAngleText: selectedAngle.text,
    experienceNotes: content.experienceNotes,
    tone: content.tone,
    topic: content.topic,
  });

  const result = await generateJSON({ system, prompt, schema, maxTokens: 700, temperature: 0.85 });

  if (!Array.isArray(result.hooks) || result.hooks.length !== 4) {
    throw new AppError('AI did not return 4 hooks as expected.', 502);
  }

  // Hooks are their own collection (Module 7's library), so regenerating
  // adds a new batch rather than overwriting - history is kept intentionally.
  const hooks = await Hook.insertMany(
    result.hooks.map((h) => ({
      contentId: content._id,
      category: h.category,
      text: h.text,
    }))
  );

  content.status = 'hooks_generated';
  await content.save();

  return hooks;
}

async function selectHook(contentId, userId, hookId) {
  const content = await Content.findOne({ _id: contentId, userId });
  if (!content) throw new AppError('Content not found.', 404);

  const hook = await Hook.findOne({ _id: hookId, contentId: content._id });
  if (!hook) throw new AppError('Hook not found on this draft.', 404);

  content.selectedHookId = hook._id;
  content.status = 'hook_selected';
  await content.save();

  return content;
}

module.exports = { generateHooks, selectHook };
