const assert = require('node:assert');
const { safeParseJSON } = require('../src/utils/jsonParser');
const { buildAnglePrompt } = require('../src/ai/prompts/angle.prompt');
const { buildHookPrompt } = require('../src/ai/prompts/hook.prompt');
const { buildContentPrompt } = require('../src/ai/prompts/content.prompt');

// --- jsonParser -------------------------------------------------------

assert.deepStrictEqual(
  safeParseJSON('```json\n{"a":1}\n```'),
  { a: 1 },
  'safeParseJSON should strip markdown fences'
);

assert.deepStrictEqual(
  safeParseJSON('Here you go:\n{"angles":[1,2,3]}'),
  { angles: [1, 2, 3] },
  'safeParseJSON should extract JSON even with preamble text'
);

assert.strictEqual(
  safeParseJSON('not json at all'),
  null,
  'safeParseJSON should return null (not throw) on unparseable input'
);

// --- angle.prompt -------------------------------------------------------

const anglePrompt = buildAnglePrompt({
  contentGoal: 'Educate',
  postType: 'Case Study',
  topic: 'AI Prospecting',
  audience: 'Founders',
  experienceNotes: 'We tested AI Prospecting across 1000 leads.',
  tone: 'Founder Style',
});
assert.ok(anglePrompt.prompt.includes('1000 leads'), 'angle prompt should carry experienceNotes through verbatim');
assert.ok(anglePrompt.prompt.includes('exactly 5'), 'angle prompt should ask for exactly 5 angles');
assert.strictEqual(anglePrompt.schema.properties.angles.minItems, 5, 'angle schema should require exactly 5 items');
assert.deepStrictEqual(
  anglePrompt.schema.properties.angles.items.properties.type.enum,
  ['mistake', 'surprise', 'framework', 'contrarian', 'lessons'],
  'angle schema should enum-constrain the 5 angle types'
);

// --- hook.prompt -------------------------------------------------------

const hookPrompt = buildHookPrompt({
  selectedAngleText: 'The mistake we made automating too early',
  experienceNotes: 'We tested AI Prospecting across 1000 leads.',
  tone: 'Founder Style',
  topic: 'AI Prospecting',
});
['curiosity', 'contrarian', 'story', 'question'].forEach((cat) => {
  assert.ok(hookPrompt.prompt.includes(cat), `hook prompt should mention category "${cat}"`);
});
assert.strictEqual(hookPrompt.schema.properties.hooks.minItems, 4, 'hook schema should require exactly 4 items');

// --- content.prompt -------------------------------------------------------

const contentPrompt = buildContentPrompt({
  selectedHookText: 'We spent months optimizing the wrong thing.',
  selectedAngleText: 'The mistake we made',
  experienceNotes: 'We tested AI Prospecting across 1000 leads.',
  topic: 'AI Prospecting',
  audience: 'Founders',
  tone: 'Founder Style',
  postType: 'Case Study',
  cta: 'Ask Question',
});
assert.ok(
  contentPrompt.prompt.includes('We spent months optimizing the wrong thing.'),
  'content prompt should carry the exact selected hook text through unchanged'
);
assert.ok(
  contentPrompt.prompt.includes('Hook, Problem, Experience, Insight, Takeaway, CTA'),
  'content prompt should enforce the fixed section structure'
);
assert.deepStrictEqual(
  contentPrompt.schema.required,
  ['hook', 'problem', 'experience', 'insight', 'takeaway', 'cta', 'fullText'],
  'content schema should require all 7 section fields'
);

// "No CTA" should suppress the CTA instruction entirely
const noCtaPrompt = buildContentPrompt({
  selectedHookText: 'Hook text',
  selectedAngleText: 'Angle text',
  experienceNotes: 'Some notes here that are long enough.',
  topic: 'Topic',
  audience: 'Founders',
  tone: 'Professional',
  postType: 'Educational',
  cta: 'No CTA',
});
assert.ok(
  noCtaPrompt.prompt.includes('Do not include a CTA'),
  'content prompt should suppress the CTA instruction when cta is "No CTA"'
);

// --- improve.prompt (Module 6) -------------------------------------------------------

const { buildImprovePrompt, IMPROVE_ACTIONS } = require('../src/ai/prompts/improve.prompt');

assert.strictEqual(Object.keys(IMPROVE_ACTIONS).length, 12, 'improve.prompt should define all 12 actions from the vision doc');

const improvePrompt = buildImprovePrompt({
  action: 'shorten',
  currentContent: {
    hook: 'Hook text',
    problem: 'Problem text',
    experience: 'Experience text',
    insight: 'Insight text',
    takeaway: 'Takeaway text',
    cta: 'CTA text',
  },
  experienceNotes: 'We tested AI Prospecting across 1000 leads.',
  tone: 'Founder Style',
  audience: 'Founders',
});
assert.ok(improvePrompt.prompt.includes('Hook text'), 'improve prompt should include the current post content');
assert.ok(improvePrompt.prompt.includes('60%'), 'improve prompt should carry the shorten action\'s specific instruction');
assert.deepStrictEqual(
  improvePrompt.schema.required,
  ['hook', 'problem', 'experience', 'insight', 'takeaway', 'cta', 'fullText'],
  'improve schema should reuse the same 7-field content schema as Module 4'
);

assert.throws(
  () => buildImprovePrompt({ action: 'not_a_real_action', currentContent: {}, experienceNotes: 'x', tone: 'x', audience: 'x' }),
  'buildImprovePrompt should throw on an unknown action rather than silently produce a broken prompt'
);

// --- lead-magnet.prompt (Module 8) -------------------------------------------------------

const { buildLeadMagnetPrompt } = require('../src/ai/prompts/lead-magnet.prompt');

const leadMagnetPrompt = buildLeadMagnetPrompt({
  audience: 'SaaS Founders',
  problem: 'Low response rate',
  outcome: 'More meetings',
  assetType: 'Checklist',
  ctaGoal: 'Email Capture',
  topic: 'A checklist for auditing cold outbound before sending.',
});
assert.ok(leadMagnetPrompt.prompt.includes('Low response rate'), 'lead magnet prompt should carry the problem through');
assert.ok(leadMagnetPrompt.prompt.includes('exactly 3 emails'), 'lead magnet prompt should require exactly 3 emails');
assert.strictEqual(
  leadMagnetPrompt.schema.properties.emailSequence.minItems,
  3,
  'lead magnet schema should enforce exactly 3 emails structurally too'
);

console.log('\u2714 All smoke tests passed.');
