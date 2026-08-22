const QUALITY_CHECK_SCHEMA = {
  type: 'object',
  properties: {
    hookStrength: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        issue: { type: 'string' },
      },
      required: ['score', 'issue'],
    },
    specificity: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        issue: { type: 'string' },
      },
      required: ['score', 'issue'],
    },
    humanVoice: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        issue: { type: 'string' },
      },
      required: ['score', 'issue'],
    },
    credibility: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        issue: { type: 'string' },
      },
      required: ['score', 'issue'],
    },
    practicalValue: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        issue: { type: 'string' },
      },
      required: ['score', 'issue'],
    },
    readability: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        issue: { type: 'string' },
      },
      required: ['score', 'issue'],
    },
    promotionalRisk: {
      type: 'object',
      properties: {
        score: { type: 'number' },
        issue: { type: 'string' },
      },
      required: ['score', 'issue'],
    },
  },
  required: [
    'hookStrength',
    'specificity',
    'humanVoice',
    'credibility',
    'practicalValue',
    'readability',
    'promotionalRisk',
  ],
};

function buildQualityCheckPrompt({
  generatedContent,
  experienceNotes,
  audience,
  tone,
}) {
  const system =
    'You are a strict AI quality reviewer for LinkedIn content. ' +
    'Evaluate the provided post against the original context. ' +
    'Score every dimension from 0 to 10, where 10 is excellent. ' +
    'Be evidence-based and do not invent facts. ' +
    'For Promotional Risk, 10 means low promotional risk and 0 means highly promotional. ' +
    'Give a short issue when a dimension is weak; otherwise return an empty issue string. ' +
    'Return only JSON matching the provided schema.';

  const prompt = `Review the following LinkedIn post.

Original context:
Target Audience: ${audience}
Tone: ${tone}

Experience / Notes:
"""${experienceNotes}"""

Generated Post:
Hook: ${generatedContent.hook}
Problem: ${generatedContent.problem}
Experience: ${generatedContent.experience}
Insight: ${generatedContent.insight}
Takeaway: ${generatedContent.takeaway}
CTA: ${generatedContent.cta}
Full Text:
"""${generatedContent.fullText}"""

Score these 7 dimensions from 0 to 10:

1. Hook Strength
Evaluate whether the opening immediately creates interest, clearly signals value, and makes the reader want to continue.

2. Specificity
Evaluate whether the post contains concrete details, real examples, useful context, or specific observations rather than generic advice.

3. Human Voice
Evaluate whether the writing feels natural, personal, authentic, and consistent with the provided tone rather than generic AI-written copy.

4. Credibility
Evaluate whether claims are grounded in the provided experience/notes and whether the post avoids unsupported facts, exaggerated claims, or invented results.

5. Practical Value
Evaluate whether the reader gets a useful lesson, insight, framework, action, or takeaway.

6. Readability
Evaluate structure, paragraph length, clarity, flow, and whether the post is easy to scan on LinkedIn.

7. Promotional Risk
Evaluate whether the post feels overly promotional, sales-heavy, or like an advertisement. Score 10 when promotional risk is low and 0 when promotional risk is high.

For every dimension:
- Return a score between 0 and 10.
- Return a short issue if the score indicates a meaningful weakness.
- Return an empty string when there is no meaningful issue.

Do not calculate or return an overall score. The application will calculate the overall score from the seven dimension scores.`;

  return {
    system,
    prompt,
    schema: QUALITY_CHECK_SCHEMA,
  };
}

module.exports = {
  buildQualityCheckPrompt,
  QUALITY_CHECK_SCHEMA,
};