import { errorResponse, json, methodNotAllowed } from "../../../../_lib/http.js";
import { assertDailyAttemptOwnership, buildDailyAttemptResponse, validateDailyParticipantId } from "../../../../_lib/daily.js";
import { ensureDailyStoreSchema, fetchDailyAttemptState, listCompletedRankedDailyAttempts } from "../../../../_lib/daily-store.js";
import { getDailyChallengeById } from "../../../../../site/shared/daily-ashes.js";

export async function onRequestGet(context) {
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
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not load the daily attempt.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
