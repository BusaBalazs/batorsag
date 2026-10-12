import { CODE_PARAM } from "../config.js";

/** A QR tartalmából kinyeri a kódot: vagy egy link (?k=KÓD), vagy maga a nyers kód. */
export function extractCode(text) {
  const t = String(text ?? "").trim();
  try {
    const url = new URL(t);
    const k = url.searchParams.get(CODE_PARAM);
    if (k) return k.trim();
  } catch {
    /* nem URL – nyers kód */
  }
  return t;
}

export const codesMatch = (a, b) =>
  String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
