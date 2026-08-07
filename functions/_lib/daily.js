import { buildSingleTestSeries } from "../../site/shared/ashes-sim.js";
import {
  buildDailyChallengeSummary,
  buildDailyCommunityStats,
  buildDailyCompletedXI,
  buildDailyPlayerPool,
  buildDailyRecap,
  buildDailyResultsLeaderboard,
  buildDailyRollPublicState,
  canSelectDailyPlayer,
  getDailyFixedPlayers,
  getDailyOppositionPlayers,
  normalizeDailySelections,
} from "../../site/shared/daily-ashes.js";
import { createDailyAttemptHelpers } from "./daily-engine.js";

const dailyHelpers = createDailyAttemptHelpers({
  sharedDaily: {
    buildDailyChallengeSummary,
    buildDailyCommunityStats,
    buildDailyCompletedXI,
    buildDailyPlayerPool,
    buildDailyRecap,
    buildDailyResultsLeaderboard,
    buildDailyRollPublicState,
    canSelectDailyPlayer,
    getDailyFixedPlayers,
    getDailyOppositionPlayers,
    normalizeDailySelections,
  },
  buildSimulation: buildSingleTestSeries,
});

export const validateDailyParticipantId = dailyHelpers.validateDailyParticipantId;
export const validateDailyStartPayload = dailyHelpers.validateDailyStartPayload;
export const validateDailySelectPayload = dailyHelpers.validateDailySelectPayload;
export const validateDailySimulatePayload = dailyHelpers.validateDailySimulatePayload;
export const assertDailyAttemptOwnership = dailyHelpers.assertDailyAttemptOwnership;
export const buildDailyAttemptResponse = dailyHelpers.buildDailyAttemptResponse;
export const buildDailySimulationResult = dailyHelpers.buildDailySimulationResult;
export const assertSelectableDailyPlayer = dailyHelpers.assertSelectableDailyPlayer;
