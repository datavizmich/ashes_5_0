import { errorResponse, json, methodNotAllowed } from "../../_lib/http.js";
import { fetchRankedDailyAttemptByParticipant } from "../../_lib/daily-store.js";
import { buildDailyChallengeSummary, getCurrentDailyChallenge } from "../../../site/shared/daily-ashes.js";
import { validateDailyParticipantId } from "../../_lib/daily.js";

export async function onRequestGet(context) {
  try {
    const definition = getCurrentDailyChallenge(new Date().toISOString());
    const url = new URL(context.request.url);
    const participantIdParam = url.searchParams.get("participantId");

    let rankedAttempt = null;
    if (participantIdParam) {
      const participantId = validateDailyParticipantId(participantIdParam);
      rankedAttempt = await fetchRankedDailyAttemptByParticipant(context.env.DB, definition.id, participantId);
    }

    return json({
      ok: true,
      challenge: buildDailyChallengeSummary(definition, rankedAttempt),
    });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not load the daily challenge.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
