import {
  BEST_WORLD_CUP_PLAYER_BY_STABLE_ID,
  WORLD_CUP_CATALOG,
  WORLD_CUP_PLAYER_BY_ID,
  WORLD_CUP_SQUAD_BY_ID,
} from "./ashes-core.js";
import {
  DAILY_ATTEMPT_MODES,
  DAILY_TOTAL_ROLLS,
  createDailyChallengeModule,
} from "./daily-engine.js";

export { DAILY_ATTEMPT_MODES, DAILY_TOTAL_ROLLS };

export const DAILY_CHALLENGE_VERSION = "worldcup-daily-v1";

const DAILY_CONDITIONS = [
  {
    pitch: "balanced",
    venue: "Ahmedabad",
    venueLabel: "Ahmedabad",
    summary: "A balanced one-day surface that rewards clean hitting but still gives the seamers something with the new ball.",
  },
  {
    pitch: "flat",
    venue: "Mumbai",
    venueLabel: "Mumbai",
    summary: "True bounce, quick outfield and short boundaries make this a high-scoring ODI setting.",
  },
  {
    pitch: "green",
    venue: "Auckland",
    venueLabel: "Auckland",
    summary: "Morning movement puts a premium on surviving the powerplay before the pitch settles.",
  },
  {
    pitch: "turning",
    venue: "Chennai",
    venueLabel: "Chennai",
    summary: "A dry strip should bring spin and changes of pace into the middle overs.",
  },
  {
    pitch: "balanced",
    venue: "Melbourne",
    venueLabel: "Melbourne",
    summary: "Long square boundaries reward smart rotation before the death overs open up the scoring.",
  },
];

const DAILY_CHALLENGE_SCHEDULE = [
  {
    date: "2026-08-06",
    fixedAssignments: [
      { slotIndex: 0, stableId: "sachin-tendulkar" },
      { slotIndex: 1, stableId: "adam-gilchrist" },
      { slotIndex: 2, stableId: "virat-kohli" },
      { slotIndex: 3, stableId: "eoin-morgan" },
      { slotIndex: 5, stableId: "ms-dhoni" },
      { slotIndex: 7, stableId: "rashid-khan" },
      { slotIndex: 8, stableId: "glenn-mcgrath" },
    ],
    oppositionStableIds: [
      "david-warner",
      "shubman-gill",
      "ricky-ponting",
      "kane-williamson",
      "heinrich-klaasen",
      "jos-buttler",
      "yuvraj-singh",
      "glenn-maxwell",
      "wasim-akram",
      "mitchell-starc",
      "muttiah-muralitharan",
    ],
    oppositionLabel: "World Cup greats XI",
    conditions: {
      pitch: "flat",
      venue: "Mumbai",
      venueLabel: "Mumbai",
      summary: "A true one-day surface where powerplay batting and death bowling both matter.",
    },
    rolls: [
      {
        squadId: "eng-2019wc",
        eligibleStableIds: [
          "jason-roy",
          "ben-stokes",
          "chris-woakes",
          "jofra-archer",
          "liam-plunkett",
        ],
      },
      {
        squadId: "aus-2015wc",
        eligibleStableIds: [
          "steve-smith",
          "shane-watson",
          "glenn-maxwell",
          "mitchell-starc",
          "mitchell-johnson",
        ],
      },
      {
        squadId: "ind-2023wc",
        eligibleStableIds: [
          "kl-rahul",
          "hardik-pandya",
          "ravindra-jadeja",
          "mohammed-shami",
          "jasprit-bumrah",
        ],
      },
      {
        squadId: "nz-2019wc",
        eligibleStableIds: [
          "ross-taylor",
          "james-neesham",
          "mitchell-santner",
          "lockie-ferguson",
          "matt-henry",
        ],
      },
    ],
  },
];

const dailyWorldCup = createDailyChallengeModule({
  catalog: WORLD_CUP_CATALOG,
  playerById: WORLD_CUP_PLAYER_BY_ID,
  squadById: WORLD_CUP_SQUAD_BY_ID,
  bestPlayerByStableId: BEST_WORLD_CUP_PLAYER_BY_STABLE_ID,
  challengeVersion: DAILY_CHALLENGE_VERSION,
  challengeIdPrefix: "daily-worldcup",
  challengeLabelPrefix: "Daily World Cup Challenge",
  generatedOppositionLabel: "Historic World Cup challengers",
  conditions: DAILY_CONDITIONS,
  scheduledChallenges: DAILY_CHALLENGE_SCHEDULE,
});

export const getDailyChallengeById = dailyWorldCup.getDailyChallengeById;
export const getCurrentDailyChallenge = dailyWorldCup.getCurrentDailyChallenge;
export const resolveBestWorldCupPlayer = dailyWorldCup.resolveBestPlayer;
export const resolveSquadPlayer = dailyWorldCup.resolveSquadPlayer;
export const getDailyFixedPlayers = dailyWorldCup.getDailyFixedPlayers;
export const getDailyOppositionPlayers = dailyWorldCup.getDailyOppositionPlayers;
export const getDailyRoll = dailyWorldCup.getDailyRoll;
export const normalizeDailySelections = dailyWorldCup.normalizeDailySelections;
export const buildDailyPlayerPool = dailyWorldCup.buildDailyPlayerPool;
export const buildDailyCompletedXI = dailyWorldCup.buildDailyCompletedXI;
export const canSelectDailyPlayer = dailyWorldCup.canSelectDailyPlayer;
export const getVisiblePlayersForRoll = dailyWorldCup.getVisiblePlayersForRoll;
export const buildDailyRollPublicState = dailyWorldCup.buildDailyRollPublicState;
export const buildDailyRecap = dailyWorldCup.buildDailyRecap;
export const buildDailyResultsLeaderboard = dailyWorldCup.buildDailyResultsLeaderboard;
export const buildDailyCommunityStats = dailyWorldCup.buildDailyCommunityStats;
export const buildDailyChallengeSummary = dailyWorldCup.buildDailyChallengeSummary;
export const countDailyCompletionPaths = dailyWorldCup.countDailyCompletionPaths;
