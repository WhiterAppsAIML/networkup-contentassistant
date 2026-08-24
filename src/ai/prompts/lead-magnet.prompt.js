// Gemini enforces this shape server-side via response_format - see ai.service.js
const LEAD_MAGNET_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    outline: { type: 'array', items: { type: 'string' } },
    landingPageCopy: { type: 'string' },
    emailSequence: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        properties: { subject: { type: 'string' }, body: { type: 'string' } },
        required: ['subject', 'body'],
      },
    },
    linkedinPromotionPost: { type: 'string' },
    cta: { type: 'string' },
  },
  required: ['title', 'outline', 'landingPageCopy', 'emailSequence', 'linkedinPromotionPost', 'cta'],
};

function buildLeadMagnetPrompt({ audience, problem, outcome, assetType, ctaGoal, topic }) {
  const system =
    'You are a senior B2B lead-generation copywriter. You build complete lead magnet packages: ' +
    'the asset outline, landing page copy, a 3-email nurture sequence, and a LinkedIn post ' +
    'promoting it. Everything must stay grounded in the stated audience, problem, and outcome - ' +
    'no generic filler.';

  const prompt = `Build a complete lead magnet package:

Audience: ${audience}
Problem it solves: ${problem}
Outcome it promises: ${outcome}
Asset type: ${assetType}
CTA goal: ${ctaGoal}
Topic / description: ${topic}

Produce:
- title: a specific, benefit-driven title for the ${assetType}
- outline: 5-8 bullet points covering what the ${assetType} actually contains
- landingPageCopy: short landing page copy (headline, 2-3 supporting lines, bullet list of what's inside) written to convert "${audience}" who have "${problem}"
- emailSequence: exactly 3 emails (delivery email, value/reminder email, final nudge email) nurturing toward the CTA goal of "${ctaGoal}"
- linkedinPromotionPost: a short LinkedIn post promoting this lead magnet, written to drive the CTA goal
- cta: the exact call-to-action line used across the assets, aimed at "${ctaGoal}"`;

  return { system, prompt, schema: LEAD_MAGNET_SCHEMA };
}

module.exports = { buildLeadMagnetPrompt, LEAD_MAGNET_SCHEMA };
