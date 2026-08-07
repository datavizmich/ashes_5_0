import { getDailyChallengeById } from "../../../../../site/shared/daily-worldcup.js";
import {
  buildDailyAttemptResponse,
  validateDailyStartPayload,
} from "../../../../_lib/daily-worldcup.js";
import { createStartDailyHandlers } from "../../../../_lib/daily-api.js";

export const { onRequestPost, onRequest } = createStartDailyHandlers({
  getDailyChallengeById,
  buildDailyAttemptResponse,
  validateDailyStartPayload,
  startRateLimitKey: "api:worldcup-daily-start",
  rateLimitMessage: "Too many World Cup daily challenge requests. Please try again shortly.",
  startErrorMessage: "Could not start the World Cup daily challenge.",
});
