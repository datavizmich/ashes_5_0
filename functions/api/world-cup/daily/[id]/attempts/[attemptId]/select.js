import { WORLD_CUP_PLAYER_BY_ID } from "../../../../../../../site/shared/ashes-core.js";
import { getDailyChallengeById } from "../../../../../../../site/shared/daily-worldcup.js";
import {
  assertDailyAttemptOwnership,
  assertSelectableDailyPlayer,
  buildDailyAttemptResponse,
  validateDailySelectPayload,
} from "../../../../../../_lib/daily-worldcup.js";
import { createSelectDailyHandlers } from "../../../../../../_lib/daily-api.js";

export const { onRequestPost, onRequest } = createSelectDailyHandlers({
  getDailyChallengeById,
  assertDailyAttemptOwnership,
  assertSelectableDailyPlayer,
  buildDailyAttemptResponse,
  validateDailySelectPayload,
  playerById: WORLD_CUP_PLAYER_BY_ID,
  selectRateLimitKey: "api:worldcup-daily-select",
  rateLimitMessage: "Too many World Cup daily selections. Please try again shortly.",
  selectErrorMessage: "Could not lock that World Cup selection.",
});
