import { requireAdminToken } from "../../../../../_lib/admin-auth.js";
import { ensureDailyStoreSchema, listRankedDailyAttemptsByChallenge } from "../../../../../_lib/daily-store.js";
import { errorResponse, json, methodNotAllowed } from "../../../../../_lib/http.js";

function buildAdminEntry(attempt) {
  const match = attempt?.result?.matches?.[0] ?? null;
  return {
    attemptId: attempt.id,
    challengeId: attempt.challengeId,
    displayName: attempt.displayName || "Anonymous",
    rawDisplayName: attempt.displayName ?? "",
    draftComplete: Boolean(attempt.draftComplete),
    simulationComplete: Boolean(attempt.simulationComplete),
    hiddenFromPublic: Boolean(attempt.hiddenFromPublic),
    hiddenReason: attempt.hiddenReason ?? "",
    matchSummary: match?.summary ?? "",
    matchHeadline: match?.headline ?? "",
    createdAt: attempt.createdAt ?? "",
    updatedAt: attempt.updatedAt ?? "",
    completedAt: attempt.completedAt ?? "",
    hiddenAt: attempt.hiddenAt ?? "",
  };
}

export async function onRequestGet(context) {
  try {
    requireAdminToken(context.request, context.env);
    await ensureDailyStoreSchema(context.env.DB);

    const entries = await listRankedDailyAttemptsByChallenge(context.env.DB, context.params.id);
    return json({
      ok: true,
      challengeId: context.params.id,
      totalEntries: entries.length,
      entries: entries.map(buildAdminEntry),
    });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not load admin daily entries.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
