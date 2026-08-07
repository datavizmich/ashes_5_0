import {
  ASHES_CATALOG,
  ASHES_PLAYER_BY_ID,
  ASHES_SQUAD_BY_ID,
  BEST_ASHES_PLAYER_BY_STABLE_ID,
} from "./ashes-core.js";
import {
  DAILY_ATTEMPT_MODES,
  DAILY_TOTAL_ROLLS,
  createDailyChallengeModule,
} from "./daily-engine.js";

export { DAILY_ATTEMPT_MODES, DAILY_TOTAL_ROLLS };

export const DAILY_CHALLENGE_VERSION = "ashes-daily-v2";

const DAILY_CONDITIONS = [
  {
    pitch: "balanced",
    venue: "The Oval",
    venueLabel: "The Oval",
    summary: "A balanced pitch with enough pace for the quicks and value for patient batting.",
  },
  {
    pitch: "green",
    venue: "Lord's",
    venueLabel: "Lord's",
    summary: "Fresh grass and cloud cover bring the seamers into play from the start.",
  },
  {
    pitch: "flat",
    venue: "Adelaide",
    venueLabel: "Adelaide",
    summary: "True bounce and fast outfield reward strokeplay if you can survive the new ball.",
  },
  {
    pitch: "turning",
    venue: "Old Trafford",
    venueLabel: "Old Trafford",
    summary: "A dry surface should bring spin and control into the game as the Test moves on.",
  },
  {
    pitch: "deteriorating",
    venue: "Headingley",
    venueLabel: "Headingley",
    summary: "Variable bounce later in the match puts a premium on balance and resilience.",
  },
];

const DAILY_CHALLENGE_SCHEDULE = [
  {
    date: "2026-07-26",
    fixedAssignments: [
      { slotIndex: 0, stableId: "jack-hobbs" },
      { slotIndex: 1, stableId: "alastair-cook" },
      { slotIndex: 2, stableId: "don-bradman" },
      { slotIndex: 3, stableId: "steve-smith" },
      { slotIndex: 5, stableId: "adam-gilchrist" },
      { slotIndex: 7, stableId: "shane-warne" },
      { slotIndex: 8, stableId: "james-anderson" },
    ],
    oppositionStableIds: [
      "herbert-sutcliffe",
      "victor-trumper",
      "ricky-ponting",
      "greg-chappell",
      "allan-border",
      "rod-marsh",
      "keith-miller",
      "bill-o-reilly",
      "pat-cummins",
      "glenn-mcgrath",
      "sydney-barnes",
    ],
    oppositionLabel: "Historic Australia greats",
    conditions: {
      pitch: "green",
      venue: "Lord's",
      venueLabel: "Lord's",
      summary: "Fresh Lord's surface with seam movement on day one.",
    },
    rolls: [
      {
        squadId: "eng-2005",
        eligibleStableIds: [
          "kevin-pietersen",
          "paul-collingwood",
          "andrew-flintoff",
          "steve-harmison",
          "matthew-hoggard",
        ],
      },
      {
        squadId: "aus-2006",
        eligibleStableIds: [
          "ricky-ponting",
          "michael-hussey",
          "andrew-symonds",
          "brett-lee",
          "glenn-mcgrath",
        ],
      },
      {
        squadId: "eng-2019",
        eligibleStableIds: [
          "joe-root",
          "ben-stokes",
          "chris-woakes",
          "jofra-archer",
          "stuart-broad",
        ],
      },
      {
        squadId: "aus-2023",
        eligibleStableIds: [
          "marnus-labuschagne",
          "travis-head",
          "cameron-green",
          "pat-cummins",
          "mitchell-starc",
        ],
      },
    ],
  },
];

const dailyAshes = createDailyChallengeModule({
  catalog: ASHES_CATALOG,
  playerById: ASHES_PLAYER_BY_ID,
  squadById: ASHES_SQUAD_BY_ID,
  bestPlayerByStableId: BEST_ASHES_PLAYER_BY_STABLE_ID,
  challengeVersion: DAILY_CHALLENGE_VERSION,
  challengeIdPrefix: "daily-ashes",
  challengeLabelPrefix: "Daily Ashes Challenge",
  generatedOppositionLabel: "Historic Ashes challengers",
  conditions: DAILY_CONDITIONS,
  scheduledChallenges: DAILY_CHALLENGE_SCHEDULE,
});

export const getDailyChallengeById = dailyAshes.getDailyChallengeById;
export const getCurrentDailyChallenge = dailyAshes.getCurrentDailyChallenge;
export const resolveBestAshesPlayer = dailyAshes.resolveBestPlayer;
export const resolveSquadPlayer = dailyAshes.resolveSquadPlayer;
export const getDailyFixedPlayers = dailyAshes.getDailyFixedPlayers;
export const getDailyOppositionPlayers = dailyAshes.getDailyOppositionPlayers;
export const getDailyRoll = dailyAshes.getDailyRoll;
export const normalizeDailySelections = dailyAshes.normalizeDailySelections;
export const buildDailyPlayerPool = dailyAshes.buildDailyPlayerPool;
export const buildDailyCompletedXI = dailyAshes.buildDailyCompletedXI;
export const canSelectDailyPlayer = dailyAshes.canSelectDailyPlayer;
export const getVisiblePlayersForRoll = dailyAshes.getVisiblePlayersForRoll;
export const buildDailyRollPublicState = dailyAshes.buildDailyRollPublicState;
export const buildDailyRecap = dailyAshes.buildDailyRecap;
export const buildDailyResultsLeaderboard = dailyAshes.buildDailyResultsLeaderboard;
export const buildDailyCommunityStats = dailyAshes.buildDailyCommunityStats;
export const buildDailyChallengeSummary = dailyAshes.buildDailyChallengeSummary;
export const countDailyCompletionPaths = dailyAshes.countDailyCompletionPaths;
