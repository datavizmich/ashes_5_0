import { normalizeDisplayName } from "../../site/shared/ashes-core.js";

const ALLOWED_DISPLAY_NAME_PATTERN = /^[\p{L}\p{N} ._'’-]+$/u;

const RESERVED_DISPLAY_NAMES = new Set([
  "admin",
  "administrator",
  "moderator",
  "mod",
  "support",
  "owner",
  "ashes50",
  "ashes5o",
  "ashesfiveo",
  "ashesfivezero",
]);

const BLOCKED_TERMS = [
  "arsehole",
  "asshole",
  "bastard",
  "bitch",
  "bollocks",
  "cock",
  "cunt",
  "dick",
  "fag",
  "faggot",
  "fuck",
  "fucker",
  "hitler",
  "motherfucker",
  "nazi",
  "nigger",
  "nigga",
  "penis",
  "porn",
  "prick",
  "pussy",
  "rape",
  "rapist",
  "shit",
  "slut",
  "spastic",
  "tosser",
  "twat",
  "vagina",
  "wank",
  "wanker",
  "whore",
];

const SUBSTITUTIONS = new Map([
  ["0", "o"],
  ["1", "i"],
  ["3", "e"],
  ["4", "a"],
  ["5", "s"],
  ["7", "t"],
  ["@", "a"],
  ["$", "s"],
  ["!", "i"],
]);

function normalizeForModeration(value) {
  return [...String(value ?? "")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()]
    .map((character) => SUBSTITUTIONS.get(character) ?? character)
    .join("");
}

function compactModerationText(value) {
  return normalizeForModeration(value).replace(/[^a-z0-9]+/gu, "");
}

export function validatePublicDisplayName(value, { allowBlank = true } = {}) {
  const normalized = normalizeDisplayName(value);
  if (!normalized) {
    if (allowBlank) return "";
    throw new Error("Display name is required.");
  }

  if (!ALLOWED_DISPLAY_NAME_PATTERN.test(normalized)) {
    throw new Error("Display name can only use letters, numbers, spaces, periods, apostrophes, hyphens, and underscores.");
  }

  const compact = compactModerationText(normalized);
  if (!compact) {
    if (allowBlank) return "";
    throw new Error("Display name is invalid.");
  }

  if (RESERVED_DISPLAY_NAMES.has(compact)) {
    throw new Error("That display name is reserved.");
  }

  if (BLOCKED_TERMS.some((term) => compact.includes(term))) {
    throw new Error("Display name contains language that is not allowed.");
  }

  return normalized;
}
