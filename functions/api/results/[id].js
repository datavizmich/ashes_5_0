import { errorResponse, json, methodNotAllowed } from "../../_lib/http.js";
import { fetchResultDetails } from "../../_lib/store.js";

export async function onRequestGet(context) {
  const resultId = String(context.params.id ?? "").trim();
  if (!resultId) {
    return errorResponse(400, "Result id is invalid.");
  }

  const result = await fetchResultDetails(context.env.DB, resultId);
  if (!result) {
    return errorResponse(404, "Result not found.");
  }

  return json({
    ok: true,
    result: result.result,
    challenge: result.challenge,
    creatorTeam: result.creatorTeam,
    responderTeam: result.responderTeam,
  });
}

export function onRequest() {
  return methodNotAllowed();
}
