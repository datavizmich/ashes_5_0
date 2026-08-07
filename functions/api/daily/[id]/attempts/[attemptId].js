import { getDailyChallengeById } from "../../../../../site/shared/daily-ashes.js";
import {
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  validateDailyParticipantId,
} from "../../../../_lib/daily.js";
import { createAttemptDailyHandlers } from "../../../../_lib/daily-api.js";

export const { onRequestGet, onRequest } = createAttemptDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  validateDailyParticipantId,
  loadErrorMessage: "Could not load the daily attempt.",
});
