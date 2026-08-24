// Maps Module 1's CTA dropdown enum to a real copy direction, so the model
// isn't left to invent a CTA that doesn't match what the user actually picked.
const CTA_COPY_MAP = {
  'No CTA': '',
  'Ask Question': 'What has worked best for you here?',
  'DM Me': "Want to talk through this? DM me and I'll walk you through it.",
  'Visit Website': 'Link in the comments if you want to dig deeper.',
  'Book Demo': 'Curious how this would work for you? Book a demo — link in comments.',
  'Download Resource': 'Grab the full breakdown — link in comments.',
};

// Gemini enforces this shape server-side via response_format - see ai.service.js
const CONTENT_SCHEMA = {
  type: 'object',
  properties: {
    hook: { type: 'string' },
    problem: { type: 'string' },
    experience: { type: 'string' },
    insight: { type: 'string' },
    takeaway: { type: 'string' },
    cta: { type: 'string' },
    fullText: { type: 'string' },
  },
  required: ['hook', 'problem', 'experience', 'insight', 'takeaway', 'cta', 'fullText'],
};

function buildContentPrompt({
  selectedHookText,
  selectedAngleText,
  experienceNotes,
  topic,
  audience,
  tone,
  postType,
  cta,
}) {
  const ctaCopy = CTA_COPY_MAP[cta] ?? '';

  const system =
    'You are a senior LinkedIn ghostwriter for B2B founders. You write in short, punchy, scannable ' +
    'paragraphs (1-3 lines each) - never dense blocks. You write ONLY in the section structure given. ' +
    "You never invent facts beyond what's provided in the experience notes.";

  const prompt = `Write a LinkedIn post using EXACTLY this structure, in this order: Hook, Problem, Experience, Insight, Takeaway, CTA.

Topic: ${topic}
Post Type: ${postType}
Target Audience: ${audience}
Tone: ${tone}

Use this hook EXACTLY as the opening line (do not rewrite it):
"${selectedHookText}"

Angle this post is built on: "${selectedAngleText}"

Experience / Notes (this is the ONLY source of facts/data - do not invent numbers or outcomes not implied here):
"""${experienceNotes}"""

${
  ctaCopy
    ? `End with a CTA in this direction (rewrite naturally in the post's voice, don't paste verbatim): "${ctaCopy}"`
    : 'Do not include a CTA - end on the takeaway.'
}

Section guidance:
- Hook: use the exact line given above
- Problem: 1-2 lines naming the common misconception or issue
- Experience: 2-4 lines on what was actually done/tested, grounded in the notes
- Insight: 1-3 lines on what the experience revealed
- Takeaway: 1-2 lines, the generalizable lesson
- CTA: 1 line (or omit if "No CTA")

Keep every paragraph short (1-3 lines) for LinkedIn readability. Do not use hashtags. Do not use
emojis unless the tone is explicitly casual.

fullText should be the complete post with each section separated by a blank line, ready to publish.`;

  return { system, prompt, schema: CONTENT_SCHEMA };
}

module.exports = { buildContentPrompt, CTA_COPY_MAP, CONTENT_SCHEMA };
