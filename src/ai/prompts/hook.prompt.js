const HOOK_CATEGORIES = ['curiosity', 'contrarian', 'story', 'question'];

// Gemini enforces this shape server-side via response_format - see ai.service.js
const HOOK_SCHEMA = {
  type: 'object',
  properties: {
    hooks: {
      type: 'array',
      minItems: 4,
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          category: { type: 'string', enum: HOOK_CATEGORIES },
          text: { type: 'string' },
        },
        required: ['category', 'text'],
      },
    },
  },
  required: ['hooks'],
};

function buildHookPrompt({ selectedAngleText, experienceNotes, tone, topic }) {
  const system =
    'You are a senior LinkedIn copywriter specializing in scroll-stopping opening lines ("hooks"). ' +
    'You write hooks only - never the full post. Every hook must be grounded in the specific angle ' +
    'and experience provided.';

  const prompt = `Generate exactly 4 hooks (opening lines) for a LinkedIn post, one per category, based on:

Topic: ${topic}
Tone: ${tone}
Selected Angle: "${selectedAngleText}"

Experience / Notes:
"""${experienceNotes}"""

Categories (write exactly one hook per category):
- curiosity: creates an open loop the reader wants closed
- contrarian: challenges a common assumption directly
- story: opens mid-scene with a concrete, specific moment
- question: opens with a sharp, non-generic question

Each hook must be 1-2 short lines, no more than 25 words, and must NOT restate the angle
verbatim - it should tease it.`;

  return { system, prompt, schema: HOOK_SCHEMA };
}

module.exports = { buildHookPrompt, HOOK_CATEGORIES, HOOK_SCHEMA };
