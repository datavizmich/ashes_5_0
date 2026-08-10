import { sanitizePlainText } from "../../../../../../site/shared/ashes-core.js";
import { requireAdminToken } from "../../../../../_lib/admin-auth.js";
import {
  ensureDailyStoreSchema,
  fetchDailyAttemptById,
  updateDailyAttemptVisibility,
} from "../../../../../_lib/daily-store.js";
import { errorResponse, json, methodNotAllowed, readJson } from "../../../../../_lib/http.js";
import { isoTimestamp } from "../../../../../_lib/store.js";

function validateVisibilityPayload(payload) {
  const body = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
  if (!body || typeof body.hidden !== "boolean") {
    const error = new Error("Visibility payload is invalid.");
    error.status = 400;
    throw error;
  }

  return {
    hidden: body.hidden,
    reason: sanitizePlainText(body.reason, 160),
  };
}

export async function onRequestPost(context) {
  try {
    requireAdminToken(context.request, context.env);
    await ensureDailyStoreSchema(context.env.DB);

    const payload = validateVisibilityPayload(await readJson(context.request));
    const attempt = await fetchDailyAttemptById(context.env.DB, context.params.attemptId);
    if (!attempt) {
      return errorResponse(404, "Daily attempt not found.");
    }

    const timestamp = isoTimestamp();
    await updateDailyAttemptVisibility(
      context.env.DB,
      attempt.id,
      payload.hidden,
      payload.hidden ? payload.reason : "",
      timestamp,
    );

    const updatedAttempt = await fetchDailyAttemptById(context.env.DB, attempt.id);
    return json({
      ok: true,
      attemptId: updatedAttempt.id,
      challengeId: updatedAttempt.challengeId,
      hiddenFromPublic: Boolean(updatedAttempt.hiddenFromPublic),
      hiddenReason: updatedAttempt.hiddenReason ?? "",
      hiddenAt: updatedAttempt.hiddenAt ?? "",
      updatedAt: updatedAttempt.updatedAt ?? "",
    });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not update entry visibility.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
