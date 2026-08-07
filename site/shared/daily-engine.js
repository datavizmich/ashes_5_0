import {
  XI_SLOTS,
  assignBestValidLineup,
  normalizeDisplayName,
  playerOverall,
  playerSlotScore,
  sanitizePlainText,
  slotAcceptsPlayer,
  stablePlayerIdFromName,
} from "./ashes-core.js";

export const DAILY_ATTEMPT_MODES = ["ranked", "practice"];
export const DAILY_TOTAL_ROLLS = 4;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

export function createDailyChallengeModule({
  catalog,
  playerById,
  squadById,
  bestPlayerByStableId,
  challengeVersion,
  challengeIdPrefix,
  challengeLabelPrefix,
  generatedOppositionLabel,
  conditions,
  scheduledChallenges,
}) {
  const catalogPlayerBySquadAndStableId = new Map(
    catalog.map((player) => [`${player.squadId}:${player.stableId}`, player]),
  );
  const bestPlayers = [...bestPlayerByStableId.values()];
  const dailyChallengeCache = new Map();
  const dailyGeneratedTemplateSlotSets = [
    [0, 1, 2, 5, 7, 8, 9],
    [0, 1, 4, 5, 7, 8, 9],
    [0, 1, 2, 5, 7, 8, 10],
  ];

  function isoDate(value) {
    return String(value ?? "").slice(0, 10);
  }

  function challengeIdForDate(date) {
    return `${challengeIdPrefix}-${date}`;
  }

  function createSeededRandom(seedText) {
    const text = String(seedText ?? "");
    let seed = 1779033703 ^ text.length;
    for (let index = 0; index < text.length; index += 1) {
      seed = Math.imul(seed ^ text.charCodeAt(index), 3432918353);
      seed = (seed << 13) | (seed >>> 19);
    }

    return () => {
      seed = Math.imul(seed ^ (seed >>> 16), 2246822507);
      seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
      seed ^= seed >>> 16;
      return (seed >>> 0) / 4294967296;
    };
  }

  function shuffle(values, rng) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function weightedPick(items, getWeight, rng) {
    const weighted = items
      .map((item) => ({
        item,
        weight: Math.max(0, Number(getWeight(item) ?? 0)),
      }))
      .filter((entry) => entry.weight > 0);
    if (!weighted.length) return null;

    const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    let remaining = rng() * total;
    for (const entry of weighted) {
      remaining -= entry.weight;
      if (remaining <= 0) return entry.item;
    }

    return weighted[weighted.length - 1]?.item ?? null;
  }

  function stableDateText(value) {
    const text = isoDate(value);
    return /^\d{4}-\d{2}-\d{2}$/u.test(text) ? text : "";
  }

  function rollEligibleCandidates(squadId, openSlotIndexes, excludedStableIds = new Set()) {
    return catalog
      .filter((player) =>
        player.squadId === squadId
        && !excludedStableIds.has(player.stableId)
        && openSlotIndexes.some((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], player)),
      )
      .sort((left, right) => playerOverall(right) - playerOverall(left));
  }

  function pickFixedAssignments(slotIndexes, seedText) {
    const rng = createSeededRandom(seedText);
    const assignments = [];
    const usedStableIds = new Set();

    for (const slotIndex of [...slotIndexes]) {
      const slot = XI_SLOTS[slotIndex];
      const candidates = bestPlayers
        .filter((player) => !usedStableIds.has(player.stableId) && slotAcceptsPlayer(slot, player))
        .sort((left, right) => playerSlotScore(right, slot) - playerSlotScore(left, slot) || playerOverall(right) - playerOverall(left))
        .slice(0, 18);

      const player = weightedPick(
        candidates,
        (candidate) => playerSlotScore(candidate, slot) * 2 + playerOverall(candidate),
        rng,
      );
      if (!player) return null;

      usedStableIds.add(player.stableId);
      assignments.push({
        slotIndex,
        stableId: player.stableId,
      });
    }

    return assignments.sort((left, right) => left.slotIndex - right.slotIndex);
  }

  function pickRollPlayersForSquad(squadId, openSlotIndexes, excludedStableIds, seedText) {
    const rng = createSeededRandom(seedText);
    const candidates = rollEligibleCandidates(squadId, openSlotIndexes, excludedStableIds);
    if (candidates.length < 5) return null;

    const remaining = [...candidates];
    const selected = [];
    const coveredSlots = new Set();

    while (selected.length < 5 && remaining.length) {
      remaining.sort((left, right) => {
        const leftSlots = openSlotIndexes.filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], left));
        const rightSlots = openSlotIndexes.filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], right));
        const leftUncovered = leftSlots.filter((slotIndex) => !coveredSlots.has(slotIndex)).length;
        const rightUncovered = rightSlots.filter((slotIndex) => !coveredSlots.has(slotIndex)).length;
        const leftScore = leftUncovered * 1000 + leftSlots.length * 140 + playerOverall(left) * 4 + rng() * 25;
        const rightScore = rightUncovered * 1000 + rightSlots.length * 140 + playerOverall(right) * 4 + rng() * 25;
        return rightScore - leftScore;
      });

      const next = remaining.shift();
      if (!next) break;
      selected.push(next);
      openSlotIndexes
        .filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], next))
        .forEach((slotIndex) => coveredSlots.add(slotIndex));
    }

    if (selected.length < 5) return null;
    return selected.map((player) => player.stableId);
  }

  function pickDailyRolls(fixedAssignments, seedText) {
    const openSlotIndexes = XI_SLOTS
      .map((_, index) => index)
      .filter((index) => !fixedAssignments.some((assignment) => assignment.slotIndex === index));
    const fixedStableIds = new Set(fixedAssignments.map((assignment) => assignment.stableId));
    const squadRng = createSeededRandom(`${seedText}|squads`);
    const squads = shuffle([...squadById.values()], squadRng)
      .filter((squad) => rollEligibleCandidates(squad.id, openSlotIndexes, fixedStableIds).length >= 5);

    if (squads.length < DAILY_TOTAL_ROLLS) return null;

    for (let startIndex = 0; startIndex <= squads.length - DAILY_TOTAL_ROLLS; startIndex += 1) {
      const rolls = [];
      const usedStableIds = new Set(fixedStableIds);
      let valid = true;

      for (let rollOffset = 0; rollOffset < DAILY_TOTAL_ROLLS; rollOffset += 1) {
        const squad = squads[startIndex + rollOffset];
        const eligibleStableIds = pickRollPlayersForSquad(
          squad.id,
          openSlotIndexes,
          usedStableIds,
          `${seedText}|roll|${rollOffset + 1}|${squad.id}|${[...usedStableIds].sort().join(",")}`,
        );
        if (!eligibleStableIds) {
          valid = false;
          break;
        }

        eligibleStableIds.forEach((stableId) => usedStableIds.add(stableId));
        rolls.push({
          squadId: squad.id,
          eligibleStableIds,
        });
      }

      if (valid && rolls.length === DAILY_TOTAL_ROLLS) {
        return rolls;
      }
    }

    return null;
  }

  function pickOppositionStableIds(excludedStableIds, seedText) {
    const rng = createSeededRandom(seedText);
    const lineup = [];
    const usedStableIds = new Set(excludedStableIds);

    for (let slotIndex = 0; slotIndex < XI_SLOTS.length; slotIndex += 1) {
      const slot = XI_SLOTS[slotIndex];
      const candidates = bestPlayers
        .filter((player) => !usedStableIds.has(player.stableId) && slotAcceptsPlayer(slot, player))
        .sort((left, right) => playerSlotScore(right, slot) - playerSlotScore(left, slot) || playerOverall(right) - playerOverall(left))
        .slice(0, 18);

      const chosen = weightedPick(
        candidates,
        (candidate) => playerSlotScore(candidate, slot) * 2 + playerOverall(candidate),
        rng,
      );
      if (!chosen) return null;

      usedStableIds.add(chosen.stableId);
      lineup[slotIndex] = chosen;
    }

    return lineup.map((player) => player.stableId);
  }

  function pickDailyConditions(seedText) {
    const rng = createSeededRandom(seedText);
    return weightedPick(conditions, () => 1, rng) ?? conditions[0];
  }

  function buildChallengeDefinition(date, config) {
    const fixedAssignments = Array.isArray(config.fixedAssignments)
      ? [...config.fixedAssignments]
        .map((assignment) => ({
          slotIndex: Number(assignment.slotIndex),
          stableId: String(assignment.stableId ?? ""),
        }))
        .filter((assignment) => Number.isInteger(assignment.slotIndex) && assignment.slotIndex >= 0 && assignment.slotIndex < XI_SLOTS.length && assignment.stableId)
        .sort((left, right) => left.slotIndex - right.slotIndex)
      : [...(config.fixedPlayerStableIds ?? [])]
        .map((stableId, index) => ({
          slotIndex: index,
          stableId: String(stableId ?? ""),
        }))
        .filter((assignment) => assignment.stableId);

    return {
      id: challengeIdForDate(date),
      date,
      label: `${challengeLabelPrefix} · ${date}`,
      challengeNumber: Number(date.replaceAll("-", "")),
      version: challengeVersion,
      fixedAssignments,
      fixedPlayerStableIds: fixedAssignments.map((assignment) => assignment.stableId),
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

  const dailyChallengeSchedule = scheduledChallenges.map((challenge) =>
    buildChallengeDefinition(challenge.date, challenge),
  );
  const dailyChallengeById = new Map(dailyChallengeSchedule.map((challenge) => [challenge.id, challenge]));
  const dailyChallengeByDate = new Map(dailyChallengeSchedule.map((challenge) => [challenge.date, challenge]));

  function completionStateKey(definition, selections, nextRollNumber) {
    const normalized = normalizeDailySelections(selections);
    const usedStableIds = [
      ...definition.fixedPlayerStableIds,
      ...normalized.map((selection) => selection.stableId),
    ].sort();
    const occupiedSlots = [
      ...(definition.fixedAssignments ?? []).map((assignment) => assignment.slotIndex),
      ...normalized.map((selection) => selection.slotIndex).filter((slotIndex) => Number.isInteger(slotIndex)),
    ].sort((left, right) => left - right);
    return `${nextRollNumber}|${usedStableIds.join(",")}|${occupiedSlots.join(",")}`;
  }

  function getCompletionSolver(definition) {
    const memo = new Map();

    function hasPathFromSelections(selections, nextRollNumber) {
      const stateKey = completionStateKey(definition, selections, nextRollNumber);
      if (memo.has(stateKey)) {
        return memo.get(stateKey);
      }

      let result = false;
      if (nextRollNumber > definition.rolls.length) {
        result = Boolean(buildDailyCompletedXI(definition, selections));
      } else {
        const roll = getDailyRoll(definition, nextRollNumber);
        if (roll) {
          const usedStableIds = lockedStableIds(definition, selections);
          for (const stableId of roll.eligibleStableIds) {
            if (usedStableIds.has(stableId)) continue;
            const player = resolveSquadPlayer(roll.squadId, stableId);
            if (!player) continue;
            const candidateSlots = openSlotIndexesForSelections(definition, selections)
              .filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], player));

            for (const slotIndex of candidateSlots) {
              const nextSelections = [
                ...normalizeDailySelections(selections),
                {
                  rollNumber: roll.rollNumber,
                  squadId: roll.squadId,
                  playerId: player.id,
                  stableId,
                  slotIndex,
                },
              ];
              if (hasPathFromSelections(nextSelections, nextRollNumber + 1)) {
                result = true;
                break;
              }
            }

            if (result) break;
          }
        }
      }

      memo.set(stateKey, result);
      return result;
    }

    return hasPathFromSelections;
  }

  function validateGeneratedDailyDefinition(definition) {
    const fixedPlayers = getDailyFixedPlayers(definition);
    const oppositionPlayers = getDailyOppositionPlayers(definition);
    if (fixedPlayers.length !== 7 || oppositionPlayers.length !== 11) return false;
    if (definition.rolls.length !== DAILY_TOTAL_ROLLS) return false;
    if (definition.rolls.some((roll) => roll.eligibleStableIds.length !== 5)) return false;

    const firstRoll = buildDailyRollPublicState(definition, 1, []);
    if (!firstRoll) return false;
    if (firstRoll.players.filter((player) => player.selectable).length < 2) return false;

    return countDailyCompletionPaths(definition, [], 1, 12) >= 4;
  }

  function buildGeneratedChallenge(date) {
    const dateText = stableDateText(date);
    if (!dateText) return null;
    const cached = dailyChallengeCache.get(dateText);
    if (cached) return cached;

    for (let variant = 0; variant < 48; variant += 1) {
      const templateRng = createSeededRandom(`${dateText}|template|${variant}`);
      const slotIndexes = shuffle(dailyGeneratedTemplateSlotSets, templateRng)[0] ?? dailyGeneratedTemplateSlotSets[0];
      const fixedAssignments = pickFixedAssignments(slotIndexes, `${dateText}|fixed|${variant}`);
      if (!fixedAssignments) continue;

      const rolls = pickDailyRolls(fixedAssignments, `${dateText}|rolls|${variant}`);
      if (!rolls) continue;

      const excludedStableIds = new Set(fixedAssignments.map((assignment) => assignment.stableId));
      rolls.forEach((roll) => roll.eligibleStableIds.forEach((stableId) => excludedStableIds.add(stableId)));

      const oppositionStableIds = pickOppositionStableIds(excludedStableIds, `${dateText}|opposition|${variant}`);
      if (!oppositionStableIds) continue;

      const definition = buildChallengeDefinition(dateText, {
        fixedAssignments,
        oppositionStableIds,
        oppositionLabel: generatedOppositionLabel,
        conditions: pickDailyConditions(`${dateText}|conditions|${variant}`),
        rolls,
      });

      if (validateGeneratedDailyDefinition(definition)) {
        dailyChallengeCache.set(dateText, definition);
        return definition;
      }
    }

    const fallbackSource = dailyChallengeSchedule[0];
    if (!fallbackSource) return null;
    const fallback = buildChallengeDefinition(dateText, {
      fixedAssignments: fallbackSource.fixedAssignments,
      oppositionStableIds: fallbackSource.oppositionStableIds,
      oppositionLabel: fallbackSource.oppositionLabel,
      conditions: fallbackSource.conditions,
      rolls: fallbackSource.rolls,
    });
    dailyChallengeCache.set(dateText, fallback);
    return fallback;
  }

  function getDailyChallengeById(challengeId) {
    const normalizedId = String(challengeId ?? "").trim();
    const scheduled = dailyChallengeById.get(normalizedId);
    if (scheduled) return scheduled;

    const match = normalizedId.match(new RegExp(`^${escapeRegex(challengeIdPrefix)}-(\\d{4}-\\d{2}-\\d{2})$`, "u"));
    if (!match) return null;
    return buildGeneratedChallenge(match[1]);
  }

  function getCurrentDailyChallenge(referenceDate = new Date()) {
    const dateText = stableDateText(referenceDate instanceof Date ? referenceDate.toISOString() : referenceDate);
    if (!dateText) return null;
    return dailyChallengeByDate.get(dateText) ?? buildGeneratedChallenge(dateText);
  }

  function resolveBestPlayer(stableId) {
    return bestPlayerByStableId.get(stableId) ?? null;
  }

  function resolveSquadPlayer(squadId, stableId) {
    return catalogPlayerBySquadAndStableId.get(`${squadId}:${stableId}`) ?? null;
  }

  function getDailyFixedPlayers(definition) {
    return (definition.fixedAssignments ?? [])
      .map((assignment) => {
        const player = resolveBestPlayer(assignment.stableId);
        return player ? { ...player, slotIndex: assignment.slotIndex } : null;
      })
      .filter(Boolean);
  }

  function getDailyOppositionPlayers(definition) {
    return definition.oppositionStableIds
      .map((stableId) => resolveBestPlayer(stableId))
      .filter(Boolean);
  }

  function getDailyRoll(definition, rollNumber) {
    return definition.rolls.find((roll) => roll.rollNumber === Number(rollNumber)) ?? null;
  }

  function normalizeDailySelections(selections) {
    return Array.isArray(selections)
      ? [...selections]
        .map((selection) => {
          const slotIndexValue = selection?.slotIndex;
          const parsedSlotIndex = slotIndexValue === null || slotIndexValue === undefined
            ? null
            : Number(slotIndexValue);
          return {
            rollNumber: Number(selection.rollNumber),
            squadId: String(selection.squadId ?? ""),
            playerId: String(selection.playerId ?? ""),
            stableId: String(selection.stableId ?? stablePlayerIdFromName(selection.playerName ?? "")),
            slotIndex: Number.isInteger(parsedSlotIndex) ? parsedSlotIndex : null,
          };
        })
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

  function openSlotIndexesForSelections(definition, selections) {
    const occupied = new Set((definition.fixedAssignments ?? []).map((assignment) => assignment.slotIndex));
    normalizeDailySelections(selections)
      .map((selection) => selection.slotIndex)
      .filter((slotIndex) => Number.isInteger(slotIndex))
      .forEach((slotIndex) => occupied.add(slotIndex));
    return XI_SLOTS.map((_, index) => index).filter((index) => !occupied.has(index));
  }

  function buildDailyPlayerPool(definition, selections) {
    const fixedPlayers = getDailyFixedPlayers(definition);
    const selectedPlayers = normalizeDailySelections(selections)
      .map((selection) => playerById.get(selection.playerId) ?? resolveBestPlayer(selection.stableId))
      .filter(Boolean);
    return [...fixedPlayers, ...selectedPlayers];
  }

  function buildDailyCompletedXI(definition, selections) {
    const normalizedSelections = normalizeDailySelections(selections);
    if (normalizedSelections.length !== definition.rolls.length) return null;

    const fixedPlayers = getDailyFixedPlayers(definition);
    const allHaveSlots = fixedPlayers.every((player) => Number.isInteger(player.slotIndex))
      && normalizedSelections.every((selection) => Number.isInteger(selection.slotIndex));

    if (allHaveSlots) {
      const lineup = new Array(XI_SLOTS.length).fill(null);
      const usedStableIds = new Set();

      for (const player of fixedPlayers) {
        if (lineup[player.slotIndex] || !slotAcceptsPlayer(XI_SLOTS[player.slotIndex], player) || usedStableIds.has(player.stableId)) {
          return null;
        }
        lineup[player.slotIndex] = player;
        usedStableIds.add(player.stableId);
      }

      for (const selection of normalizedSelections) {
        const player = playerById.get(selection.playerId);
        if (!player || lineup[selection.slotIndex] || !slotAcceptsPlayer(XI_SLOTS[selection.slotIndex], player) || usedStableIds.has(player.stableId)) {
          return null;
        }
        lineup[selection.slotIndex] = player;
        usedStableIds.add(player.stableId);
      }

      return lineup.every(Boolean) ? lineup : null;
    }

    const pool = buildDailyPlayerPool(definition, normalizedSelections);
    if (pool.length !== XI_SLOTS.length) return null;
    return assignBestValidLineup(pool);
  }

  function validSlotIndexesForPlayer(definition, selections, rollNumber, playerId) {
    const roll = getDailyRoll(definition, rollNumber);
    if (!roll || roll.rollNumber !== Number(rollNumber)) {
      return [];
    }

    const player = playerById.get(playerId);
    if (!player || player.squadId !== roll.squadId) {
      return [];
    }

    if (!roll.eligibleStableIds.includes(player.stableId)) {
      return [];
    }

    const used = lockedStableIds(definition, selections);
    if (used.has(player.stableId)) {
      return [];
    }

    const solver = getCompletionSolver(definition);
    const openSlotIndexes = openSlotIndexesForSelections(definition, selections)
      .filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], player));

    return openSlotIndexes.filter((slotIndex) => solver([
      ...normalizeDailySelections(selections),
      {
        rollNumber: roll.rollNumber,
        squadId: roll.squadId,
        playerId: player.id,
        stableId: player.stableId,
        slotIndex,
      },
    ], roll.rollNumber + 1));
  }

  function canSelectDailyPlayer(definition, selections, rollNumber, playerId, slotIndex = null) {
    const validSlotIndexes = validSlotIndexesForPlayer(definition, selections, rollNumber, playerId);
    if (!validSlotIndexes.length) return false;
    if (slotIndex === null || slotIndex === undefined || slotIndex === "") return true;
    const parsedSlotIndex = Number(slotIndex);
    if (!Number.isInteger(parsedSlotIndex)) return false;
    return validSlotIndexes.includes(parsedSlotIndex);
  }

  function getVisiblePlayersForRoll(definition, rollNumber, selections) {
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
            validSlotIndexes: [],
            unavailableReason: "Already locked into this XI.",
          };
        }

        const validSlotIndexes = validSlotIndexesForPlayer(definition, selections, roll.rollNumber, player.id);
        return {
          ...player,
          selectable: validSlotIndexes.length > 0,
          validSlotIndexes,
          unavailableReason: validSlotIndexes.length
            ? ""
            : "This choice would leave no valid way to complete the XI.",
        };
      })
      .sort((left, right) => playerOverall(right) - playerOverall(left));
  }

  function buildDailyRollPublicState(definition, rollNumber, selections) {
    const roll = getDailyRoll(definition, rollNumber);
    if (!roll) return null;
    const squad = squadById.get(roll.squadId);
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

  function buildDailyRecap(definition, selections) {
    const byRoll = new Map(normalizeDailySelections(selections).map((selection) => [selection.rollNumber, selection]));

    return definition.rolls.map((roll) => {
      const squad = squadById.get(roll.squadId);
      const selected = byRoll.get(roll.rollNumber) ?? null;
      const selectedPlayer = selected ? playerById.get(selected.playerId) ?? null : null;
      return {
        rollNumber: roll.rollNumber,
        squadId: roll.squadId,
        squadLabel: squad?.label ?? roll.squadId,
        squadTeam: squad?.team ?? "",
        squadYear: squad?.year ?? "",
        slotIndex: selected?.slotIndex ?? null,
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
      }),
    );
  }

  function normalizeLeaderboardName(value, fallback = "Anonymous") {
    return normalizeDisplayName(value) || fallback;
  }

  function parseWinMargin(summary) {
    const text = String(summary ?? "").trim();
    let match = text.match(/^Won by an innings and (\d+) run(?:s)?$/iu);
    if (match) {
      return {
        kind: "innings",
        amount: Number(match[1]),
        sortRank: 3,
        label: text,
      };
    }

    match = text.match(/^Won by (\d+) wicket(?:s)?$/iu);
    if (match) {
      return {
        kind: "wickets",
        amount: Number(match[1]),
        sortRank: 2,
        label: text,
      };
    }

    match = text.match(/^Won by (\d+) run(?:s)?$/iu);
    if (match) {
      return {
        kind: "runs",
        amount: Number(match[1]),
        sortRank: 1,
        label: text,
      };
    }

    return null;
  }

  function buildDailyResultsLeaderboard(completedRankedAttempts, currentAttemptId = "") {
    const attempts = Array.isArray(completedRankedAttempts)
      ? completedRankedAttempts
      : [];
    const totalCompletedPlayers = attempts.filter((attempt) => {
      if (!attempt) return false;
      if (attempt.simulationComplete) return true;
      return Boolean(attempt.result?.matches?.length);
    }).length;
    const winners = attempts
      .map((attempt) => {
        const match = attempt.result?.matches?.[0] ?? null;
        const margin = parseWinMargin(match?.summary);
        if (!margin) return null;
        return {
          attemptId: attempt.id,
          displayName: normalizeLeaderboardName(attempt.displayName),
          margin: margin.label,
          marginKind: margin.kind,
          marginAmount: margin.amount,
          isCurrentUser: attempt.id === currentAttemptId,
          sortRank: margin.sortRank,
          completedAt: attempt.completedAt ?? attempt.updatedAt ?? attempt.createdAt ?? "",
        };
      })
      .filter(Boolean)
      .sort((left, right) =>
        right.sortRank - left.sortRank
        || right.marginAmount - left.marginAmount
        || left.completedAt.localeCompare(right.completedAt)
        || left.displayName.localeCompare(right.displayName),
      );

    return {
      totalCompletedPlayers,
      totalWinners: winners.length,
      entries: winners.slice(0, 5),
    };
  }

  function buildDailyCommunityStats(definition, completedRankedAttempts, userSelections) {
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
        squadLabel: squadById.get(roll.squadId)?.label ?? roll.squadId,
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
          player: playerById.get(selection.playerId) ?? null,
          percentage: playerStats?.percentage ?? 0,
          squadLabel: rollStats?.squadLabel ?? "",
        };
      })
      .filter((entry) => entry.player);

    const mostUnusualSelection = [...userSelectionShares].sort((left, right) => left.percentage - right.percentage)[0] ?? null;

    const roleCounts = new Map();
    for (const attempt of attempts) {
      for (const selection of normalizeDailySelections(attempt.selections)) {
        const player = playerById.get(selection.playerId);
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

  function buildDailyChallengeSummary(definition, rankedAttempt = null) {
    const fixedPlayers = getDailyFixedPlayers(definition);
    const playerIds = new Set(fixedPlayers.map((player) => player.id));
    for (const roll of definition.rolls ?? []) {
      for (const stableId of roll.eligibleStableIds ?? []) {
        const player = resolveSquadPlayer(roll.squadId, stableId);
        if (player?.id) {
          playerIds.add(player.id);
        }
      }
    }
    return {
      id: definition.id,
      date: definition.date,
      label: definition.label,
      challengeNumber: definition.challengeNumber,
      totalRolls: definition.rolls.length,
      todayPlayerCount: playerIds.size,
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
            displayName: normalizeLeaderboardName(rankedAttempt.displayName, ""),
          }
        : null,
    };
  }

  function countDailyCompletionPaths(definition, selections = [], rollNumber = 1, limit = 24) {
    if (limit <= 0) return 0;
    if (rollNumber > definition.rolls.length) {
      return buildDailyCompletedXI(definition, selections) ? 1 : 0;
    }

    const roll = buildDailyRollPublicState(definition, rollNumber, selections);
    if (!roll) return 0;

    let total = 0;
    for (const player of roll.players.filter((entry) => entry.selectable)) {
      for (const slotIndex of player.validSlotIndexes ?? []) {
        total += countDailyCompletionPaths(
          definition,
          [
            ...normalizeDailySelections(selections),
            {
              rollNumber,
              squadId: roll.squadId,
              playerId: player.id,
              stableId: player.stableId,
              slotIndex,
            },
          ],
          rollNumber + 1,
          limit - total,
        );
        if (total >= limit) {
          return total;
        }
      }
    }

    return total;
  }

  return {
    DAILY_CHALLENGE_VERSION: challengeVersion,
    getDailyChallengeById,
    getCurrentDailyChallenge,
    resolveBestPlayer,
    resolveSquadPlayer,
    getDailyFixedPlayers,
    getDailyOppositionPlayers,
    getDailyRoll,
    normalizeDailySelections,
    buildDailyPlayerPool,
    buildDailyCompletedXI,
    canSelectDailyPlayer,
    getVisiblePlayersForRoll,
    buildDailyRollPublicState,
    buildDailyRecap,
    buildDailyResultsLeaderboard,
    buildDailyCommunityStats,
    buildDailyChallengeSummary,
    countDailyCompletionPaths,
  };
}
