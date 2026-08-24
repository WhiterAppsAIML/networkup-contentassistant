/**
 * AI models don't reliably return pure JSON — they wrap it in ```json fences,
 * add a sentence of preamble, etc. This extracts and parses the JSON payload
 * defensively and returns null (never throws) if it truly can't be parsed,
 * so callers can decide whether to retry.
 */
function safeParseJSON(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null;

  let cleaned = raw.trim();

  // Strip ```json ... ``` or ``` ... ``` fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');

  // Grab the outermost {...} or [...] in case the model added preamble/postamble text
  const firstBrace = cleaned.search(/[[{]/);
  const lastBrace = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
}

module.exports = { safeParseJSON };
