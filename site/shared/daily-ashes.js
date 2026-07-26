import {
  ASHES_CATALOG,
  ASHES_SQUAD_BY_ID,
  BEST_ASHES_PLAYER_BY_STABLE_ID,
  assignBestValidLineup,
  canAssignValidLineup,
  playerOverall,
  sanitizePlainText,
  stablePlayerIdFromName,
} from "./ashes-core.js";

export const DAILY_ATTEMPT_MODES = ["ranked", "practice"];
export const DAILY_TOTAL_ROLLS = 4;
export const DAILY_CHALLENGE_VERSION = "ashes-daily-v1";

const CATALOG_PLAYER_BY_SQUAD_AND_STABLE_ID = new Map(
  ASHES_CATALOG.map((player) => [`${player.squadId}:${player.stableId}`, player]),
);

function isoDate(value) {
  return String(value ?? "").slice(0, 10);
}

function challengeIdForDate(date) {
  return `daily-ashes-${date}`;
}

function buildChallengeDefinition(date, config) {
  return {
    id: challengeIdForDate(date),
    date,
    label: `Daily Ashes Challenge · ${date}`,
    challengeNumber: Number(date.replaceAll("-", "")),
    version: DAILY_CHALLENGE_VERSION,
    fixedPlayerStableIds: [...config.fixedPlayerStableIds],
    oppositionStableIds: [...config.oppositionStableIds],
    oppositionLabel: sanitizePlainText(config.oppositionLabel, 80) || "Historic opposition XI",
    conditions: {
      pitch: config.conditions?.pitch ?? "balanced",
      venue: sanitizePlainText(config.conditions?.venue, 80) || "Historic venue",
      venueLabel: sanitizePlainText(config.conditions?.venueLabel, 80) || sanitizePlainText(config.conditions?.venue, 80) || "Historic venue",
      summary: sanitizePlainText(config.conditions?.summary, 120) || "Balanced conditions",
    },
    rolls: config.rolls.map((roll, index) => ({
      rollNumber: index + 1,
      squadId: roll.squadId,
      eligibleStableIds: [...roll.eligibleStableIds],
    })),
  };
}

const DAILY_CHALLENGE_SCHEDULE = [
  buildChallengeDefinition("2026-07-26", {
    fixedPlayerStableIds: [
      "jack-hobbs",
      "alastair-cook",
      "don-bradman",
      "steve-smith",
      "adam-gilchrist",
      "shane-warne",
      "james-anderson",
    ],
    oppositionStableIds: [
      "herbert-sutcliffe",
      "victor-trumper",
      "ricky-ponting",
      "greg-chappell",
      "allan-border",
      "rod-marsh",
      "keith-miller",
      "bill-o-reilly",
      "pat-cummins",
      "glenn-mcgrath",
      "sydney-barnes",
    ],
    oppositionLabel: "Historic Australia greats",
    conditions: {
      pitch: "green",
      venue: "Lord's",
      venueLabel: "Lord's",
      summary: "Fresh Lord's surface with seam movement on day one.",
    },
    rolls: [
      {
        squadId: "eng-2005",
        eligibleStableIds: [
          "kevin-pietersen",
          "paul-collingwood",
          "andrew-flintoff",
          "steve-harmison",
          "matthew-hoggard",
        ],
      },
      {
        squadId: "aus-2006",
        eligibleStableIds: [
          "ricky-ponting",
          "michael-hussey",
          "andrew-symonds",
          "brett-lee",
          "glenn-mcgrath",
        ],
      },
      {
        squadId: "eng-2019",
        eligibleStableIds: [
          "joe-root",
          "ben-stokes",
          "chris-woakes",
          "jofra-archer",
          "stuart-broad",
        ],
      },
      {
        squadId: "aus-2023",
        eligibleStableIds: [
          "marnus-labuschagne",
          "travis-head",
          "cameron-green",
          "pat-cummins",
          "mitchell-starc",
        ],
      },
    ],
  }),
];

const DAILY_CHALLENGE_BY_ID = new Map(DAILY_CHALLENGE_SCHEDULE.map((challenge) => [challenge.id, challenge]));
const DAILY_CHALLENGE_BY_DATE = new Map(DAILY_CHALLENGE_SCHEDULE.map((challenge) => [challenge.date, challenge]));

export function getDailyChallengeById(challengeId) {
  return DAILY_CHALLENGE_BY_ID.get(String(challengeId ?? "").trim()) ?? null;
}

export function getCurrentDailyChallenge(referenceDate = new Date()) {
  const dateText = isoDate(referenceDate instanceof Date ? referenceDate.toISOString() : referenceDate);
  const exact = DAILY_CHALLENGE_BY_DATE.get(dateText);
  if (exact) return exact;

  const sorted = [...DAILY_CHALLENGE_SCHEDULE].sort((left, right) => left.date.localeCompare(right.date));
  const latestPast = [...sorted].reverse().find((challenge) => challenge.date <= dateText);
  return latestPast ?? sorted[0] ?? null;
}

export function resolveBestAshesPlayer(stableId) {
  return BEST_ASHES_PLAYER_BY_STABLE_ID.get(stableId) ?? null;
}

export function resolveSquadPlayer(squadId, stableId) {
  return CATALOG_PLAYER_BY_SQUAD_AND_STABLE_ID.get(`${squadId}:${stableId}`) ?? null;
}

export function getDailyFixedPlayers(definition) {
  return definition.fixedPlayerStableIds
    .map((stableId) => resolveBestAshesPlayer(stableId))
    .filter(Boolean);
}

export function getDailyOppositionPlayers(definition) {
  return definition.oppositionStableIds
    .map((stableId) => resolveBestAshesPlayer(stableId))
    .filter(Boolean);
}

export function getDailyRoll(definition, rollNumber) {
  return definition.rolls.find((roll) => roll.rollNumber === Number(rollNumber)) ?? null;
}

export function normalizeDailySelections(selections) {
  return Array.isArray(selections)
    ? [...selections]
      .map((selection) => ({
        rollNumber: Number(selection.rollNumber),
        squadId: String(selection.squadId ?? ""),
        playerId: String(selection.playerId ?? ""),
        stableId: String(selection.stableId ?? stablePlayerIdFromName(selection.playerName ?? "")),
      }))
      .filter((selection) => selection.rollNumber >= 1 && selection.playerId && selection.stableId)
      .sort((left, right) => left.rollNumber - right.rollNumber)
    : [];
}

function lockedStableIds(definition, selections) {
  return new Set([
    ...definition.fixedPlayerStableIds,
    ...normalizeDailySelections(selections).map((selection) => selection.stableId),
  ]);
}

export function buildDailyPlayerPool(definition, selections) {
  const fixedPlayers = getDailyFixedPlayers(definition);
  const selectedPlayers = normalizeDailySelections(selections)
    .map((selection) => ASHES_CATALOG.find((player) => player.id === selection.playerId) ?? resolveBestAshesPlayer(selection.stableId))
    .filter(Boolean);
  return [...fixedPlayers, ...selectedPlayers];
}

export function buildDailyCompletedXI(definition, selections) {
  const pool = buildDailyPlayerPool(definition, selections);
  if (pool.length !== 11) return null;
  return assignBestValidLineup(pool);
}

function enumerateRemainingChoices(definition, startingSelections, rollNumber) {
  const usedStableIds = lockedStableIds(definition, startingSelections);
  const allSelections = normalizeDailySelections(startingSelections);

  function backtrack(nextRollNumber) {
    if (nextRollNumber > definition.rolls.length) {
      const pool = buildDailyPlayerPool(definition, allSelections);
      return canAssignValidLineup(pool);
    }

    const roll = getDailyRoll(definition, nextRollNumber);
    if (!roll) return false;

    for (const stableId of roll.eligibleStableIds) {
      if (usedStableIds.has(stableId)) continue;
      const player = resolveSquadPlayer(roll.squadId, stableId);
      if (!player) continue;
      usedStableIds.add(stableId);
      allSelections.push({
        rollNumber: roll.rollNumber,
        squadId: roll.squadId,
        playerId: player.id,
        stableId,
      });
      if (backtrack(nextRollNumber + 1)) {
        allSelections.pop();
        usedStableIds.delete(stableId);
        return true;
      }
      allSelections.pop();
      usedStableIds.delete(stableId);
    }

    return false;
  }

  return backtrack(rollNumber);
}

export function canSelectDailyPlayer(definition, selections, rollNumber, playerId) {
  const roll = getDailyRoll(definition, rollNumber);
  if (!roll || roll.rollNumber !== Number(rollNumber)) {
    return false;
  }

  const player = ASHES_CATALOG.find((candidate) => candidate.id === playerId);
  if (!player || player.squadId !== roll.squadId) {
    return false;
  }

  if (!roll.eligibleStableIds.includes(player.stableId)) {
    return false;
  }

  const used = lockedStableIds(definition, selections);
  if (used.has(player.stableId)) {
    return false;
  }

  const nextSelections = [
    ...normalizeDailySelections(selections),
    {
      rollNumber: roll.rollNumber,
      squadId: roll.squadId,
      playerId: player.id,
      stableId: player.stableId,
    },
  ];

  return enumerateRemainingChoices(definition, nextSelections, roll.rollNumber + 1);
}

export function getVisiblePlayersForRoll(definition, rollNumber, selections) {
  const roll = getDailyRoll(definition, rollNumber);
  if (!roll) return [];

  const used = lockedStableIds(definition, selections);
  return roll.eligibleStableIds
    .map((stableId) => resolveSquadPlayer(roll.squadId, stableId))
    .filter(Boolean)
    .map((player) => {
      if (used.has(player.stableId)) {
        return {
          ...player,
          selectable: false,
          unavailableReason: "Already locked into this XI.",
        };
      }

      const selectable = canSelectDailyPlayer(definition, selections, roll.rollNumber, player.id);
      return {
        ...player,
        selectable,
        unavailableReason: selectable
          ? ""
          : "This choice would leave no valid way to complete the XI.",
      };
    })
    .sort((left, right) => playerOverall(right) - playerOverall(left));
}

export function buildDailyRollPublicState(definition, rollNumber, selections) {
  const roll = getDailyRoll(definition, rollNumber);
  if (!roll) return null;
  const squad = ASHES_SQUAD_BY_ID.get(roll.squadId);
  if (!squad) return null;

  return {
    rollNumber: roll.rollNumber,
    squadId: roll.squadId,
    squadLabel: squad.label,
    squadTeam: squad.team,
    squadYear: squad.year,
    players: getVisiblePlayersForRoll(definition, roll.rollNumber, selections),
  };
}

export function buildDailyRecap(definition, selections) {
  const byRoll = new Map(normalizeDailySelections(selections).map((selection) => [selection.rollNumber, selection]));

  return definition.rolls.map((roll) => {
    const squad = ASHES_SQUAD_BY_ID.get(roll.squadId);
    const selected = byRoll.get(roll.rollNumber) ?? null;
    const selectedPlayer = selected ? ASHES_CATALOG.find((player) => player.id === selected.playerId) ?? null : null;
    return {
      rollNumber: roll.rollNumber,
      squadId: roll.squadId,
      squadLabel: squad?.label ?? roll.squadId,
      squadTeam: squad?.team ?? "",
      squadYear: squad?.year ?? "",
      selectedPlayer,
      players: roll.eligibleStableIds
        .map((stableId) => resolveSquadPlayer(roll.squadId, stableId))
        .filter(Boolean)
        .sort((left, right) => playerOverall(right) - playerOverall(left)),
    };
  });
}

function selectionOrderKey(selections) {
  return normalizeDailySelections(selections)
    .map((selection) => selection.stableId)
    .join("|");
}

function laterRoleOptions(definition, rollNumber, roles) {
  const laterRolls = definition.rolls.filter((roll) => roll.rollNumber > rollNumber);
  const roleSet = new Set(roles);

  return laterRolls.some((roll) =>
    roll.eligibleStableIds.some((stableId) => {
      const player = resolveSquadPlayer(roll.squadId, stableId);
      return player?.roles?.some((role) => roleSet.has(role));
    })
  );
}

export function buildDailyCommunityStats(definition, completedRankedAttempts, userSelections) {
  const attempts = Array.isArray(completedRankedAttempts)
    ? completedRankedAttempts.filter((attempt) => normalizeDailySelections(attempt.selections).length === definition.rolls.length)
    : [];
  const totalCompleted = attempts.length;
  const rolls = definition.rolls.map((roll) => {
    const counts = new Map();
    for (const attempt of attempts) {
      const selection = normalizeDailySelections(attempt.selections).find((entry) => entry.rollNumber === roll.rollNumber);
      if (!selection) continue;
      counts.set(selection.stableId, (counts.get(selection.stableId) ?? 0) + 1);
    }

    const players = roll.eligibleStableIds
      .map((stableId) => resolveSquadPlayer(roll.squadId, stableId))
      .filter(Boolean)
      .map((player) => {
        const count = counts.get(player.stableId) ?? 0;
        const percentage = totalCompleted ? Math.round((count / totalCompleted) * 100) : 0;
        return {
          ...player,
          count,
          percentage,
        };
      })
      .sort((left, right) => right.count - left.count || playerOverall(right) - playerOverall(left));

    return {
      rollNumber: roll.rollNumber,
      squadLabel: ASHES_SQUAD_BY_ID.get(roll.squadId)?.label ?? roll.squadId,
      selections: players,
      mostPopularSelection: players[0] ?? null,
    };
  });

  const userOrder = selectionOrderKey(userSelections);
  const sameFourChoicesCount = attempts.filter((attempt) => selectionOrderKey(attempt.selections) === userOrder).length;
  const sameFourChoicesPercentage = totalCompleted ? Math.round((sameFourChoicesCount / totalCompleted) * 100) : 0;

  const userSelectionShares = normalizeDailySelections(userSelections)
    .map((selection) => {
      const rollStats = rolls.find((roll) => roll.rollNumber === selection.rollNumber);
      const playerStats = rollStats?.selections?.find((player) => player.stableId === selection.stableId) ?? null;
      return {
        rollNumber: selection.rollNumber,
        player: ASHES_CATALOG.find((player) => player.id === selection.playerId) ?? null,
        percentage: playerStats?.percentage ?? 0,
        squadLabel: rollStats?.squadLabel ?? "",
      };
    })
    .filter((entry) => entry.player);

  const mostUnusualSelection = [...userSelectionShares].sort((left, right) => left.percentage - right.percentage)[0] ?? null;

  const roleCounts = new Map();
  for (const attempt of attempts) {
    for (const selection of normalizeDailySelections(attempt.selections)) {
      const player = ASHES_CATALOG.find((entry) => entry.id === selection.playerId);
      if (!player) continue;
      for (const role of player.roles) {
        if (!laterRoleOptions(definition, selection.rollNumber, [role])) continue;
        const entry = roleCounts.get(role) ?? { role, count: 0 };
        entry.count += 1;
        roleCounts.set(role, entry);
      }
    }
  }

  return {
    totalCompleted,
    rolls,
    sameFourChoicesPercentage,
    mostUnusualSelection,
    roleTimingStats: [...roleCounts.values()]
      .map((entry) => ({
        ...entry,
        percentage: totalCompleted ? Math.round((entry.count / totalCompleted) * 100) : 0,
      }))
      .sort((left, right) => right.count - left.count),
  };
}

export function buildDailyChallengeSummary(definition, rankedAttempt = null) {
  const fixedPlayers = getDailyFixedPlayers(definition);
  return {
    id: definition.id,
    date: definition.date,
    label: definition.label,
    challengeNumber: definition.challengeNumber,
    totalRolls: definition.rolls.length,
    fixedPlayers,
    opposition: {
      label: definition.oppositionLabel,
      summary: `${definition.oppositionLabel} under ${definition.conditions.venueLabel} conditions.`,
    },
    conditions: definition.conditions,
    rankedAttempt: rankedAttempt
      ? {
          attemptId: rankedAttempt.id,
          draftComplete: Boolean(rankedAttempt.draftComplete),
          simulationComplete: Boolean(rankedAttempt.simulationComplete),
          attemptMode: rankedAttempt.attemptMode,
          currentRollNumber: rankedAttempt.currentRollNumber,
        }
      : null,
  };
}
