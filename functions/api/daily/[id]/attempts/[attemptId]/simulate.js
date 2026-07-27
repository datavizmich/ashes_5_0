import { errorResponse, json, methodNotAllowed, readJson } from "../../../../../_lib/http.js";
import {
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  buildDailySimulationResult,
  validateDailySimulatePayload,
} from "../../../../../_lib/daily.js";
import {
  ensureDailyStoreSchema,
  fetchDailyAttemptState,
  listCompletedRankedDailyAttempts,
  saveDailyAttemptResult,
  updateDailyAttemptDisplayName,
} from "../../../../../_lib/daily-store.js";
import { checkRateLimit } from "../../../../../_lib/security.js";
import { isoTimestamp } from "../../../../../_lib/store.js";
import { getDailyChallengeById } from "../../../../../../site/shared/daily-ashes.js";

export async function onRequestPost(context) {
  const rateLimit = checkRateLimit(context.request, "api:daily-simulate", { limit: 8, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many daily simulations. Please try again shortly.", {
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
      return errorResponse(400, "Finish the draft before simulating the Test.");
    }

    if (payload.displayName !== attemptState.attempt.displayName) {
      await updateDailyAttemptDisplayName(context.env.DB, attemptState.attempt.id, payload.displayName, isoTimestamp());
    }

    if (!attemptState.attempt.simulationComplete) {
      const result = buildDailySimulationResult(definition, attemptState.selections);
      await saveDailyAttemptResult(context.env.DB, attemptState.attempt.id, result, isoTimestamp());
    }

    const refreshed = await fetchDailyAttemptState(context.env.DB, attemptState.attempt.id);
    const completedRankedAttempts = await listCompletedRankedDailyAttempts(context.env.DB, definition.id);
    return json(buildDailyAttemptResponse(
      definition,
      refreshed.attempt,
      refreshed.selections,
      completedRankedAttempts,
    ));
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not simulate the daily Test.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
