import { errorResponse, json, methodNotAllowed } from "../../_lib/http.js";
import { fetchChallengeDetails } from "../../_lib/store.js";

export async function onRequestGet(context) {
  const challengeId = String(context.params.id ?? "").trim();
  if (!challengeId) {
    return errorResponse(400, "Challenge id is invalid.");
  }

  const challenge = await fetchChallengeDetails(context.env.DB, challengeId);
  if (!challenge) {
    return errorResponse(404, "Challenge not found.");
  }

  return json({
    ok: true,
    challenge: challenge.challenge,
    team: challenge.team,
  });
}

export function onRequest() {
  return methodNotAllowed();
}
