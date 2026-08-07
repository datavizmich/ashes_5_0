import { getDailyChallengeById } from "../../../../../../../site/shared/daily-worldcup.js";
import {
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  buildDailySimulationResult,
  validateDailySimulatePayload,
} from "../../../../../../_lib/daily-worldcup.js";
import { createSimulateDailyHandlers } from "../../../../../../_lib/daily-api.js";

export const { onRequestPost, onRequest } = createSimulateDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  buildDailySimulationResult,
  validateDailySimulatePayload,
  simulateRateLimitKey: "api:worldcup-daily-simulate",
  rateLimitMessage: "Too many World Cup daily simulations. Please try again shortly.",
  incompleteDraftMessage: "Finish the draft before simulating the ODI.",
  simulateErrorMessage: "Could not simulate the daily ODI.",
});
