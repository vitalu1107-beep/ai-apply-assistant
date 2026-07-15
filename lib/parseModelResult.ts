import { normalizeGenerateResult } from "./normalizeGenerateResult";

function stripCodeFence(content: string) {
  return content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function extractJsonObject(content: string) {
  const start = content.indexOf("{");
  if (start < 0) {
    return "";
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < content.length; index += 1) {
    const char = content[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return content.slice(start, index + 1);
      }
    }
  }

  return "";
}

function tryParseJson(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function parseModelResult(rawText: string) {
  const direct = tryParseJson(rawText);
  if (direct) {
    return normalizeGenerateResult(direct);
  }

  const withoutFence = stripCodeFence(rawText);
  const fenced = tryParseJson(withoutFence);
  if (fenced) {
    return normalizeGenerateResult(fenced);
  }

  const extracted = extractJsonObject(withoutFence);
  const embedded = extracted ? tryParseJson(extracted) : null;
  if (embedded) {
    return normalizeGenerateResult(embedded);
  }

  throw new Error("模型返回格式异常，请重新生成。");
}
