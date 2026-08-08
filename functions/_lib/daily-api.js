import { errorResponse, json, methodNotAllowed, readJson } from "./http.js";
import {
  countRankedDailyParticipants,
  addDailySelection,
  createDailyAttempt,
  createOrFetchRankedDailyAttempt,
  ensureDailyStoreSchema,
  fetchDailyAttemptState,
  fetchRankedDailyAttemptByParticipant,
  listCompletedRankedDailyAttempts,
  saveDailyAttemptResult,
  updateDailyAttemptDisplayName,
  updateDailyAttemptProgress,
} from "./daily-store.js";
import { checkRateLimit } from "./security.js";
import { isoTimestamp } from "./store.js";

export function createCurrentDailyHandlers({
  getCurrentDailyChallenge,
  buildDailyChallengeSummary,
  buildDailyResultsLeaderboard,
  validateDailyParticipantId,
  loadErrorMessage,
}) {
  return {
    async onRequestGet(context) {
      try {
        await ensureDailyStoreSchema(context.env.DB);

        const definition = getCurrentDailyChallenge(new Date().toISOString());
        const url = new URL(context.request.url);
        const participantIdParam = url.searchParams.get("participantId");

        let rankedAttempt = null;
        if (participantIdParam) {
          const participantId = validateDailyParticipantId(participantIdParam);
          rankedAttempt = await fetchRankedDailyAttemptByParticipant(context.env.DB, definition.id, participantId);
        }
        const completedRankedAttempts = await listCompletedRankedDailyAttempts(context.env.DB, definition.id);
        const rankedParticipantsCount = await countRankedDailyParticipants(context.env.DB, definition.id);
        const leaderboardPreview = buildDailyResultsLeaderboard(completedRankedAttempts);

        return json({
          ok: true,
          challenge: {
            ...buildDailyChallengeSummary(definition, rankedAttempt),
            rankedParticipantsCount,
            leaderboardPreview: leaderboardPreview.entries[0] ?? null,
          },
        });
      } catch (error) {
        return errorResponse(error.status ?? 400, error instanceof Error ? error.message : loadErrorMessage);
      }
    },
    onRequest() {
      return methodNotAllowed();
    },
  };
}

export function createStartDailyHandlers({
  getDailyChallengeById,
  buildDailyAttemptResponse,
  validateDailyStartPayload,
  startRateLimitKey,
  rateLimitMessage,
  startErrorMessage,
}) {
  return {
    async onRequestPost(context) {
      const rateLimit = checkRateLimit(context.request, startRateLimitKey, { limit: 12, windowMs: 60_000 });
      if (!rateLimit.allowed) {
        return errorResponse(429, rateLimitMessage, {
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        });
      }

      const definition = getDailyChallengeById(context.params.id);
      if (!definition) {
        return errorResponse(404, "Daily challenge not found.");
      }

      try {
        await ensureDailyStoreSchema(context.env.DB);

        const payload = validateDailyStartPayload(await readJson(context.request));
        let attempt;

        if (payload.attemptMode === "practice") {
          const rankedAttempt = await fetchRankedDailyAttemptByParticipant(context.env.DB, definition.id, payload.participantId);
          if (!rankedAttempt?.draftComplete) {
            return errorResponse(400, "Finish the ranked draft before starting practice mode.");
          }

          attempt = await createDailyAttempt(context.env.DB, {
            challengeId: definition.id,
            participantId: payload.participantId,
            attemptMode: "practice",
            submissionKey: payload.submissionKey,
            displayName: payload.displayName,
          }, isoTimestamp());
        } else {
          attempt = await createOrFetchRankedDailyAttempt(context.env.DB, {
            challengeId: definition.id,
            participantId: payload.participantId,
            submissionKey: payload.submissionKey,
            displayName: payload.displayName,
          }, isoTimestamp());
        }

        if (!attempt) {
          return errorResponse(500, "Could not create the daily attempt.");
        }

        if (payload.displayName !== attempt.displayName) {
          await updateDailyAttemptDisplayName(context.env.DB, attempt.id, payload.displayName, isoTimestamp());
        }

        const attemptState = await fetchDailyAttemptState(context.env.DB, attempt.id);
        if (!attemptState) {
          return errorResponse(500, "Daily attempt state could not be loaded.");
        }
        const completedRankedAttempts = attemptState?.attempt?.simulationComplete
          ? await listCompletedRankedDailyAttempts(context.env.DB, definition.id)
          : null;

        return json(buildDailyAttemptResponse(
          definition,
          attemptState.attempt,
          attemptState.selections,
          completedRankedAttempts,
        ));
      } catch (error) {
        return errorResponse(error.status ?? 400, error instanceof Error ? error.message : startErrorMessage);
      }
    },
    onRequest() {
      return methodNotAllowed();
    },
  };
}

export function createAttemptDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  validateDailyParticipantId,
  loadErrorMessage,
}) {
  return {
    async onRequestGet(context) {
      const definition = getDailyChallengeById(context.params.id);
      if (!definition) {
        return errorResponse(404, "Daily challenge not found.");
      }

      try {
        await ensureDailyStoreSchema(context.env.DB);

        const url = new URL(context.request.url);
        const participantId = validateDailyParticipantId(url.searchParams.get("participantId"));
        const attemptState = await fetchDailyAttemptState(context.env.DB, context.params.attemptId);
        assertDailyAttemptOwnership(definition, attemptState?.attempt, participantId);

        const completedRankedAttempts = attemptState.attempt.simulationComplete
          ? await listCompletedRankedDailyAttempts(context.env.DB, definition.id)
          : null;

        return json(buildDailyAttemptResponse(
          definition,
          attemptState.attempt,
          attemptState.selections,
          completedRankedAttempts,
        ));
      } catch (error) {
        return errorResponse(error.status ?? 400, error instanceof Error ? error.message : loadErrorMessage);
      }
    },
    onRequest() {
      return methodNotAllowed();
    },
  };
}

export function createSelectDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  assertSelectableDailyPlayer,
  buildDailyAttemptResponse,
  validateDailySelectPayload,
  playerById,
  selectRateLimitKey,
  rateLimitMessage,
  selectErrorMessage,
}) {
  return {
    async onRequestPost(context) {
      const rateLimit = checkRateLimit(context.request, selectRateLimitKey, { limit: 20, windowMs: 60_000 });
      if (!rateLimit.allowed) {
        return errorResponse(429, rateLimitMessage, {
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        });
      }

      const definition = getDailyChallengeById(context.params.id);
      if (!definition) {
        return errorResponse(404, "Daily challenge not found.");
      }

      try {
        await ensureDailyStoreSchema(context.env.DB);

        const payload = validateDailySelectPayload(await readJson(context.request));
        const attemptState = await fetchDailyAttemptState(context.env.DB, context.params.attemptId);
        assertDailyAttemptOwnership(definition, attemptState?.attempt, payload.participantId);

        if (attemptState.attempt.draftComplete) {
          return errorResponse(400, "This draft is already complete.");
        }

        if (attemptState.attempt.currentRollNumber !== payload.currentRollNumber) {
          return errorResponse(409, "That is not the current unresolved roll.");
        }

        assertSelectableDailyPlayer(definition, attemptState.selections, payload.currentRollNumber, payload.selectedPlayerId, payload.slotIndex);
        const selectedPlayer = playerById.get(payload.selectedPlayerId);
        if (!selectedPlayer) {
          return errorResponse(400, "Selected player is invalid.");
        }

        const timestamp = isoTimestamp();
        await addDailySelection(context.env.DB, attemptState.attempt.id, {
          rollNumber: payload.currentRollNumber,
          squadId: selectedPlayer.squadId,
          stableId: selectedPlayer.stableId,
          playerId: selectedPlayer.id,
          slotIndex: payload.slotIndex,
        }, timestamp);

        const draftComplete = payload.currentRollNumber >= definition.rolls.length;
        const nextRollNumber = draftComplete ? definition.rolls.length : payload.currentRollNumber + 1;
        await updateDailyAttemptProgress(context.env.DB, attemptState.attempt.id, nextRollNumber, draftComplete, timestamp);

        const refreshed = await fetchDailyAttemptState(context.env.DB, attemptState.attempt.id);
        const completedRankedAttempts = refreshed.attempt.simulationComplete
          ? await listCompletedRankedDailyAttempts(context.env.DB, definition.id)
          : null;

        return json(buildDailyAttemptResponse(
          definition,
          refreshed.attempt,
          refreshed.selections,
          completedRankedAttempts,
        ));
      } catch (error) {
        return errorResponse(error.status ?? 400, error instanceof Error ? error.message : selectErrorMessage);
      }
    },
    onRequest() {
      return methodNotAllowed();
    },
  };
}

export function createSimulateDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  buildDailySimulationResult,
  validateDailySimulatePayload,
  simulateRateLimitKey,
  rateLimitMessage,
  incompleteDraftMessage,
  simulateErrorMessage,
}) {
  return {
    async onRequestPost(context) {
      const rateLimit = checkRateLimit(context.request, simulateRateLimitKey, { limit: 8, windowMs: 60_000 });
      if (!rateLimit.allowed) {
        return errorResponse(429, rateLimitMessage, {
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        });
      }

      const definition = getDailyChallengeById(context.params.id);
      if (!definition) {
        return errorResponse(404, "Daily challenge not found.");
      }

      try {
        await ensureDailyStoreSchema(context.env.DB);

        const payload = validateDailySimulatePayload(await readJson(context.request));
        const attemptState = await fetchDailyAttemptState(context.env.DB, context.params.attemptId);
        assertDailyAttemptOwnership(definition, attemptState?.attempt, payload.participantId);

        if (!attemptState.attempt.draftComplete) {
          return errorResponse(400, incompleteDraftMessage);
        }

        if (payload.displayName !== attemptState.attempt.displayName) {
          await updateDailyAttemptDisplayName(context.env.DB, attemptState.attempt.id, payload.displayName, isoTimestamp());
        }

        if (!attemptState.attempt.simulationComplete) {
          const result = buildDailySimulationResult(definition, attemptState.selections);
          await saveDailyAttemptResult(context.env.DB, attemptState.attempt.id, result, isoTimestamp());
        }

        const refreshed = await fetchDailyAttemptState(context.env.DB, context.params.attemptId);
        const completedRankedAttempts = await listCompletedRankedDailyAttempts(context.env.DB, definition.id);
        return json(buildDailyAttemptResponse(
          definition,
          refreshed.attempt,
          refreshed.selections,
          completedRankedAttempts,
        ));
      } catch (error) {
        return errorResponse(error.status ?? 400, error instanceof Error ? error.message : simulateErrorMessage);
      }
    },
    onRequest() {
      return methodNotAllowed();
    },
  };
}
