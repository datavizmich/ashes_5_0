import { errorResponse, json, methodNotAllowed, readJson } from "../../../_lib/http.js";
import { checkRateLimit } from "../../../_lib/security.js";
import { createResult, fetchChallengeDetails, isoTimestamp } from "../../../_lib/store.js";
import { validateResultCreationPayload } from "../../../_lib/validation.js";

export async function onRequestPost(context) {
  const rateLimit = checkRateLimit(context.request, "api:challenge-result-create", { limit: 10, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return errorResponse(429, "Too many result submissions. Please try again shortly.", {
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    });
  }

  const challengeId = String(context.params.id ?? "").trim();
  if (!challengeId) {
    return errorResponse(400, "Challenge id is invalid.");
  }

  const challenge = await fetchChallengeDetails(context.env.DB, challengeId);
  if (!challenge) {
    return errorResponse(404, "Challenge not found.");
  }

  try {
    const payload = await readJson(context.request);
    const { resultSubmissionKey, team, result } = validateResultCreationPayload(payload, challenge.team);
    const createdResult = await createResult(
      context.env.DB,
      challenge,
      team,
      resultSubmissionKey,
      result,
      isoTimestamp(),
    );
    return json({ ok: true, id: createdResult.id, url: createdResult.shortUrl });
  } catch (error) {
    return errorResponse(error.status ?? 400, error instanceof Error ? error.message : "Could not save result.");
  }
}

export function onRequest() {
  return methodNotAllowed();
}
