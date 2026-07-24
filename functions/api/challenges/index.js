import { errorResponse, json, methodNotAllowed, readJson } from "../../_lib/http.js";
import { checkRateLimit } from "../../_lib/security.js";
import { createChallenge, isoTimestamp } from "../../_lib/store.js";
import { validateChallengeCreationPayload } from "../../_lib/validation.js";

export async function onRequestPost(context) {
  const rateLimit = checkRateLimit(context.request, "api:challenge-create", { limit: 8, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many challenge submissions. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
  }

  try {
    const payload = await readJson(context.request);
    const { challengeSubmissionKey, team } = validateChallengeCreationPayload(payload);
    const challenge = await createChallenge(context.env.DB, challengeSubmissionKey, team, isoTimestamp());
    return json({ ok: true, id: challenge.id, url: challenge.url });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not create challenge.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
