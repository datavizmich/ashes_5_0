import { errorResponse, json, methodNotAllowed, readJson } from "../../_lib/http.js";
import { checkRateLimit } from "../../_lib/security.js";
import { createSoloTeam, isoTimestamp } from "../../_lib/store.js";
import { validateSoloTeamPayload } from "../../_lib/validation.js";

export async function onRequestPost(context) {
  const rateLimit = checkRateLimit(context.request, "api:solo-team-create", { limit: 10, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many team submissions. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
  }

  try {
    const payload = await readJson(context.request);
    const { team } = validateSoloTeamPayload(payload);
    const storedTeam = await createSoloTeam(context.env.DB, team, isoTimestamp());
    return json({ ok: true, id: storedTeam.id });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not save team.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
