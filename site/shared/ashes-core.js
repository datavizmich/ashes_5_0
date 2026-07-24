import { ASHES_SQUADS } from "../data/ashes-squads.js";

export const CANONICAL_SITE_ORIGIN = "https://ashes-5-0.co.uk";
export const TEAM_DATA_VERSION = "ashes-5-0-data-v1";
export const CHALLENGE_RESULT_VERSION = "challenge-result-v1";
export const RESULT_SIMULATION_VERSION = "ashes-5-0-sim-v1";
export const DISPLAY_NAME_MAX = 40;
export const SUPPORTED_MODES = ["classic", "memory"];

export const XI_SLOTS = [
  { label: "Opener", accepts: ["Opener"], focus: "batting", row: 5, col: 2 },
  { label: "Opener", accepts: ["Opener"], focus: "batting", row: 5, col: 4 },
  { label: "#3", accepts: ["Top Order", "Middle Order"], focus: "batting", row: 4, col: 3 },
  { label: "#4", accepts: ["Middle Order", "Top Order", "All-rounder"], focus: "batting", row: 3, col: 2 },
  { label: "#5", accepts: ["Middle Order", "All-rounder", "Top Order"], focus: "batting", row: 3, col: 4 },
  { label: "WK", accepts: ["Wicketkeeper"], focus: "fielding", row: 2, col: 3 },
  { label: "AR", accepts: ["All-rounder"], focus: "mixed", row: 3, col: 1 },
  { label: "Spin", accepts: ["Spinner"], focus: "bowling", row: 2, col: 1 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 1 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 3 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 5 },
];

export function normalizePlayableMode(value) {
  if (value === "classic" || value === "memory") return value;
  return null;
}

export function sanitizePlainText(value, maxLength = 160) {
  return String(value ?? "")
    .replace(/[<>&]/gu, "")
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, maxLength);
}

export function normalizeDisplayName(value, maxLength = DISPLAY_NAME_MAX) {
  return sanitizePlainText(value, maxLength);
}

export function stablePlayerIdFromName(name) {
  const slug = String(name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
  return slug || "player";
}

export function buildCatalogFromSquads(squads) {
  return squads.flatMap((squad) =>
    squad.players.map((player, index) => ({
      ...player,
      id: `${squad.id}:${index}`,
      stableId: stablePlayerIdFromName(player.name),
      squadId: squad.id,
      squadLabel: squad.label,
      squadTeam: squad.team,
      squadYear: squad.year,
    })),
  );
}

export function slotAcceptsPlayer(slot, player) {
  return slot.accepts.some((role) => player.roles.includes(role));
}

export const ASHES_CATALOG = buildCatalogFromSquads(ASHES_SQUADS);
export const ASHES_CATALOG_INDEX_BY_ID = new Map(ASHES_CATALOG.map((player, index) => [player.id, index]));
export const ASHES_PLAYER_BY_ID = new Map(ASHES_CATALOG.map((player) => [player.id, player]));

const stablePlayers = new Map();
for (const player of ASHES_CATALOG) {
  const existing = stablePlayers.get(player.stableId);
  if (!existing) {
    stablePlayers.set(player.stableId, {
      id: player.stableId,
      name: player.name,
      roles: [...player.roles],
    });
    continue;
  }

  for (const role of player.roles) {
    if (!existing.roles.includes(role)) {
      existing.roles.push(role);
    }
  }
}

export const ASHES_PLAYERS = [...stablePlayers.values()].sort((left, right) => left.name.localeCompare(right.name));
export const ASHES_PLAYER_BY_STABLE_ID = new Map(ASHES_PLAYERS.map((player) => [player.id, player]));

export function lineupIdsToPlayers(lineupPlayerIds) {
  if (!Array.isArray(lineupPlayerIds)) return null;
  const lineup = lineupPlayerIds.map((playerId) => ASHES_PLAYER_BY_ID.get(playerId) ?? null);
  return lineup.every(Boolean) ? lineup : null;
}

export function validateLineupPlayerIds(lineupPlayerIds) {
  if (!Array.isArray(lineupPlayerIds) || lineupPlayerIds.length !== XI_SLOTS.length) {
    return null;
  }

  const lineup = lineupIdsToPlayers(lineupPlayerIds);
  if (!lineup) return null;

  const ids = lineup.map((player) => player.id);
  if (new Set(ids).size !== XI_SLOTS.length) {
    return null;
  }

  const valid = lineup.every((player, index) => slotAcceptsPlayer(XI_SLOTS[index], player));
  return valid ? lineup : null;
}

export function challengeUrlForId(challengeId) {
  return `${CANONICAL_SITE_ORIGIN}/c/${challengeId}`;
}

export function resultUrlForId(resultId) {
  return `${CANONICAL_SITE_ORIGIN}/r/${resultId}`;
}

export function leaderboardUrl() {
  return `${CANONICAL_SITE_ORIGIN}/leaderboard`;
}
