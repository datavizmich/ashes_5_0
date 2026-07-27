import { ASHES_PLAYER_BY_ID } from "../../../../../../site/shared/ashes-core.js";
import { errorResponse, json, methodNotAllowed, readJson } from "../../../../../_lib/http.js";
import {
  assertDailyAttemptOwnership,
  assertSelectableDailyPlayer,
  buildDailyAttemptResponse,
  validateDailySelectPayload,
} from "../../../../../_lib/daily.js";
import {
  ensureDailyStoreSchema,
  addDailySelection,
  fetchDailyAttemptState,
  listCompletedRankedDailyAttempts,
  updateDailyAttemptProgress,
} from "../../../../../_lib/daily-store.js";
import { checkRateLimit } from "../../../../../_lib/security.js";
import { isoTimestamp } from "../../../../../_lib/store.js";
import { getDailyChallengeById } from "../../../../../../site/shared/daily-ashes.js";

export async function onRequestPost(context) {
  const rateLimit = checkRateLimit(context.request, "api:daily-select", { limit: 20, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many daily selections. Please try again shortly.", {
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
    const selectedPlayer = ASHES_PLAYER_BY_ID.get(payload.selectedPlayerId);
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
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not lock that selection.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
