// lib/aiJson.ts

/**
 * A robust function to find and parse a JSON object from a string.
 * It handles markdown code blocks and leading/trailing text.
 */
export function extractJsonFromText(text: string): string {
  // Try code-fenced JSON ```json ... ```
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenced && fenced[1]) return fenced[1].trim();

  // Try any fenced block ```
  const anyFence = text.match(/```\s*([\s\S]*?)\s*```/);
  if (anyFence && anyFence[1]) return anyFence[1].trim();

  // Fallback: best-effort first balanced {...} or [...]
  const firstBracket = text.indexOf('[');
  const firstBrace = text.indexOf('{');
  
  let startIndex = -1;
  if (firstBracket === -1) {
      startIndex = firstBrace;
  } else if (firstBrace === -1) {
      startIndex = firstBracket;
  } else {
      startIndex = Math.min(firstBracket, firstBrace);
  }
  
  if (startIndex === -1) {
      return ""; // No JSON found
  }
  
  const lastBracket = text.lastIndexOf(']');
  const lastBrace = text.lastIndexOf('}');
  
  const endIndex = Math.max(lastBracket, lastBrace);

  if (endIndex === -1 || endIndex < startIndex) {
       return ""; // No valid JSON structure ending
  }

  return text.substring(startIndex, endIndex + 1).trim();
}

/**
 * Safely parses a JSON string into a given type.
 * @param jsonStr The JSON string to parse.
 * @returns An object indicating success or failure with the data or an error message.
 */
export function safeParseJson<T>(jsonStr: string): { ok: true; data: T } | { ok: false; error: string } {
    if (!jsonStr) {
        return { ok: false, error: "Empty string provided for parsing." };
    }
    try {
        const data = JSON.parse(jsonStr) as T;
        return { ok: true, data };
    } catch (e: any) {
        return { ok: false, error: `JSON.parse error: ${e?.message || String(e)}` };
    }
}
