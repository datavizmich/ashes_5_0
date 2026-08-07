import { normalizeDisplayName } from "../../site/shared/ashes-core.js";

function asAttemptError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateSubmissionKey(value, label) {
  const normalized = String(value ?? "").trim();
  if (!/^[A-Za-z0-9_-]{10,64}$/u.test(normalized)) {
    throw asAttemptError(`${label} is invalid.`);
  }
  return normalized;
}

export function createDailyAttemptHelpers({
  sharedDaily,
  buildSimulation,
}) {
  const {
    buildDailyChallengeSummary,
    buildDailyCommunityStats,
    buildDailyCompletedXI,
    buildDailyPlayerPool,
    buildDailyRecap,
    buildDailyResultsLeaderboard,
    buildDailyRollPublicState,
    canSelectDailyPlayer,
    getDailyFixedPlayers,
    getDailyOppositionPlayers,
    normalizeDailySelections,
  } = sharedDaily;

  function validateDailyParticipantId(value) {
    const normalized = String(value ?? "").trim();
    if (!/^[A-Za-z0-9_-]{12,80}$/u.test(normalized)) {
      throw asAttemptError("Participant id is invalid.");
    }
    return normalized;
  }

  function validateDailyStartPayload(payload) {
    const body = payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : null;
    if (!body) throw asAttemptError("Daily challenge payload is invalid.");

    const attemptMode = body.attemptMode === "practice" ? "practice" : "ranked";
    return {
      participantId: validateDailyParticipantId(body.participantId),
      submissionKey: validateSubmissionKey(body.submissionKey, "Submission key"),
      attemptMode,
      displayName: normalizeDisplayName(body.displayName),
    };
  }

  function validateDailySelectPayload(payload) {
    const body = payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : null;
    if (!body) throw asAttemptError("Daily selection payload is invalid.");

    const currentRollNumber = Number(body.currentRollNumber);
    if (!Number.isInteger(currentRollNumber) || currentRollNumber < 1 || currentRollNumber > 4) {
      throw asAttemptError("Current roll number is invalid.");
    }

    const selectedPlayerId = String(body.selectedPlayerId ?? "").trim();
    if (!selectedPlayerId) {
      throw asAttemptError("Selected player id is invalid.");
    }

    const slotIndex = Number(body.slotIndex);
    if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex > 10) {
      throw asAttemptError("Selected slot is invalid.");
    }

    return {
      participantId: validateDailyParticipantId(body.participantId),
      currentRollNumber,
      selectedPlayerId,
      slotIndex,
    };
  }

  function validateDailySimulatePayload(payload) {
    const body = payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : null;
    if (!body) throw asAttemptError("Daily simulation payload is invalid.");

    return {
      participantId: validateDailyParticipantId(body.participantId),
      displayName: normalizeDisplayName(body.displayName),
    };
  }

  function assertDailyAttemptOwnership(definition, attempt, participantId) {
    if (!attempt) {
      throw asAttemptError("Daily attempt not found.", 404);
    }
    if (attempt.challengeId !== definition.id) {
      throw asAttemptError("Daily attempt does not belong to this challenge.", 400);
    }
    if (attempt.participantId !== participantId) {
      throw asAttemptError("Daily attempt does not belong to this participant.", 403);
    }
  }

  function buildLockedSelectionsPayload(definition, selections) {
    return buildDailyRecap(definition, selections)
      .filter((roll) => roll.selectedPlayer)
      .map((roll) => ({
        rollNumber: roll.rollNumber,
        squadId: roll.squadId,
        squadLabel: roll.squadLabel,
        squadTeam: roll.squadTeam,
        squadYear: roll.squadYear,
        slotIndex: roll.slotIndex,
        player: roll.selectedPlayer,
      }));
  }

  function buildCompletedXiPayload(definition, selections) {
    const completedXI = buildDailyCompletedXI(definition, selections);
    if (!completedXI) {
      throw asAttemptError("The completed XI is invalid.", 400);
    }
    return completedXI;
  }

  function buildDailyAttemptResponse(definition, attempt, selections, completedRankedAttempts = null) {
    const normalizedSelections = normalizeDailySelections(selections);
    const summary = buildDailyChallengeSummary(definition, attempt);
    const lockedSelections = buildLockedSelectionsPayload(definition, normalizedSelections);
    const fixedPlayers = getDailyFixedPlayers(definition);
    const pool = buildDailyPlayerPool(definition, normalizedSelections);
    const response = {
      ok: true,
      challenge: {
        id: summary.id,
        date: summary.date,
        label: summary.label,
        challengeNumber: summary.challengeNumber,
        totalRolls: summary.totalRolls,
        conditions: summary.conditions,
        opposition: summary.opposition,
      },
      attempt: {
        id: attempt.id,
        attemptMode: attempt.attemptMode,
        displayName: attempt.displayName ?? "",
        currentRollNumber: attempt.currentRollNumber,
        draftComplete: Boolean(attempt.draftComplete),
        simulationComplete: Boolean(attempt.simulationComplete),
      },
      fixedPlayers,
      lockedSelections,
      currentTeamPool: pool,
      draftProgress: {
        lockedSelections: lockedSelections.length,
        totalSelections: definition.rolls.length,
        remainingSelections: Math.max(0, definition.rolls.length - lockedSelections.length),
      },
    };

    if (!attempt.draftComplete) {
      response.currentRoll = buildDailyRollPublicState(definition, attempt.currentRollNumber, normalizedSelections);
      return response;
    }

    response.completedXI = buildCompletedXiPayload(definition, normalizedSelections);
    response.recap = buildDailyRecap(definition, normalizedSelections);

    if (attempt.simulationComplete && completedRankedAttempts) {
      response.communityStats = buildDailyCommunityStats(definition, completedRankedAttempts, normalizedSelections);
      response.dailyLeaderboard = buildDailyResultsLeaderboard(completedRankedAttempts, attempt.id);
    }

    if (attempt.simulationComplete && attempt.result) {
      response.result = attempt.result;
    }

    return response;
  }

  function buildDailySimulationResult(definition, selections) {
    const completedXI = buildCompletedXiPayload(definition, selections);
    const oppositionLineup = getDailyOppositionPlayers(definition);
    const seed = [
      definition.id,
      ...completedXI.map((player) => player.id),
      definition.conditions.pitch,
      definition.conditions.venueLabel,
    ].join("|");

    return buildSimulation(completedXI, oppositionLineup, definition.conditions, seed);
  }

  function assertSelectableDailyPlayer(definition, selections, rollNumber, selectedPlayerId, slotIndex = null) {
    if (!canSelectDailyPlayer(definition, selections, rollNumber, selectedPlayerId, slotIndex)) {
      throw asAttemptError("That player cannot be locked from this roll.", 400);
    }
  }

  return {
    validateDailyParticipantId,
    validateDailyStartPayload,
    validateDailySelectPayload,
    validateDailySimulatePayload,
    assertDailyAttemptOwnership,
    buildDailyAttemptResponse,
    buildDailySimulationResult,
    assertSelectableDailyPlayer,
  };
}
