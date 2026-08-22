const Content = require('../../models/Content.model');
const AppError = require('../../utils/AppError');
const { generateJSON } = require('../../ai/ai.service');
const { buildQualityCheckPrompt } = require('../../ai/prompts/quality-check.prompt');

const QUALITY_DIMENSIONS = [
  'hookStrength',
  'specificity',
  'humanVoice',
  'credibility',
  'practicalValue',
  'readability',
  'promotionalRisk',
];

const WEAK_SCORE_THRESHOLD = 6;

function calculateOverall(scores) {
  const total = QUALITY_DIMENSIONS.reduce((sum, dimension) => {
    return sum + scores[dimension].score;
  }, 0);

  return Number((total / QUALITY_DIMENSIONS.length).toFixed(1));
}

function validateScores(result) {
  for (const dimension of QUALITY_DIMENSIONS) {
    const score = result?.[dimension]?.score;

    if (typeof score !== 'number' || score < 0 || score > 10) {
      throw new AppError(
        `AI returned an invalid ${dimension} score.`,
        502
      );
    }
  }
}

async function checkContentQuality(contentId, userId) {
  const content = await Content.findOne({ _id: contentId, userId });

  if (!content) {
    throw new AppError('Content not found.', 404);
  }

  if (!content.generatedContent?.fullText) {
    throw new AppError('Generate content before running the quality check.', 400);
  }

  const { system, prompt, schema } = buildQualityCheckPrompt({
    generatedContent: content.generatedContent,
    experienceNotes: content.experienceNotes,
    audience: content.audience,
    tone: content.tone,
  });

  const result = await generateJSON({
    system,
    prompt,
    schema,
    maxTokens: 1000,
    temperature: 0.2,
  });

  validateScores(result);

  const overall = calculateOverall(result);

  const weakDimensions = QUALITY_DIMENSIONS.filter(
    (dimension) => result[dimension].score < WEAK_SCORE_THRESHOLD
  );

  return {
    scores: result,
    overall,
    weakDimensions,
    needsImprovement: weakDimensions.length > 0,
  };
}

module.exports = {
  checkContentQuality,
  calculateOverall,
  validateScores,
  QUALITY_DIMENSIONS,
  WEAK_SCORE_THRESHOLD,
};