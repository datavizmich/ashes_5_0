import { ASHES_PLAYER_BY_ID } from "../../../../../../site/shared/ashes-core.js";
import { getDailyChallengeById } from "../../../../../../site/shared/daily-ashes.js";
import {
  assertDailyAttemptOwnership,
  assertSelectableDailyPlayer,
  buildDailyAttemptResponse,
  validateDailySelectPayload,
} from "../../../../../_lib/daily.js";
import { createSelectDailyHandlers } from "../../../../../_lib/daily-api.js";

export const { onRequestPost, onRequest } = createSelectDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  assertSelectableDailyPlayer,
  buildDailyAttemptResponse,
  validateDailySelectPayload,
  playerById: ASHES_PLAYER_BY_ID,
  selectRateLimitKey: "api:daily-select",
  rateLimitMessage: "Too many daily selections. Please try again shortly.",
  selectErrorMessage: "Could not lock that selection.",
});
