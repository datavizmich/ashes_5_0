import {
  buildDailyChallengeSummary,
  buildDailyResultsLeaderboard,
  getCurrentDailyChallenge,
} from "../../../../site/shared/daily-worldcup.js";
import { validateDailyParticipantId } from "../../../_lib/daily-worldcup.js";
import { createCurrentDailyHandlers } from "../../../_lib/daily-api.js";

export const { onRequestGet, onRequest } = createCurrentDailyHandlers({
  getCurrentDailyChallenge,
  buildDailyChallengeSummary,
  buildDailyResultsLeaderboard,
  validateDailyParticipantId,
  loadErrorMessage: "Could not load the World Cup daily challenge.",
});
