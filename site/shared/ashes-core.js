import { ASHES_SQUADS } from "../data/ashes-squads.js";
import { WORLD_CUP_SQUADS } from "../data/wc-squads.js";

export const CANONICAL_SITE_ORIGIN = "https://ashes-5-0.co.uk";
export const TEAM_DATA_VERSION = "ashes-5-0-data-v1";
export const CHALLENGE_RESULT_VERSION = "challenge-result-v1";
export const RESULT_SIMULATION_VERSION = "ashes-5-0-sim-v1";
export const DISPLAY_NAME_MAX = 40;
export const SUPPORTED_MODES = ["classic", "memory"];
export const SUPPORTED_COMPETITIONS = ["ashes", "worldcup"];

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

export function normalizeCompetition(value) {
  if (value === "worldcup") return "worldcup";
  if (value === "ashes") return "ashes";
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

export function playerOverall(player) {
  return Math.round(player.batting * 0.4 + player.bowling * 0.3 + player.fielding * 0.2 + player.experience * 0.1);
}

export function playerSlotScore(player, slot) {
  const roleBonus = slotAcceptsPlayer(slot, player) ? 22 : 0;
  const batting = player.batting * 0.35;
  const bowling = player.bowling * 0.35;
  const fielding = player.fielding * 0.2;
  const experience = player.experience * 0.1;

  if (slot.focus === "batting") return batting + fielding + experience + roleBonus;
  if (slot.focus === "bowling") return bowling + fielding + experience + roleBonus;
  return batting * 0.35 + bowling * 0.35 + fielding * 0.2 + experience * 0.1 + roleBonus;
}

export const ASHES_CATALOG = buildCatalogFromSquads(ASHES_SQUADS);
export const ASHES_CATALOG_INDEX_BY_ID = new Map(ASHES_CATALOG.map((player, index) => [player.id, index]));
export const ASHES_PLAYER_BY_ID = new Map(ASHES_CATALOG.map((player) => [player.id, player]));
export const ASHES_SQUAD_BY_ID = new Map(ASHES_SQUADS.map((squad) => [squad.id, squad]));
export const WORLD_CUP_CATALOG = buildCatalogFromSquads(WORLD_CUP_SQUADS);
export const WORLD_CUP_PLAYER_BY_ID = new Map(WORLD_CUP_CATALOG.map((player) => [player.id, player]));
export const WORLD_CUP_SQUAD_BY_ID = new Map(WORLD_CUP_SQUADS.map((squad) => [squad.id, squad]));

function buildStablePlayerCollections(catalog) {
  const stablePlayers = new Map();
  const bestCatalogPlayers = new Map();
  for (const player of catalog) {
    const existing = stablePlayers.get(player.stableId);
    if (!existing) {
      stablePlayers.set(player.stableId, {
        id: player.stableId,
        name: player.name,
        roles: [...player.roles],
      });
    } else {
      for (const role of player.roles) {
        if (!existing.roles.includes(role)) {
          existing.roles.push(role);
        }
      }
    }

    const bestExisting = bestCatalogPlayers.get(player.stableId);
    if (!bestExisting || playerOverall(player) > playerOverall(bestExisting)) {
      bestCatalogPlayers.set(player.stableId, player);
    }
  }

  const players = [...stablePlayers.values()].sort((left, right) => left.name.localeCompare(right.name));
  return {
    players,
    playerByStableId: new Map(players.map((player) => [player.id, player])),
    bestPlayerByStableId: new Map(bestCatalogPlayers),
  };
}

const ashesStableCollections = buildStablePlayerCollections(ASHES_CATALOG);
const worldCupStableCollections = buildStablePlayerCollections(WORLD_CUP_CATALOG);
const allStableCollections = buildStablePlayerCollections([...ASHES_CATALOG, ...WORLD_CUP_CATALOG]);

export const ASHES_PLAYERS = ashesStableCollections.players;
export const ASHES_PLAYER_BY_STABLE_ID = ashesStableCollections.playerByStableId;
export const BEST_ASHES_PLAYER_BY_STABLE_ID = ashesStableCollections.bestPlayerByStableId;
export const WORLD_CUP_PLAYERS = worldCupStableCollections.players;
export const WORLD_CUP_PLAYER_BY_STABLE_ID = worldCupStableCollections.playerByStableId;
export const BEST_WORLD_CUP_PLAYER_BY_STABLE_ID = worldCupStableCollections.bestPlayerByStableId;
export const ALL_PLAYERS = allStableCollections.players;
export const ALL_PLAYER_BY_STABLE_ID = allStableCollections.playerByStableId;

export function catalogForCompetition(competition = "ashes") {
  return competition === "worldcup" ? WORLD_CUP_CATALOG : ASHES_CATALOG;
}

export function playerByIdForCompetition(competition = "ashes") {
  return competition === "worldcup" ? WORLD_CUP_PLAYER_BY_ID : ASHES_PLAYER_BY_ID;
}

export function squadByIdForCompetition(competition = "ashes") {
  return competition === "worldcup" ? WORLD_CUP_SQUAD_BY_ID : ASHES_SQUAD_BY_ID;
}

export function bestPlayerByStableIdForCompetition(competition = "ashes") {
  return competition === "worldcup" ? BEST_WORLD_CUP_PLAYER_BY_STABLE_ID : BEST_ASHES_PLAYER_BY_STABLE_ID;
}

export function lineupIdsToPlayers(lineupPlayerIds) {
  return lineupIdsToPlayersForCompetition(lineupPlayerIds, "ashes");
}

export function lineupIdsToPlayersForCompetition(lineupPlayerIds, competition = "ashes") {
  if (!Array.isArray(lineupPlayerIds)) return null;
  const playerById = playerByIdForCompetition(competition);
  const lineup = lineupPlayerIds.map((playerId) => playerById.get(playerId) ?? null);
  return lineup.every(Boolean) ? lineup : null;
}

export function validateLineupPlayerIds(lineupPlayerIds) {
  return validateLineupPlayerIdsForCompetition(lineupPlayerIds, "ashes");
}

export function validateLineupPlayerIdsForCompetition(lineupPlayerIds, competition = "ashes") {
  if (!Array.isArray(lineupPlayerIds) || lineupPlayerIds.length !== XI_SLOTS.length) {
    return null;
  }

  const lineup = lineupIdsToPlayersForCompetition(lineupPlayerIds, competition);
  if (!lineup) return null;

  const ids = lineup.map((player) => player.id);
  if (new Set(ids).size !== XI_SLOTS.length) {
    return null;
  }

  const valid = lineup.every((player, index) => slotAcceptsPlayer(XI_SLOTS[index], player));
  return valid ? lineup : null;
}

export function assignBestValidLineup(players) {
  if (!Array.isArray(players) || players.length !== XI_SLOTS.length) {
    return null;
  }

  const pool = [...players];
  const seenStableIds = new Set();
  for (const player of pool) {
    const stableId = player?.stableId ?? stablePlayerIdFromName(player?.name ?? "");
    if (seenStableIds.has(stableId)) {
      return null;
    }
    seenStableIds.add(stableId);
  }

  const slotOrder = XI_SLOTS
    .map((slot, index) => ({
      slot,
      index,
      candidates: pool
        .map((player, playerIndex) => ({
          player,
          playerIndex,
          score: playerSlotScore(player, slot),
        }))
        .filter(({ player }) => slotAcceptsPlayer(slot, player))
        .sort((left, right) => right.score - left.score || playerOverall(right.player) - playerOverall(left.player)),
    }))
    .sort((left, right) => left.candidates.length - right.candidates.length);

  if (slotOrder.some((entry) => !entry.candidates.length)) {
    return null;
  }

  let bestAssignment = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  const used = new Array(pool.length).fill(false);
  const assignment = new Array(XI_SLOTS.length).fill(null);

  function search(orderIndex, score) {
    if (orderIndex >= slotOrder.length) {
      if (score > bestScore) {
        bestScore = score;
        bestAssignment = [...assignment];
      }
      return;
    }

    const { slot, index, candidates } = slotOrder[orderIndex];
    for (const candidate of candidates) {
      if (used[candidate.playerIndex]) continue;
      used[candidate.playerIndex] = true;
      assignment[index] = candidate.player;
      search(orderIndex + 1, score + playerSlotScore(candidate.player, slot));
      assignment[index] = null;
      used[candidate.playerIndex] = false;
    }
  }

  search(0, 0);
  return bestAssignment;
}

export function canAssignValidLineup(players) {
  return Boolean(assignBestValidLineup(players));
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
