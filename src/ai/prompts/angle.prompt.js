const ANGLE_TYPES = [
  { type: 'mistake', label: 'The mistake we made' },
  { type: 'surprise', label: 'What surprised us' },
  { type: 'framework', label: 'A framework we discovered' },
  { type: 'contrarian', label: 'Why most companies do this wrong' },
  { type: 'lessons', label: 'Lessons from real implementation' },
];

// Gemini enforces this shape server-side via response_format - see ai.service.js
const ANGLE_SCHEMA = {
  type: 'object',
  properties: {
    angles: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['mistake', 'surprise', 'framework', 'contrarian', 'lessons'] },
          label: { type: 'string' },
          text: { type: 'string' },
        },
        required: ['type', 'label', 'text'],
      },
    },
  },
  required: ['angles'],
};

function buildAnglePrompt({ contentGoal, postType, topic, audience, experienceNotes, tone }) {
  const system =
    'You are a senior LinkedIn content strategist for B2B founders and sales/marketing leaders. ' +
    'You generate distinct content ANGLES - not full posts - that a user will choose between before ' +
    'any post is written. Every angle must be grounded in the specific experience the user provided, ' +
    'not generic advice.';

  const prompt = `Generate exactly 5 content angles for a LinkedIn post using this input:

Content Goal: ${contentGoal}
Post Type: ${postType}
Topic: ${topic}
Target Audience: ${audience}
Tone: ${tone}

Experience / Notes (ground every angle in this - do not invent facts not implied here):
"""${experienceNotes}"""

Generate exactly one angle per type, in this order:
1. mistake - "The mistake we made"
2. surprise - "What surprised us"
3. framework - "A framework we discovered"
4. contrarian - "Why most companies do this wrong"
5. lessons - "Lessons from real implementation"

For each angle, write a 1-2 sentence pitch of what that specific post would say, using real
specifics from the experience notes above (numbers, outcomes, specifics) - not vague statements.`;

  return { system, prompt, schema: ANGLE_SCHEMA };
}

module.exports = { buildAnglePrompt, ANGLE_TYPES, ANGLE_SCHEMA };
