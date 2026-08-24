const { CONTENT_SCHEMA } = require('./content.prompt');

// The 12 actions from the vision doc. Each is a targeted edit, never a full
// regenerate - the prompt below always sends the CURRENT post and instructs
// the model to return every section, changing only what the action implies.
const IMPROVE_ACTIONS = {
  improve_hook: {
    label: 'Improve Hook',
    instruction: 'Rewrite ONLY the hook to be sharper and more scroll-stopping. Keep every other section byte-for-byte identical to the input.',
  },
  generate_new_hook: {
    label: 'Generate New Hook',
    instruction: 'Replace the hook with a genuinely different opening line - a different angle or style than the current one, not just a reword. Keep every other section byte-for-byte identical to the input.',
  },
  make_more_professional: {
    label: 'Make More Professional',
    instruction: 'Rewrite the ENTIRE post in a more professional, polished register. Keep the same facts, structure, and section order - only the voice changes.',
  },
  make_more_conversational: {
    label: 'Make More Conversational',
    instruction: 'Rewrite the ENTIRE post in a more conversational, casual register, like talking to a peer. Keep the same facts, structure, and section order - only the voice changes.',
  },
  make_more_technical: {
    label: 'Make More Technical',
    instruction: 'Rewrite the ENTIRE post in a more technical, precise register suited to a technical audience. Keep the same facts, structure, and section order - only the voice changes.',
  },
  shorten: {
    label: 'Shorten',
    instruction: 'Condense the ENTIRE post to roughly 60% of its current length. Keep the strongest specifics, cut filler, keep the same section order.',
  },
  expand: {
    label: 'Expand',
    instruction: 'Expand the ENTIRE post with more supporting detail and texture, grounded ONLY in the original experience notes provided below - do not invent new facts or numbers.',
  },
  improve_cta: {
    label: 'Improve CTA',
    instruction: 'Rewrite ONLY the CTA to be sharper and more likely to prompt a reply. Keep every other section byte-for-byte identical to the input.',
  },
  add_data_points: {
    label: 'Add Data Points',
    instruction: 'Revise the Experience and Insight sections to surface any concrete numbers, outcomes, or specifics already present in the original experience notes that the current draft left out. Do NOT invent numbers that are not implied by the experience notes. Keep every other section byte-for-byte identical to the input.',
  },
  generate_alternative_ending: {
    label: 'Generate Alternative Ending',
    instruction: 'Rewrite ONLY the Takeaway and CTA with a different closing angle than the current one. Keep Hook, Problem, Experience, and Insight byte-for-byte identical to the input.',
  },
  turn_into_story: {
    label: 'Turn Into Story',
    instruction: 'Restructure the ENTIRE post into a narrative, scene-driven story format, while keeping the same underlying facts and section labels (hook/problem/experience/insight/takeaway/cta).',
  },
  turn_into_case_study: {
    label: 'Turn Into Case Study',
    instruction: 'Restructure the ENTIRE post into a case-study format - lead with the setup, present the test/method, then the measurable result - while keeping the same underlying facts and section labels.',
  },
};

function buildImprovePrompt({ action, currentContent, experienceNotes, tone, audience }) {
  const config = IMPROVE_ACTIONS[action];
  if (!config) {
    throw new Error(`Unknown improve action: "${action}". Must be one of: ${Object.keys(IMPROVE_ACTIONS).join(', ')}`);
  }

  const system =
    'You are a senior LinkedIn ghostwriter doing a targeted edit pass on an existing post. ' +
    "You never invent facts beyond what's in the experience notes provided. You always return the " +
    'FULL post in the same 6-section shape, even for a single-section edit - sections the ' +
    'instruction does not mention must come back identical to the input.';

  const prompt = `Current post (JSON):
${JSON.stringify(
  {
    hook: currentContent.hook,
    problem: currentContent.problem,
    experience: currentContent.experience,
    insight: currentContent.insight,
    takeaway: currentContent.takeaway,
    cta: currentContent.cta,
  },
  null,
  2
)}

Original experience notes (source of truth for any facts/data):
"""${experienceNotes}"""

Tone: ${tone}
Audience: ${audience}

Edit instruction: ${config.instruction}

Return the complete updated post in the same shape, including fullText (the complete post with
each section separated by a blank line, ready to publish).`;

  return { system, prompt, schema: CONTENT_SCHEMA };
}

module.exports = { buildImprovePrompt, IMPROVE_ACTIONS };
