import { errorResponse, json, methodNotAllowed } from "../../../_lib/http.js";
import { ensureDailyStoreSchema, fetchRankedDailyAttemptByParticipant } from "../../../_lib/daily-store.js";
import { buildDailyChallengeSummary, getCurrentDailyChallenge } from "../../../../site/shared/daily-worldcup.js";
import { validateDailyParticipantId } from "../../../_lib/daily-worldcup.js";

export async function onRequestGet(context) {
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

    return json({
      ok: true,
      challenge: buildDailyChallengeSummary(definition, rankedAttempt),
    });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not load the World Cup daily challenge.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
