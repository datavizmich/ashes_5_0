import { getDailyChallengeById } from "../../../../site/shared/daily-ashes.js";
import {
  buildDailyAttemptResponse,
  validateDailyStartPayload,
} from "../../../_lib/daily.js";
import { createStartDailyHandlers } from "../../../_lib/daily-api.js";

export const { onRequestPost, onRequest } = createStartDailyHandlers({
  getDailyChallengeById,
  buildDailyAttemptResponse,
  validateDailyStartPayload,
  startRateLimitKey: "api:daily-start",
  rateLimitMessage: "Too many daily challenge requests. Please try again shortly.",
  startErrorMessage: "Could not start the daily challenge.",
});
