import { getDailyChallengeById } from "../../../../../../site/shared/daily-worldcup.js";
import {
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  validateDailyParticipantId,
} from "../../../../../_lib/daily-worldcup.js";
import { createAttemptDailyHandlers } from "../../../../../_lib/daily-api.js";

export const { onRequestGet, onRequest } = createAttemptDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  buildDailyAttemptResponse,
  validateDailyParticipantId,
  loadErrorMessage: "Could not load the World Cup daily attempt.",
});
