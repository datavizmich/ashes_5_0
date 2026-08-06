import { errorResponse, json, methodNotAllowed, readJson } from "../../../../_lib/http.js";
import {
  ensureDailyStoreSchema,
  createDailyAttempt,
  createOrFetchRankedDailyAttempt,
  fetchDailyAttemptState,
  fetchRankedDailyAttemptByParticipant,
  listCompletedRankedDailyAttempts,
  updateDailyAttemptDisplayName,
} from "../../../../_lib/daily-store.js";
import { checkRateLimit } from "../../../../_lib/security.js";
import { buildDailyAttemptResponse, validateDailyStartPayload } from "../../../../_lib/daily-worldcup.js";
import { getDailyChallengeById } from "../../../../../site/shared/daily-worldcup.js";
import { isoTimestamp } from "../../../../_lib/store.js";

export async function onRequestPost(context) {
  const rateLimit = checkRateLimit(context.request, "api:worldcup-daily-start", { limit: 12, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many World Cup daily challenge requests. Please try again shortly.", {
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
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not start the World Cup daily challenge.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
