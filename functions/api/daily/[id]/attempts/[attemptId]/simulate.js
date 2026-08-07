import { getDailyChallengeById } from "../../../../../../site/shared/daily-ashes.js";
import {
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  buildDailySimulationResult,
  validateDailySimulatePayload,
} from "../../../../../_lib/daily.js";
import { createSimulateDailyHandlers } from "../../../../../_lib/daily-api.js";

export const { onRequestPost, onRequest } = createSimulateDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  buildDailySimulationResult,
  validateDailySimulatePayload,
  simulateRateLimitKey: "api:daily-simulate",
  rateLimitMessage: "Too many daily simulations. Please try again shortly.",
  incompleteDraftMessage: "Finish the draft before simulating the Test.",
  simulateErrorMessage: "Could not simulate the daily Test.",
});
