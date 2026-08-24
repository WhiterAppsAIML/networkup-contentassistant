const client = require('./providers/gemini.client');
const { geminiModel, geminiApiKey } = require('../config/env');
const { safeParseJSON } = require('../utils/jsonParser');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const DEFAULT_MAX_TOKENS = 1500;
const MAX_RETRIES = 2;

/**
 * Calls Gemini with a system instruction + input, returns raw output text.
 * Controllers never call the SDK directly - everything routes through here,
 * so Phase 3's RAG/Personal Memory modules can later inject retrieved
 * context or user style at this one seam instead of touching every
 * controller. Swapping providers again later (this file used to wrap
 * Anthropic) only ever means rewriting this file + providers/*.client.js -
 * prompts, services, and controllers are untouched.
 *
 * `schema` is optional - when passed, Gemini enforces the JSON shape
 * server-side via response_format (see angle/hook/content .prompt.js),
 * which is stricter than what was possible with prompt-only JSON
 * instructions. safeParseJSON below is kept anyway as defense in depth.
 */
async function callModel({ system, prompt, schema, maxTokens = DEFAULT_MAX_TOKENS, temperature = 0.7 }) {
  if (!geminiApiKey) {
    throw new AppError('GEMINI_API_KEY is not configured.', 500);
  }

  try {
    const interaction = await client.interactions.create({
      model: geminiModel,
      input: prompt,
      system_instruction: system,
      generation_config: {
        // max_output_tokens + thinking_level are confirmed against the
        // installed @google/genai SDK's own type definitions.
        max_output_tokens: maxTokens,
        thinking_level: 'low', // fast structured generation, not multi-step reasoning
        // temperature is confirmed working here in Google's official docs
        // (ai.google.dev/gemini-api/docs/text-generation, checked 2026-08),
        // though it isn't listed in this SDK version's strict generation_config
        // type - if it's ever silently ignored, that discrepancy is why.
        temperature,
      },
      ...(schema
        ? {
            response_format: {
              type: 'text',
              mime_type: 'application/json',
              schema,
            },
          }
        : {}),
    });

    return interaction.output_text || '';
  } catch (err) {
    logger.error('AI call failed:', err.message);
    throw new AppError('AI generation failed. Please try again.', 502, err.message);
  }
}

/**
 * Calls the model and expects strict JSON back. With a schema passed,
 * Gemini should already return valid JSON matching it - this retry loop
 * is a safety net for the rare malformed response rather than the primary
 * mechanism it was with prompt-only JSON enforcement.
 */
async function generateJSON({ system, prompt, schema, maxTokens, temperature }) {
  let lastRaw = '';

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const currentPrompt =
      attempt === 0
        ? prompt
        : `${prompt}\n\nYour previous response could not be parsed as valid JSON. Respond again with ONLY valid JSON, no markdown fences, no preamble, no explanation.\n\nPrevious response:\n${lastRaw}`;

    // eslint-disable-next-line no-await-in-loop
    const raw = await callModel({ system, prompt: currentPrompt, schema, maxTokens, temperature });
    lastRaw = raw;

    const parsed = safeParseJSON(raw);
    if (parsed) return parsed;

    logger.warn(`AI JSON parse failed on attempt ${attempt + 1}/${MAX_RETRIES + 1}`);
  }

  throw new AppError('AI returned an unparseable response after retries.', 502);
}

module.exports = { callModel, generateJSON };
