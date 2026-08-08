import { ASHES_SQUADS } from "./data/ashes-squads.js";
import { WORLD_CUP_SQUADS } from "./data/wc-squads.js";
import {
  PUBLIC_PAGE_DEFS,
  canonicalUrlForPageKey,
  publicPageKeyForPath,
} from "./shared/public-pages.js";
import { playableModeDef } from "./shared/modes.js";

const CANONICAL_SITE_ORIGIN = "https://ashes-5-0.co.uk";
const SEO_HOME_TITLE = PUBLIC_PAGE_DEFS.home.title;
const SEO_HOME_DESCRIPTION = PUBLIC_PAGE_DEFS.home.description;
const STATIC_HOME_PAGE_KEYS = new Set([
  "about",
  "howToPlay",
  "methodology",
  "feedback",
]);

const XI_SLOTS = [
  { label: "Opener", accepts: ["Opener"], focus: "batting", row: 5, col: 2 },
  { label: "Opener", accepts: ["Opener"], focus: "batting", row: 5, col: 4 },
  { label: "#3", accepts: ["Top Order", "Middle Order"], focus: "batting", row: 4, col: 3 },
  { label: "#4", accepts: ["Middle Order", "Top Order", "All-rounder"], focus: "batting", row: 3, col: 2 },
  { label: "#5", accepts: ["Middle Order", "All-rounder", "Top Order"], focus: "batting", row: 3, col: 4 },
  { label: "WK", accepts: ["Wicketkeeper"], focus: "fielding", row: 2, col: 3 },
  { label: "AR", accepts: ["All-rounder"], focus: "mixed", row: 3, col: 1 },
  { label: "Spin", accepts: ["Spinner"], focus: "bowling", row: 2, col: 1 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 1 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 3 },
  { label: "Pace", accepts: ["Fast Bowler", "Pace Bowler", "Seam Bowler"], focus: "bowling", row: 1, col: 5 },
];
const CHALLENGE_QUERY_KEY = "c";
const CHALLENGE_CREATOR_QUERY_KEY = "n";
const RESULT_QUERY_KEY = "r";
const LEGACY_CHALLENGE_QUERY_KEY = "challenge";
const LEGACY_CHALLENGE_CREATOR_QUERY_KEY = "challenger";
const LEGACY_CHALLENGE_MODE_QUERY_KEY = "challengeMode";
const CHALLENGE_RESULT_VERSION = "challenge-result-v1";
const RESULT_SIMULATION_VERSION = "ashes-5-0-sim-v1";
const TEAM_DATA_VERSION = "ashes-5-0-data-v1";
const BOOTSTRAP = window.__ASHES_BOOTSTRAP__ ?? null;
const DAILY_PARTICIPANT_STORAGE_KEY = "ashes-daily-participant-id";
const DAILY_ATTEMPT_STORAGE_KEY_PREFIX = "ashes-daily-attempt";
const DAILY_DISPLAY_NAME_STORAGE_KEY_PREFIX = "ashes-daily-display-name";

function buildInitialDailyState() {
  return {
    competition: "ashes",
    active: false,
    loadingSummary: false,
    loadingAction: false,
    summary: null,
    participantId: "",
    challenge: null,
    attempt: null,
    fixedPlayers: [],
    lockedSelections: [],
    currentRoll: null,
    currentTeamPool: [],
    completedXI: [],
    recap: [],
    communityStats: null,
    resultsLeaderboard: null,
    result: null,
    displayName: "",
    pendingPlayerId: null,
  };
}

const STATE = {
  view: "home",
  competition: "ashes",
  squads: ASHES_SQUADS,
  catalog: [],
  challenge: null,
  generatedChallenge: null,
  result: null,
  challengeDraftName: "",
  challengeDraftMode: "classic",
  challengeResponseName: "",
  lineup: new Map(),
  currentSquad: null,
  selectedPlayerId: null,
  mode: "classic",
  series: null,
  teamSubmissionKey: "",
  challengeSubmissionKey: "",
  resultSubmissionKey: "",
  soloTeamRecorded: false,
  routeError: null,
  leaderboard: {
    competition: "ashes",
    metric: "selected",
    period: "all",
    mode: "all",
    limit: 20,
    totalTeams: null,
    entries: [],
    loading: false,
    error: "",
  },
  challengeLinkPromise: null,
  resultPersistPromise: null,
  soloPersistPromise: null,
  timer: null,
  achievementDetail: null,
  achievementPinned: false,
  achievementHelpBound: false,
  seriesShareAsset: null,
  seriesShareAssetPromise: null,
  rollAnimation: null,
  daily: buildInitialDailyState(),
};

const ACHIEVEMENT_DEFS = {
  "The Invincibles": {
    description: "Win all five Tests in the series.",
  },
  Bodyline: {
    description: "Take 40 or more wickets across the series.",
  },
  "The Don": {
    description: "Score 700 or more runs across the series.",
  },
  "Great Escape": {
    description: "Win the series after trailing 0-2.",
  },
};

const els = {};

function bindElements() {
  const selectors = {
    siteNav: "[data-site-nav]",
    navToggle: "[data-nav-toggle]",
    navLinks: "[data-nav-links]",
    homePrimaryCta: "[data-home-primary-cta]",
    homeSecondaryCta: "[data-home-secondary-cta]",
    homePreviewCard: "[data-home-preview-card]",
    homePreviewKicker: "[data-home-preview-kicker]",
    homePreviewScore: "[data-home-preview-score]",
    homePreviewLabel: "[data-home-preview-label]",
    homePreviewSummary: "[data-home-preview-summary]",
    homePreviewPlayers: "[data-home-preview-players]",
    homeView: "[data-home-view]",
    leaderboardView: "[data-leaderboard-view]",
    gameView: "[data-game-view]",
    seriesView: "[data-series-view]",
    homeEyebrow: "[data-home-eyebrow]",
    homeTitle: "[data-home-title]",
    homeTagline: "[data-home-tagline]",
    homeLede: "[data-home-lede]",
    homePanelKicker: "[data-home-panel-kicker]",
    homePanelTitle: "[data-home-panel-title]",
    homePanelCopy: "[data-home-panel-copy]",
    homeConfigGrid: "[data-home-config-grid]",
    homeControls: "[data-home-controls]",
    homeResponseNameRow: "[data-home-response-name-row]",
    homeResponseName: "[data-home-response-name]",
    homeMode: "[data-home-mode]",
    homeRulesGrid: "[data-home-rules-grid]",
    homeSquadsLabel: "[data-home-squads-label]",
    homePlayersLabel: "[data-home-players-label]",
    homeFormatLabel: "[data-home-format-label]",
    homeFormatValue: "[data-home-format-value]",
    totalSquads: "[data-total-squads]",
    totalPlayers: "[data-total-players]",
    homeChallenge: "[data-home-challenge]",
    homeDaily: "[data-home-daily]",
    homeLeaderboard: "[data-home-leaderboard]",
    homeCompetition: "[data-home-competition]",
    leaderboardTitle: "[data-leaderboard-title]",
    leaderboardLede: "[data-leaderboard-lede]",
    leaderboardHome: "[data-leaderboard-home]",
    leaderboardMetric: "[data-leaderboard-metric]",
    leaderboardPeriod: "[data-leaderboard-period]",
    leaderboardMode: "[data-leaderboard-mode]",
    leaderboardTotal: "[data-leaderboard-total]",
    leaderboardMetricLabel: "[data-leaderboard-metric-label]",
    leaderboardPeriodLabel: "[data-leaderboard-period-label]",
    leaderboardStatus: "[data-leaderboard-status]",
    leaderboardTable: "[data-leaderboard-table]",
    gameSquadCount: "[data-game-squad-count]",
    gamePlayerCount: "[data-game-player-count]",
    gameMode: "[data-game-mode]",
    gameEyebrow: "[data-game-eyebrow]",
    gameTitle: "[data-game-title]",
    currentSquad: "[data-current-squad]",
    lineupStatus: "[data-lineup-status]",
    rosterTitle: "[data-roster-title]",
    rosterSummary: "[data-roster-summary]",
    rosterKicker: "[data-roster-kicker]",
    boardTitle: "[data-board-title]",
    boardCopy: "[data-board-copy]",
    rosterGrid: "[data-roster-grid]",
    board: "[data-board]",
    rollSquad: "[data-roll-squad]",
    dailyNameInline: "[data-daily-name-inline]",
    dailyRouteSwitch: "[data-daily-route-switch]",
    startSeries: "[data-start-series]",
    challengePanel: "[data-challenge-panel]",
    challengeTitle: "[data-challenge-title]",
    challengeCopy: "[data-challenge-copy]",
    challengeNameRow: "[data-challenge-name-row]",
    challengeName: "[data-challenge-name]",
    challengeMode: "[data-challenge-mode]",
    challengeMeta: "[data-challenge-meta]",
    challengeLink: "[data-challenge-link]",
    copyChallengeLink: "[data-copy-challenge-link]",
    challengeStatus: "[data-challenge-status]",
    playGame: "[data-play-game]",
    backHome: "[data-back-home]",
    backBuilder: "[data-back-builder]",
    seriesProgress: "[data-series-progress]",
    seriesStatus: "[data-series-status]",
    seriesControlsPanel: "[data-series-controls-panel]",
    seriesUserLabel: "[data-series-user-label]",
    seriesUserStrength: "[data-series-user-strength]",
    seriesOppositionLabel: "[data-series-opposition-label]",
    seriesStarStrength: "[data-series-star-strength]",
    seriesEyebrow: "[data-series-eyebrow]",
    seriesTitle: "[data-series-title]",
    seriesFeedKicker: "[data-series-feed-kicker]",
    seriesFeedTitle: "[data-series-feed-title]",
    seriesFeed: "[data-series-feed]",
    seriesTableKicker: "[data-series-table-kicker]",
    seriesTableTitle: "[data-series-table-title]",
    seriesTableWrap: "[data-series-table-wrap]",
    dailyCommunityPanel: "[data-daily-community-panel]",
    dailyCommunityContent: "[data-daily-community-content]",
    seriesNext: "[data-series-next]",
    seriesAll: "[data-series-all]",
    draftMeter: "[data-draft-meter]",
    draftMeterTitle: "[data-draft-meter-title]",
    draftMeterCopy: "[data-draft-meter-copy]",
    draftBatting: "[data-draft-batting]",
    draftBowling: "[data-draft-bowling]",
    draftFielding: "[data-draft-fielding]",
    draftOverall: "[data-draft-overall]",
    seriesInsights: "[data-series-insights]",
    seriesActions: "[data-series-actions]",
    seriesReveal: "[data-series-reveal]",
    seriesRevealGrid: "[data-series-reveal-grid]",
    playAgain: "[data-play-again]",
    dailyPractice: "[data-daily-practice]",
    dailyRouteSwitchSeries: "[data-daily-route-switch-series]",
    seriesLeaderboard: "[data-series-leaderboard]",
    sendResultBack: "[data-send-result-back]",
    challengeBack: "[data-challenge-back]",
    shareResult: "[data-share-result]",
    whatsappShare: "[data-whatsapp-share]",
    copyLink: "[data-copy-link]",
    downloadShare: "[data-download-share]",
    shareStatus: "[data-share-status]",
    resetBuilder: "[data-reset-builder]",
    feedbackToggle: "[data-feedback-toggle]",
    feedbackPanel: "[data-feedback-panel]",
    feedbackForm: "[data-feedback-form]",
    feedbackMessage: "[data-feedback-message]",
    feedbackHoneypot: "[data-feedback-honeypot]",
    feedbackStatus: "[data-feedback-status]",
    feedbackSubmit: "[data-feedback-submit]",
    liveRegion: "[data-live-region]",
  };

  const optionalSelectors = {
    homeRuleOne: "[data-home-rule-one]",
    homeRuleThree: "[data-home-rule-three]",
  };

  for (const [key, selector] of Object.entries(selectors)) {
    els[key] = document.querySelector(selector);
  }

  for (const [key, selector] of Object.entries(optionalSelectors)) {
    els[key] = document.querySelector(selector);
  }

  els.navLinkNodes = [...document.querySelectorAll("[data-nav-link]")];

  const optionalKeys = new Set(Object.keys(optionalSelectors));

  const missing = Object.entries(els)
    .filter(([key]) => !optionalKeys.has(key))
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing required DOM nodes: ${missing.join(", ")}`);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function randomChoice(values) {
  if (!values.length) return null;
  return values[Math.floor(Math.random() * values.length)];
}

function shuffle(values) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function normalizeName(name) {
  return String(name).trim().toLowerCase();
}

function playerKey(player) {
  return player?.id ?? normalizeName(player?.name ?? "");
}

function buildCatalogFromSquads(squads) {
  return squads.flatMap((squad) =>
    squad.players.map((player, index) => ({
      ...player,
      id: `${squad.id}:${index}`,
      squadId: squad.id,
      squadLabel: squad.label,
      squadTeam: squad.team,
      squadYear: squad.year,
    })),
  );
}

const ASHES_CATALOG = buildCatalogFromSquads(ASHES_SQUADS);
const WORLD_CUP_CATALOG = buildCatalogFromSquads(WORLD_CUP_SQUADS);
const ASHES_CATALOG_INDEX_BY_ID = new Map(ASHES_CATALOG.map((player, index) => [player.id, index]));

function dailyAttemptStorageKey(challengeId, attemptMode = "ranked") {
  return `${DAILY_ATTEMPT_STORAGE_KEY_PREFIX}:${challengeId}:${attemptMode}`;
}

function dailyDisplayNameStorageKey(challengeId, attemptMode = "ranked") {
  return `${DAILY_DISPLAY_NAME_STORAGE_KEY_PREFIX}:${challengeId}:${attemptMode}`;
}

function loadStoredDailyAttemptId(challengeId, attemptMode = "ranked") {
  if (!challengeId) return "";
  try {
    return window.localStorage.getItem(dailyAttemptStorageKey(challengeId, attemptMode)) ?? "";
  } catch {
    return "";
  }
}

function persistStoredDailyAttemptId(challengeId, attemptMode, attemptId) {
  if (!challengeId || !attemptId) return;
  try {
    window.localStorage.setItem(dailyAttemptStorageKey(challengeId, attemptMode), attemptId);
  } catch {}
}

function clearStoredDailyAttemptId(challengeId, attemptMode = "ranked") {
  if (!challengeId) return;
  try {
    window.localStorage.removeItem(dailyAttemptStorageKey(challengeId, attemptMode));
  } catch {}
}

function loadStoredDailyDisplayName(challengeId, attemptMode = "ranked") {
  if (!challengeId) return "";
  try {
    return normalizeChallengeCreatorName(
      window.localStorage.getItem(dailyDisplayNameStorageKey(challengeId, attemptMode)) ?? "",
    );
  } catch {
    return "";
  }
}

function persistStoredDailyDisplayName(challengeId, attemptMode = "ranked", displayName = "") {
  if (!challengeId) return;

  const normalized = normalizeChallengeCreatorName(displayName);
  try {
    if (normalized) {
      window.localStorage.setItem(dailyDisplayNameStorageKey(challengeId, attemptMode), normalized);
    } else {
      window.localStorage.removeItem(dailyDisplayNameStorageKey(challengeId, attemptMode));
    }
  } catch {}
}

function resolveDailyDisplayName(...values) {
  for (const value of values) {
    const normalized = normalizeChallengeCreatorName(value);
    if (normalized) {
      return normalized;
    }
  }

  return "";
}

function dailyChallengeActive() {
  return STATE.daily.active && STATE.competition === currentDailyCompetition();
}

function currentDailyStage() {
  if (!dailyChallengeActive()) return "idle";
  if (!STATE.daily.attempt) return "intro";
  if (STATE.daily.attempt.draftComplete) return "recap";
  return "draft";
}

function currentDailyChallengeId() {
  return String(STATE.daily.challenge?.id ?? STATE.daily.summary?.id ?? "");
}

function normalizeCompetitionValue(value) {
  return value === "worldcup" ? "worldcup" : "ashes";
}

function currentDailyCompetition() {
  return normalizeCompetitionValue(STATE.daily.competition ?? "ashes");
}

function currentLeaderboardCompetition() {
  return normalizeCompetitionValue(
    STATE.leaderboard.competition
    ?? (currentPublicPageKey() === "worldCupLeaderboard" ? "worldcup" : STATE.competition),
  );
}

function dailyPageKeyForCompetition(competition = currentDailyCompetition()) {
  return normalizeCompetitionValue(competition) === "worldcup" ? "worldCupDaily" : "daily";
}

function dailyPathForCompetition(competition = currentDailyCompetition()) {
  return PUBLIC_PAGE_DEFS[dailyPageKeyForCompetition(competition)].path;
}

function leaderboardPageKeyForCompetition(competition = currentLeaderboardCompetition()) {
  return normalizeCompetitionValue(competition) === "worldcup" ? "worldCupLeaderboard" : "leaderboard";
}

function leaderboardPathForCompetition(competition = currentLeaderboardCompetition()) {
  return PUBLIC_PAGE_DEFS[leaderboardPageKeyForCompetition(competition)].path;
}

function otherDailyCompetition(competition = currentDailyCompetition()) {
  return normalizeCompetitionValue(competition) === "worldcup" ? "ashes" : "worldcup";
}

function dailyApiBasePath(competition = currentDailyCompetition()) {
  return normalizeCompetitionValue(competition) === "worldcup" ? "/api/world-cup/daily" : "/api/daily";
}

function leaderboardCopyForCompetition(competition = currentLeaderboardCompetition()) {
  const worldCup = normalizeCompetitionValue(competition) === "worldcup";
  return {
    title: worldCup
      ? "Community favourites from completed World Cup XIs."
      : "Community favourites from completed Ashes XIs.",
    lede: worldCup
      ? "See which World Cup ODI players are selected most often across completed XIs, daily challenges, and community drafts."
      : "See which Ashes players are selected most often across completed XIs, Daily Challenges, challenge teams, and community drafts.",
    loading: "Loading community statistics.",
    intro: worldCup
      ? "Selection counts update as more completed teams are recorded. World Cup Daily picks are counted once a daily XI is finished."
      : "Selection counts update as more completed teams are recorded. Daily Challenge picks are counted once a daily XI is finished.",
    empty: worldCup
      ? "No completed World Cup teams match these filters yet."
      : "No completed Ashes teams match these filters yet.",
  };
}

function currentDailyAttemptMode() {
  return STATE.daily.attempt?.attemptMode ?? "ranked";
}

function currentDailyDisplayName() {
  return resolveDailyDisplayName(
    STATE.daily.attempt?.displayName,
    STATE.daily.displayName,
    STATE.daily.summary?.rankedAttempt?.displayName,
    loadStoredDailyDisplayName(currentDailyChallengeId(), currentDailyAttemptMode()),
  );
}

function currentDailyPlayerPool() {
  if (STATE.daily.currentTeamPool.length) {
    return STATE.daily.currentTeamPool;
  }

  return [
    ...STATE.daily.fixedPlayers,
    ...STATE.daily.lockedSelections.map((selection) => selection.player).filter(Boolean),
  ];
}

function buildLineupMapFromArray(lineup) {
  const lineupMap = new Map();
  lineup.forEach((player, index) => {
    if (player) {
      lineupMap.set(index, player);
    }
  });
  return lineupMap;
}

function buildBestPartialLineupMap(players) {
  const pool = [];
  const seen = new Set();

  for (const player of Array.isArray(players) ? players : []) {
    if (!player) continue;
    const key = playerKey(player);
    if (seen.has(key)) continue;
    seen.add(key);
    pool.push(player);
  }

  if (!pool.length) {
    return new Map();
  }

  const order = pool
    .map((player) => ({
      player,
      candidates: XI_SLOTS
        .map((slot, index) => ({
          index,
          score: playerSlotScore(player, slot),
        }))
        .filter(({ index }) => slotAcceptsPlayer(XI_SLOTS[index], player))
        .sort((left, right) => right.score - left.score),
    }))
    .sort((left, right) => {
      const candidateDelta = left.candidates.length - right.candidates.length;
      if (candidateDelta !== 0) return candidateDelta;
      return playerOverall(right.player) - playerOverall(left.player);
    });

  let bestPlaced = -1;
  let bestScore = Number.NEGATIVE_INFINITY;
  let bestAssignment = new Map();
  const usedSlots = new Array(XI_SLOTS.length).fill(false);
  const assignment = new Map();

  function search(orderIndex, placedCount, totalScore) {
    if (placedCount + (order.length - orderIndex) < bestPlaced) {
      return;
    }

    if (orderIndex >= order.length) {
      if (placedCount > bestPlaced || (placedCount === bestPlaced && totalScore > bestScore)) {
        bestPlaced = placedCount;
        bestScore = totalScore;
        bestAssignment = new Map(assignment);
      }
      return;
    }

    const { player, candidates } = order[orderIndex];
    for (const candidate of candidates) {
      if (usedSlots[candidate.index]) continue;
      usedSlots[candidate.index] = true;
      assignment.set(candidate.index, player);
      search(orderIndex + 1, placedCount + 1, totalScore + candidate.score);
      assignment.delete(candidate.index);
      usedSlots[candidate.index] = false;
    }

    search(orderIndex + 1, placedCount, totalScore);
  }

  search(0, 0, 0);
  return bestAssignment;
}

function currentDailyLineupMap() {
  if (STATE.daily.completedXI.length === XI_SLOTS.length) {
    return buildLineupMapFromArray(STATE.daily.completedXI);
  }

  const fixedPlayersHaveSlots = STATE.daily.fixedPlayers.every((player) => Number.isInteger(player?.slotIndex));
  const selectionsHaveSlots = STATE.daily.lockedSelections.every((selection) => Number.isInteger(selection?.slotIndex));
  if (fixedPlayersHaveSlots && selectionsHaveSlots) {
    const lineupMap = new Map();
    STATE.daily.fixedPlayers.forEach((player) => {
      lineupMap.set(player.slotIndex, player);
    });
    STATE.daily.lockedSelections.forEach((selection) => {
      if (selection.player) {
        lineupMap.set(selection.slotIndex, selection.player);
      }
    });
    return lineupMap;
  }

  return buildBestPartialLineupMap(currentDailyPlayerPool());
}

function resetDailyState({ preserveSummary = true, preserveParticipant = true } = {}) {
  const next = buildInitialDailyState();
  next.summary = preserveSummary ? STATE.daily.summary : null;
  next.participantId = preserveParticipant ? STATE.daily.participantId : "";
  next.displayName = currentDailyDisplayName();
  next.competition = preserveSummary ? currentDailyCompetition() : next.competition;
  STATE.daily = next;
}

function isMemoryMode() {
  if (dailyChallengeActive()) return true;
  if (isChallengeMode()) {
    return currentChallengePlayableMode() === "memory";
  }
  return STATE.mode === "memory";
}

function isChallengeMode() {
  return STATE.mode === "challenge";
}

function resultSnapshotLoaded() {
  return Boolean(STATE.result);
}

function challengeLineupLoaded() {
  return STATE.competition === "ashes"
    && Array.isArray(STATE.challenge?.lineup)
    && STATE.challenge.lineup.length === XI_SLOTS.length;
}

function challengeCreationMode() {
  return STATE.competition === "ashes"
    && !dailyChallengeActive()
    && isChallengeMode()
    && !challengeLineupLoaded()
    && !resultSnapshotLoaded();
}

function modeLabel() {
  if (dailyChallengeActive()) {
    return currentDailyAttemptMode() === "practice" ? "Daily Practice" : "Daily Challenge";
  }
  if (isChallengeMode()) {
    return isMemoryMode() ? "Memory Challenge" : "Challenge";
  }
  if (isMemoryMode()) return "Memory";
  return "Classic";
}

function currentModeDef() {
  if (dailyChallengeActive()) {
    return playableModeDef("memory");
  }
  if (isChallengeMode()) {
    return playableModeDef(currentChallengePlayableMode());
  }
  return playableModeDef(STATE.mode);
}

function showPlayerRatingsInDraft() {
  return currentModeDef().showPlayerRatings && !dailyChallengeActive();
}

function currentModeDraftNote() {
  if (dailyChallengeActive()) {
    return "Ratings stay hidden in the Daily Challenge until the result is complete.";
  }
  return currentModeDef().draftNote;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function announce(message) {
  if (!els.liveRegion) return;
  els.liveRegion.textContent = "";
  window.setTimeout(() => {
    els.liveRegion.textContent = String(message ?? "");
  }, 10);
}

function parsePreferredModeFromLocation() {
  const url = new URL(window.location.href);
  const requested = url.searchParams.get("mode");
  return requested === "memory" ? "memory" : requested === "classic" ? "classic" : "";
}

function scrollViewportTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

function homePreviewFallbackPlayers(competition = STATE.competition) {
  return competition === "worldcup"
    ? ["Tendulkar", "Gilchrist", "Kallis", "Akram"]
    : ["Compton", "Bradman", "Botham", "Warne"];
}

function homePreviewPlayerNames(summary, competition = STATE.competition) {
  const fixedPlayers = Array.isArray(summary?.fixedPlayers) ? summary.fixedPlayers : [];
  const names = fixedPlayers
    .map((player) => player?.name)
    .filter(Boolean)
    .slice(0, 4);
  const fallback = homePreviewFallbackPlayers(competition);
  const merged = [...names];
  for (const playerName of fallback) {
    if (merged.length >= 4) break;
    if (!merged.includes(playerName)) merged.push(playerName);
  }
  return merged.length ? merged : fallback;
}

function homePreviewLeaderText(summary) {
  return summary?.leaderboardPreview?.margin || "No result yet";
}

function renderHomePreviewCard(summary = null) {
  if (!els.homePreviewCard) return;

  const worldCup = STATE.competition === "worldcup";
  const competition = worldCup ? "worldcup" : "ashes";
  const rankedParticipantsCount = summary?.rankedParticipantsCount;
  const participantCount = Number.isFinite(Number(rankedParticipantsCount))
    ? Number(rankedParticipantsCount)
    : null;
  const players = homePreviewPlayerNames(summary, competition);

  els.homePreviewCard.dataset.competition = competition;
  els.homePreviewKicker.textContent = worldCup ? "World Cup Daily" : "Daily Challenge";
  els.homePreviewScore.hidden = !worldCup;
  els.homePreviewScore.textContent = worldCup ? "One-day ODI" : "";
  els.homePreviewLabel.textContent = "Seven players locked in";
  els.homePreviewSummary.textContent = worldCup
    ? "4 choices finish the ODI XI"
    : "4 choices decide the XI";
  els.homePreviewPlayers.innerHTML = players
    .map((name) => `<span>${escapeHtml(name)}</span>`)
    .join("");
  els.homeSquadsLabel.textContent = "Users today";
  els.totalSquads.textContent = participantCount === null ? "Loading" : String(participantCount);
  els.homePlayersLabel.textContent = "Leading score";
  els.totalPlayers.textContent = homePreviewLeaderText(summary);
  els.homeFormatLabel.textContent = "Locked in";
  els.homeFormatValue.textContent = "7 players";
}

function currentPathname() {
  const pathname = window.location.pathname.replace(/\/index\.html$/i, "/");
  return pathname === "" ? "/" : pathname.replace(/\/+$/u, "") || "/";
}

function currentPublicPageKey() {
  const bootstrappedPageKey = String(BOOTSTRAP?.route?.pageKey ?? "").trim();
  if (bootstrappedPageKey && PUBLIC_PAGE_DEFS[bootstrappedPageKey]) {
    return bootstrappedPageKey;
  }
  return publicPageKeyForPath(currentPathname());
}

function currentPublicPageDef() {
  const pageKey = currentPublicPageKey();
  return pageKey ? PUBLIC_PAGE_DEFS[pageKey] ?? null : null;
}

function staticHomePageActive() {
  return STATIC_HOME_PAGE_KEYS.has(currentPublicPageKey());
}

function mobileBuilderViewport() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function activeNavKey() {
  const pageKey = currentPublicPageKey();
  if (pageKey === "about") return "about";
  if (pageKey === "howToPlay") return "howToPlay";
  if (pageKey === "leaderboard" || pageKey === "worldCupLeaderboard") return "leaderboard";
  if (pageKey === "daily") return "daily";
  if (pageKey === "worldCup" || pageKey === "worldCupDaily") return "worldCup";
  if (pageKey === "ashes" || pageKey === "challenge") return "play";
  return "";
}

function closeSiteNav() {
  if (!els.siteNav || !els.navToggle || !els.navLinks) return;
  els.siteNav.dataset.open = "false";
  els.navToggle.setAttribute("aria-expanded", "false");
}

function toggleSiteNav(forceOpen) {
  if (!els.siteNav || !els.navToggle || !els.navLinks) return;
  const nextOpen = typeof forceOpen === "boolean"
    ? forceOpen
    : els.siteNav.dataset.open !== "true";
  els.siteNav.dataset.open = nextOpen ? "true" : "false";
  els.navToggle.setAttribute("aria-expanded", nextOpen ? "true" : "false");
}

function blurActiveBuilderControl() {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body) {
    active.blur();
  }
}

function scrollBuilderTargetIntoView(target, offset = 14) {
  if (!target || !mobileBuilderViewport()) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const runScroll = () => {
    const targetTop = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
    window.scrollTo({
      top: targetTop,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  blurActiveBuilderControl();
  window.requestAnimationFrame(() => {
    runScroll();
    window.setTimeout(runScroll, reduceMotion ? 0 : 120);
  });
}

function currentSiteOrigin() {
  if (window.location.origin?.startsWith("http")) {
    return window.location.origin;
  }

  return CANONICAL_SITE_ORIGIN;
}

function pageUrlForOrigin(origin) {
  return new URL(currentPathname(), origin);
}

function normalizeChallengeCreatorName(value) {
  const normalized = String(value ?? "")
    .replace(/\s+/gu, " ")
    .trim();
  return normalized ? normalized.slice(0, 40) : "";
}

function normalizePlayableMode(value) {
  return value === "memory" ? "memory" : "classic";
}

function loadedChallengeCreatorName() {
  return normalizeChallengeCreatorName(STATE.challenge?.creatorName ?? "");
}

function loadedResultChallengerName() {
  return normalizeChallengeCreatorName(STATE.result?.challengerDisplayName ?? "");
}

function loadedResultResponderName() {
  return normalizeChallengeCreatorName(STATE.result?.responderDisplayName ?? "");
}

function currentChallengeResponseName() {
  return loadedResultResponderName() || normalizeChallengeCreatorName(STATE.challengeResponseName);
}

function currentChallengeCreatorName() {
  if (resultSnapshotLoaded()) {
    return loadedResultChallengerName();
  }
  return challengeLineupLoaded()
    ? loadedChallengeCreatorName()
    : normalizeChallengeCreatorName(STATE.challengeDraftName);
}

function currentChallengePlayableMode() {
  if (resultSnapshotLoaded()) {
    return normalizePlayableMode(STATE.result?.mode);
  }
  return challengeLineupLoaded()
    ? normalizePlayableMode(STATE.challenge?.mode)
    : normalizePlayableMode(STATE.challengeDraftMode);
}

function challengeModeSelectionLocked() {
  return challengeLineupLoaded()
    || resultSnapshotLoaded()
    || Boolean(STATE.generatedChallenge?.url)
    || Boolean(STATE.currentSquad)
    || Boolean(STATE.rollAnimation?.active)
    || Boolean(STATE.series)
    || STATE.lineup.size > 0;
}

function hashChallengeCode(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function challengeRefForCode(code) {
  return code ? hashChallengeCode(code) : "";
}

function challengeCodeForLineup(lineup, mode = currentChallengePlayableMode()) {
  try {
    return serializeCompactChallengeCode(lineup, mode);
  } catch {
    return "";
  }
}

function currentChallengeRef() {
  if (resultSnapshotLoaded()) {
    return String(STATE.result?.challengeRef ?? "");
  }

  if (challengeLineupLoaded()) {
    return challengeRefForCode(STATE.challenge?.code);
  }

  if (challengeCreationMode() && lineupComplete()) {
    return challengeRefForCode(challengeCodeForLineup(userLineup(), currentChallengePlayableMode()));
  }

  return "";
}

const DISALLOWED_ANALYTICS_KEYS = new Set([
  "challenge_ref",
  "challenge_id",
  "result_id",
  "challenge_url",
  "result_url",
  "creator_name",
  "display_name",
  "team_contents",
]);

function baseChallengeAnalyticsProps(overrides = {}) {
  const props = {
    competition: "ashes",
    challenge_mode: currentChallengePlayableMode(),
    has_creator_name: currentChallengeCreatorName() ? "true" : "false",
    ...overrides,
  };

  return Object.fromEntries(
    Object.entries(props).filter(
      ([key, value]) => !DISALLOWED_ANALYTICS_KEYS.has(key) && value !== "" && value !== null && value !== undefined,
    ),
  );
}

function trackEvent(name, props = {}) {
  const record = {
    name,
    props,
    timestamp: Date.now(),
  };

  const eventLog = window.__ashesAnalyticsLog ?? [];
  eventLog.push(record);
  window.__ashesAnalyticsLog = eventLog.slice(-200);

  const counts = window.__ashesAnalyticsCounts ?? {};
  counts[name] = (counts[name] ?? 0) + 1;
  window.__ashesAnalyticsCounts = counts;

  window.dispatchEvent(new CustomEvent("ashes-analytics", { detail: record }));

  if (typeof window.plausible === "function") {
    window.plausible(name, { props });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, props);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...props });
  }
}

function trackChallengeEvent(name, overrides = {}) {
  trackEvent(name, baseChallengeAnalyticsProps(overrides));
}

function baseDailyAnalyticsProps(overrides = {}) {
  const props = {
    competition: currentDailyCompetition(),
    challenge_mode: "memory",
    daily_challenge_date: STATE.daily.challenge?.date ?? STATE.daily.summary?.date ?? "",
    attempt_mode: currentDailyAttemptMode(),
    ...overrides,
  };

  return Object.fromEntries(
    Object.entries(props).filter(
      ([key, value]) => !DISALLOWED_ANALYTICS_KEYS.has(key)
        && key !== "participant_id"
        && key !== "submission_key"
        && key !== "simulation_seed"
        && key !== "future_squads"
        && key !== "candidate_list"
        && value !== ""
        && value !== null
        && value !== undefined,
    ),
  );
}

function trackDailyEvent(name, overrides = {}) {
  trackEvent(name, baseDailyAnalyticsProps(overrides));
}

function deviceCategory() {
  if (window.matchMedia("(max-width: 760px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1040px)").matches) return "tablet";
  return "desktop";
}

function analyticsModeValue() {
  if (dailyChallengeActive()) {
    return currentDailyAttemptMode() === "practice" ? "daily_practice" : "daily";
  }
  if (isChallengeMode()) {
    return currentChallengePlayableMode() === "memory" ? "friend_memory" : "friend_classic";
  }
  return currentModeDef().key;
}

function analyticsChallengeType() {
  if (dailyChallengeActive()) return "daily";
  if (isChallengeMode() || challengeLineupLoaded() || resultSnapshotLoaded()) return "friend";
  return STATE.competition === "worldcup" ? "worldcup" : "solo";
}

function trackStandardEvent(name, overrides = {}) {
  trackEvent(name, {
    mode: analyticsModeValue(),
    device_category: deviceCategory(),
    challenge_type: analyticsChallengeType(),
    completion_stage: STATE.view,
    ...overrides,
  });
}

function base64UrlEncodeBytes(bytes) {
  const binary = Array.from(bytes, (value) => String.fromCharCode(value)).join("");
  return window.btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function base64UrlDecodeBytes(value) {
  const normalized = String(value ?? "").replaceAll("-", "+").replaceAll("_", "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const binary = window.atob(`${normalized}${padding}`);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function encodeJsonPayload(payload) {
  const text = new TextEncoder().encode(JSON.stringify(payload));
  return base64UrlEncodeBytes(text);
}

function decodeJsonPayload(value) {
  try {
    const bytes = base64UrlDecodeBytes(value);
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function createRandomId(byteLength = 9) {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return base64UrlEncodeBytes(bytes);
}

function createSubmissionKey() {
  return createRandomId(10);
}

function currentDailyReferenceDateText() {
  return new Date().toISOString().slice(0, 10);
}

function loadOrCreateDailyParticipantId() {
  try {
    const existing = window.localStorage.getItem(DAILY_PARTICIPANT_STORAGE_KEY);
    if (existing && /^[A-Za-z0-9_-]{12,80}$/u.test(existing)) {
      return existing;
    }
  } catch {}

  const participantId = createRandomId(12);
  try {
    window.localStorage.setItem(DAILY_PARTICIPANT_STORAGE_KEY, participantId);
  } catch {}
  return participantId;
}

function resetSubmissionState() {
  STATE.teamSubmissionKey = createSubmissionKey();
  STATE.challengeSubmissionKey = createSubmissionKey();
  STATE.resultSubmissionKey = "";
  STATE.soloTeamRecorded = false;
  STATE.generatedChallenge = null;
}

function hydrateAshesLineup(lineupPlayerIds) {
  if (!Array.isArray(lineupPlayerIds) || lineupPlayerIds.length !== XI_SLOTS.length) return null;
  const lineup = lineupPlayerIds.map((playerId) => {
    const index = ASHES_CATALOG_INDEX_BY_ID.get(playerId);
    return Number.isInteger(index) ? ASHES_CATALOG[index] : null;
  });
  return lineup.every(Boolean) ? decodeChallengeLineup(lineup) : null;
}

function isShortChallengePath(pathname = currentPathname()) {
  return /^\/c\/[^/]+$/u.test(pathname);
}

function isShortResultPath(pathname = currentPathname()) {
  return /^\/r\/[^/]+$/u.test(pathname);
}

function isLeaderboardPath(pathname = currentPathname()) {
  return pathname === "/leaderboard" || pathname === "/world-cup/leaderboard";
}

function routeUsesDedicatedPath(pathname = currentPathname()) {
  const publicPageKey = publicPageKeyForPath(pathname);
  const publicPage = publicPageKey ? PUBLIC_PAGE_DEFS[publicPageKey] ?? null : null;
  return isShortChallengePath(pathname)
    || isShortResultPath(pathname)
    || isLeaderboardPath(pathname)
    || Boolean(publicPage?.path && publicPage.path !== "/");
}

function replaceBrowserPath(pathname) {
  window.history.replaceState({}, "", pathname);
}

function clearRouteError() {
  STATE.routeError = null;
}

function setRouteError(title, message) {
  STATE.routeError = { title, message };
  STATE.challenge = null;
  STATE.result = null;
  STATE.view = "home";
}

function applyChallengeApiPayload(challenge, team) {
  const lineup = hydrateAshesLineup(team?.lineupPlayerIds ?? []);
  if (!challenge || !team || !lineup) return null;
  return {
    publicId: challenge.id,
    shortUrl: challenge.url,
    code: challenge.id,
    creatorName: normalizeChallengeCreatorName(team.displayName),
    mode: normalizePlayableMode(team.mode) ?? "classic",
    lineup,
    lineupPlayerIds: [...team.lineupPlayerIds],
    label: "Challenge XI",
  };
}

function applyResultApiPayload(result) {
  if (!result || typeof result !== "object") return null;
  return {
    ...result,
    publicId: result.id ?? result.publicId ?? "",
    shortUrl: result.shortUrl ?? (result.id ? `${CANONICAL_SITE_ORIGIN}/r/${result.id}` : ""),
  };
}

function leaderboardMetricLabel(metric) {
  return metric === "selected" ? "Selected" : "Selected";
}

function leaderboardPeriodLabel(period) {
  return period === "30d" ? "Last 30 days" : "All time";
}

function challengeModeCode(mode) {
  return normalizePlayableMode(mode) === "memory" ? "m" : "c";
}

function challengeModeFromCode(code) {
  if (code === "m") return "memory";
  if (code === "c") return "classic";
  return null;
}

function serializeCompactLineup(lineup) {
  const payload = lineup.map((player) => {
    const index = ASHES_CATALOG_INDEX_BY_ID.get(player.id);
    if (!Number.isInteger(index)) {
      throw new Error(`Unknown Ashes player in lineup: ${player.id}`);
    }
    return index.toString(36).padStart(2, "0");
  }).join("");
  return payload;
}

function decodeChallengeLineup(lineup) {
  if (!Array.isArray(lineup) || lineup.length !== XI_SLOTS.length) return null;
  const ids = lineup.map((player) => player?.id).filter(Boolean);
  if (ids.length !== XI_SLOTS.length || new Set(ids).size !== XI_SLOTS.length) {
    return null;
  }

  const valid = lineup.every((player, index) => slotAcceptsPlayer(XI_SLOTS[index], player));
  return valid ? lineup : null;
}

function deserializeCompactLineup(serialized) {
  const code = String(serialized ?? "").trim().toLowerCase();
  const expectedLength = XI_SLOTS.length * 2;
  if (code.length !== expectedLength) return null;
  const lineup = [];
  for (let offset = 0; offset < code.length; offset += 2) {
    const token = code.slice(offset, offset + 2);
    if (!/^[0-9a-z]{2}$/u.test(token)) return null;
    const player = ASHES_CATALOG[Number.parseInt(token, 36)] ?? null;
    if (!player) return null;
    lineup.push(player);
  }

  return decodeChallengeLineup(lineup);
}

function serializeCompactChallengeCode(lineup, mode = "classic") {
  return `${challengeModeCode(mode)}${serializeCompactLineup(lineup)}`;
}

function deserializeCompactChallengeCode(serialized) {
  const code = String(serialized ?? "").trim().toLowerCase();
  const expectedLength = 1 + XI_SLOTS.length * 2;
  if (code.length !== expectedLength) return null;

  const mode = challengeModeFromCode(code[0]);
  if (!mode) return null;

  const lineup = deserializeCompactLineup(code.slice(1));
  if (!lineup) return null;
  return { code, lineup, mode };
}

function deserializeLegacyChallengeLineup(serialized) {
  if (!serialized) return null;

  const ids = serialized
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (ids.length !== XI_SLOTS.length || new Set(ids).size !== XI_SLOTS.length) {
    return null;
  }

  const byId = new Map(ASHES_CATALOG.map((player) => [player.id, player]));
  const lineup = ids.map((id) => byId.get(id) ?? null);
  return decodeChallengeLineup(lineup);
}

function challengeInviteText(url, creatorName = "", mode = "classic") {
  const normalizedCreatorName = normalizeChallengeCreatorName(creatorName);
  const modeName = normalizePlayableMode(mode) === "memory" ? "Memory" : "Classic";
  return normalizedCreatorName
    ? `${normalizedCreatorName} has challenged you to an Ashes 5-0 ${modeName} Challenge: ${url}`
    : `Play this Ashes 5-0 ${modeName} Challenge: ${url}`;
}

function challengeUrlForLineup(lineup, creatorName = "", mode = "classic", origin = currentSiteOrigin()) {
  const url = pageUrlForOrigin(origin);
  url.searchParams.set(CHALLENGE_QUERY_KEY, serializeCompactChallengeCode(lineup, mode));
  const normalizedCreatorName = normalizeChallengeCreatorName(creatorName);
  if (normalizedCreatorName) {
    url.searchParams.set(CHALLENGE_CREATOR_QUERY_KEY, normalizedCreatorName);
  } else {
    url.searchParams.delete(CHALLENGE_CREATOR_QUERY_KEY);
  }
  return url.toString();
}

function currentChallengeUrl() {
  if (challengeLineupLoaded()) {
    return STATE.challenge?.shortUrl
      || challengeUrlForLineup(STATE.challenge.lineup, currentChallengeCreatorName(), currentChallengePlayableMode());
  }

  if (STATE.generatedChallenge?.url) {
    return STATE.generatedChallenge.url;
  }

  return "";
}

function sanitizeResultText(value, maxLength = 160) {
  return String(value ?? "")
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, maxLength);
}

function encodeLeaderSnapshot(entry) {
  if (!entry) return null;
  return [
    entry.side === "star" ? "s" : "y",
    sanitizeResultText(entry.name, 60),
    clamp(Math.round(entry.runs ?? 0), 0, 9999),
    clamp(Math.round(entry.wickets ?? 0), 0, 999),
    clamp(Math.round(entry.centuries ?? 0), 0, 99),
    clamp(Math.round(entry.fiveFors ?? 0), 0, 99),
    clamp(Math.round(entry.points ?? 0), 0, 9999),
  ];
}

function decodeLeaderSnapshot(entry) {
  if (!Array.isArray(entry) || entry.length < 7) return null;
  const side = entry[0] === "s" ? "star" : "your";
  const name = sanitizeResultText(entry[1], 60);
  if (!name) return null;
  return {
    side,
    name,
    runs: clamp(Math.round(Number(entry[2]) || 0), 0, 9999),
    wickets: clamp(Math.round(Number(entry[3]) || 0), 0, 999),
    centuries: clamp(Math.round(Number(entry[4]) || 0), 0, 99),
    fiveFors: clamp(Math.round(Number(entry[5]) || 0), 0, 99),
    points: clamp(Math.round(Number(entry[6]) || 0), 0, 9999),
  };
}

function encodeSeriesLeaders(leaders) {
  if (!leaders) return null;
  return {
    o: encodeLeaderSnapshot(leaders.overallLeader),
    r: encodeLeaderSnapshot(leaders.mostRuns),
    w: encodeLeaderSnapshot(leaders.mostWickets),
    c: encodeLeaderSnapshot(leaders.mostCenturies),
    f: encodeLeaderSnapshot(leaders.mostFiveFors),
    ur: clamp(Math.round(leaders.userRuns ?? 0), 0, 99999),
    uw: clamp(Math.round(leaders.userWickets ?? 0), 0, 9999),
  };
}

function decodeSeriesLeaders(payload) {
  if (!payload || typeof payload !== "object") return null;
  return {
    overallLeader: decodeLeaderSnapshot(payload.o),
    mostRuns: decodeLeaderSnapshot(payload.r),
    mostWickets: decodeLeaderSnapshot(payload.w),
    mostCenturies: decodeLeaderSnapshot(payload.c),
    mostFiveFors: decodeLeaderSnapshot(payload.f),
    userRuns: clamp(Math.round(Number(payload.ur) || 0), 0, 99999),
    userWickets: clamp(Math.round(Number(payload.uw) || 0), 0, 9999),
  };
}

function encodeResultBox(box) {
  return {
    bn: sanitizeResultText(box?.batter?.name, 60) || "Unknown",
    br: clamp(Math.round(Number(box?.batter?.runs) || 0), 0, 999),
    wn: sanitizeResultText(box?.bowler?.name, 60) || "Unknown",
    wf: sanitizeResultText(box?.bowler?.figures, 24) || "0/0",
  };
}

function decodeResultBox(payload) {
  if (!payload || typeof payload !== "object") {
    return {
      batter: { name: "Unknown", runs: 0 },
      bowler: { name: "Unknown", figures: "0/0" },
    };
  }

  return {
    batter: {
      name: sanitizeResultText(payload.bn, 60) || "Unknown",
      runs: clamp(Math.round(Number(payload.br) || 0), 0, 999),
    },
    bowler: {
      name: sanitizeResultText(payload.wn, 60) || "Unknown",
      figures: sanitizeResultText(payload.wf, 24) || "0/0",
    },
  };
}

function encodeResultMatch(match) {
  return {
    n: clamp(Math.round(match.matchNumber ?? match.testNumber ?? 0), 1, 5),
    v: sanitizeResultText(match.venue, 60),
    r: match.result === "loss" || match.result === "draw" ? match.result : "win",
    h: sanitizeResultText(match.headline, 120),
    s: sanitizeResultText(match.summary, 120),
    sc: sanitizeResultText(match.scoreline, 120),
    i: (match.innings ?? []).map((innings) => [
      sanitizeResultText(innings.label, 48),
      sanitizeResultText(innings.score, 32),
    ]),
    ub: encodeResultBox(match.userBox),
    sb: encodeResultBox(match.starBox),
  };
}

function decodeResultMatch(payload) {
  if (!payload || typeof payload !== "object") return null;
  const matchNumber = clamp(Math.round(Number(payload.n) || 0), 1, 5);
  const result = payload.r === "loss" || payload.r === "draw" ? payload.r : "win";
  const innings = Array.isArray(payload.i)
    ? payload.i
        .map((entry) => {
          if (!Array.isArray(entry) || entry.length < 2) return null;
          return {
            label: sanitizeResultText(entry[0], 48),
            score: sanitizeResultText(entry[1], 32),
          };
        })
        .filter(Boolean)
    : [];

  return {
    format: "tests",
    snapshotOnly: true,
    testNumber: matchNumber,
    matchNumber,
    venue: sanitizeResultText(payload.v, 60) || "Historic venue",
    result,
    headline: sanitizeResultText(payload.h, 120) || "Series result",
    summary: sanitizeResultText(payload.s, 120) || "Test complete",
    scoreline: sanitizeResultText(payload.sc, 120) || "",
    innings,
    userBox: decodeResultBox(payload.ub),
    starBox: decodeResultBox(payload.sb),
  };
}

function encodeChallengeResultRecord(record) {
  return encodeJsonPayload({
    v: CHALLENGE_RESULT_VERSION,
    rid: record.responseId,
    cr: record.challengeRef,
    m: record.mode,
    cn: record.challengerDisplayName,
    rn: record.responderDisplayName,
    cl: serializeCompactLineup(record.challengerLineup),
    rl: serializeCompactLineup(record.responderLineup),
    uw: record.userWins,
    sw: record.starWins,
    dr: record.draws,
    mt: record.matches.map(encodeResultMatch),
    ld: encodeSeriesLeaders(record.leaders),
    po: encodeLeaderSnapshot(record.playerOfSeries),
    ac: Array.isArray(record.achievements) ? record.achievements.map((item) => sanitizeResultText(item, 40)).filter(Boolean) : [],
    ca: record.completedAt,
    sv: record.simulationVersion,
  });
}

function decodeChallengeResultRecord(serialized) {
  const payload = decodeJsonPayload(serialized);
  if (!payload || payload.v !== CHALLENGE_RESULT_VERSION) return null;

  const challengerLineup = deserializeCompactLineup(payload.cl);
  const responderLineup = deserializeCompactLineup(payload.rl);
  if (!challengerLineup || !responderLineup) return null;

  const matches = Array.isArray(payload.mt) ? payload.mt.map(decodeResultMatch).filter(Boolean) : [];
  if (!matches.length) return null;

  return {
    responseId: sanitizeResultText(payload.rid, 24) || createRandomId(),
    challengeRef: sanitizeResultText(payload.cr, 24),
    mode: normalizePlayableMode(payload.m),
    challengerDisplayName: normalizeChallengeCreatorName(payload.cn),
    responderDisplayName: normalizeChallengeCreatorName(payload.rn),
    challengerLineup,
    responderLineup,
    userWins: clamp(Math.round(Number(payload.uw) || 0), 0, 5),
    starWins: clamp(Math.round(Number(payload.sw) || 0), 0, 5),
    draws: clamp(Math.round(Number(payload.dr) || 0), 0, 5),
    matches,
    leaders: decodeSeriesLeaders(payload.ld),
    playerOfSeries: decodeLeaderSnapshot(payload.po),
    achievements: Array.isArray(payload.ac)
      ? payload.ac.map((item) => sanitizeResultText(item, 40)).filter(Boolean)
      : [],
    completedAt: sanitizeResultText(payload.ca, 40) || new Date().toISOString(),
    simulationVersion: sanitizeResultText(payload.sv, 40) || RESULT_SIMULATION_VERSION,
  };
}

function resultUrlForRecord(record, origin = currentSiteOrigin()) {
  const url = pageUrlForOrigin(origin);
  url.searchParams.set(RESULT_QUERY_KEY, encodeChallengeResultRecord(record));
  url.searchParams.delete(CHALLENGE_QUERY_KEY);
  url.searchParams.delete(CHALLENGE_CREATOR_QUERY_KEY);
  url.searchParams.delete(LEGACY_CHALLENGE_QUERY_KEY);
  url.searchParams.delete(LEGACY_CHALLENGE_CREATOR_QUERY_KEY);
  url.searchParams.delete(LEGACY_CHALLENGE_MODE_QUERY_KEY);
  return url.toString();
}

function currentResultUrl() {
  if (!resultSnapshotLoaded()) return "";
  return STATE.result?.shortUrl || resultUrlForRecord(STATE.result);
}

function clearResultUrlFromBrowser() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(RESULT_QUERY_KEY)) return;
  url.searchParams.delete(RESULT_QUERY_KEY);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function writeResultUrlToBrowser(record) {
  if (record?.shortUrl) {
    const url = new URL(record.shortUrl, currentSiteOrigin());
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    return;
  }

  const url = new URL(resultUrlForRecord(record, currentSiteOrigin()));
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function clearChallengeUrlFromBrowser() {
  const url = new URL(window.location.href);
  const hasChallengeParams = [
    CHALLENGE_QUERY_KEY,
    CHALLENGE_CREATOR_QUERY_KEY,
    LEGACY_CHALLENGE_QUERY_KEY,
    LEGACY_CHALLENGE_CREATOR_QUERY_KEY,
    LEGACY_CHALLENGE_MODE_QUERY_KEY,
  ].some((key) => url.searchParams.has(key));
  if (!hasChallengeParams) return;
  url.searchParams.delete(CHALLENGE_QUERY_KEY);
  url.searchParams.delete(CHALLENGE_CREATOR_QUERY_KEY);
  url.searchParams.delete(LEGACY_CHALLENGE_QUERY_KEY);
  url.searchParams.delete(LEGACY_CHALLENGE_CREATOR_QUERY_KEY);
  url.searchParams.delete(LEGACY_CHALLENGE_MODE_QUERY_KEY);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function loadChallengeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const compactCode = params.get(CHALLENGE_QUERY_KEY);
  const legacySerialized = params.get(LEGACY_CHALLENGE_QUERY_KEY);
  if (!compactCode && !legacySerialized) return null;

  const compactChallenge = compactCode ? deserializeCompactChallengeCode(compactCode) : null;
  const legacyLineup = compactChallenge ? null : deserializeLegacyChallengeLineup(legacySerialized);
  const creatorName = normalizeChallengeCreatorName(
    params.get(CHALLENGE_CREATOR_QUERY_KEY) ?? params.get(LEGACY_CHALLENGE_CREATOR_QUERY_KEY),
  );

  if (!compactChallenge && !legacyLineup) {
    clearChallengeUrlFromBrowser();
    return null;
  }

  const mode = compactChallenge
    ? compactChallenge.mode
    : normalizePlayableMode(params.get(LEGACY_CHALLENGE_MODE_QUERY_KEY));
  const lineup = compactChallenge?.lineup ?? legacyLineup;
  const code = compactChallenge?.code ?? String(legacySerialized ?? "");

  return {
    code,
    creatorName,
    mode,
    lineup,
    label: "Challenge XI",
  };
}

function loadResultFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const serialized = params.get(RESULT_QUERY_KEY);
  if (!serialized) return null;

  const result = decodeChallengeResultRecord(serialized);
  if (!result) {
    clearResultUrlFromBrowser();
    return null;
  }

  return result;
}

function challengerTeamLabelFromName(name) {
  const normalized = normalizeChallengeCreatorName(name);
  return normalized ? `${normalized}'s XI` : "Challenger's XI";
}

function responderTeamLabelFromName(name, fallback = "Your XI") {
  const normalized = normalizeChallengeCreatorName(name);
  return normalized ? `${normalized}'s XI` : fallback;
}

function currentSeriesUserLabel() {
  if (dailyChallengeActive()) {
    return responderTeamLabelFromName(currentDailyDisplayName(), "Your XI");
  }

  if (resultSnapshotLoaded()) {
    return responderTeamLabelFromName(STATE.result?.responderDisplayName, "Responder's XI");
  }

  if (challengeLineupLoaded()) {
    return responderTeamLabelFromName(STATE.challengeResponseName, "Your XI");
  }

  return "Your XI";
}

function currentSeriesOppositionLabel() {
  if (resultSnapshotLoaded()) {
    return challengerTeamLabelFromName(STATE.result?.challengerDisplayName);
  }

  if (challengeLineupLoaded()) {
    return challengerTeamLabelFromName(STATE.challenge?.creatorName);
  }

  return competitionConfig().oppositionShortTitle;
}

function currentChallengeSendTarget() {
  const name = resultSnapshotLoaded()
    ? loadedResultChallengerName()
    : loadedChallengeCreatorName();
  return name || "";
}

function challengeSeriesOutcome(seriesOrResult = STATE.result ?? STATE.series) {
  if (!seriesOrResult) return "draw";
  if ((seriesOrResult.userWins ?? 0) > (seriesOrResult.starWins ?? 0)) return "win";
  if ((seriesOrResult.userWins ?? 0) < (seriesOrResult.starWins ?? 0)) return "loss";
  return "draw";
}

function challengeSeriesScore(seriesOrResult = STATE.result ?? STATE.series) {
  if (!seriesOrResult) return "0-0";
  return `${seriesOrResult.userWins}-${seriesOrResult.starWins}${(seriesOrResult.draws ?? 0) ? `-${seriesOrResult.draws}` : ""}`;
}

function seriesFromResultRecord(result) {
  const userLineup = [...result.responderLineup];
  const starLineup = [...result.challengerLineup];
  return {
    snapshotResult: true,
    userLineup,
    starLineup,
    userTeam: teamMetricsFromLineup(userLineup),
    starTeam: teamMetricsFromLineup(starLineup),
    matches: result.matches.map((match) => ({ ...match })),
    revealed: result.matches.length,
    userWins: result.userWins,
    starWins: result.starWins,
    draws: result.draws,
    leaders: result.leaders,
    achievements: result.achievements,
    playerOfSeries: result.playerOfSeries ?? result.leaders?.overallLeader ?? null,
  };
}

function buildChallengeResultRecord() {
  if (!STATE.series || !challengeLineupLoaded() || !seriesComplete()) return null;

  const leaders = STATE.series.leaders ?? collectSeriesStats(STATE.series);
  const achievements = STATE.series.achievements ?? buildAchievementList(STATE.series, leaders);
  const matches = STATE.series.matches.map((match) => decodeResultMatch(encodeResultMatch(match))).filter(Boolean);

  return {
    responseId: createRandomId(),
    challengeRef: currentChallengeRef(),
    mode: currentChallengePlayableMode(),
    challengerDisplayName: loadedChallengeCreatorName(),
    responderDisplayName: normalizeChallengeCreatorName(STATE.challengeResponseName),
    challengerLineup: [...STATE.series.starLineup],
    responderLineup: [...STATE.series.userLineup],
    userWins: STATE.series.userWins,
    starWins: STATE.series.starWins,
    draws: STATE.series.draws,
    matches,
    leaders,
    playerOfSeries: leaders.overallLeader,
    achievements,
    completedAt: new Date().toISOString(),
    simulationVersion: RESULT_SIMULATION_VERSION,
    dataVersion: TEAM_DATA_VERSION,
  };
}

function finalizeChallengeResultIfNeeded() {
  if (STATE.result) return STATE.result;
  const result = buildChallengeResultRecord();
  if (!result) return null;

  STATE.result = result;
  STATE.seriesShareAsset = null;
  STATE.seriesShareAssetPromise = null;
  if (STATE.challenge?.publicId) {
    void ensurePersistedChallengeResult({ background: true });
  } else {
    writeResultUrlToBrowser(result);
  }
  return result;
}

async function postJsonRequest(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

async function getJsonRequest(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

function applyDailySummaryPayload(challengeSummary) {
  if (!challengeSummary) return null;
  const storedDisplayName = loadStoredDailyDisplayName(challengeSummary.id, "ranked");
  const resolvedDisplayName = resolveDailyDisplayName(
    challengeSummary.rankedAttempt?.displayName,
    STATE.daily.displayName,
    storedDisplayName,
  );

  STATE.daily.competition = currentDailyCompetition();
  STATE.daily.summary = {
    ...challengeSummary,
    rankedAttempt: challengeSummary.rankedAttempt
      ? {
          ...challengeSummary.rankedAttempt,
          displayName: resolvedDisplayName,
        }
      : null,
  };
  STATE.daily.challenge = challengeSummary;
  STATE.daily.fixedPlayers = Array.isArray(challengeSummary.fixedPlayers) ? challengeSummary.fixedPlayers : [];
  STATE.daily.currentTeamPool = [...STATE.daily.fixedPlayers];
  STATE.daily.lockedSelections = [];
  STATE.daily.currentRoll = null;
  STATE.daily.completedXI = [];
  STATE.daily.recap = [];
  STATE.daily.communityStats = null;
  STATE.daily.resultsLeaderboard = null;
  STATE.daily.result = null;
  STATE.daily.displayName = resolvedDisplayName;
  STATE.daily.pendingPlayerId = null;
  STATE.daily.attempt = null;
  persistStoredDailyDisplayName(challengeSummary.id, "ranked", resolvedDisplayName);
  return challengeSummary;
}

function applyDailyAttemptPayload(payload) {
  if (!payload?.challenge || !payload?.attempt) return null;

  const storedDisplayName = payload.attempt.attemptMode === "ranked"
    ? loadStoredDailyDisplayName(payload.challenge.id, payload.attempt.attemptMode)
    : "";
  const resolvedDisplayName = resolveDailyDisplayName(
    payload.attempt.displayName,
    STATE.daily.displayName,
    storedDisplayName,
  );
  const nextAttempt = {
    ...payload.attempt,
    displayName: resolvedDisplayName,
  };

  STATE.daily.competition = currentDailyCompetition();

  STATE.daily.summary = {
    ...STATE.daily.summary,
    ...payload.challenge,
    rankedAttempt: nextAttempt.attemptMode === "ranked"
      ? {
          attemptId: nextAttempt.id,
          draftComplete: Boolean(nextAttempt.draftComplete),
          simulationComplete: Boolean(nextAttempt.simulationComplete),
          attemptMode: nextAttempt.attemptMode,
          currentRollNumber: nextAttempt.currentRollNumber,
          displayName: resolvedDisplayName,
        }
      : STATE.daily.summary?.rankedAttempt ?? null,
  };
  STATE.daily.challenge = payload.challenge;
  STATE.daily.attempt = nextAttempt;
  STATE.daily.fixedPlayers = Array.isArray(payload.fixedPlayers) ? payload.fixedPlayers : [];
  STATE.daily.lockedSelections = Array.isArray(payload.lockedSelections) ? payload.lockedSelections : [];
  STATE.daily.currentRoll = payload.currentRoll ?? null;
  STATE.daily.currentTeamPool = Array.isArray(payload.currentTeamPool) ? payload.currentTeamPool : currentDailyPlayerPool();
  STATE.daily.completedXI = Array.isArray(payload.completedXI) ? payload.completedXI : [];
  STATE.daily.recap = Array.isArray(payload.recap) ? payload.recap : [];
  STATE.daily.communityStats = payload.communityStats ?? null;
  STATE.daily.resultsLeaderboard = payload.dailyLeaderboard ?? null;
  STATE.daily.result = payload.result ?? null;
  STATE.daily.displayName = resolvedDisplayName;
  STATE.daily.pendingPlayerId = null;
  STATE.daily.active = true;
  persistStoredDailyAttemptId(payload.challenge.id, nextAttempt.attemptMode, nextAttempt.id);
  if (nextAttempt.attemptMode === "ranked") {
    persistStoredDailyDisplayName(payload.challenge.id, nextAttempt.attemptMode, resolvedDisplayName);
  }

  if (payload.result) {
    STATE.series = payload.result;
    STATE.view = "series";
  } else {
    STATE.series = null;
    STATE.view = "game";
  }

  return payload;
}

function prepareDailyView(targetCompetition = currentDailyCompetition()) {
  const competition = normalizeCompetitionValue(targetCompetition);
  const participantId = STATE.daily.participantId || loadOrCreateDailyParticipantId();
  const displayName = currentDailyDisplayName();
  clearTimer();
  clearRollAnimation();
  STATE.challenge = null;
  STATE.result = null;
  clearChallengeUrlFromBrowser();
  clearResultUrlFromBrowser();
  STATE.challengeDraftName = "";
  STATE.challengeResponseName = "";
  STATE.lineup.clear();
  STATE.currentSquad = null;
  STATE.selectedPlayerId = null;
  STATE.series = null;
  STATE.seriesShareAsset = null;
  STATE.seriesShareAssetPromise = null;
  setShareStatus("");
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  STATE.daily = buildInitialDailyState();
  STATE.daily.participantId = participantId;
  STATE.daily.displayName = displayName;
  STATE.daily.competition = competition;
  STATE.daily.active = true;
  STATE.competition = competition;
  STATE.squads = competition === "worldcup" ? WORLD_CUP_SQUADS : ASHES_SQUADS;
  STATE.mode = "memory";
  addCatalogMetadata();
}

async function loadDailySummary({ force = false, competition = currentDailyCompetition() } = {}) {
  const targetCompetition = normalizeCompetitionValue(competition);
  if (!STATE.daily.participantId) {
    STATE.daily.participantId = loadOrCreateDailyParticipantId();
  }

  if (
    !force
    && STATE.daily.competition === targetCompetition
    && STATE.daily.summary?.id
    && STATE.daily.summary?.date === currentDailyReferenceDateText()
    && !STATE.daily.loadingSummary
  ) {
    return STATE.daily.summary;
  }

  STATE.daily.loadingSummary = true;
  STATE.daily.competition = targetCompetition;
  renderAll();
  try {
    const payload = await getJsonRequest(`${dailyApiBasePath(targetCompetition)}/current?participantId=${encodeURIComponent(STATE.daily.participantId)}`);
    return applyDailySummaryPayload(payload.challenge);
  } finally {
    STATE.daily.loadingSummary = false;
    renderAll();
  }
}

async function resumeDailyAttempt(attemptId) {
  const challengeId = currentDailyChallengeId();
  if (!challengeId || !attemptId) {
    throw new Error("Daily attempt is unavailable.");
  }

  const payload = await getJsonRequest(
    `${dailyApiBasePath()}/${challengeId}/attempts/${attemptId}?participantId=${encodeURIComponent(STATE.daily.participantId)}`,
  );
  applyDailyAttemptPayload(payload);
  if (!payload.attempt.draftComplete) {
    trackDailyEvent("daily_draft_resumed", { roll_number: payload.attempt.currentRollNumber });
    if (payload.currentRoll?.rollNumber) {
      trackDailyEvent("daily_roll_revealed", { roll_number: payload.currentRoll.rollNumber, source: "resume" });
    }
  } else {
    trackDailyEvent("daily_draft_recap_viewed", { source: "resume" });
  }
  renderAll();
  return payload;
}

async function startDailyAttempt(attemptMode = "ranked") {
  const challengeId = currentDailyChallengeId();
  if (!challengeId) {
    throw new Error("Daily challenge is unavailable.");
  }

  STATE.daily.loadingAction = true;
  renderAll();
  try {
    const payload = await postJsonRequest(`${dailyApiBasePath()}/${challengeId}/start`, {
      participantId: STATE.daily.participantId,
      submissionKey: createSubmissionKey(),
      attemptMode,
      displayName: currentDailyDisplayName(),
    });
    applyDailyAttemptPayload(payload);
    trackDailyEvent("daily_attempt_started", { attempt_mode: attemptMode });
    trackStandardEvent("game_started", {
      mode: attemptMode === "practice" ? "daily_practice" : "daily",
    });
    if (payload.currentRoll?.rollNumber) {
      trackDailyEvent("daily_roll_revealed", { roll_number: payload.currentRoll.rollNumber, source: "start" });
    }
    announce("Daily challenge started. First squad ready.");
    renderAll();
    scrollViewportTop();
    return payload;
  } finally {
    STATE.daily.loadingAction = false;
    renderAll();
  }
}

async function openDailyChallenge(targetCompetition = currentDailyCompetition(), { autoStart = false } = {}) {
  prepareDailyView(targetCompetition);
  STATE.view = "game";
  renderAll();
  const summary = await loadDailySummary({ force: true, competition: targetCompetition });
  STATE.daily.active = true;
  STATE.daily.challenge = summary;
  STATE.daily.fixedPlayers = Array.isArray(summary?.fixedPlayers) ? summary.fixedPlayers : [];
  STATE.daily.currentTeamPool = [...STATE.daily.fixedPlayers];

  if (summary?.rankedAttempt?.attemptId) {
    await resumeDailyAttempt(summary.rankedAttempt.attemptId);
    scrollViewportTop();
    return summary;
  }

  renderAll();
  scrollViewportTop();
  if (autoStart) {
    await startDailyAttempt("ranked");
  }
  return summary;
}

async function lockDailySelection(slotIndex) {
  if (!dailyChallengeActive() || !STATE.daily.currentRoll || !STATE.daily.pendingPlayerId) return;
  if (!Number.isInteger(slotIndex)) return;

  STATE.daily.loadingAction = true;
  renderAll();
  try {
    const player = STATE.daily.currentRoll.players.find((entry) => entry.id === STATE.daily.pendingPlayerId);
    if (!player?.selectable || !(player.validSlotIndexes ?? []).includes(slotIndex)) {
      throw new Error(player?.unavailableReason || "That choice is unavailable.");
    }
    const firstPick = STATE.daily.lockedSelections.length === 0;

    trackDailyEvent("daily_player_lock_confirmed", {
      roll_number: STATE.daily.currentRoll.rollNumber,
      attempt_mode: currentDailyAttemptMode(),
    });

    const payload = await postJsonRequest(
      `${dailyApiBasePath()}/${currentDailyChallengeId()}/attempts/${STATE.daily.attempt.id}/select`,
      {
        participantId: STATE.daily.participantId,
        currentRollNumber: STATE.daily.currentRoll.rollNumber,
        selectedPlayerId: player.id,
        slotIndex,
      },
    );

    applyDailyAttemptPayload(payload);
    if (firstPick) {
      trackStandardEvent("first_pick", { mode: analyticsModeValue() });
    }
    trackStandardEvent("player_assigned", { mode: analyticsModeValue() });
    if (payload.attempt.draftComplete) {
      announce(`${player.name} assigned. Daily draft complete.`);
      trackStandardEvent("draft_completed", { mode: analyticsModeValue() });
      if (payload.attempt.attemptMode === "ranked") {
        trackDailyEvent("daily_ranked_draft_completed", { total_rolls: payload.challenge.totalRolls });
      }
      trackDailyEvent("daily_draft_recap_viewed", { source: "post-lock" });
    } else if (payload.currentRoll?.rollNumber) {
      const slotLabel = XI_SLOTS[slotIndex]?.label ?? "that slot";
      announce(`${player.name} assigned to ${slotLabel}. Next squad ready.`);
      trackDailyEvent("daily_next_roll_revealed", { roll_number: payload.currentRoll.rollNumber });
      trackDailyEvent("daily_roll_revealed", { roll_number: payload.currentRoll.rollNumber, source: "next-roll" });
    }
  } catch (error) {
    console.error("Daily selection lock failed:", error);
    window.alert(error instanceof Error ? error.message : "Could not lock that selection.");
  } finally {
    STATE.daily.loadingAction = false;
    renderAll();
  }
}

async function simulateDailyTest() {
  if (!dailyChallengeActive() || !STATE.daily.attempt?.draftComplete) return;

  STATE.daily.loadingAction = true;
  trackStandardEvent("simulation_started", { mode: analyticsModeValue() });
  renderAll();
  try {
    const payload = await postJsonRequest(
      `${dailyApiBasePath()}/${currentDailyChallengeId()}/attempts/${STATE.daily.attempt.id}/simulate`,
      {
        participantId: STATE.daily.participantId,
        displayName: currentDailyDisplayName(),
      },
    );
    applyDailyAttemptPayload(payload);
    trackStandardEvent("simulation_completed", { mode: analyticsModeValue() });
    trackStandardEvent("daily_rank_viewed", { mode: analyticsModeValue() });
    announce("Simulation completed.");
    renderAll();
  } finally {
    STATE.daily.loadingAction = false;
    renderAll();
  }
}

async function startDailyPractice() {
  const dailyCompetition = currentDailyCompetition();
  trackStandardEvent("replay_started", {
    mode: dailyCompetition === "worldcup" ? "worldcup_daily_practice" : "daily_practice",
  });
  prepareDailyView(dailyCompetition);
  const summary = await loadDailySummary({ force: true, competition: dailyCompetition });
  STATE.view = "game";
  STATE.daily.active = true;
  STATE.daily.challenge = summary;
  STATE.daily.fixedPlayers = Array.isArray(summary?.fixedPlayers) ? summary.fixedPlayers : [];
  STATE.daily.currentTeamPool = [...STATE.daily.fixedPlayers];
  await startDailyAttempt("practice");
}

function currentTeamSubmissionPayload(displayName = "") {
  const mode = isChallengeMode()
    ? currentChallengePlayableMode()
    : normalizePlayableMode(STATE.mode);

  return {
    submissionKey: STATE.teamSubmissionKey,
    competition: STATE.competition,
    mode: mode ?? "classic",
    displayName: normalizeChallengeCreatorName(displayName),
    lineupPlayerIds: userLineup().map((player) => player.id),
    dataVersion: TEAM_DATA_VERSION,
  };
}

async function ensureGeneratedChallengeLink() {
  if (STATE.generatedChallenge?.url) {
    return STATE.generatedChallenge.url;
  }
  if (!challengeCreationMode() || !lineupComplete()) {
    throw new Error("Challenge invite is not ready.");
  }
  if (STATE.challengeLinkPromise) {
    const challenge = await STATE.challengeLinkPromise;
    return challenge?.url ?? "";
  }

  setChallengeStatus("Creating short invite...");
  STATE.challengeLinkPromise = postJsonRequest("/api/challenges", {
    challengeSubmissionKey: STATE.challengeSubmissionKey,
    team: currentTeamSubmissionPayload(STATE.challengeDraftName),
  })
    .then((data) => {
      STATE.generatedChallenge = { id: data.id, url: data.url };
      trackStandardEvent("challenge_created", { mode: analyticsModeValue() });
      return STATE.generatedChallenge;
    })
    .finally(() => {
      STATE.challengeLinkPromise = null;
      renderChallengePanel();
    });

  const challenge = await STATE.challengeLinkPromise;
  return challenge?.url ?? "";
}

async function persistSoloTeamIfNeeded() {
  if (isChallengeMode() || !lineupComplete() || STATE.soloTeamRecorded) {
    return;
  }
  if (STATE.soloPersistPromise) {
    await STATE.soloPersistPromise;
    return;
  }

  STATE.soloPersistPromise = postJsonRequest("/api/teams/solo", {
    team: currentTeamSubmissionPayload(""),
  })
    .then(() => {
      STATE.soloTeamRecorded = true;
    })
    .catch((error) => {
      console.error("Solo team persistence failed:", error);
    })
    .finally(() => {
      STATE.soloPersistPromise = null;
    });

  await STATE.soloPersistPromise;
}

async function ensurePersistedChallengeResult({ background = false } = {}) {
  const result = currentChallengeResultRecord();
  if (!result) {
    throw new Error("Challenge result is not ready.");
  }
  if (!STATE.challenge?.publicId) {
    return result;
  }
  if (STATE.result?.shortUrl) {
    return STATE.result;
  }
  if (STATE.resultPersistPromise) {
    return STATE.resultPersistPromise;
  }

  if (!STATE.resultSubmissionKey) {
    STATE.resultSubmissionKey = createSubmissionKey();
  }

  if (!background) {
    setShareStatus("Saving result...");
  }

  STATE.resultPersistPromise = postJsonRequest(`/api/challenges/${STATE.challenge.publicId}/results`, {
    resultSubmissionKey: STATE.resultSubmissionKey,
    team: currentTeamSubmissionPayload(STATE.challengeResponseName),
    result: {
      ...result,
      dataVersion: TEAM_DATA_VERSION,
    },
  })
    .then((data) => {
      STATE.result = {
        ...result,
        id: data.id,
        publicId: data.id,
        shortUrl: data.url,
      };
      writeResultUrlToBrowser(STATE.result);
      return STATE.result;
    })
    .catch((error) => {
      if (!background) {
        throw error;
      }
      console.error("Challenge result persistence failed:", error);
      setShareStatus("Result not saved yet. Try sharing again.");
      return result;
    })
    .finally(() => {
      STATE.resultPersistPromise = null;
      renderAll();
    });

  return STATE.resultPersistPromise;
}

function clearRollAnimation() {
  if (STATE.rollAnimation?.timer) {
    clearInterval(STATE.rollAnimation.timer);
  }
  STATE.rollAnimation = null;
}

function competitionConfig() {
  if (dailyChallengeActive()) {
    const stage = currentDailyStage();
    const dailyCompetition = currentDailyCompetition();
    const challengeDate = STATE.daily.challenge?.date ?? STATE.daily.summary?.date ?? currentDailyReferenceDateText();
    const oppositionLabel = STATE.daily.challenge?.opposition?.label ?? "Today's opposition";
    const rollNumber = STATE.daily.currentRoll?.rollNumber ?? STATE.daily.attempt?.currentRollNumber ?? 1;
    const totalRolls = STATE.daily.challenge?.totalRolls ?? 4;
    const worldCupDaily = dailyCompetition === "worldcup";

    return {
      name: worldCupDaily ? "World Cup" : "Ashes",
      title: worldCupDaily ? "World Cup Daily Challenge" : "Daily Ashes Challenge",
      plural: worldCupDaily ? "World Cup" : "Ashes",
      accentLabel: worldCupDaily ? "dark blue" : "green",
      theme: dailyCompetition,
      format: worldCupDaily ? "limited-overs" : "tests",
      homeEyebrow: worldCupDaily ? "World Cup Daily" : "Daily Ashes Challenge",
      homeTitle: worldCupDaily ? "World Cup Daily Challenge" : "Daily Ashes Challenge",
      homeTagline: "",
      homeLede:
        worldCupDaily
          ? "Same four hidden rolls for everyone. Start with 7 locked players and play one ODI."
          : "Same four hidden rolls for everyone. Start with 7 locked players and play one Test.",
      squadsLabel: "Daily rolls",
      gameEyebrow: worldCupDaily ? "World Cup daily" : "Daily challenge",
      gameTitle: stage === "intro"
        ? "Reveal the first squad"
        : stage === "recap"
          ? "Your four selections"
          : `Squad ${rollNumber} of ${totalRolls}`,
      rosterKicker: stage === "recap" ? "Draft recap" : "Current squad",
      boardTitle: stage === "recap" ? "Completed XI" : worldCupDaily ? "Your daily World Cup XI" : "Your daily XI",
      seriesEyebrow: worldCupDaily ? "Daily ODI" : "Daily Test",
      seriesTitle: `${currentSeriesUserLabel()} versus ${oppositionLabel}.`,
      oppositionTitle: oppositionLabel,
      oppositionShortTitle: oppositionLabel,
      seriesProgressLabel: worldCupDaily ? "ODIs" : "Tests",
      matchLabel: worldCupDaily ? "ODI" : "Test",
      seriesDescriptor: `${worldCupDaily ? "Daily ODI" : "Daily Test"} · ${challengeDate}`,
      modeButton: "World Cup mode",
    };
  }

  const loadedChallenge = challengeLineupLoaded();
  const resultLoaded = resultSnapshotLoaded();
  const creatorName = resultLoaded ? loadedResultChallengerName() : loadedChallengeCreatorName();
  const challengerTeamLabel = challengerTeamLabelFromName(creatorName);
  const challengeMode = currentChallengePlayableMode();
  const challengeModeLabel = challengeMode === "memory" ? "memory" : "classic";

  if (STATE.competition === "worldcup") {
    return {
      name: "World Cup",
      title: "World Cup XI",
      plural: "World Cup",
      accentLabel: "dark blue",
      theme: "worldcup",
      format: "limited-overs",
      homeEyebrow: "World Cup XI",
      homeTitle: "Build your World Cup XI",
      homeTagline: "Build an ODI XI, then survive the tournament route.",
      homeLede:
        "Each roll produces a historic World Cup squad. Pick one player from the squad to lock into your XI, then play through the group stage and knockout rounds.",
      squadsLabel: "World Cup squads",
      gameEyebrow: "World Cup builder",
      gameTitle: "Roll a squad. Choose one player. Place them in the XI.",
      rosterKicker: "World Cup pool",
      boardTitle: "Your World Cup side",
      seriesEyebrow: "World Cup series",
      seriesTitle: "Your XI navigates a World Cup group and knockout route.",
      oppositionTitle: "World Cup opposition",
      oppositionShortTitle: "World Cup opposition",
      seriesProgressLabel: "Matches",
      matchLabel: "ODI",
      seriesDescriptor: "World Cup tournament",
      modeButton: "Ashes mode",
    };
  }

  return {
    name: "Ashes",
    title: "Ashes XI",
    plural: "Ashes",
    accentLabel: "green",
    theme: "ashes",
    format: "tests",
    homeEyebrow: "Ashes 5-0",
    homeTitle: loadedChallenge
      ? creatorName
        ? `${creatorName} has challenged you.`
        : "A Challenge XI is waiting. Draft your Ashes side and take it on."
      : isChallengeMode()
        ? "Build a cricket XI and face a friend."
        : "Build your full Ashes XI",
    homeTagline: loadedChallenge
      ? ""
      : isChallengeMode()
        ? "Build your XI. Generate a private link. See who wins."
        : "Classic shows ratings. Memory hides them.",
    homeLede: loadedChallenge
      ? creatorName
        ? `This link contains ${creatorName}'s saved Ashes XI. Accept the ${challengeModeLabel} challenge, draft your own side, and then play a five-Test series against it.`
        : `This link contains a saved Ashes XI. Draft your own side in the required ${challengeModeLabel} mode, then simulate a five-Test challenge series against it.`
      : isChallengeMode()
        ? "Complete a historic Ashes XI, share a private challenge link, and see whether someone else can draft a side strong enough to beat it."
        : "Roll historic England and Australia squads, lock one player at a time, and build an all-time Ashes XI for a five-Test series.",
    squadsLabel: "Ashes squads",
    gameEyebrow: "XI builder",
    gameTitle: loadedChallenge
      ? "Roll a squad. Choose one player. Build an XI to face the Challenge XI."
      : isChallengeMode()
        ? "Roll a squad. Choose one player. Build the side you want to challenge others with."
        : "Roll a squad. Choose one player. Place them in the XI.",
    rosterKicker: "Squad pool",
    boardTitle: "Your Test side",
    seriesEyebrow: resultLoaded ? "Challenge result" : loadedChallenge ? "Challenge series" : "Test series",
    seriesTitle: resultLoaded
      ? `${currentSeriesUserLabel()} versus ${challengerTeamLabel}.`
      : loadedChallenge
        ? `${currentSeriesUserLabel()} takes on ${challengerTeamLabel}.`
        : "Your XI takes on an all-star Ashes XI.",
    oppositionTitle: resultLoaded || loadedChallenge ? challengerTeamLabel : "All-star Ashes XI",
    oppositionShortTitle: resultLoaded || loadedChallenge ? challengerTeamLabel : "All-star XI",
    seriesProgressLabel: "Tests",
    matchLabel: "Test",
    seriesDescriptor: resultLoaded || loadedChallenge ? "5-Test challenge" : "5-Test series",
    modeButton: "World Cup mode",
  };
}

function setCompetition(nextCompetition) {
  STATE.competition = nextCompetition === "worldcup" ? "worldcup" : "ashes";
  if (STATE.competition !== "ashes") {
    resetDailyState({ preserveSummary: false });
    STATE.challenge = null;
    STATE.result = null;
    STATE.challengeResponseName = "";
    clearChallengeUrlFromBrowser();
    clearResultUrlFromBrowser();
    if (isChallengeMode()) {
      STATE.mode = "classic";
    }
  }
  STATE.squads = STATE.competition === "worldcup" ? WORLD_CUP_SQUADS : ASHES_SQUADS;
  STATE.lineup.clear();
  STATE.currentSquad = null;
  STATE.selectedPlayerId = null;
  clearRollAnimation();
  STATE.series = null;
  STATE.seriesShareAsset = null;
  STATE.seriesShareAssetPromise = null;
  addCatalogMetadata();
  renderAll();
}

function addCatalogMetadata() {
  STATE.catalog = STATE.competition === "worldcup" ? WORLD_CUP_CATALOG : ASHES_CATALOG;
}

function decorateSquad(squad) {
  return {
    ...squad,
    players: squad.players.map((player, index) => ({
      ...player,
      id: `${squad.id}:${index}`,
      squadId: squad.id,
      squadLabel: squad.label,
      squadTeam: squad.team,
      squadYear: squad.year,
    })),
  };
}

function slotAcceptsPlayer(slot, player) {
  return player.roles.some((role) => slot.accepts.includes(role));
}

function lineupContainsName(name) {
  const key = normalizeName(name);
  return [...STATE.lineup.values()].some((player) => normalizeName(player.name) === key);
}

function squadHasAvailablePlayer(squad) {
  return squad.players.some((player) => {
    if (lineupContainsName(player.name)) return false;
    return XI_SLOTS.some((slot, index) => !STATE.lineup.has(index) && slotAcceptsPlayer(slot, player));
  });
}

function playerCanPlay(player) {
  if (lineupContainsName(player.name)) return false;
  return XI_SLOTS.some((slot, index) => !STATE.lineup.has(index) && slotAcceptsPlayer(slot, player));
}

function slotLabelsFromIndexes(slotIndexes = []) {
  return [...new Set(
    slotIndexes
      .map((slotIndex) => XI_SLOTS[slotIndex]?.label ?? "")
      .filter(Boolean),
  )];
}

function openSlotIndexes() {
  return XI_SLOTS
    .map((_, index) => index)
    .filter((index) => !STATE.lineup.has(index));
}

function availableSlotIndexesForPlayer(player) {
  return openSlotIndexes().filter((slotIndex) => slotAcceptsPlayer(XI_SLOTS[slotIndex], player));
}

function playerRoleText(player) {
  return Array.isArray(player?.roles) && player.roles.length
    ? player.roles.join(" / ")
    : "Historic player";
}

function playerRatingText(player) {
  return `Bat ${player.batting} / Bowl ${player.bowling}`;
}

function playerCardNoteText(note = "") {
  const normalized = String(note ?? "").trim();
  if (!normalized) return "";
  if (normalized === currentModeDraftNote()) return "";
  if (normalized === "Ratings stay hidden in the Daily Challenge.") return "";
  return normalized;
}

function buildPlayerCardHtml(player, {
  selected = false,
  unavailable = false,
  slotIndexes = [],
  buttonDataAttr = "",
  note = "",
} = {}) {
  const showRatings = showPlayerRatingsInDraft();
  const eligibleLabels = slotLabelsFromIndexes(slotIndexes);
  const eligibleText = eligibleLabels.length ? eligibleLabels.join(", ") : "No open slot";
  const noteText = playerCardNoteText(note);
  const ratingHtml = showRatings
    ? `<span class="player-rating" aria-label="${escapeHtml(playerRatingText(player))}">${escapeHtml(playerRatingText(player))}</span>`
    : "";
  const noteHtml = noteText ? `<span class="player-note">${escapeHtml(noteText)}</span>` : "";

  return `
    <button
      class="player-card ${selected ? "selected" : ""} ${unavailable ? "unavailable" : ""}"
      type="button"
      ${buttonDataAttr}
      ${unavailable ? "disabled" : ""}
      aria-disabled="${unavailable ? "true" : "false"}"
    >
      <span class="player-card-topline">
        <span class="player-name">${escapeHtml(player.name)}</span>
        ${ratingHtml}
      </span>
      <span class="player-role">${escapeHtml(playerRoleText(player))}</span>
      <span class="player-meta">Eligible: ${escapeHtml(eligibleText)}</span>
      ${noteHtml}
    </button>
  `;
}

function dailyChoiceProgressText() {
  const totalRolls = STATE.daily.challenge?.totalRolls ?? 4;
  const madeChoices = STATE.daily.lockedSelections.length;
  return `${madeChoices} of ${totalRolls} choices made`;
}

function seriesComplete() {
  return Boolean(STATE.series) && STATE.series.revealed >= STATE.series.matches.length;
}

function ratingLabel(value) {
  return currentModeDef().showPlayerRatings || seriesComplete() ? String(value) : "??";
}

function ratingPairLabel(player) {
  return `Bat ${ratingLabel(player.batting)} / Bowl ${ratingLabel(player.bowling)}`;
}

function playerOverall(player) {
  return Math.round(player.batting * 0.4 + player.bowling * 0.3 + player.fielding * 0.2 + player.experience * 0.1);
}

function playerSlotScore(player, slot) {
  const roleBonus = slotAcceptsPlayer(slot, player) ? 22 : 0;
  const batting = player.batting * 0.35;
  const bowling = player.bowling * 0.35;
  const fielding = player.fielding * 0.2;
  const experience = player.experience * 0.1;

  if (slot.focus === "batting") return batting + fielding + experience + roleBonus;
  if (slot.focus === "bowling") return bowling + fielding + experience + roleBonus;
  return batting * 0.35 + bowling * 0.35 + fielding * 0.2 + experience * 0.1 + roleBonus;
}

function hasRole(player, roles) {
  return roles.some((role) => player.roles.includes(role));
}

function bowlingRoleBoost(player) {
  if (hasRole(player, ["Fast Bowler", "Pace Bowler", "Seam Bowler"])) return 8;
  if (player.roles.includes("Spinner")) return 7;
  if (player.roles.includes("All-rounder")) return 4;
  return 0;
}

function wicketkeeperFieldingBonus(lineup) {
  const wicketkeeper = lineup.find((player) => player.roles.includes("Wicketkeeper"));
  if (!wicketkeeper) return 0;
  return Math.max(0, wicketkeeper.fielding - 60) * 0.08;
}

function lineupScore(lineup) {
  const topSeven = lineup.slice(0, 7);
  const tail = lineup.slice(7);
  const battingCore = average(topSeven.map((player) => player.batting));
  const tailSupport = average(tail.map((player) => player.batting));
  const bowlingCore = [...lineup]
    .sort(
      (left, right) =>
        (right.bowling + bowlingRoleBoost(right) * 0.75) - (left.bowling + bowlingRoleBoost(left) * 0.75),
    )
    .slice(0, Math.min(5, lineup.length));
  const batting = battingCore * 0.9 + tailSupport * 0.1;
  const bowling = average(bowlingCore.map((player) => player.bowling + bowlingRoleBoost(player) * 0.75));
  const fielding = average(lineup.map((player) => player.fielding)) + wicketkeeperFieldingBonus(lineup);
  const experience = average(lineup.map((player) => player.experience));
  return {
    batting,
    bowling,
    fielding,
    experience,
    power: batting * 0.48 + bowling * 0.34 + fielding * 0.1 + experience * 0.08,
  };
}

function buildLineupFromMap(lineupMap) {
  return XI_SLOTS.map((_, index) => lineupMap.get(index)).filter(Boolean);
}

function buildBestLineup(players) {
  const chosen = new Set();
  const lineup = new Map();

  XI_SLOTS.forEach((slot, index) => {
    const pool = players.filter((player) => !chosen.has(playerKey(player)) && slotAcceptsPlayer(slot, player));
    const fallback = pool.length ? pool : players.filter((player) => !chosen.has(playerKey(player)));
    const pick = shuffle(fallback).sort((a, b) => playerSlotScore(b, slot) - playerSlotScore(a, slot))[0] ?? null;
    if (pick) {
      lineup.set(index, pick);
      chosen.add(playerKey(pick));
    }
  });

  return buildLineupFromMap(lineup);
}

function buildAllStarXI(excludedNames = new Set()) {
  const byName = new Map();
  for (const player of STATE.catalog) {
    const key = normalizeName(player.name);
    if (excludedNames.has(key)) continue;
    const existing = byName.get(key);
    if (!existing || playerOverall(player) > playerOverall(existing)) {
      byName.set(key, player);
    }
  }

  const pool = [...byName.values()];
  const chosen = new Set();
  const lineup = [];

  XI_SLOTS.forEach((slot) => {
    const eligible = pool.filter((player) => !chosen.has(player.id) && slotAcceptsPlayer(slot, player));
    const fallback = eligible.length ? eligible : pool.filter((player) => !chosen.has(player.id));
    const pick = [...fallback].sort((a, b) => {
      const scoreDelta = playerSlotScore(b, slot) - playerSlotScore(a, slot);
      return scoreDelta !== 0 ? scoreDelta : playerOverall(b) - playerOverall(a);
    })[0];
    if (pick) {
      lineup.push(pick);
      chosen.add(pick.id);
    }
  });

  return lineup;
}

function teamLabelFromSquad(squad) {
  return `${squad.team} ${squad.year}`;
}

function currentSquadLabel() {
  if (dailyChallengeActive()) {
    if (STATE.daily.currentRoll?.squadTeam && STATE.daily.currentRoll?.squadYear) {
      return `${STATE.daily.currentRoll.squadTeam} ${STATE.daily.currentRoll.squadYear}`;
    }
    return currentDailyStage() === "recap" ? "Draft complete" : "Daily challenge";
  }
  if (STATE.rollAnimation?.active) return STATE.rollAnimation.label;
  return STATE.currentSquad ? STATE.currentSquad.label : "Roll a squad";
}

function lineupComplete() {
  if (dailyChallengeActive()) {
    return Boolean(STATE.daily.attempt?.draftComplete);
  }
  return STATE.lineup.size === XI_SLOTS.length;
}

function userLineup() {
  if (dailyChallengeActive()) {
    return buildLineupFromMap(currentDailyLineupMap());
  }
  return buildLineupFromMap(STATE.lineup);
}

function teamStrengthFromLineup(lineup) {
  return lineupScore(lineup);
}

function ballsToOvers(balls) {
  const overs = Math.floor(balls / 6);
  const remainder = balls % 6;
  return remainder === 0 ? `${overs}` : `${overs}.${remainder}`;
}

function gradeFromOverall(overall) {
  if (overall >= 94) return "A+";
  if (overall >= 90) return "A";
  if (overall >= 86) return "A-";
  if (overall >= 82) return "B+";
  if (overall >= 78) return "B";
  if (overall >= 74) return "B-";
  if (overall >= 68) return "C+";
  if (overall >= 62) return "C";
  return "D";
}

function teamMetricsFromLineup(lineup) {
  const score = teamStrengthFromLineup(lineup);
  const batting = clamp(Math.round(score.batting), 0, 99);
  const bowling = clamp(Math.round(score.bowling), 0, 99);
  const fielding = clamp(Math.round(score.fielding), 0, 99);
  const overall = clamp(Math.round(score.power), 0, 99);

  return {
    batting,
    bowling,
    fielding,
    overall,
    power: overall,
    grade: gradeFromOverall(overall),
    percentile: clamp(Math.round(44 + (overall - 60) * 2.1), 1, 99),
  };
}

function draftMetricsFromLineup(lineup) {
  if (!lineup.length) {
    return {
      batting: 0,
      bowling: 0,
      fielding: 0,
      overall: 0,
      power: 0,
      grade: "D",
      percentile: 0,
      drafted: 0,
    };
  }

  const batting = clamp(Math.round(average(lineup.map((player) => player.batting))), 0, 99);
  const bowling = clamp(Math.round(average(lineup.map((player) => player.bowling))), 0, 99);
  const fielding = clamp(Math.round(average(lineup.map((player) => player.fielding))), 0, 99);
  const overall = clamp(Math.round(batting * 0.45 + bowling * 0.35 + fielding * 0.2), 0, 99);

  return {
    batting,
    bowling,
    fielding,
    overall,
    power: overall,
    grade: gradeFromOverall(overall),
    percentile: clamp(Math.round(44 + (overall - 60) * 2.1), 1, 99),
    drafted: lineup.length,
  };
}

function seriesWinnerLabel() {
  const competition = competitionConfig();
  if (!STATE.series) return "Simulation ready";
  if (STATE.series.statusText) return STATE.series.statusText;
  if (STATE.series.userWins > STATE.series.starWins) return `${currentSeriesUserLabel()} lead the series`;
  if (STATE.series.starWins > STATE.series.userWins) return `${competition.oppositionShortTitle} lead the series`;
  return "Series level";
}

function seriesScoreShort(series = STATE.series) {
  if (!series) return "";
  return `${series.userWins}-${series.starWins}`;
}

function completedSeriesOutcomeText(series = STATE.series) {
  if (!series) return "";
  if (series.tournamentType === "worldcup") {
    return series.statusText ?? "Tournament complete";
  }
  if (series.userWins > series.starWins) {
    return `Won ${seriesScoreShort(series)}`;
  }
  if (series.userWins < series.starWins) {
    return `Lost ${seriesScoreShort(series)}`;
  }
  return `Drew ${seriesScoreShort(series)}`;
}

function completedSeriesSummaryText(series = STATE.series) {
  if (!series) return "";
  if (series.tournamentType === "worldcup") {
    return series.statusText ?? "Tournament complete";
  }
  const opponent = competitionConfig().oppositionTitle;
  if (series.userWins > series.starWins) {
    return `Your XI beat ${opponent} ${seriesScoreShort(series)} in the five-Test series.`;
  }
  if (series.userWins < series.starWins) {
    return `${opponent} beat your XI ${seriesScoreShort(series)} in the five-Test series.`;
  }
  return `Your XI drew the five-Test series ${seriesScoreShort(series)} with ${opponent}.`;
}

function performancePointsForCard(card) {
  return (card.runs ?? 0) + (card.wickets ?? 0) * 25 + (card.centuries ?? 0) * 18 + (card.fiveFors ?? 0) * 22;
}

function formatDismissal(card) {
  if (card.dnb) return "DNB";
  if (card.notOut) return "not out";
  return card.dismissal || "c";
}

function estimateInningsBalls(batters, extras, wickets, maxBalls = null) {
  const strikerBalls = batters.reduce((sum, card) => sum + (card.dnb ? 0 : card.balls), 0);
  const extraBalls = clamp(Math.round(extras * 0.35 + wickets * 0.8 + Math.max(0, normalRandom() * 8)), 0, 18);
  const estimated = strikerBalls + extraBalls;
  if (maxBalls !== null) return clamp(estimated, 0, maxBalls);
  if (estimated === 0) return 0;
  return clamp(estimated, 36, 900);
}

function buildBattingScorecard(lineup, opposition, inningsIndex, conditions = {}, chaseTarget = null, firstInningsLead = 0, options = {}) {
  const order = options.battingOrder ?? battingOrder(lineup);
  const battingStrength = lineupScore(lineup).batting;
  const bowlingStrength = lineupScore(opposition).bowling;
  const pitch = conditions.pitch ?? "balanced";
  const maxBalls = Number.isFinite(options.maxBalls) ? Math.max(0, Math.round(options.maxBalls)) : null;
  const extras = clamp(
    Math.round(2 + Math.random() * 12 + bowlingStrength / 18 + inningsIndex * 1.4),
    0,
    24,
  );

  let runs = 0;
  let wickets = 0;
  let declared = false;
  let chaseComplete = false;
  let ballsRemaining = maxBalls;
  const batters = [];

  for (let index = 0; index < order.length; index += 1) {
    if (ballsRemaining !== null && ballsRemaining <= 0) break;

    const player = order[index];
    const outcome = sampleTestBatterOutcome(player, battingStrength, bowlingStrength, pitch, inningsIndex);
    let adjustedRuns = outcome.runs;
    const plannedBalls = outcome.balls;
    const balls = ballsRemaining === null ? plannedBalls : clamp(plannedBalls, 1, ballsRemaining);
    if (balls < plannedBalls && adjustedRuns > 0) {
      adjustedRuns = clamp(Math.round(adjustedRuns * ((balls / plannedBalls) ** 0.92)), 0, adjustedRuns);
    }
    const fours = adjustedRuns === 0
      ? 0
      : clamp(Math.round(adjustedRuns / 11 + Math.random() * 3), 0, Math.max(0, Math.floor(adjustedRuns / 4)));
    const sixes = adjustedRuns === 0
      ? 0
      : clamp(Math.round(adjustedRuns / 32 + Math.random() * 2), 0, Math.max(0, Math.floor(adjustedRuns / 6)));
    const dismissalOptions = ["c", "lbw", "b", "st", "c&b"];
    const card = {
      name: player.name,
      runs: adjustedRuns,
      balls,
      fours,
      sixes,
      out: true,
      notOut: false,
      dismissal: randomChoice(dismissalOptions) ?? "c",
    };

    if (ballsRemaining !== null) {
      ballsRemaining = Math.max(0, ballsRemaining - balls);
    }

    runs += adjustedRuns;

    if (chaseTarget !== null && runs + extras >= chaseTarget) {
      card.out = false;
      card.notOut = true;
      card.dismissal = "not out";
      chaseComplete = true;
      batters.push(card);
      break;
    }

    if (ballsRemaining !== null && ballsRemaining <= 0) {
      card.out = false;
      card.notOut = true;
      card.dismissal = "not out";
      batters.push(card);
      break;
    }

    if (shouldDeclare(runs + extras, wickets, inningsIndex, firstInningsLead, ballsRemaining)) {
      card.out = false;
      card.notOut = true;
      card.dismissal = "not out";
      declared = true;
      batters.push(card);
      break;
    }

    wickets += 1;
    batters.push(card);

    if (wickets >= 10) break;
  }

  while (batters.length < order.length) {
    const player = order[batters.length];
    batters.push({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      out: false,
      notOut: false,
      dismissal: "DNB",
      dnb: true,
    });
  }

  const total = runs + extras;
  const ballsFaced = estimateInningsBalls(batters, extras, wickets, maxBalls);
  const notOutCount = batters.filter((card) => card.notOut).length;
  const topBatter = [...batters]
    .filter((card) => !card.dnb)
    .sort((a, b) => b.runs - a.runs)[0] ?? batters[0] ?? null;

  return {
    batters,
    extras,
    runs,
    wickets,
    declared,
    chaseComplete,
    total,
    balls: ballsFaced,
    overs: ballsToOvers(ballsFaced),
    topBatter,
    notOutCount,
  };
}

function reconcileBowlingRuns(bowlers, targetRuns) {
  if (!bowlers.length) return bowlers;
  if (targetRuns <= 0) {
    bowlers.forEach((bowler) => {
      bowler.runs = 0;
      bowler.maidens = clamp(bowler.maidens, 0, Math.floor(bowler.balls / 6));
    });
    return bowlers;
  }

  const totalBalls = bowlers.reduce((sum, bowler) => sum + bowler.balls, 0) || 1;
  const provisional = bowlers.map((bowler) =>
    Math.max(
      0.5,
      targetRuns * (bowler.balls / totalBalls) +
        (100 - bowler.player.bowling) * 0.18 -
        bowler.wickets * 1.4 +
        normalRandom() * 3,
    ),
  );
  const provisionalTotal = provisional.reduce((sum, value) => sum + value, 0) || 1;
  const exact = provisional.map((value) => (targetRuns * value) / provisionalTotal);
  const assigned = exact.map((value) => Math.floor(value));
  let remainder = targetRuns - assigned.reduce((sum, value) => sum + value, 0);
  const order = exact
    .map((value, index) => ({
      index,
      remainder: value - assigned[index],
      tiebreak: Math.random(),
    }))
    .sort((a, b) => b.remainder - a.remainder || b.tiebreak - a.tiebreak);

  for (let index = 0; index < order.length && remainder > 0; index += 1, remainder -= 1) {
    assigned[order[index].index] += 1;
  }

  bowlers.forEach((bowler, index) => {
    bowler.runs = assigned[index];
    const overs = bowler.balls / 6;
    const economyMaidenCap = Math.max(0, Math.floor(overs - bowler.runs / 7.5) + 1);
    bowler.maidens = clamp(bowler.maidens, 0, Math.min(Math.floor(overs), economyMaidenCap));
  });

  return bowlers;
}

function buildBowlingScorecard(lineup, inningsTotal, inningsBalls, wickets, teamEdge = 0, options = {}) {
  const ranked = options.rankedBowlers ?? teamBowlingRanking(lineup, teamEdge);
  const bowlers = ranked.map(({ player, value }) => ({
    name: player.name,
    player,
    value,
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0,
  }));
  const used = bowlers.filter((entry) => entry.player.roles.some((role) => ["Fast Bowler", "Spinner", "All-rounder"].includes(role)));
  const totalOvers = clamp(Math.max(1, Math.round(inningsBalls / 6)), 8, 180);
  const working = (used.length ? used : bowlers.slice(0, Math.min(5, bowlers.length))).slice(0, Math.min(totalOvers, bowlers.length));

  const weighted = working.map((bowler) => {
    const weight = Math.max(1, bowler.player.bowling + bowler.value / 4);
    const exact = (totalOvers * weight) / working.reduce((sum, item) => sum + Math.max(1, item.player.bowling + item.value / 4), 0);
    const base = Math.max(1, Math.floor(exact));
    return {
      bowler,
      base,
      remainder: exact - base,
    };
  });

  let oversLeft = totalOvers - weighted.reduce((sum, entry) => sum + entry.base, 0);
  weighted.sort((a, b) => b.remainder - a.remainder);
  for (const entry of weighted) {
    if (oversLeft <= 0) break;
    entry.base += 1;
    oversLeft -= 1;
  }

  weighted.forEach((entry) => {
    entry.bowler.balls = entry.base * 6;
  });

  weighted.sort((a, b) => b.bowler.player.bowling - a.bowler.player.bowling);

  const wicketPool = [];
  for (let index = 0; index < wickets; index += 1) {
    const wicketWorking = weighted.map((entry) => entry.bowler).filter((bowler) => bowler.balls > 0);
    wicketPool.push(
      weightedPick(wicketWorking, (bowler) => Math.max(1, bowler.player.bowling + bowler.value / 3 - bowler.wickets * 12)),
    );
  }
  wicketPool.forEach((bowler) => {
    bowler.wickets += 1;
  });

  weighted.forEach((entry) => {
    const bowler = entry.bowler;
    bowler.runs = Math.max(
      0,
      inningsTotal * (bowler.balls / Math.max(1, totalOvers * 6)) +
        (100 - bowler.player.bowling) * 0.22 -
        bowler.wickets * 1.2 +
        teamEdge * -0.08 +
        Math.random() * 7,
    );
    bowler.maidens = clamp(
      Math.round(bowler.balls / 24 + (bowler.player.bowling - 50) / 24 + Math.random() * 1.4),
      0,
      12,
    );
  });

  reconcileBowlingRuns(
    weighted.map((entry) => entry.bowler).filter((bowler) => bowler.balls > 0),
    inningsTotal,
  );

  return weighted
    .map((entry) => entry.bowler)
    .filter((bowler) => bowler.balls > 0)
    .map((bowler) => ({
      name: bowler.name,
      overs: ballsToOvers(bowler.balls),
      maidens: bowler.maidens,
      runs: bowler.runs,
      wickets: bowler.wickets,
    }))
    .sort((a, b) => b.wickets - a.wickets || a.runs - b.runs);
}

function buildInningsSummary(teamLabel, batting, bowling) {
  const topRuns = batting.topBatter ? `${batting.topBatter.name} ${batting.topBatter.runs}` : "No score";
  const topBowler = bowling[0] ? `${bowling[0].name} ${bowling[0].wickets}/${bowling[0].runs}` : "No figures";
  const status = batting.chaseComplete
    ? "Chased down"
    : batting.declared
      ? "Declared"
      : batting.wickets >= 10
        ? "All out"
        : "Closed";

  return {
    teamLabel,
    batting,
    bowling,
    status,
    topRuns,
    topBowler,
  };
}

function bestBattersFromInnings(inningsList) {
  const batters = inningsList.flatMap((innings) => innings?.batting?.batters ?? innings?.batters ?? []);
  return batters.filter((card) => !card.dnb).sort((a, b) => b.runs - a.runs || b.balls - a.balls)[0] ?? null;
}

function bestBowlerFromInnings(inningsList) {
  const bowlers = inningsList
    .flatMap((innings) => innings?.bowling ?? innings?.bowlers ?? [])
    .filter((bowler) => bowler && bowler.overs !== "0");
  return bowlers.sort((a, b) => b.wickets - a.wickets || a.runs - b.runs)[0] ?? null;
}

function buildMatchBoxScore(sideInnings) {
  const batter = bestBattersFromInnings(sideInnings.batting) ?? { name: "Unknown", runs: 0 };
  const bowler = bestBowlerFromInnings(sideInnings.bowling) ?? { name: "Unknown", wickets: 0, runs: 0, overs: "0" };
  return {
    batter,
    bowler: {
      ...bowler,
      figures: `${bowler.wickets}/${bowler.runs}`,
    },
  };
}

function summariseResult(match) {
  const opponentLabel = competitionConfig().oppositionShortTitle;
  const { user1, star1, user2, star2 } = match.innings;
  const userTotal = user1.total + user2.total;
  const starTotal = star1.total + star2.total;

  if (match.format === "limited-overs") {
    const limitedUserTotal = user1.total;
    const limitedStarTotal = star1.total;

    if (match.result === "draw") {
      return "Match tied";
    }

    if (match.result === "win") {
      if (star1.chaseComplete) {
        return `won by ${10 - star1.wickets} ${pluralize(10 - star1.wickets, "wicket")}`;
      }
      return `won by ${limitedUserTotal - limitedStarTotal} ${pluralize(limitedUserTotal - limitedStarTotal, "run")}`;
    }

    if (star1.chaseComplete) {
      return `lost by ${10 - star1.wickets} ${pluralize(10 - star1.wickets, "wicket")}`;
    }

    return `lost by ${limitedStarTotal - limitedUserTotal} ${pluralize(limitedStarTotal - limitedUserTotal, "run")}`;
  }

  if (match.result === "draw") {
    return "Series drawn";
  }

  const userWon = match.result === "win";
  const winningSecond = userWon ? user2 : star2;
  const losingFirst = userWon ? star1 : user1;
  const winnerTotal = userWon ? userTotal : starTotal;
  const loserTotal = userWon ? starTotal : userTotal;

  if ((userWon && user2.chaseComplete) || (!userWon && star2.chaseComplete)) {
    const wicketsLeft = 10 - winningSecond.wickets;
    return `${userWon ? "Your XI" : opponentLabel} won by ${wicketsLeft} ${pluralize(wicketsLeft, "wicket")}`;
  }

  if (winningSecond.wickets >= 10 && loserTotal > 0) {
    const runsMargin = winnerTotal - loserTotal;
    return `${userWon ? "Your XI" : opponentLabel} won by ${runsMargin} ${pluralize(runsMargin, "run")}`;
  }

  const inningsMargin = (userWon ? star1.total + star2.total : user1.total + user2.total) - (userWon ? userTotal : starTotal);
  if (inningsMargin > 0) {
    return `${userWon ? "Your XI" : opponentLabel} won by an innings and ${inningsMargin} ${pluralize(inningsMargin, "run")}`;
  }

  return match.result === "win" ? "Your XI won" : `${opponentLabel} won`;
}

function generateHeadline(match) {
  const limitedOvers = match.format === "limited-overs";
  const batters = [
    ...(match.innings.user1?.batters ?? []),
    ...(match.innings.user2?.batters ?? []),
    ...(match.innings.star1?.batters ?? []),
    ...(match.innings.star2?.batters ?? []),
  ];
  const bowlers = [
    ...(match.innings.user1.bowling ?? []),
    ...(match.innings.user2.bowling ?? []),
    ...(match.innings.star1.bowling ?? []),
    ...(match.innings.star2.bowling ?? []),
  ];

  const topBat = [...batters].filter((card) => !card.dnb).sort((a, b) => b.runs - a.runs)[0] ?? null;
  const topBowl = [...bowlers].sort((a, b) => b.wickets - a.wickets || a.runs - b.runs)[0] ?? null;

  if (topBowl && topBowl.wickets >= 5) {
    return limitedOvers
      ? `${topBowl.name} turns the game with ${topBowl.wickets} wickets`
      : `${topBowl.name} destroys the chase with ${topBowl.wickets} wickets`;
  }

  if (topBat && topBat.runs >= 140) {
    return limitedOvers
      ? `${topBat.name}'s ${topBat.runs} seals the match`
      : `${topBat.name}'s ${topBat.runs} seals the Test`;
  }

  if (match.result === "draw") {
    return "A stubborn final session salvages the draw";
  }

  return topBat
    ? `${topBat.name} anchors the innings with ${topBat.runs}`
    : "A tight Test goes down to the final innings";
}

function matchMarginText(match) {
  const { user1, star1, user2, star2 } = match.innings;
  const userTotal = user1.total + user2.total;
  const starTotal = star1.total + star2.total;

  if (match.format === "limited-overs") {
    if (match.result === "draw") return "Match tied";

    if (match.result === "win") {
      if (star1.chaseComplete) {
        return `Won by ${10 - star1.wickets} ${pluralize(10 - star1.wickets, "wicket")}`;
      }
      return `Won by ${user1.total - star1.total} ${pluralize(user1.total - star1.total, "run")}`;
    }

    if (star1.chaseComplete) {
      return `Lost by ${10 - star1.wickets} ${pluralize(10 - star1.wickets, "wicket")}`;
    }

    return `Lost by ${star1.total - user1.total} ${pluralize(star1.total - user1.total, "run")}`;
  }

  if (match.result === "draw") return "Match drawn";

  if (match.result === "win") {
    if (user2.chaseComplete) {
      return `Won by ${10 - user2.wickets} ${pluralize(10 - user2.wickets, "wicket")}`;
    }
    if (star2.wickets >= 10 && userTotal > starTotal) {
      return `Won by ${userTotal - starTotal} ${pluralize(userTotal - starTotal, "run")}`;
    }
    if (user1.total > star1.total + star2.total) {
      return `Won by an innings and ${user1.total - (star1.total + star2.total)} ${pluralize(user1.total - (star1.total + star2.total), "run")}`;
    }
  } else if (match.result === "loss") {
    if (star2.chaseComplete) {
      return `Lost by ${10 - star2.wickets} ${pluralize(10 - star2.wickets, "wicket")}`;
    }
    if (user2.wickets >= 10 && starTotal > userTotal) {
      return `Lost by ${starTotal - userTotal} ${pluralize(starTotal - userTotal, "run")}`;
    }
    if (star1.total > user1.total + user2.total) {
      return `Lost by an innings and ${star1.total - (user1.total + user2.total)} ${pluralize(star1.total - (user1.total + user2.total), "run")}`;
    }
  }

  return match.result === "win" ? "Won the Test" : "Lost the Test";
}

function collectSeriesStats(series) {
  const leaderMap = new Map();

  const addCardStats = (side, card) => {
    const key = `${side}:${card.name}`;
    const entry = leaderMap.get(key) ?? {
      side,
      name: card.name,
      runs: 0,
      wickets: 0,
      centuries: 0,
      fiveFors: 0,
      points: 0,
    };
    entry.runs += card.runs ?? 0;
    entry.points += performancePointsForCard(card);
    if ((card.runs ?? 0) >= 100) entry.centuries += 1;
    leaderMap.set(key, entry);
  };

  const addBowlerStats = (side, bowler) => {
    const key = `${side}:${bowler.name}`;
    const entry = leaderMap.get(key) ?? {
      side,
      name: bowler.name,
      runs: 0,
      wickets: 0,
      centuries: 0,
      fiveFors: 0,
      points: 0,
    };
    entry.wickets += bowler.wickets ?? 0;
    entry.points += (bowler.wickets ?? 0) * 20;
    if ((bowler.wickets ?? 0) >= 5) entry.fiveFors += 1;
    leaderMap.set(key, entry);
  };

  const addInningsStats = (battingSide, bowlingSide, innings) => {
    if (!innings) return;
    (innings.batters ?? []).forEach((card) => {
      if (!card.dnb) addCardStats(battingSide, card);
    });
    (innings.bowling ?? []).forEach((bowler) => addBowlerStats(bowlingSide, bowler));
  };

  for (const match of series.matches) {
    addInningsStats("your", "star", match.inningsData?.user1?.batting);
    addInningsStats("star", "your", match.inningsData?.star1?.batting);
    addInningsStats("your", "star", match.inningsData?.user2?.batting);
    addInningsStats("star", "your", match.inningsData?.star2?.batting);
  }

  const leaders = [...leaderMap.values()];
  const overallLeader = [...leaders].sort((a, b) => b.points - a.points || b.runs - a.runs || b.wickets - a.wickets)[0] ?? null;

  return {
    overallLeader,
    mostRuns: [...leaders].sort((a, b) => b.runs - a.runs)[0] ?? null,
    mostWickets: [...leaders].sort((a, b) => b.wickets - a.wickets)[0] ?? null,
    mostCenturies: [...leaders].sort((a, b) => b.centuries - a.centuries || b.runs - a.runs)[0] ?? null,
    mostFiveFors: [...leaders].sort((a, b) => b.fiveFors - a.fiveFors || b.wickets - a.wickets)[0] ?? null,
    userRuns: leaders.filter((item) => item.side === "your").reduce((sum, item) => sum + item.runs, 0),
    userWickets: leaders.filter((item) => item.side === "your").reduce((sum, item) => sum + item.wickets, 0),
  };
}

function buildAchievementList(series, leaders) {
  const achievements = [];

  if (series.userWins === 5) achievements.push("The Invincibles");
  if (leaders.userWickets >= 40) achievements.push("Bodyline");
  if (leaders.userRuns >= 700) achievements.push("The Don");
  if (series.userWins >= 3 && series.starWins >= 2 && series.matches.slice(0, 2).every((match) => match.result === "loss")) {
    achievements.push("Great Escape");
  }

  return achievements;
}

function oversFromBalls(balls) {
  return balls / 6;
}

function worldCupSquadStrength(squad) {
  return teamMetricsFromLineup(buildBestLineup(squad.players)).overall;
}

function buildWorldCupPools() {
  const ranked = WORLD_CUP_SQUADS
    .map((squad) => ({
      squad,
      lineup: buildBestLineup(squad.players),
      metrics: teamMetricsFromLineup(buildBestLineup(squad.players)),
      strength: worldCupSquadStrength(squad),
    }))
    .sort((a, b) => b.strength - a.strength || b.metrics.overall - a.metrics.overall);

  const buckets = {
    weak: [],
    middle: [],
    strong: [],
    elite: [],
  };

  ranked.forEach((entry, index) => {
    const bucketIndex = clamp(Math.floor((index / Math.max(1, ranked.length)) * 4), 0, 3);
    const bucketName = ["elite", "strong", "middle", "weak"][bucketIndex];
    buckets[bucketName].push(entry);
  });

  return { ranked, buckets };
}

function drawWorldCupOpponent(bucket, usedIds, fallbackPool) {
  const source = bucket.filter((entry) => !usedIds.has(entry.squad.id));
  const pool = source.length ? source : fallbackPool.filter((entry) => !usedIds.has(entry.squad.id));
  const pick = randomChoice(pool.length ? pool : fallbackPool);
  if (!pick) return null;
  usedIds.add(pick.squad.id);
  return pick;
}

function createDisplayMatch({
  stage,
  stageLabel,
  matchNumber,
  venue,
  homeTeam,
  awayTeam,
  match,
}) {
  const resultClass =
    match.result === "win" ? "result-win" : match.result === "loss" ? "result-loss" : "result-draw";
  return {
    format: "limited-overs",
    stage,
    stageLabel,
    matchNumber,
    venue,
    result: match.result,
    resultClass,
    homeTeam,
    awayTeam,
    innings: [
      { label: `${homeTeam.label} innings`, score: inningsScoreLabel(match.innings.user1) },
      { label: `${awayTeam.label} innings`, score: inningsScoreLabel(match.innings.star1) },
    ],
    scoreline: `${inningsScoreLabel(match.innings.user1)} | ${inningsScoreLabel(match.innings.star1)}`,
    summary: summariseResult(match),
    headline: generateHeadline(match),
    inningsData: {
      user1: buildInningsSummary(`${homeTeam.label} innings`, match.innings.user1, match.innings.user1.bowling),
      star1: buildInningsSummary(`${awayTeam.label} innings`, match.innings.star1, match.innings.star1.bowling),
      user2: buildInningsSummary(`${homeTeam.label} 2nd innings`, match.innings.user2, match.innings.user2.bowling),
      star2: buildInningsSummary(`${awayTeam.label} 2nd innings`, match.innings.star2, match.innings.star2.bowling),
    },
    userBox: buildMatchBoxScore({
      batting: [match.innings.user1],
      bowling: [match.innings.star1],
    }),
    starBox: buildMatchBoxScore({
      batting: [match.innings.star1],
      bowling: [match.innings.user1],
    }),
  };
}

function buildWorldCupTournament() {
  const userLine = userLineup();
  const userTeam = teamMetricsFromLineup(userLine);
  const { ranked, buckets } = buildWorldCupPools();
  const usedIds = new Set();

  const drawBucketOpponent = (bucket, category) => {
    const draw = drawWorldCupOpponent(bucket, usedIds, ranked);
    if (!draw) return null;
    return {
      id: draw.squad.id,
      label: draw.squad.label,
      lineup: draw.lineup,
      metrics: draw.metrics,
      category,
      squad: draw.squad,
    };
  };

  const groupOpponents = [
    drawBucketOpponent(buckets.weak, "Weak"),
    drawBucketOpponent(buckets.middle, "Middle"),
    drawBucketOpponent(buckets.strong, "Strong"),
  ].filter(Boolean);

  const userEntry = {
    id: "your",
    label: "Your XI",
    lineup: userLine,
    metrics: userTeam,
    category: "user",
  };

  const groupTeams = [userEntry, ...groupOpponents];
  const standings = new Map(
    groupTeams.map((team) => [
      team.id,
      {
        id: team.id,
        label: team.label,
        team,
        played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        points: 0,
        runsFor: 0,
        runsAgainst: 0,
        ballsFor: 0,
        ballsAgainst: 0,
        nrr: 0,
      },
    ]),
  );

  const updateStandings = (firstTeam, secondTeam, match) => {
    const first = standings.get(firstTeam.id);
    const second = standings.get(secondTeam.id);
    if (!first || !second) return;

    first.played += 1;
    second.played += 1;
    first.runsFor += match.innings.user1.total;
    first.runsAgainst += match.innings.star1.total;
    first.ballsFor += match.innings.user1.balls;
    first.ballsAgainst += match.innings.star1.balls;
    second.runsFor += match.innings.star1.total;
    second.runsAgainst += match.innings.user1.total;
    second.ballsFor += match.innings.star1.balls;
    second.ballsAgainst += match.innings.user1.balls;

    if (match.result === "win") {
      first.wins += 1;
      first.points += 2;
      second.losses += 1;
    } else if (match.result === "loss") {
      second.wins += 1;
      second.points += 2;
      first.losses += 1;
    } else {
      first.draws += 1;
      second.draws += 1;
      first.points += 1;
      second.points += 1;
    }
  };

  const visibleMatches = [];
  const userMatches = new Map();

  const fixtures = shuffle([
    [groupTeams[0], groupTeams[1]],
    [groupTeams[0], groupTeams[2]],
    [groupTeams[0], groupTeams[3]],
    [groupTeams[1], groupTeams[2]],
    [groupTeams[1], groupTeams[3]],
    [groupTeams[2], groupTeams[3]],
  ]);

  fixtures.forEach(([firstTeam, secondTeam], index) => {
    const match = simulateLimitedOversMatch(firstTeam.lineup, secondTeam.lineup, {
      pitch: index % 2 === 0 ? "balanced" : "flat",
    });
    updateStandings(firstTeam, secondTeam, match);

    if (firstTeam.id === "your" || secondTeam.id === "your") {
      const opponent = firstTeam.id === "your" ? secondTeam : firstTeam;
      const displayMatch = createDisplayMatch({
        stage: "group",
        stageLabel: "Group stage",
        matchNumber: userMatches.size + 1,
        venue: opponent.label,
        homeTeam: userEntry,
        awayTeam: opponent,
        match: firstTeam.id === "your"
          ? match
          : {
              ...match,
              result: match.result === "win" ? "loss" : match.result === "loss" ? "win" : "draw",
              innings: {
                user1: match.innings.star1,
                star1: match.innings.user1,
                user2: match.innings.star2,
                star2: match.innings.user2,
              },
            },
      });

      userMatches.set(opponent.id, displayMatch);
    }
  });

  const groupTable = [...standings.values()]
    .map((entry) => ({
      ...entry,
      nrr:
        oversFromBalls(entry.ballsFor) > 0 && oversFromBalls(entry.ballsAgainst) > 0
          ? entry.runsFor / oversFromBalls(entry.ballsFor) - entry.runsAgainst / oversFromBalls(entry.ballsAgainst)
          : 0,
    }))
    .sort((a, b) => b.points - a.points || b.nrr - a.nrr || b.runsFor - a.runsFor || a.label.localeCompare(b.label));

  const qualified = groupTable.findIndex((entry) => entry.id === "your") < 2;
  const groupMatches = [...userMatches.values()].sort((a, b) => a.matchNumber - b.matchNumber);
  const knockoutMatches = [];
  let statusText = qualified ? "Through to the semi-finals" : "Knocked out in the group stage";
  let finalOpponent = null;
  let starTeam =
    [...groupOpponents].sort((a, b) => b.metrics.overall - a.metrics.overall || b.metrics.batting - a.metrics.batting)[0] ??
    userEntry;
  let starLineup = starTeam.lineup;

  if (qualified) {
    const semiOpponent = drawWorldCupOpponent(buckets.elite, usedIds, buckets.elite);
    if (semiOpponent) {
      const semiTeam = {
        id: semiOpponent.squad.id,
        label: semiOpponent.squad.label,
        lineup: semiOpponent.lineup,
        metrics: semiOpponent.metrics,
        category: "Elite",
      };
      const semiMatch = simulateLimitedOversMatch(userLine, semiTeam.lineup, { pitch: "balanced" });
      knockoutMatches.push(
        createDisplayMatch({
          stage: "semi",
          stageLabel: "Semi-final",
          matchNumber: groupMatches.length + 1,
          venue: semiTeam.label,
          homeTeam: userEntry,
          awayTeam: semiTeam,
          match: semiMatch,
        }),
      );
      starTeam = semiTeam;
      starLineup = semiTeam.lineup;

      if (semiMatch.result === "win") {
        finalOpponent = drawWorldCupOpponent(buckets.elite, usedIds, buckets.elite);
        if (finalOpponent) {
          const finalTeam = {
            id: finalOpponent.squad.id,
            label: finalOpponent.squad.label,
            lineup: finalOpponent.lineup,
            metrics: finalOpponent.metrics,
            category: "Elite",
          };
          const finalMatch = simulateLimitedOversMatch(userLine, finalTeam.lineup, { pitch: "balanced" });
          knockoutMatches.push(
            createDisplayMatch({
              stage: "final",
              stageLabel: "Final",
              matchNumber: groupMatches.length + knockoutMatches.length,
              venue: finalTeam.label,
              homeTeam: userEntry,
              awayTeam: finalTeam,
              match: finalMatch,
            }),
          );
          starTeam = finalTeam;
          starLineup = finalTeam.lineup;
          statusText = finalMatch.result === "win" ? "World Cup champions" : "Runners-up";
        } else {
          statusText = "Semi-final winner";
        }
      } else {
        statusText = "Semi-final exit";
      }
    }
  }

  const matches = [...groupMatches, ...knockoutMatches];
  const userWins = matches.filter((match) => match.result === "win").length;
  const starWins = matches.filter((match) => match.result === "loss").length;
  const draws = matches.filter((match) => match.result === "draw").length;

  return {
    format: "limited-overs",
    userLineup: userLine,
    starLineup,
    userTeam,
    starTeam: starTeam.metrics,
    matches,
    groupTable,
    revealed: 0,
    userWins,
    starWins,
    draws,
    qualified,
    statusText,
    stageReached: knockoutMatches.length ? knockoutMatches[knockoutMatches.length - 1].stage : qualified ? "semi" : "group",
    playerOfSeries: null,
    leaders: collectSeriesStats({ matches }),
    tournamentType: "worldcup",
  };
}

function achievementMeta(name) {
  return ACHIEVEMENT_DEFS[name] ?? {
    description: "Achievement unlocked.",
  };
}

function setAchievementDetail(name, pinned = false) {
  STATE.achievementDetail = name;
  STATE.achievementPinned = pinned;

  const detail = els.seriesInsights?.querySelector("[data-achievement-detail]");
  if (!detail) return;

  if (!name) {
    detail.hidden = true;
    return;
  }

  const meta = achievementMeta(name);
  const title = detail.querySelector("[data-achievement-title]");
  const copy = detail.querySelector("[data-achievement-copy]");
  if (title) title.textContent = name;
  if (copy) copy.textContent = meta.description;
  detail.dataset.pinned = pinned ? "true" : "false";
  detail.hidden = false;
}

function clearAchievementDetail() {
  if (STATE.achievementPinned) return;
  setAchievementDetail(null, false);
}

function setFeedbackStatus(message, kind = "idle") {
  if (!els.feedbackStatus) return;
  els.feedbackStatus.textContent = message;
  els.feedbackStatus.dataset.kind = kind;
}

function toggleFeedbackPanel(forceOpen) {
  if (!els.feedbackPanel || !els.feedbackToggle) return;
  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : els.feedbackPanel.hidden;
  els.feedbackPanel.hidden = !shouldOpen;
  els.feedbackToggle.setAttribute("aria-expanded", String(shouldOpen));
  els.feedbackToggle.textContent = shouldOpen ? "Hide feedback" : "Feedback";
  if (shouldOpen) {
    els.feedbackMessage?.focus();
  } else {
    setFeedbackStatus("");
  }
}

function closeFeedbackPanel() {
  toggleFeedbackPanel(false);
}

function renderDraftMeter() {
  const lineup = userLineup();
  const progressLabels = [...els.draftMeter.querySelectorAll(".metric span")];
  if (!progressLabels.length) {
    return;
  }

  if (dailyChallengeActive() || !showPlayerRatingsInDraft()) {
    const dailyLineupCount = STATE.daily.fixedPlayers.length + STATE.daily.lockedSelections.length;
    const selectionsValue = dailyChallengeActive()
      ? dailyChoiceProgressText()
      : `${lineup.length} / ${XI_SLOTS.length}`;
    const openSlotsValue = dailyChallengeActive()
      ? String(Math.max(0, XI_SLOTS.length - dailyLineupCount))
      : String(Math.max(0, XI_SLOTS.length - lineup.length));
    const activeChoices = dailyChallengeActive()
      ? String(STATE.daily.currentRoll?.players?.filter((player) => player.selectable).length ?? 0)
      : String(STATE.currentSquad?.players?.filter((player) => playerCanPlay(player)).length ?? 0);

    els.draftMeter.hidden = false;
    els.draftMeterTitle.textContent = "Draft progress";
    els.draftMeterCopy.textContent = currentModeDraftNote();
    progressLabels[0].textContent = dailyChallengeActive() ? "Choices" : "Selections";
    progressLabels[1].textContent = "Open slots";
    progressLabels[2].textContent = "Live options";
    progressLabels[3].textContent = "Mode";
    els.draftBatting.textContent = selectionsValue;
    els.draftBowling.textContent = openSlotsValue;
    els.draftFielding.textContent = activeChoices;
    els.draftOverall.textContent = dailyChallengeActive() ? "Hidden ratings" : currentModeDef().shortLabel;
    els.draftMeter.dataset.grade = "hidden";
    return;
  }

  els.draftMeter.hidden = false;
  els.draftMeterTitle.textContent = "Current XI";
  els.draftMeterCopy.textContent = "Ratings update as you draft.";
  progressLabels[0].textContent = "Batting";
  progressLabels[1].textContent = "Bowling";
  progressLabels[2].textContent = "Fielding";
  progressLabels[3].textContent = "Overall";
  const metrics = draftMetricsFromLineup(userLineup());
  els.draftBatting.textContent = String(metrics.batting);
  els.draftBowling.textContent = String(metrics.bowling);
  els.draftFielding.textContent = String(metrics.fielding);
  els.draftOverall.textContent = `${metrics.overall} · ${metrics.grade}`;
  els.draftMeter.dataset.grade = metrics.grade;
}

function renderSeriesInsights() {
  if (!STATE.series || !els.seriesInsights) return;

  const competition = competitionConfig();
  const completed = seriesComplete();
  const leaders = STATE.series.leaders ?? collectSeriesStats(STATE.series);
  const achievements = completed ? (STATE.series.achievements ?? buildAchievementList(STATE.series, leaders)) : [];
  const userMetrics = teamMetricsFromLineup(STATE.series.userLineup);
  const starMetrics = teamMetricsFromLineup(STATE.series.starLineup);
  const isWorldCup = STATE.series.tournamentType === "worldcup";
  const strengthPercent = clamp(Math.round(50 + (userMetrics.overall - 60) * 2.2), 1, 99);
  const playerOfSeriesEntry = STATE.series.playerOfSeries ?? leaders.overallLeader;
  const playerOfSeries = playerOfSeriesEntry
    ? `${playerOfSeriesEntry.name} (${playerOfSeriesEntry.side === "your" ? currentSeriesUserLabel() : competition.oppositionTitle})`
    : "Awaiting";
  const tournamentLeader = STATE.series.statusText ?? "Tournament complete";
  const pathSummary = isWorldCup
    ? [
        `Group stage: ${STATE.series.groupTable.findIndex((entry) => entry.id === "your") < 2 ? "Qualified" : "Eliminated"}`,
        `Knockout: ${STATE.series.matches.some((match) => match.stage === "final") ? "Reached final" : STATE.series.matches.some((match) => match.stage === "semi") ? "Reached semi-final" : "No knockout match"}`,
        `Result: ${tournamentLeader}`,
      ]
    : [];

  els.seriesInsights.innerHTML = isWorldCup
    ? `
      <div class="insights-grid">
        <article class="insight-card insight-primary">
          <span class="insight-label">Tournament summary</span>
          <strong>${escapeHtml(tournamentLeader)}</strong>
          <p>${escapeHtml(pathSummary.join(" · "))}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">Player of the tournament</span>
          <strong>${escapeHtml(playerOfSeries)}</strong>
          <p>Most runs: ${escapeHtml(leaders.mostRuns ? `${leaders.mostRuns.name} (${leaders.mostRuns.runs})` : "n/a")}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">Tournament leaders</span>
          <div class="leader-stack">
            <span>Most Runs: ${escapeHtml(leaders.mostRuns ? `${leaders.mostRuns.name} (${leaders.mostRuns.runs})` : "n/a")}</span>
            <span>Most Wickets: ${escapeHtml(leaders.mostWickets ? `${leaders.mostWickets.name} (${leaders.mostWickets.wickets})` : "n/a")}</span>
            <span>Most Centuries: ${escapeHtml(leaders.mostCenturies ? `${leaders.mostCenturies.name} (${leaders.mostCenturies.centuries})` : "n/a")}</span>
            <span>Most Five-Fors: ${escapeHtml(leaders.mostFiveFors ? `${leaders.mostFiveFors.name} (${leaders.mostFiveFors.fiveFors})` : "n/a")}</span>
          </div>
        </article>
        <article class="insight-card">
          <span class="insight-label">Team grade</span>
          <strong>Overall ${userMetrics.overall} · ${userMetrics.grade}</strong>
          <p>Batting ${userMetrics.batting} · Bowling ${userMetrics.bowling} · Fielding ${userMetrics.fielding}</p>
        </article>
      </div>
      <div class="badge-row">
        ${
          completed && achievements.length
            ? achievements
                .map(
                  (name) =>
                    `<button type="button" class="achievement-badge" data-achievement-key="${escapeHtml(name)}" title="${escapeHtml(achievementMeta(name).description)}">${escapeHtml(name)}</button>`,
                )
                .join("")
            : `<span class="achievement-badge muted">Keep playing to unlock achievements</span>`
        }
      </div>
      <div class="achievement-detail" data-achievement-detail hidden>
        <span class="achievement-detail-label">Achievement detail</span>
        <strong data-achievement-title></strong>
        <p data-achievement-copy></p>
      </div>
    `
    : `
      <div class="insights-grid">
        <article class="insight-card insight-primary">
          <span class="insight-label">Series result</span>
          <strong>${escapeHtml(completedSeriesOutcomeText(STATE.series))}</strong>
          <p>${escapeHtml(completedSeriesSummaryText(STATE.series))}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">Completed XI</span>
          <strong>Overall ${userMetrics.overall} · ${userMetrics.grade}</strong>
          <p>Batting ${userMetrics.batting} · Bowling ${userMetrics.bowling} · Fielding ${userMetrics.fielding}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">Series edge</span>
          <strong>Your XI is stronger than ${strengthPercent}% of generated XIs</strong>
          <p>${competition.oppositionTitle}: ${starMetrics.overall} overall · ${starMetrics.grade}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">Player of the series</span>
          <strong>${escapeHtml(playerOfSeries)}</strong>
          <p>${escapeHtml(seriesWinnerLabel())}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">Series leaders</span>
          <div class="leader-stack">
            <span>Most Runs: ${escapeHtml(leaders.mostRuns ? `${leaders.mostRuns.name} (${leaders.mostRuns.runs})` : "n/a")}</span>
            <span>Most Wickets: ${escapeHtml(leaders.mostWickets ? `${leaders.mostWickets.name} (${leaders.mostWickets.wickets})` : "n/a")}</span>
            <span>Most Centuries: ${escapeHtml(leaders.mostCenturies ? `${leaders.mostCenturies.name} (${leaders.mostCenturies.centuries})` : "n/a")}</span>
            <span>Most Five-Fors: ${escapeHtml(leaders.mostFiveFors ? `${leaders.mostFiveFors.name} (${leaders.mostFiveFors.fiveFors})` : "n/a")}</span>
          </div>
        </article>
      </div>
      <div class="badge-row">
        ${
          completed && achievements.length
            ? achievements
                .map(
                  (name) =>
                    `<button type="button" class="achievement-badge" data-achievement-key="${escapeHtml(name)}" title="${escapeHtml(achievementMeta(name).description)}">${escapeHtml(name)}</button>`,
                )
                .join("")
            : `<span class="achievement-badge muted">Keep playing to unlock achievements</span>`
        }
      </div>
      <div class="achievement-detail" data-achievement-detail hidden>
        <span class="achievement-detail-label">Achievement detail</span>
        <strong data-achievement-title></strong>
        <p data-achievement-copy></p>
      </div>
    `;

  if (STATE.achievementDetail) {
    setAchievementDetail(STATE.achievementDetail, STATE.achievementPinned);
  }
}

function renderDetailedInnings(match, innings, label) {
  const summary = innings.batting ?? innings;
  const bowlers = innings.bowling ?? [];
  const batters = (summary.batters ?? []).filter((card) => !(summary.wickets >= 10 && card.dnb));
  const status = summary.didNotBat
    ? "Did not bat"
    : summary.chaseComplete
      ? "Chased down"
      : summary.declared
        ? "Declared"
        : summary.wickets >= 10
          ? "All out"
          : "In progress";

  return `
    <article class="scorecard-section">
      <div class="scorecard-head">
        <div>
          <span class="scorecard-team">${escapeHtml(label)}</span>
          <strong>${escapeHtml(summary.didNotBat ? "DNB" : `${summary.total}/${summary.wickets}${summary.declared ? "d" : ""}`)}</strong>
        </div>
        <span class="scorecard-overs">${escapeHtml(summary.overs)} overs</span>
      </div>
      <div class="scorecard-subline">
        <span>Extras ${summary.extras}</span>
        <span>${escapeHtml(status)}</span>
      </div>
      <div class="scorecard-columns">
        <table class="batting-table">
          <thead>
            <tr>
              <th>Batter</th>
              <th>R</th>
              <th>B</th>
            </tr>
          </thead>
          <tbody>
            ${batters
              .map(
                (card) => `
                  <tr class="${card.dnb ? "dnb" : ""}">
                    <td>${escapeHtml(card.name)}</td>
                    <td>${card.dnb ? "DNB" : card.runs}</td>
                    <td>${card.dnb ? "0" : card.balls}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
        <table class="bowling-table">
          <thead>
            <tr>
              <th>Bowler</th>
              <th>O</th>
              <th>W</th>
              <th>R</th>
            </tr>
          </thead>
          <tbody>
            ${bowlers
              .map(
                (bowler) => `
                  <tr>
                    <td>${escapeHtml(bowler.name)}</td>
                    <td>${escapeHtml(bowler.overs)}</td>
                    <td>${bowler.wickets}</td>
                    <td>${bowler.runs}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="scorecard-footer">
        <span>Top batter: ${escapeHtml(summary.topBatter ? `${summary.topBatter.name} ${summary.topBatter.runs}` : "n/a")}</span>
        <span>Top bowler: ${escapeHtml(bowlers[0] ? `${bowlers[0].name} ${bowlers[0].wickets}/${bowlers[0].runs}` : "n/a")}</span>
      </div>
    </article>
  `;
}

function badgeLabelHtml(label, showBadge = false) {
  return showBadge
    ? `${escapeHtml(label)} <span class="feature-badge feature-badge-inline" aria-hidden="true">NEW</span>`
    : escapeHtml(label);
}

function floatingBadgeLabelHtml(label, showBadge = false) {
  return showBadge
    ? `${escapeHtml(label)} <span class="feature-badge" aria-hidden="true">NEW</span>`
    : escapeHtml(label);
}

function renderStats() {
  const competition = competitionConfig();
  const loadedChallenge = challengeLineupLoaded();
  const routeError = STATE.view === "home" ? STATE.routeError : null;
  const publicPage = currentPublicPageDef();
  const pageKey = currentPublicPageKey();
  const homePage = pageKey === "home";
  const dailySummary = currentDailyCompetition() === STATE.competition ? STATE.daily.summary : null;
  const dailyRankedAttempt = dailySummary?.rankedAttempt ?? null;
  const dailyLabelNode = els.homeDaily?.querySelector(".feature-action-label") ?? null;
  const worldCupHome = STATE.competition === "worldcup";
  const dailyRouteLabel = worldCupHome ? "World Cup daily" : "Daily challenge";
  const dailyResumeLabel = worldCupHome ? "Resume World Cup daily" : "Resume daily challenge";
  const dailyResultLabel = worldCupHome ? "Today's World Cup result" : "Today's daily result";
  const leaderboardLabel = worldCupHome ? "World Cup community favourites" : "Community favourites";
  const heroActions = els.homePrimaryCta?.parentElement ?? null;
  const heroTrust = document.querySelector("[data-home-trust]") ?? null;
  els.homeEyebrow.hidden = homePage && !routeError;
  if (homePage) {
    renderHomePreviewCard(dailySummary);
  } else {
    els.totalSquads.textContent = String(STATE.squads.length);
    els.totalPlayers.textContent = String(STATE.catalog.length);
    els.homeSquadsLabel.textContent = competition.squadsLabel;
    els.homePlayersLabel.textContent = "Total players";
    els.homeFormatLabel.textContent = competition.format === "limited-overs" ? "Match format" : "Series format";
    els.homeFormatValue.textContent = competition.format === "limited-overs" ? "ODI" : "5 Tests";
  }
  els.gameSquadCount.textContent = dailyChallengeActive()
    ? (STATE.daily.challenge?.date ?? STATE.daily.summary?.date ?? currentDailyReferenceDateText())
    : `${STATE.squads.length} squads`;
  els.gamePlayerCount.textContent = dailyChallengeActive()
    ? `${STATE.daily.challenge?.totalRolls ?? 4} hidden rolls`
    : `${STATE.catalog.length} players`;
  els.homeMode.value = dailyChallengeActive()
    ? STATE.mode
    : isMemoryMode()
      ? "memory"
      : "classic";
  els.homeMode.disabled = loadedChallenge;
  document.title = pageTitleForCompetition(competition);

  if (staticHomePageActive()) {
    els.gameSquadCount.textContent = `${STATE.squads.length} squads`;
    els.gamePlayerCount.textContent = `${STATE.catalog.length} players`;
    els.leaderboardTotal.textContent = STATE.leaderboard.totalTeams === null ? "Loading" : String(STATE.leaderboard.totalTeams);
    document.body.dataset.competition = competition.theme;
    if (heroActions) heroActions.hidden = true;
    if (heroTrust) heroTrust.hidden = true;
    return;
  }

  els.homeEyebrow.textContent = routeError
    ? "Link problem"
    : homePage
      ? "Ashes 5-0"
      : competition.homeEyebrow;
  els.homeTitle.textContent = routeError
    ? routeError.title
    : homePage
      ? "Can your all-time Ashes XI go 5-0?"
      : competition.homeTitle;
  els.homeTagline.hidden = Boolean(routeError) || (homePage ? false : !competition.homeTagline);
  els.homeTagline.textContent = routeError
    ? ""
    : homePage
      ? "Draft from historic squads and back your cricket judgement."
      : competition.homeTagline;
  els.homeLede.textContent = routeError
    ? routeError.message
    : homePage
      ? "Draft players from historic Ashes squads, build your XI and simulate a five-Test series. The Daily Challenge is the fastest way to start."
      : competition.homeLede;
  if (heroActions) {
    heroActions.hidden = !homePage || loadedChallenge || Boolean(routeError);
  }
  if (heroTrust) {
    heroTrust.hidden = !homePage || loadedChallenge || Boolean(routeError);
  }
  els.homePanelKicker.textContent = routeError
    ? "Helpful 404"
    : loadedChallenge
      ? "Challenge received"
      : homePage
        ? "Choose a mode"
        : "How it works";
  els.homePanelTitle.textContent = routeError
    ? "Start a fresh game"
    : loadedChallenge
      ? "Accept challenge"
      : homePage
        ? "Start with the Daily Challenge"
      : pageKey === "challenge"
        ? "Friend challenge"
        : pageKey === "worldCup"
          ? "World Cup mode"
          : pageKey === "ashes"
            ? "Ashes mode"
            : "Squad Roller";
  els.homePanelCopy.hidden = loadedChallenge || homePage;
  els.homePanelCopy.innerHTML = routeError
    ? "That saved link is unavailable. You can still draft a new XI, open the leaderboard, or ask for a fresh short link."
    : loadedChallenge
      ? ""
      : pageKey === "worldCup"
        ? 'Try the <a href="/world-cup/daily">World Cup Daily Challenge</a>, compare completed XIs on the <a href="/world-cup/leaderboard">World Cup leaderboard</a>, or return to <a href="/ashes">Ashes mode</a>.'
      : pageKey === "challenge"
        ? 'Read the <a href="/how-to-play">rules</a>, compare selections on the <a href="/leaderboard">leaderboard</a>, or return to the main <a href="/ashes">Ashes mode</a>.'
        : pageKey === "ashes"
          ? 'Try the <a href="/daily">Daily Challenge</a>, create a private <a href="/challenge">friend challenge</a>, or read the <a href="/how-to-play">full rules</a>.'
          : "Build your XI, compare community favourites, and explore the other modes once you know the basics.";
  els.homeConfigGrid.hidden = loadedChallenge || Boolean(routeError) || homePage;
  els.homeResponseNameRow.hidden = !loadedChallenge;
  els.homeResponseName.value = currentChallengeResponseName();
  els.homeRulesGrid.hidden = loadedChallenge || Boolean(routeError);
  if (els.homeRuleOne) {
    els.homeRuleOne.textContent = `Roll a previous ${competition.name} squad.`;
  }
  if (els.homeRuleThree) {
    els.homeRuleThree.textContent = challengeLineupLoaded()
      ? "Repeat until your XI is full, then simulate the challenge series."
      : challengeCreationMode()
        ? "Repeat until your XI is full, then copy the invite."
        : "Repeat until your XI is full, then simulate the series.";
  }
  els.homeCompetition.innerHTML = floatingBadgeLabelHtml(competition.modeButton, !worldCupHome);
  const showHomeActions = !loadedChallenge;
  els.homeChallenge.hidden = !showHomeActions || worldCupHome || homePage;
  els.homeDaily.hidden = !showHomeActions || homePage;
  if (dailyLabelNode) {
    dailyLabelNode.textContent = STATE.daily.loadingSummary
      ? "Loading daily..."
      : dailyRankedAttempt?.simulationComplete
        ? dailyResultLabel
        : dailyRankedAttempt?.attemptId
          ? dailyResumeLabel
          : dailyRouteLabel;
  }
  els.homeDaily.title = worldCupHome
    ? "Play the ranked World Cup Daily Challenge with the same hidden roll sequence as everyone else."
    : "Play the ranked Daily Ashes Challenge with the same hidden roll sequence as everyone else.";
  els.homeLeaderboard.hidden = !showHomeActions || homePage;
  els.homeLeaderboard.textContent = leaderboardLabel;
  if (pageKey === "challenge") {
    els.homeChallenge.hidden = true;
  }
  els.homeCompetition.hidden = loadedChallenge || homePage;
  els.homeControls.hidden = homePage;
  els.playGame.textContent = routeError
    ? "Start a new game"
    : loadedChallenge
      ? "Accept challenge"
      : pageKey === "challenge"
        ? "Build a challenge XI"
    : STATE.competition === "worldcup"
      ? "Start World Cup"
      : pageKey === "ashes"
        ? "Start drafting"
        : "Start a solo game";
  els.leaderboardTotal.textContent = STATE.leaderboard.totalTeams === null ? "Loading" : String(STATE.leaderboard.totalTeams);
  els.leaderboardMetricLabel.textContent = leaderboardMetricLabel(STATE.leaderboard.metric);
  els.leaderboardPeriodLabel.textContent = leaderboardPeriodLabel(STATE.leaderboard.period);
  els.gameEyebrow.textContent = competition.gameEyebrow;
  els.gameTitle.textContent = competition.gameTitle;
  els.rosterKicker.textContent = competition.rosterKicker;
  els.boardTitle.textContent = competition.boardTitle;
  if (els.boardCopy) {
    if (dailyChallengeActive()) {
      els.boardCopy.innerHTML = dailyBoardCopyHtml();
    } else {
      els.boardCopy.innerHTML = `${escapeHtml(currentModeDraftNote())} <span>Select a player, then choose a highlighted slot.</span>`;
    }
  }
  els.seriesEyebrow.textContent = competition.seriesEyebrow;
  els.seriesTitle.textContent = competition.seriesTitle;
  els.seriesUserLabel.textContent = currentSeriesUserLabel();
  els.seriesOppositionLabel.textContent = competition.oppositionShortTitle;
  if (els.starTitle) els.starTitle.textContent = competition.oppositionTitle;
  document.body.dataset.competition = competition.theme;
}

function renderView() {
  els.homeView.hidden = STATE.view !== "home";
  els.leaderboardView.hidden = STATE.view !== "leaderboard";
  els.gameView.hidden = STATE.view !== "game";
  els.seriesView.hidden = STATE.view !== "series";
  document.body.dataset.view = STATE.view;
}

function renderSiteNav() {
  if (!els.siteNav || !els.navLinkNodes) return;
  const currentKey = activeNavKey();
  els.siteNav.hidden = false;

  for (const link of els.navLinkNodes) {
    const key = link.dataset.navLink ?? "";
    if (key === currentKey) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  if (!mobileBuilderViewport()) {
    closeSiteNav();
  }
}

function dailyDraftHelpHtml() {
  const challengeDate = STATE.daily.challenge?.date ?? STATE.daily.summary?.date ?? currentDailyReferenceDateText();
  return `
    <details class="daily-help">
      <summary aria-label="Daily challenge help" title="Daily challenge help">?</summary>
      <div class="daily-help-card">
        Complete your XI through four squad rolls. Choose one player from each squad, but choose carefully - you will not see the next squad until your current pick is locked. Everyone gets the same hidden sequence on ${escapeHtml(challengeDate)}.
      </div>
    </details>
  `;
}

function dailyBoardCopyHtml() {
  const stage = currentDailyStage();
  const worldCupDaily = currentDailyCompetition() === "worldcup";
  if (stage === "recap") {
    return `Draft complete. Your XI is ready for the ${worldCupDaily ? "ODI" : "Test"}.`;
  }

  const label = stage === "draft"
    ? "Ratings stay hidden and future squads remain unrevealed."
    : "Seven players are already locked in and ratings stay hidden.";
  return `<span>${escapeHtml(label)}</span>${dailyDraftHelpHtml()}`;
}

function dailyDisplayNameFieldHtml(label = "Daily leaderboard name (optional)") {
  return `
    <label class="control challenge-name-control">
      <span>${escapeHtml(label)}</span>
      <input
        class="challenge-name-input"
        data-daily-display-name
        type="text"
        maxlength="40"
        placeholder="Enter your name"
        value="${escapeHtml(currentDailyDisplayName())}"
      />
    </label>
  `;
}

function bindDailyDisplayNameInput(root = document) {
  const input = root?.querySelector?.("[data-daily-display-name]");
  if (!input) return;

  input.addEventListener("input", () => {
    STATE.daily.displayName = normalizeChallengeCreatorName(input.value);
    if (STATE.daily.attempt) {
      STATE.daily.attempt.displayName = STATE.daily.displayName;
    }
    if (STATE.daily.summary?.rankedAttempt) {
      STATE.daily.summary.rankedAttempt.displayName = STATE.daily.displayName;
    }
    persistStoredDailyDisplayName(currentDailyChallengeId(), "ranked", STATE.daily.displayName);
  });

  input.addEventListener("blur", () => {
    const normalized = normalizeChallengeCreatorName(input.value);
    STATE.daily.displayName = normalized;
    if (STATE.daily.attempt) {
      STATE.daily.attempt.displayName = normalized;
    }
    if (STATE.daily.summary?.rankedAttempt) {
      STATE.daily.summary.rankedAttempt.displayName = normalized;
    }
    input.value = normalized;
    persistStoredDailyDisplayName(currentDailyChallengeId(), "ranked", normalized);
  });
}

function renderDailyNameInline() {
  if (!els.dailyNameInline) return;

  const showInline = STATE.view === "game"
    && dailyChallengeActive()
    && currentDailyAttemptMode() === "ranked";
  els.dailyNameInline.hidden = !showInline;

  if (!showInline) {
    els.dailyNameInline.innerHTML = "";
    return;
  }

  const stage = currentDailyStage();
  const label = stage === "recap"
    ? "Daily leaderboard name (optional)"
    : "Set your daily leaderboard name (optional)";
  const note = stage === "recap"
    ? "This is the name that will appear on the ranked daily leaderboard if you win."
    : "Set this now so it is ready when your ranked result is submitted.";

  els.dailyNameInline.innerHTML = `
    <div class="daily-name-inline-card">
      ${dailyDisplayNameFieldHtml(label)}
      <p class="daily-name-inline-note">${escapeHtml(note)}</p>
    </div>
  `;
  bindDailyDisplayNameInput(els.dailyNameInline);
}

function dailyBoardGridHtml(lineupMap, targetSlotIndexes = []) {
  const targetSet = new Set(targetSlotIndexes);
  const fixedSlotSet = new Set((STATE.daily.fixedPlayers ?? []).map((player) => player.slotIndex));
  const chosenSlotSet = new Set((STATE.daily.lockedSelections ?? []).map((selection) => selection.slotIndex));
  return `
    <div class="board-grid">
      ${XI_SLOTS.map((slot, index) => {
        const player = lineupMap.get(index) ?? null;
        const validTarget = targetSet.has(index) && !player;
        const canClick = !player && !STATE.daily.loadingAction && Boolean(STATE.daily.pendingPlayerId);
        const slotState = player
          ? fixedSlotSet.has(index)
            ? "Preselected"
            : chosenSlotSet.has(index)
              ? "Your pick"
              : "Locked"
          : validTarget
            ? "Tap to place"
            : STATE.daily.pendingPlayerId
              ? "Not available for this player"
              : "Waiting for a player";
        return `
          <button
            class="slot ${player ? "filled" : "empty"} ${validTarget ? "target" : ""} ${canClick && !validTarget ? "ineligible" : ""}"
            type="button"
            style="grid-row: ${slot.row}; grid-column: ${slot.col};"
            ${canClick ? `data-daily-slot-index="${index}" data-daily-slot-valid="${validTarget ? "true" : "false"}"` : "disabled"}
          >
            <span class="slot-label">${escapeHtml(slot.label)}</span>
            ${
              player
                ? `<span class="slot-name">${escapeHtml(player.name)}</span><span class="slot-sub">${escapeHtml(slotState)} · ${escapeHtml(player.roles[0])}</span>`
                : `<span class="slot-sub">${escapeHtml(slotState)}</span>`
            }
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function dailyCommunityStatsBodyHtml() {
  const stats = STATE.daily.communityStats;
  if (!stats?.rolls?.length) {
    return `
      <p class="panel-subtitle">Community percentages will appear after more ranked drafts are completed.</p>
    `;
  }

  const unusual = stats.mostUnusualSelection?.player
    ? `Most unusual selection: ${stats.mostUnusualSelection.player.name} on Roll ${stats.mostUnusualSelection.rollNumber} (${stats.mostUnusualSelection.percentage}%).`
    : "Most unusual selection data will appear once more ranked attempts are complete.";
  const samePath = `${stats.sameFourChoicesPercentage}% of ranked players made the same four choices.`;

  return `
    <p class="panel-subtitle">${escapeHtml(samePath)} ${escapeHtml(unusual)}</p>
    <div class="daily-community-grid">
      ${stats.rolls.map((roll) => `
        <article class="daily-community-card">
          <strong>Roll ${roll.rollNumber} - ${escapeHtml(roll.squadLabel)}</strong>
          <div class="daily-community-list">
            ${roll.selections.map((player) => `
              <div class="daily-community-player">
                <strong>${escapeHtml(player.name)}</strong>
                <span>${player.percentage}% picked</span>
                <span>${escapeHtml(`${ratingPairLabel(player)} · Ovr ${playerOverall(player)}`)}</span>
              </div>
            `).join("")}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function dailyResultsLeaderboardCardHtml() {
  const leaderboard = STATE.daily.resultsLeaderboard;
  const totalCompletedPlayers = Math.max(0, Number(leaderboard?.totalCompletedPlayers ?? 0));
  const completedSummary = `${totalCompletedPlayers} ranked ${pluralize(totalCompletedPlayers, "player")} ${totalCompletedPlayers === 1 ? "has" : "have"} completed this daily challenge.`;
  if (!leaderboard?.entries?.length) {
    return `
      <p class="panel-subtitle">${escapeHtml(totalCompletedPlayers ? `${completedSummary} No ranked wins have been recorded yet for this daily challenge.` : "No ranked results have been recorded yet for this daily challenge.")}</p>
    `;
  }

  return `
    <p class="panel-subtitle">${escapeHtml(completedSummary)} Top 5 ranked winning margins for ${escapeHtml(STATE.daily.challenge?.date ?? STATE.daily.summary?.date ?? currentDailyReferenceDateText())}.</p>
    <div class="daily-community-grid">
      ${leaderboard.entries.map((entry, index) => `
        <article class="daily-community-card">
          <strong>${index + 1}. ${escapeHtml(entry.isCurrentUser ? `${entry.displayName} (You)` : entry.displayName)}</strong>
          <div class="daily-community-list">
            <span>${escapeHtml(entry.margin)}</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDailyCommunityPanel() {
  if (!els.dailyCommunityPanel || !els.dailyCommunityContent) return;

  const showPanel = dailyChallengeActive() && seriesComplete();
  els.dailyCommunityPanel.hidden = !showPanel;

  if (!showPanel) {
    els.dailyCommunityContent.innerHTML = "";
    return;
  }

  els.dailyCommunityContent.innerHTML = dailyCommunityStatsBodyHtml();
}

function renderGameMeta() {
  const competition = competitionConfig();
  const rolling = Boolean(STATE.rollAnimation?.active);
  const buildingChallenge = challengeCreationMode();
  if (dailyChallengeActive()) {
    const stage = currentDailyStage();
    const selectedCount = STATE.daily.fixedPlayers.length + STATE.daily.lockedSelections.length;
    const otherDailyRoute = dailyPathForCompetition(otherDailyCompetition());
    const otherDailyLabel = currentDailyCompetition() === "worldcup" ? "Try the Ashes daily" : "Try the World Cup daily";
    els.startSeries.classList.toggle("primary", stage === "recap");
    els.startSeries.classList.toggle("secondary", stage !== "recap");
    els.gameMode.textContent = currentDailyAttemptMode() === "practice"
      ? `${competition.name} Daily Practice`
      : `${competition.name} Daily`;
    els.currentSquad.textContent = stage === "draft"
      ? `Squad ${STATE.daily.currentRoll?.rollNumber ?? 1} of ${STATE.daily.challenge?.totalRolls ?? 4}`
      : stage === "recap"
        ? "Draft complete"
        : "Reveal the first squad";
    els.lineupStatus.textContent = stage === "recap"
      ? `${STATE.daily.challenge?.totalRolls ?? 4} of ${STATE.daily.challenge?.totalRolls ?? 4} choices made`
      : dailyChoiceProgressText();
    els.rollSquad.hidden = STATE.view !== "game" || stage !== "intro";
    els.rollSquad.textContent = STATE.daily.loadingAction || STATE.daily.loadingSummary ? "Loading..." : "Reveal the first squad";
    els.rollSquad.disabled = STATE.view !== "game" || stage !== "intro" || STATE.daily.loadingAction || STATE.daily.loadingSummary;
    els.startSeries.hidden = STATE.view !== "game" || stage !== "recap";
    els.startSeries.disabled = STATE.view !== "game" || stage !== "recap" || STATE.daily.loadingAction;
    els.startSeries.textContent = STATE.daily.loadingAction
      ? `Preparing ${competition.matchLabel}...`
      : `Play the ${competition.matchLabel}`;
    if (els.dailyRouteSwitch) {
      els.dailyRouteSwitch.hidden = STATE.view !== "game";
      els.dailyRouteSwitch.href = otherDailyRoute;
      els.dailyRouteSwitch.innerHTML = badgeLabelHtml(otherDailyLabel, currentDailyCompetition() !== "worldcup");
    }
    return;
  }

  if (els.dailyRouteSwitch) {
    els.dailyRouteSwitch.hidden = true;
  }
  els.startSeries.classList.remove("primary");
  els.startSeries.classList.add("secondary");

  els.gameMode.textContent = isChallengeMode()
    ? `${currentModeDef().shortLabel} Challenge`
    : currentModeDef().cardTitle;
  els.currentSquad.textContent = currentSquadLabel();
  els.lineupStatus.textContent = `${STATE.lineup.size} of ${XI_SLOTS.length} selected`;
  els.rollSquad.hidden = false;
  els.startSeries.hidden = STATE.view !== "game" || buildingChallenge;
  els.startSeries.disabled = !lineupComplete() || STATE.view !== "game" || buildingChallenge;
  els.startSeries.textContent = lineupComplete()
    ? challengeLineupLoaded()
      ? "Simulate the challenge series"
      : "Simulate the series"
    : `Fill XI to simulate (${STATE.lineup.size}/11)`;
  els.rollSquad.textContent = rolling ? "Rolling..." : `Roll ${competition.name} squad`;
  els.rollSquad.disabled = STATE.view !== "game" || lineupComplete() || Boolean(STATE.currentSquad) || rolling;
}

function renderRoster() {
  if (dailyChallengeActive()) {
    const stage = currentDailyStage();
    const dailyCompetition = competitionConfig();
    const players = STATE.daily.currentRoll?.players ?? [];
    const selected = players.find((player) => player.id === STATE.daily.pendingPlayerId) ?? null;
    els.rosterGrid.dataset.competition = dailyCompetition.theme;

    if (stage === "intro") {
      const oppositionLabel = STATE.daily.challenge?.opposition?.label ?? "today's opposition";
      const challengeDate = STATE.daily.challenge?.date ?? STATE.daily.summary?.date ?? currentDailyReferenceDateText();
      const matchLabel = dailyCompetition.matchLabel;
      els.rosterTitle.textContent = "Reveal the first squad";
      els.rosterSummary.textContent = `One ${matchLabel} against ${oppositionLabel}.`;
      els.rosterGrid.innerHTML = `
        <article class="copy-card daily-intro-card">
          <h3>Four rolls. One ${matchLabel}.</h3>
          <p>Build the shared daily XI through a hidden sequence before you play the match.</p>
          <ul>
            <li>7 players are already locked into your XI.</li>
            <li>4 historic ${dailyCompetition.name} squads appear one at a time.</li>
            <li>You select 1 player from each squad.</li>
            <li>Future squads stay hidden until the current pick is locked.</li>
            <li>Everyone receives the same deterministic sequence for ${escapeHtml(challengeDate)}.</li>
            <li>Your first ranked attempt is the entry that counts for the daily leaderboard.</li>
          </ul>
        </article>
      `;
      return;
    }

    if (stage === "recap") {
      els.rosterTitle.textContent = "Ready to play";
      els.rosterSummary.textContent = currentDailyAttemptMode() === "ranked"
        ? `Your XI is complete. Play the ${dailyCompetition.matchLabel} when you are ready.`
        : "Practice result. This draft will not affect the ranked leaderboard.";
      els.rosterGrid.innerHTML = `
        <article class="daily-recap-card">
          <strong>${escapeHtml(currentDailyAttemptMode() === "ranked" ? "Ranked attempt ready" : "Practice attempt ready")}</strong>
          <p>${escapeHtml(currentDailyAttemptMode() === "ranked"
            ? `Your leaderboard name is set above. Start the ${dailyCompetition.matchLabel} when you are ready.`
            : `Your practice XI is locked in. Start the ${dailyCompetition.matchLabel} when you are ready.`)}</p>
        </article>
      `;
      return;
    }

    els.rosterTitle.textContent = STATE.daily.currentRoll?.squadLabel ?? "Current squad";
    els.rosterSummary.textContent = selected
      ? `${selected.name} is selected. Pick one of the highlighted slots in your XI.`
      : `${players.length} players available. Click one, then choose a slot.`;

    if (!players.length) {
      els.rosterGrid.innerHTML = `<div class="placeholder">Loading the next squad...</div>`;
      return;
    }

    els.rosterGrid.innerHTML = players
      .map((player) => buildPlayerCardHtml(player, {
        selected: player.id === STATE.daily.pendingPlayerId,
        unavailable: !player.selectable || STATE.daily.loadingAction,
        slotIndexes: player.validSlotIndexes ?? [],
        buttonDataAttr: `data-daily-player-id="${player.id}"`,
        note: player.selectable ? "Ratings stay hidden in the Daily Challenge." : player.unavailableReason || "Unavailable",
      }))
      .join("");

    els.rosterGrid.querySelectorAll("[data-daily-player-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const playerId = button.dataset.dailyPlayerId;
        const nextPlayerId = STATE.daily.pendingPlayerId === playerId ? null : playerId;
        const firstPreview = !STATE.daily.pendingPlayerId && STATE.daily.lockedSelections.length === 0;
        STATE.daily.pendingPlayerId = nextPlayerId;
        if (nextPlayerId) {
          announce("Player selected. Choose a highlighted slot.");
          if (firstPreview) {
            trackStandardEvent("first_player_viewed", { mode: analyticsModeValue() });
          }
          trackDailyEvent("daily_player_previewed", {
            roll_number: STATE.daily.currentRoll?.rollNumber ?? 0,
            attempt_mode: currentDailyAttemptMode(),
          });
        }
        renderRoster();
        renderBoard();
        if (nextPlayerId) {
          scrollBuilderTargetIntoView(els.board.closest(".board-panel") ?? els.board);
        }
      });
    });
    return;
  }

  const competition = competitionConfig();
  const players = STATE.currentSquad?.players ?? [];
  const selected = STATE.catalog.find((player) => player.id === STATE.selectedPlayerId) ?? null;
  const rolling = Boolean(STATE.rollAnimation?.active);

  els.rosterTitle.textContent = rolling
    ? STATE.rollAnimation.label
    : STATE.currentSquad
      ? STATE.currentSquad.label
      : "No squad rolled yet";
  if (rolling) {
    els.rosterSummary.textContent = "Rolling through squads...";
  } else if (!STATE.currentSquad) {
    els.rosterSummary.textContent = lineupComplete()
      ? challengeCreationMode()
        ? "Your XI is complete. Copy the invite above."
        : challengeLineupLoaded()
          ? "Your XI is complete. Start the challenge series."
          : "Your XI is complete. Start the series."
      : STATE.lineup.size
        ? "A player has been locked. Roll another squad to continue."
        : `Roll a ${competition.name} squad to begin.`;
  } else if (selected) {
    els.rosterSummary.textContent = `${selected.name} is selected. Pick one of the highlighted slots to lock them in.`;
  } else {
    els.rosterSummary.textContent = `${players.length} players available. Click one, then choose a slot.`;
  }
  els.rosterGrid.dataset.competition = competition.theme;

  if (rolling || !players.length) {
    els.rosterGrid.innerHTML = `
      <div class="placeholder">
        ${
          rolling
            ? "Rolling squad..."
            : lineupComplete()
            ? challengeCreationMode()
              ? "XI complete. Copy the invite above."
              : challengeLineupLoaded()
                ? "XI complete. Simulate the challenge series."
                : "XI complete. Simulate the series."
            : STATE.lineup.size
              ? "Player locked. Roll another squad."
              : "Roll a squad to see its players."
        }
      </div>
    `;
    return;
  }

  els.rosterGrid.innerHTML = players
    .map((player) => {
      const locked = lineupContainsName(player.name);
      const availableSlots = availableSlotIndexesForPlayer(player);
      const unavailable = locked || !availableSlots.length;
      return buildPlayerCardHtml(player, {
        selected: player.id === STATE.selectedPlayerId,
        unavailable,
        slotIndexes: availableSlots,
        buttonDataAttr: `data-player-id="${player.id}"`,
        note: locked
          ? "Already in your XI."
          : availableSlots.length
            ? currentModeDraftNote()
            : "No valid slot remains for this player.",
      });
    })
    .join("");

  els.rosterGrid.querySelectorAll("[data-player-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const playerId = button.dataset.playerId;
      const nextPlayerId = STATE.selectedPlayerId === playerId ? null : playerId;
      const firstPreview = !STATE.selectedPlayerId && STATE.lineup.size === 0;
      STATE.selectedPlayerId = nextPlayerId;
      if (nextPlayerId) {
        announce("Player selected. Choose a highlighted slot.");
        if (firstPreview) {
          trackStandardEvent("first_player_viewed", { mode: analyticsModeValue() });
        }
      }
      renderRoster();
      renderBoard();
      if (nextPlayerId) {
        scrollBuilderTargetIntoView(els.board.closest(".board-panel") ?? els.board);
      }
    });
  });
}

function renderBoard() {
  const competition = competitionConfig();
  els.board.dataset.competition = competition.theme;

  if (dailyChallengeActive()) {
    const stage = currentDailyStage();
    const pendingPlayer = STATE.daily.currentRoll?.players?.find((player) => player.id === STATE.daily.pendingPlayerId) ?? null;
    const lineupMap = currentDailyLineupMap();

    if (stage === "recap") {
      els.board.innerHTML = `
        <div class="daily-board">
          ${dailyBoardGridHtml(lineupMap)}
        </div>
      `;
      return;
    }

    const targetSlotIndexes = pendingPlayer?.validSlotIndexes ?? [];
    els.board.innerHTML = `
      <div class="daily-board">
        ${dailyBoardGridHtml(lineupMap, targetSlotIndexes)}
        ${pendingPlayer ? "" : `
          <div class="placeholder">${stage === "intro" ? "Reveal the first squad to begin." : "Select one player from the current squad to continue."}</div>
        `}
      </div>
    `;

    els.board.querySelectorAll("[data-daily-slot-index]").forEach((button) => {
      button.addEventListener("click", () => {
        button.blur();
        const valid = button.dataset.dailySlotValid === "true";
        if (!valid) {
          const pendingPlayer = STATE.daily.currentRoll?.players?.find((player) => player.id === STATE.daily.pendingPlayerId);
          const slotLabel = XI_SLOTS[Number(button.dataset.dailySlotIndex)]?.label ?? "that slot";
          announce(`${pendingPlayer?.name ?? "This player"} cannot be placed at ${slotLabel}. Choose a highlighted slot.`);
          return;
        }
        const slotIndex = Number(button.dataset.dailySlotIndex);
        void lockDailySelection(slotIndex);
      });
    });
    return;
  }

  const selected = STATE.catalog.find((player) => player.id === STATE.selectedPlayerId) ?? null;
  const rolling = Boolean(STATE.rollAnimation?.active);

  els.board.innerHTML = `
    <div class="board-grid">
      ${XI_SLOTS.map((slot, index) => {
        const player = STATE.lineup.get(index) ?? null;
        const canAccept = !rolling && selected ? slotAcceptsPlayer(slot, selected) : false;
        const canClick = Boolean(selected && !player);
        return `
          <button
            class="slot ${player ? "filled" : "empty"} ${canAccept && canClick ? "target" : ""} ${canClick && !canAccept ? "ineligible" : ""}"
            type="button"
            style="grid-row: ${slot.row}; grid-column: ${slot.col};"
            ${canClick ? `data-slot-index="${index}" data-slot-valid="${canAccept ? "true" : "false"}"` : "disabled"}
          >
            <span class="slot-label">${escapeHtml(slot.label)}</span>
            ${
              player
                ? `<span class="slot-name">${escapeHtml(player.name)}</span><span class="slot-sub">${escapeHtml(player.roles[0])}</span>`
                : `<span class="slot-sub">${selected ? (canAccept ? "Tap to place" : "Not available for this player") : "Waiting for a player"}</span>`
            }
          </button>
        `;
      }).join("")}
    </div>
  `;

  els.board.querySelectorAll("[data-slot-index]").forEach((button) => {
    button.addEventListener("click", () => {
      button.blur();
      const index = Number(button.dataset.slotIndex);
      const slot = XI_SLOTS[index];
      const player = STATE.catalog.find((candidate) => candidate.id === STATE.selectedPlayerId);
      const valid = button.dataset.slotValid === "true";
      if (!player || !slot || STATE.lineup.has(index)) return;
      if (!valid || !slotAcceptsPlayer(slot, player)) {
        announce(`${player.name} cannot be placed at ${slot.label}. Choose a highlighted slot.`);
        return;
      }
      if (lineupContainsName(player.name)) return;

      const firstPick = STATE.lineup.size === 0;
      STATE.lineup.set(index, player);
      if (STATE.lineup.size === XI_SLOTS.length && isChallengeMode()) {
        const role = challengeLineupLoaded() ? "recipient" : "creator";
        trackChallengeEvent("challenge_team_completed", { role });
        if (role === "creator") {
          trackChallengeEvent("challenge_link_generated", {
            role,
            challenge_ref: challengeRefForCode(challengeCodeForLineup(userLineup(), currentChallengePlayableMode())),
          });
        }
      }
      if (firstPick) {
        trackStandardEvent("first_pick", { mode: analyticsModeValue() });
      }
      trackStandardEvent("player_assigned", { mode: analyticsModeValue() });
      if (STATE.lineup.size === XI_SLOTS.length) {
        trackStandardEvent("draft_completed", { mode: analyticsModeValue() });
      }
      STATE.selectedPlayerId = null;
      STATE.currentSquad = null;
      announce(`${player.name} assigned to ${slot.label}.`);
      renderAll();
      scrollBuilderTargetIntoView(els.rollSquad.closest(".controls") ?? els.rollSquad);
    });
  });
}

function setChallengeStatus(message) {
  if (!els.challengeStatus) return;
  els.challengeStatus.textContent = message;
}

function renderChallengePanel() {
  if (!els.challengePanel) return;

  const showPanel = STATE.view === "game" && STATE.competition === "ashes" && isChallengeMode() && !dailyChallengeActive();
  const loadedChallenge = challengeLineupLoaded();
  const creatorName = loadedChallengeCreatorName();
  const playableMode = currentChallengePlayableMode();
  const playableModeLabel = playableMode === "memory" ? "Memory" : "Classic";
  els.challengePanel.hidden = !showPanel;
  if (!showPanel) {
    setChallengeStatus("");
    return;
  }

  const ready = loadedChallenge || lineupComplete();
  const url = ready ? currentChallengeUrl() : "";
  const challengeCreatorName = currentChallengeCreatorName();
  const generatedLink = !loadedChallenge && Boolean(STATE.generatedChallenge?.url);
  const modeLocked = challengeModeSelectionLocked();

  els.challengeTitle.textContent = loadedChallenge
    ? creatorName
      ? `${creatorName}'s ${playableModeLabel.toLowerCase()} challenge`
      : `${playableModeLabel} challenge loaded`
    : "Create your invite link";
  els.challengeCopy.textContent = loadedChallenge
    ? creatorName
      ? `Draft your XI in ${playableModeLabel.toLowerCase()} mode, then simulate a five-Test series against ${creatorName}'s saved side.`
      : `Draft your XI in ${playableModeLabel.toLowerCase()} mode, then simulate a five-Test series against the saved side.`
    : ready
      ? generatedLink
        ? "Your short Ashes 5-0 invite is ready to share."
        : "Your XI is locked. Create a short Ashes 5-0 invite link to share with someone else."
      : `Complete your XI in ${playableModeLabel.toLowerCase()} mode to generate an Ashes 5-0 invite link.`;
  els.challengeNameRow.hidden = loadedChallenge;
  els.challengeName.value = loadedChallenge ? "" : STATE.challengeDraftName;
  els.challengeName.disabled = generatedLink;
  els.challengeMode.value = playableMode;
  els.challengeMode.disabled = loadedChallenge || modeLocked;
  els.challengeMeta.hidden = !loadedChallenge;
  els.challengeMeta.textContent = loadedChallenge
    ? creatorName
      ? `Challenge created by ${creatorName} · ${playableModeLabel} mode.`
      : `${playableModeLabel} mode challenge.`
    : "";
  els.challengeLink.value = url;
  if (!ready || (!loadedChallenge && !generatedLink)) {
    setChallengeStatus("");
  }
  els.copyChallengeLink.disabled = !ready;
  els.copyChallengeLink.textContent = loadedChallenge || generatedLink ? "Copy invite" : "Create invite";
  if (!loadedChallenge && challengeCreatorName && !ready) {
    els.challengeMeta.hidden = false;
    els.challengeMeta.textContent = `Invite will be shared as ${challengeCreatorName} · ${playableModeLabel} mode.`;
  } else if (!loadedChallenge && generatedLink) {
    els.challengeMeta.hidden = false;
    els.challengeMeta.textContent = `Short invite saved as ${challengeCreatorName || "Anonymous"} · ${playableModeLabel} mode.`;
  }
}

function renderSeriesSummary() {
  if (!STATE.series) return;
  const competition = competitionConfig();
  const completed = seriesComplete();
  const revealedAll = STATE.series.revealed >= STATE.series.matches.length;
  const resultLoaded = resultSnapshotLoaded();
  const dailyRankedComplete = dailyChallengeActive() && completed && STATE.daily.attempt?.attemptMode === "ranked";
  const canSendBack = completed && (challengeLineupLoaded() || resultLoaded);
  const sendTarget = currentChallengeSendTarget();
  const dailyRouteSwitchTarget = dailyPathForCompetition(otherDailyCompetition());
  const dailyRouteSwitchLabel = currentDailyCompetition() === "worldcup" ? "Try the Ashes daily" : "Try the World Cup daily";
  els.seriesProgress.textContent = completed
    ? completedSeriesOutcomeText(STATE.series)
    : `${STATE.series.revealed} / ${STATE.series.matches.length} ${competition.seriesProgressLabel}`;
  els.seriesStatus.textContent = completed
    ? completedSeriesSummaryText(STATE.series)
    : STATE.series.revealed === 0
      ? "Ready to simulate"
      : "Simulation in progress";
  els.backBuilder.hidden = true;
  els.seriesUserStrength.textContent = `${STATE.series.userTeam.overall} · ${STATE.series.userTeam.grade}`;
  els.seriesStarStrength.textContent = `${STATE.series.starTeam.overall} · ${STATE.series.starTeam.grade}`;
  els.seriesUserLabel.textContent = currentSeriesUserLabel();
  els.seriesOppositionLabel.textContent = competition.oppositionShortTitle;
  els.seriesActions.hidden = !completed;
  els.seriesControlsPanel.hidden = resultLoaded || completed;
  els.sendResultBack.hidden = dailyChallengeActive() || !canSendBack;
  els.sendResultBack.textContent = sendTarget ? `Send result back to ${sendTarget}` : "Send result back";
  if (els.dailyPractice) {
    els.dailyPractice.hidden = !dailyRankedComplete;
  }
  if (els.dailyRouteSwitchSeries) {
    els.dailyRouteSwitchSeries.hidden = !dailyChallengeActive();
    els.dailyRouteSwitchSeries.href = dailyRouteSwitchTarget;
    els.dailyRouteSwitchSeries.innerHTML = badgeLabelHtml(
      dailyRouteSwitchLabel,
      currentDailyCompetition() !== "worldcup",
    );
  }
  els.seriesLeaderboard.textContent = STATE.competition === "worldcup" ? "World Cup community favourites" : "Community favourites";
  if (els.challengeBack) {
    els.challengeBack.hidden = dailyChallengeActive() || !completed || (!challengeLineupLoaded() && !resultLoaded);
  }
  els.playAgain.classList.toggle("primary", !canSendBack);
  els.playAgain.classList.toggle("secondary", canSendBack);
  els.sendResultBack.classList.toggle("primary", canSendBack);
  els.sendResultBack.classList.toggle("secondary", !canSendBack);
  els.shareResult.textContent = primaryShareButtonLabel();
  els.copyLink.textContent = "Copy link";
  els.downloadShare.textContent = "Download image";
  els.seriesTitle.textContent = competition.seriesTitle;
  if (els.seriesNext) {
    els.seriesNext.disabled = revealedAll;
    els.seriesNext.textContent = revealedAll ? "Series complete" : "Simulate next game";
  }
  if (els.seriesAll) {
    els.seriesAll.disabled = revealedAll;
    els.seriesAll.textContent = revealedAll ? "Series complete" : "Simulate all games";
  }
}

function renderSeriesPanels() {
  if (!els.seriesFeedKicker || !els.seriesFeedTitle || !els.seriesTableKicker || !els.seriesTableTitle) return;

  if (dailyChallengeActive()) {
    els.seriesFeedKicker.textContent = currentDailyCompetition() === "worldcup" ? "Daily ODI result" : "Daily result";
    els.seriesFeedTitle.textContent = currentDailyCompetition() === "worldcup" ? "ODI result" : "Match result";
    els.seriesTableKicker.textContent = "Community";
    els.seriesTableTitle.textContent = "Daily leaderboard";
    return;
  }

  els.seriesFeedKicker.textContent = "Live feed";
  els.seriesFeedTitle.textContent = "Match-by-match results";
  els.seriesTableKicker.textContent = "Series table";
  els.seriesTableTitle.textContent = "Final tally";
}

function renderSeriesFeed() {
  if (!STATE.series) return;
  const competition = competitionConfig();
  const visible = STATE.series.matches.slice(0, STATE.series.revealed);
  els.seriesFeed.innerHTML = visible
    .map((match) => {
      const resultClass =
        match.result === "win" ? "result-win" : match.result === "loss" ? "result-loss" : "result-draw";
      const limitedOvers = match.format === "limited-overs";
      const homeLabel = match.homeTeam?.label ?? currentSeriesUserLabel();
      const awayLabel = match.awayTeam?.label ?? currentSeriesOppositionLabel();
      const awayCategory = match.awayTeam?.category ? ` · ${match.awayTeam.category}` : "";
      const innings = limitedOvers
        ? match.innings.slice(0, 2)
        : match.innings;
      const metaLabel = limitedOvers
        ? `${match.stageLabel ?? competition.matchLabel}${match.matchNumber ? ` ${match.matchNumber}` : ""}${awayCategory} · ${match.venue}`
        : `${competition.matchLabel} ${match.matchNumber ?? match.testNumber} · ${match.venue}`;
      return `
        <article class="match-card ${resultClass}">
          <div class="match-meta">${escapeHtml(metaLabel)}</div>
          <div class="match-row">
            <span class="match-team">${escapeHtml(homeLabel)}</span>
            <strong class="match-score">${escapeHtml(match.scoreline)}</strong>
            <span class="match-team">${escapeHtml(awayLabel)}</span>
          </div>
          <div class="match-headline">${escapeHtml(match.headline)}</div>
          <div class="match-summary">${escapeHtml(match.summary)}</div>
          <div class="innings-grid">
            ${innings
              .map(
                (innings) => `
                  <div class="innings-chip">
                    <span>${escapeHtml(innings.label)}</span>
                    <strong>${escapeHtml(innings.score)}</strong>
                  </div>
                `,
              )
              .join("")}
          </div>
          <div class="box-score">
            <div class="box-team">
              <span class="box-heading">${escapeHtml(homeLabel)}</span>
              <span>Top bat: ${escapeHtml(match.userBox.batter.name)} ${escapeHtml(String(match.userBox.batter.runs))}</span>
              <span>Top bowl: ${escapeHtml(match.userBox.bowler.name)} ${escapeHtml(match.userBox.bowler.figures)}</span>
            </div>
            <div class="box-team">
              <span class="box-heading">${escapeHtml(awayLabel)}</span>
              <span>Top bat: ${escapeHtml(match.starBox.batter.name)} ${escapeHtml(String(match.starBox.batter.runs))}</span>
              <span>Top bowl: ${escapeHtml(match.starBox.bowler.name)} ${escapeHtml(match.starBox.bowler.figures)}</span>
            </div>
          </div>
          ${
            match.snapshotOnly
              ? ""
              : `
                <details class="scorecard-toggle">
                  <summary>Full scorecard</summary>
                  <div class="scorecard-stack">
                    ${renderDetailedInnings(match, match.inningsData.user1, limitedOvers ? `${homeLabel} innings` : `${homeLabel} 1st innings`)}
                    ${renderDetailedInnings(match, match.inningsData.star1, limitedOvers ? `${awayLabel} innings` : `${awayLabel} 1st innings`)}
                    ${limitedOvers ? "" : renderDetailedInnings(match, match.inningsData.user2, `${homeLabel} 2nd innings`)}
                    ${limitedOvers ? "" : renderDetailedInnings(match, match.inningsData.star2, `${awayLabel} 2nd innings`)}
                  </div>
                </details>
              `
          }
        </article>
      `;
    })
    .join("");
}

function renderSeriesTable() {
  if (!STATE.series) return;
  els.seriesTableWrap.classList.remove("daily-results-wrap");
  if (dailyChallengeActive()) {
    els.seriesTableWrap.classList.add("daily-results-wrap");
    if (STATE.series.revealed < STATE.series.matches.length) {
      els.seriesTableWrap.innerHTML = `<div class="placeholder">The daily leaderboard will appear after the ${escapeHtml(competitionConfig().matchLabel)} result is revealed.</div>`;
      return;
    }

    els.seriesTableWrap.innerHTML = dailyResultsLeaderboardCardHtml();
    return;
  }

  if (STATE.series.revealed < STATE.series.matches.length) {
    els.seriesTableWrap.innerHTML = `<div class="placeholder">The table will appear when the tournament ends.</div>`;
    return;
  }

  if (STATE.series.tournamentType === "worldcup") {
    const qualifiers = STATE.series.groupTable.slice(0, 2).map((entry) => entry.id);
    const yourRow = STATE.series.groupTable.find((entry) => entry.id === "your");

    els.seriesTableWrap.innerHTML = `
      <div class="tournament-summary">
        <div class="tournament-summary-card">
          <span class="scorecard-team">World Cup path</span>
          <strong>${escapeHtml(STATE.series.statusText ?? "Tournament complete")}</strong>
          <p>${escapeHtml(yourRow ? `Your XI finished ${yourRow.played} group matches.` : "Tournament complete.")}</p>
        </div>
        <table class="series-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Pld</th>
              <th>W</th>
              <th>L</th>
              <th>Pts</th>
              <th>NRR</th>
            </tr>
          </thead>
          <tbody>
            ${STATE.series.groupTable
              .map(
                (entry) => `
                  <tr class="${entry.id === "your" ? "highlight" : qualifiers.includes(entry.id) ? "qualified" : ""}">
                    <td>${escapeHtml(entry.label)}</td>
                    <td>${entry.played}</td>
                    <td>${entry.wins}</td>
                    <td>${entry.losses}</td>
                    <td>${entry.points}</td>
                    <td>${entry.nrr.toFixed(2)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    return;
  }
  const { userWins, starWins, draws } = STATE.series;
  const opponentLabel = competitionConfig().oppositionShortTitle;
  const userLabel = currentSeriesUserLabel();
  const winner =
    userWins > starWins ? userLabel : starWins > userWins ? opponentLabel : "Series drawn";
  const tableHtml = `
    <table class="series-table">
      <thead>
        <tr>
          <th>Side</th>
          <th>Won</th>
          <th>Drawn</th>
          <th>Lost</th>
        </tr>
      </thead>
      <tbody>
        <tr class="${winner === userLabel ? "highlight" : ""}">
          <td>${escapeHtml(userLabel)}</td>
          <td>${userWins}</td>
          <td>${draws}</td>
          <td>${starWins}</td>
        </tr>
        <tr class="${winner === opponentLabel ? "highlight" : ""}">
          <td>${escapeHtml(opponentLabel)}</td>
          <td>${starWins}</td>
          <td>${draws}</td>
          <td>${userWins}</td>
        </tr>
      </tbody>
    </table>
  `;

  els.seriesTableWrap.innerHTML = tableHtml;
}

function renderStarLineup() {
  if (!STATE.series || !els.starLineup) return;
  const competition = competitionConfig();
  const revealRatings = seriesComplete() || !isMemoryMode();
  els.starLineup.innerHTML = STATE.series.starLineup
    .map(
      (player, index) => `
        <article class="x11-card">
          <div class="role">${escapeHtml(XI_SLOTS[index].label)}</div>
          <div class="name">${escapeHtml(player.name)}</div>
          <div class="rating">Bat ${revealRatings ? player.batting : "??"} / Bowl ${revealRatings ? player.bowling : "??"}</div>
        </article>
      `,
    )
    .join("");
  els.starLineup.dataset.competition = competition.theme;
}

function renderSeriesReveal() {
  if (!STATE.series || !els.seriesReveal || !els.seriesRevealGrid) return;
  const showReveal = seriesComplete() && (isMemoryMode() || resultSnapshotLoaded());
  els.seriesReveal.hidden = !showReveal;
  els.seriesReveal.open = showReveal;

  if (!showReveal) {
    els.seriesRevealGrid.innerHTML = "";
    return;
  }

  const revealRatings = seriesComplete() || !isMemoryMode();
  const buildSide = (title, lineup, metrics, sideClass) => `
    <article class="season-reveal-card ${sideClass}">
      <div class="season-reveal-slot">${escapeHtml(title)}</div>
      <div class="season-reveal-summary">
        <strong>${metrics.overall} · ${metrics.grade}</strong>
        <span>Bat ${metrics.batting} · Bowl ${metrics.bowling} · Field ${metrics.fielding}</span>
      </div>
      <div class="season-reveal-list">
        ${lineup
          .map(
            (player, index) => `
              <div class="season-reveal-row">
                <span class="season-reveal-name">${escapeHtml(player.name)}</span>
                <span class="season-reveal-rating">Bat ${revealRatings ? player.batting : "??"} / Bowl ${revealRatings ? player.bowling : "??"}</span>
                <span class="season-reveal-role">${escapeHtml(XI_SLOTS[index].label)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;

  els.seriesRevealGrid.innerHTML = `
    ${buildSide(currentSeriesUserLabel(), STATE.series.userLineup, teamMetricsFromLineup(STATE.series.userLineup), "your-side")}
    ${buildSide(currentSeriesOppositionLabel(), STATE.series.starLineup, teamMetricsFromLineup(STATE.series.starLineup), "star-side")}
  `;
}

function renderSeries() {
  renderSeriesSummary();
  renderSeriesPanels();
  renderSeriesFeed();
  renderSeriesTable();
  renderDailyCommunityPanel();
  renderStarLineup();
  renderSeriesInsights();
  renderSeriesReveal();
}

async function loadLeaderboard() {
  const competition = currentLeaderboardCompetition();
  STATE.leaderboard.loading = true;
  STATE.leaderboard.error = "";
  STATE.leaderboard.competition = competition;
  renderLeaderboard();

  try {
    const params = new URLSearchParams({
      competition,
      metric: STATE.leaderboard.metric,
      period: STATE.leaderboard.period,
      mode: STATE.leaderboard.mode,
    });
    const response = await fetch(`/api/leaderboards/players?${params.toString()}`);
    const responseText = await response.text();
    let payload = {};
    try {
      payload = responseText ? JSON.parse(responseText) : {};
    } catch {
      payload = {};
    }
    if (!response.ok || payload.ok === false) {
      const message = payload.error
        || responseText.trim()
        || `Could not load the leaderboard (HTTP ${response.status}).`;
      throw new Error(message);
    }

    STATE.leaderboard.competition = normalizeCompetitionValue(payload.competition ?? competition);
    STATE.leaderboard.totalTeams = Number(payload.totalTeams ?? 0);
    STATE.leaderboard.limit = Number(payload.limit ?? 20);
    STATE.leaderboard.entries = Array.isArray(payload.entries) ? payload.entries : [];
  } catch (error) {
    STATE.leaderboard.error = error instanceof Error ? error.message : "Could not load the leaderboard.";
  } finally {
    STATE.leaderboard.loading = false;
    renderLeaderboard();
  }
}

function renderLeaderboard() {
  const leaderboard = STATE.leaderboard;
  const copy = leaderboardCopyForCompetition();
  els.leaderboardMetric.value = leaderboard.metric;
  els.leaderboardPeriod.value = leaderboard.period;
  els.leaderboardMode.value = leaderboard.mode;
  els.leaderboardTitle.textContent = copy.title;
  els.leaderboardLede.textContent = copy.lede;

  if (leaderboard.loading) {
    els.leaderboardStatus.textContent = copy.loading;
    els.leaderboardTable.innerHTML = `<div class="placeholder">${escapeHtml(copy.loading)}</div>`;
    return;
  }

  if (leaderboard.error) {
    els.leaderboardStatus.textContent = leaderboard.error;
    els.leaderboardTable.innerHTML = `<div class="placeholder">${escapeHtml(leaderboard.error)}</div>`;
    return;
  }

  if (leaderboard.totalTeams === null) {
    els.leaderboardStatus.textContent = copy.intro;
    els.leaderboardTable.innerHTML = `<div class="placeholder">${escapeHtml(copy.loading)}</div>`;
    return;
  }

  els.leaderboardStatus.textContent = leaderboard.totalTeams
    ? `${leaderboard.totalTeams} completed ${leaderboard.totalTeams === 1 ? "team" : "teams"} represented. Showing the top ${leaderboard.limit} community favourites by selection count.`
    : copy.empty;

  if (!leaderboard.entries.length) {
    els.leaderboardTable.innerHTML = `<div class="placeholder">${escapeHtml(copy.empty)}</div>`;
    return;
  }

  els.leaderboardTable.innerHTML = `
    <table class="series-table leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Selection count</th>
          <th>Pick share</th>
        </tr>
      </thead>
      <tbody>
        ${leaderboard.entries
          .map((entry, index) => {
            const share = leaderboard.totalTeams
              ? `${Math.round((entry.count / leaderboard.totalTeams) * 100)}%`
              : "0%";
            return `
              <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(entry.name)}</td>
                <td>${entry.count}</td>
                <td>${share}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderAll() {
  syncSeoMetadata();
  renderStats();
  renderView();
  renderSiteNav();
  renderGameMeta();
  renderDailyNameInline();
  renderDraftMeter();
  renderChallengePanel();
  renderRoster();
  renderBoard();
  renderSeries();
  renderLeaderboard();
}

function rollSquad() {
  if (dailyChallengeActive()) {
    if (currentDailyStage() !== "intro" || STATE.daily.loadingAction || STATE.daily.loadingSummary) return;
    void startDailyAttempt("ranked").catch((error) => {
      console.error(`${competitionConfig().title} could not start:`, error);
      window.alert(error instanceof Error ? error.message : `Could not start ${competitionConfig().title}.`);
    });
    return;
  }
  if (STATE.view !== "game" || STATE.currentSquad || lineupComplete() || STATE.rollAnimation?.active) return;

  const pool = STATE.squads.filter(squadHasAvailablePlayer);
  const chosen = randomChoice(pool.length ? pool : STATE.squads);
  if (!chosen) return;
  if (STATE.lineup.size === 0 && !STATE.currentSquad) {
    announce("Game started. First squad ready.");
    trackStandardEvent("game_started", { mode: analyticsModeValue() });
  }

  if (prefersReducedMotion()) {
    STATE.currentSquad = decorateSquad(chosen);
    STATE.selectedPlayerId = null;
    renderAll();
    return;
  }

  const candidates = shuffle(
    [...STATE.squads]
      .filter((squad) => squad.id !== chosen.id)
      .concat(chosen),
  );
  const animationFrames = [];
  const cycles = STATE.competition === "worldcup" ? 16 : 12;

  for (let index = 0; index < cycles; index += 1) {
    const squad = candidates[index % candidates.length];
    animationFrames.push({
      label: `${squad.team} ${squad.year}`,
      squadLabel: squad.label,
    });
  }
  animationFrames.push({
    label: `${chosen.team} ${chosen.year}`,
    squadLabel: chosen.label,
  });

  const animation = {
    active: true,
    label: "Rolling...",
    timer: null,
    frames: animationFrames,
    index: 0,
  };

  STATE.rollAnimation = animation;
  STATE.selectedPlayerId = null;
  STATE.currentSquad = null;
  renderAll();

  const tick = () => {
    if (STATE.rollAnimation !== animation) return;

    const frame = animation.frames[animation.index];
    if (frame) {
      animation.label = frame.label;
      els.rosterTitle.textContent = frame.squadLabel;
      els.currentSquad.textContent = frame.label;
      renderGameMeta();
      renderRoster();
      renderBoard();
    }

    animation.index += 1;
    if (animation.index >= animation.frames.length) {
      clearInterval(animation.timer);
      animation.active = false;
      STATE.currentSquad = decorateSquad(chosen);
      STATE.rollAnimation = null;
      STATE.selectedPlayerId = null;
      renderAll();
    }
  };

  animation.timer = setInterval(tick, STATE.competition === "worldcup" ? 55 : 65);
  tick();
}

function normalRandom() {
  return (
    Math.random() +
    Math.random() +
    Math.random() +
    Math.random() +
    Math.random() +
    Math.random()
  ) / 6 - 0.5;
}

function weightedPick(items, getWeight) {
  const total = items.reduce((sum, item) => sum + Math.max(0, getWeight(item)), 0);
  let roll = Math.random() * total;

  for (const item of items) {
    roll -= Math.max(0, getWeight(item));
    if (roll <= 0) return item;
  }

  return items[items.length - 1];
}

function pluralize(value, singular, plural = `${singular}s`) {
  return value === 1 ? singular : plural;
}

function resultSummaryFromMatch(result, match) {
  const { user1, star1, user2, star2 } = match.innings;
  const userTotal = match.userTotal;
  const starTotal = match.starTotal;

  if (result === "draw") return "drawn";

  if (result === "win") {
    const wonByInnings = star2.didNotBat && userTotal > starTotal;

    if (wonByInnings) {
      return `won by an innings and ${userTotal - star1.runs} ${pluralize(userTotal - star1.runs, "run")}`;
    }

    if (user2.chaseComplete) {
      const wicketsLeft = 10 - user2.wickets;
      return `won by ${wicketsLeft} ${pluralize(wicketsLeft, "wicket")}`;
    }

    const runsMargin = userTotal - starTotal;
    return `won by ${runsMargin} ${pluralize(runsMargin, "run")}`;
  }

  if (result === "loss") {
    const lostByInnings = star2.didNotBat && starTotal > userTotal;

    if (lostByInnings) {
      return `lost by an innings and ${star1.runs - userTotal} ${pluralize(star1.runs - userTotal, "run")}`;
    }

    if (star2.chaseComplete) {
      const wicketsLeft = 10 - star2.wickets;
      return `lost by ${wicketsLeft} ${pluralize(wicketsLeft, "wicket")}`;
    }

    const runsMargin = starTotal - userTotal;
    return `lost by ${runsMargin} ${pluralize(runsMargin, "run")}`;
  }

  return "drawn";
}

function inningsScoreLabel(innings) {
  if (innings.didNotBat) return "DNB";
  return `${innings.total}/${innings.wickets}${innings.declared ? "d" : ""}`;
}

function teamBowlingRanking(lineup, teamEdge = 0, noiseScale = 22) {
  return [...lineup]
    .map((player) => {
      const roleBoost = bowlingRoleBoost(player);
      const noise = normalRandom() * noiseScale;

      return {
        player,
        value:
          player.bowling * 1.2 +
          player.experience * 0.16 +
          roleBoost +
          teamEdge * 0.45 +
          noise,
      };
    })
    .sort((a, b) => b.value - a.value);
}

function teamBattingRanking(lineup, teamEdge = 0, noiseScale = 18) {
  return [...lineup]
    .map((player) => {
      const roleBoost = player.roles.includes("Opener")
        ? 14
        : player.roles.includes("Top Order")
          ? 10
          : player.roles.includes("Middle Order")
            ? 6
            : player.roles.includes("All-rounder")
              ? 3
              : player.roles.includes("Wicketkeeper")
                ? 2
                : 0;

      const bowlingPenalty = player.roles.includes("Fast Bowler") || player.roles.includes("Spinner")
        ? -8
        : 0;

      const noise = normalRandom() * noiseScale;

      return {
        player,
        value:
          player.batting * 1.25 +
          player.experience * 0.18 +
          roleBoost +
          bowlingPenalty +
          teamEdge * 0.35 +
          noise,
      };
    })
    .sort((a, b) => b.value - a.value);
}

function buildMatchPlan(lineup) {
  return {
    battingOrder: teamBattingRanking(lineup, 0, 7).map((item) => item.player),
    bowlingRanks: teamBowlingRanking(lineup, 0, 8),
  };
}

function battingOrder(lineup, teamEdge = 0) {
  return teamBattingRanking(lineup, teamEdge).map((item) => item.player);
}

function testBattingRoleProfile(player) {
  if (player.roles.includes("Opener")) return { resistance: 1.14, tempo: 4 };
  if (player.roles.includes("Top Order")) return { resistance: 1.08, tempo: 2 };
  if (player.roles.includes("Middle Order")) return { resistance: 1.01, tempo: 0 };
  if (player.roles.includes("Wicketkeeper")) return { resistance: 0.98, tempo: 2 };
  if (player.roles.includes("All-rounder")) return { resistance: 0.92, tempo: 4 };
  if (player.roles.includes("Spinner")) return { resistance: 0.74, tempo: -8 };
  return { resistance: 0.68, tempo: -10 };
}

function limitedOversBattingRoleProfile(player) {
  if (player.roles.includes("Opener")) return { stability: 1.2, aggression: 10, ballBonus: 14 };
  if (player.roles.includes("Top Order")) return { stability: 1.11, aggression: 5, ballBonus: 9 };
  if (player.roles.includes("Middle Order")) return { stability: 1.03, aggression: 0, ballBonus: 3 };
  if (player.roles.includes("Wicketkeeper")) return { stability: 1.01, aggression: 3, ballBonus: 4 };
  if (player.roles.includes("All-rounder")) return { stability: 0.95, aggression: 8, ballBonus: 1 };
  if (player.roles.includes("Spinner")) return { stability: 0.75, aggression: -6, ballBonus: -8 };
  return { stability: 0.66, aggression: -10, ballBonus: -10 };
}

function sampleTestBatterOutcome(player, battingStrength, bowlingStrength, pitch, inningsIndex) {
  const batting = player?.batting ?? 45;
  const experience = player?.experience ?? 50;
  const { resistance, tempo } = testBattingRoleProfile(player);

  const pitchDifficulty = {
    flat: -10,
    balanced: 0,
    green: 12,
    turning: 8,
    deteriorating: 18,
  }[pitch] ?? 0;

  const inningsDifficulty = [0, 4, 8, 16][inningsIndex - 1] ?? 0;
  const battingEdge = battingStrength - bowlingStrength;
  const fourthInningsResistanceBoost = inningsIndex === 4 ? 20 : 0;
  const fourthInningsTempoPenalty = inningsIndex === 4 ? 10 : 0;
  const meanBalls = clamp(
    (
      40 +
      batting * 0.46 +
      experience * 0.18 -
      bowlingStrength * 0.14 -
      pitchDifficulty * 1.1 -
      inningsDifficulty * 1.1 +
      battingEdge * 0.14 +
      fourthInningsResistanceBoost
    ) * resistance,
    6,
    260
  );

  const duckChance = clamp(
    0.085 - batting / 2500 - experience / 4500 + Math.max(0, bowlingStrength - batting) / 1200 + pitchDifficulty / 320,
    0.015,
    0.12
  );

  if (Math.random() < duckChance) {
    return {
      runs: clamp(Math.round(Math.random() * 5), 0, 6),
      balls: clamp(Math.round(1 + Math.random() * 9), 1, 14),
    };
  }

  const volatility = 0.58;
  const logMean = Math.log(meanBalls) - (volatility * volatility) / 2;
  const balls = clamp(Math.round(Math.exp(logMean + normalRandom() * 6 * volatility)), 2, 260);
  const strikeRate = clamp(
    38 +
      batting * 0.22 +
      experience * 0.04 -
      bowlingStrength * 0.045 -
      pitchDifficulty * 0.65 -
      inningsDifficulty * 0.28 +
      tempo +
      battingEdge * 0.05 +
      (inningsIndex === 4 ? -fourthInningsTempoPenalty : 0) +
      normalRandom() * 7,
    24,
    78
  );
  const runs = clamp(
    Math.round(
      balls * strikeRate / 100 +
      batting * 0.03 +
      normalRandom() * Math.max(6, balls * 0.08)
    ),
    0,
    280
  );

  return { runs, balls };
}

function sampleLimitedOversBatterOutcome(
  player,
  battingStrength,
  bowlingStrength,
  pitch,
  inningsIndex,
  wickets,
  currentRuns,
  extras,
  chaseTarget,
  ballsRemaining,
  maxBalls,
) {
  const batting = player?.batting ?? 45;
  const experience = player?.experience ?? 50;
  const { stability, aggression, ballBonus } = limitedOversBattingRoleProfile(player);
  const phase = 1 - ballsRemaining / Math.max(1, maxBalls);
  const pitchModifier = {
    flat: 8,
    balanced: 0,
    green: -8,
    turning: -5,
    deteriorating: -7,
  }[pitch] ?? 0;
  const battingEdge = battingStrength - bowlingStrength;
  const wicketPressure = wickets >= 7 ? -10 : wickets >= 5 ? -5 : 0;
  const requiredRate =
    chaseTarget === null
      ? 5.6
      : (Math.max(0, chaseTarget - (currentRuns + extras)) * 6) / Math.max(1, ballsRemaining);
  const survivalMean = clamp(
    (
      14 +
      batting * 0.28 +
      experience * 0.11 -
      bowlingStrength * 0.05 +
      battingEdge * 0.07 +
      ballBonus -
      phase * 8 -
      Math.max(0, requiredRate - 6.5) * 1.4
    ) * stability,
    4,
    110,
  );
  const duckChance = clamp(
    0.06 - batting / 2200 - experience / 6500 + Math.max(0, bowlingStrength - batting) / 1300 + phase * 0.015 + (requiredRate > 8.5 ? 0.01 : 0),
    0.01,
    0.1,
  );

  if (Math.random() < duckChance) {
    return {
      runs: clamp(Math.round(Math.random() * 4), 0, 5),
      balls: clamp(Math.round(1 + Math.random() * 8), 1, 12),
    };
  }

  const survivalVolatility = 0.46;
  const logMeanBalls = Math.log(survivalMean) - (survivalVolatility * survivalVolatility) / 2;
  const plannedBalls = clamp(
    Math.round(Math.exp(logMeanBalls + normalRandom() * 6 * survivalVolatility)),
    1,
    120,
  );
  const strikeRate = clamp(
    60 +
      batting * 0.22 +
      experience * 0.03 -
      bowlingStrength * 0.08 +
      pitchModifier +
      phase * 12 +
      aggression +
      (requiredRate - 5.6) * 6 +
      wicketPressure +
      battingEdge * 0.05 +
      normalRandom() * 10,
    48,
    150,
  );

  return {
    runs: clamp(
      Math.round(plannedBalls * strikeRate / 100 + normalRandom() * Math.max(4, plannedBalls * 0.08)),
      0,
      220,
    ),
    balls: plannedBalls,
  };
}

function shouldDeclare(runs, wickets, inningsIndex, lead = 0, ballsRemaining = null) {
  if (inningsIndex !== 3) return false;
  if (wickets >= 9 || wickets < 4) return false;
  if (!Number.isFinite(ballsRemaining)) return false;
  if (ballsRemaining > 780 || ballsRemaining < 300) return false;

  const totalLead = runs + lead;
  if (totalLead >= 560 && wickets <= 7) return Math.random() < 0.12;
  return totalLead >= 450 && wickets <= 6 && ballsRemaining <= 660 && Math.random() < 0.04;
}

function buildDidNotBatInnings(lineup, battingOrderOverride = null) {
  return {
    batters: (battingOrderOverride ?? battingOrder(lineup)).map((player) => ({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      out: false,
      notOut: false,
      dismissal: "DNB",
      dnb: true,
    })),
    extras: 0,
    runs: 0,
    wickets: 0,
    declared: false,
    chaseComplete: false,
    didNotBat: true,
    total: 0,
    balls: 0,
    overs: "0.0",
    topBatter: null,
    bowling: [],
  };
}

function buildLimitedOversBattingScorecard(
  lineup,
  opposition,
  inningsIndex,
  conditions = {},
  chaseTarget = null,
  oversLimit = 50,
  options = {},
) {
  const order = options.battingOrder ?? battingOrder(lineup);
  const battingStrength = lineupScore(lineup).batting;
  const bowlingStrength = lineupScore(opposition).bowling;
  const pitch = conditions.pitch ?? "balanced";
  const maxBalls = oversLimit * 6;
  const wicketsLimit = 10;
  const totalExtras = clamp(Math.round(2 + Math.random() * 9 + bowlingStrength / 16 + inningsIndex * 0.5), 0, 24);

  let runs = 0;
  let wickets = 0;
  let ballsRemaining = maxBalls;
  let chaseComplete = false;
  const batters = [];

  for (let index = 0; index < order.length; index += 1) {
    const player = order[index];

    if (ballsRemaining <= 0 || wickets >= wicketsLimit || chaseComplete) {
      break;
    }

    const outcome = sampleLimitedOversBatterOutcome(
      player,
      battingStrength,
      bowlingStrength,
      pitch,
      inningsIndex,
      wickets,
      runs,
      totalExtras,
      chaseTarget,
      ballsRemaining,
      maxBalls,
    );
    let adjustedRuns = outcome.runs;
    const plannedBalls = outcome.balls;
    const balls = clamp(plannedBalls, 1, ballsRemaining);
    if (balls < plannedBalls && adjustedRuns > 0) {
      adjustedRuns = clamp(Math.round(adjustedRuns * ((balls / plannedBalls) ** 0.94)), 0, adjustedRuns);
    }

    ballsRemaining -= balls;
    runs += adjustedRuns;

    const card = {
      name: player.name,
      runs: adjustedRuns,
      balls,
      fours: adjustedRuns === 0
        ? 0
        : clamp(Math.round(adjustedRuns / 8 + Math.random() * 2), 0, Math.max(0, Math.floor(adjustedRuns / 2))),
      sixes: adjustedRuns === 0
        ? 0
        : clamp(Math.round(adjustedRuns / 28 + Math.random() * 2), 0, Math.max(0, Math.floor(adjustedRuns / 6))),
      out: true,
      notOut: false,
      dismissal: randomChoice(["c", "lbw", "b", "st", "run out"]) ?? "c",
    };

    if (runs + totalExtras >= chaseTarget && chaseTarget !== null) {
      card.out = false;
      card.notOut = true;
      card.dismissal = "not out";
      chaseComplete = true;
      batters.push(card);
      break;
    }

    if (ballsRemaining <= 0) {
      card.out = false;
      card.notOut = true;
      card.dismissal = "not out";
      batters.push(card);
      break;
    }

    wickets += 1;
    batters.push(card);
  }

  while (batters.length < order.length) {
    const player = order[batters.length];
    batters.push({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      out: false,
      notOut: false,
      dismissal: "DNB",
      dnb: true,
    });
  }

  const ballsFaced = maxBalls - ballsRemaining;
  const topBatter = [...batters]
    .filter((card) => !card.dnb)
    .sort((a, b) => b.runs - a.runs)[0] ?? batters[0] ?? null;

  return {
    batters,
    extras: totalExtras,
    runs,
    wickets,
    declared: false,
    chaseComplete,
    total: runs + totalExtras,
    balls: ballsFaced,
    overs: ballsToOvers(ballsFaced),
    topBatter,
    notOutCount: batters.filter((card) => card.notOut).length,
  };
}

function buildLimitedOversBowlingScorecard(lineup, inningsTotal, inningsBalls, wickets, teamEdge = 0, options = {}) {
  const ranked = options.rankedBowlers ?? teamBowlingRanking(lineup, teamEdge);
  const bowlers = ranked.map(({ player, value }) => ({
    name: player.name,
    player,
    value,
    weight: Math.max(1, player.bowling + value / 4),
    overs: 0,
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0,
  }));

  const used = bowlers.filter((entry) => entry.player.roles.some((role) => ["Fast Bowler", "Spinner", "All-rounder"].includes(role)));
  const working = (used.length ? used : bowlers.slice(0, Math.min(6, bowlers.length))).slice(0, Math.min(6, bowlers.length));
  const totalOvers = clamp(Math.max(1, Math.round(inningsBalls / 6)), 1, 50);
  const maxOversPerBowler = 10;

  for (let over = 0; over < totalOvers; over += 1) {
    const available = working.filter((bowler) => bowler.overs < maxOversPerBowler);
    const pool = available.length ? available : working;
    const bowler = weightedPick(
      pool,
      (item) => Math.max(1, item.weight) * Math.max(1, maxOversPerBowler - item.overs),
    );
    bowler.overs += 1;
  }

  working.forEach((entry) => {
    entry.balls = entry.overs * 6;
  });

  const wicketPool = [];
  for (let index = 0; index < wickets; index += 1) {
    const wicketWorking = working.filter((bowler) => bowler.balls > 0);
    wicketPool.push(
      weightedPick(wicketWorking, (bowler) => Math.max(1, bowler.player.bowling + bowler.value / 3 - bowler.wickets * 12)),
    );
  }
  wicketPool.forEach((bowler) => {
    bowler.wickets += 1;
  });

  working.forEach((bowler) => {
    bowler.runs = Math.max(
      0,
      inningsTotal * (bowler.balls / Math.max(1, totalOvers * 6)) +
        (100 - bowler.player.bowling) * 0.16 -
        bowler.wickets * 1.3 +
        teamEdge * -0.1 +
        Math.random() * 6,
    );
    bowler.maidens = clamp(
      Math.round(bowler.balls / 30 + (bowler.player.bowling - 50) / 30 + Math.random() * 1.2),
      0,
      10,
    );
  });

  reconcileBowlingRuns(working.filter((bowler) => bowler.balls > 0), inningsTotal);

  return working
    .filter((bowler) => bowler.balls > 0)
    .map((bowler) => ({
      name: bowler.name,
      overs: ballsToOvers(bowler.balls),
      maidens: bowler.maidens,
      runs: bowler.runs,
      wickets: bowler.wickets,
    }))
    .sort((a, b) => b.wickets - a.wickets || a.runs - b.runs);
}

function testMatchBallBudget(conditions = {}) {
  const pitchAdjustment = {
    flat: 80,
    balanced: 0,
    green: -40,
    turning: -20,
    deteriorating: -90,
  }[conditions.pitch ?? "balanced"] ?? 0;
  return 2700 + pitchAdjustment;
}

function simulateTestMatch(userLineup, starLineup, conditions = {}) {
  const userPlan = buildMatchPlan(userLineup);
  const starPlan = buildMatchPlan(starLineup);
  let remainingMatchBalls = testMatchBallBudget(conditions);
  const user1 = buildBattingScorecard(userLineup, starLineup, 1, conditions, null, 0, {
    battingOrder: userPlan.battingOrder,
    maxBalls: remainingMatchBalls,
  });
  remainingMatchBalls = Math.max(0, remainingMatchBalls - user1.balls);
  const star1 = remainingMatchBalls <= 0
    ? buildDidNotBatInnings(starLineup, starPlan.battingOrder)
    : buildBattingScorecard(starLineup, userLineup, 2, conditions, null, 0, {
        battingOrder: starPlan.battingOrder,
        maxBalls: remainingMatchBalls,
      });
  remainingMatchBalls = Math.max(0, remainingMatchBalls - star1.balls);

  const userLead = user1.total - star1.total;
  const user2 = remainingMatchBalls <= 0
    ? buildDidNotBatInnings(userLineup, userPlan.battingOrder)
    : buildBattingScorecard(userLineup, starLineup, 3, conditions, null, userLead, {
        battingOrder: userPlan.battingOrder,
        maxBalls: remainingMatchBalls,
      });
  remainingMatchBalls = Math.max(0, remainingMatchBalls - user2.balls);

  const target = user1.total + user2.total - star1.total + 1;
  const star2 = target <= 0
    ? {
        batters: starPlan.battingOrder.map((player) => ({
          name: player.name,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          out: false,
          notOut: false,
          dismissal: "DNB",
          dnb: true,
        })),
        extras: 0,
        runs: 0,
        wickets: 0,
        declared: false,
        chaseComplete: true,
        didNotBat: true,
        total: 0,
        balls: 0,
        overs: "0.0",
        topBatter: null,
        bowling: [],
      }
    : remainingMatchBalls <= 0
      ? buildDidNotBatInnings(starLineup, starPlan.battingOrder)
      : buildBattingScorecard(starLineup, userLineup, 4, conditions, target, 0, {
          battingOrder: starPlan.battingOrder,
          maxBalls: remainingMatchBalls,
        });

  const user1Bowling = buildBowlingScorecard(starLineup, user1.total, user1.balls, user1.wickets, 0, {
    rankedBowlers: starPlan.bowlingRanks,
  });
  const star1Bowling = buildBowlingScorecard(userLineup, star1.total, star1.balls, star1.wickets, 0, {
    rankedBowlers: userPlan.bowlingRanks,
  });
  const user2Bowling = buildBowlingScorecard(starLineup, user2.total, user2.balls, user2.wickets, userLead, {
    rankedBowlers: starPlan.bowlingRanks,
  });
  const star2Bowling = target <= 0 ? [] : buildBowlingScorecard(userLineup, star2.total, star2.balls, star2.wickets, -userLead, {
    rankedBowlers: userPlan.bowlingRanks,
  });

  user1.bowling = user1Bowling;
  star1.bowling = star1Bowling;
  user2.bowling = user2Bowling;
  star2.bowling = star2Bowling;

  const userTotal = user1.total + user2.total;
  const starTotal = star1.total + star2.total;

  let result;

  if (star2.chaseComplete && starTotal > userTotal) {
    result = "loss";
  } else if (star2.wickets >= 10 && starTotal < userTotal) {
    result = "win";
  } else if (starTotal === userTotal) {
    result = "draw";
  } else if (starTotal > userTotal) {
    result = "loss";
  } else {
    result = "draw";
  }

  return {
    result,
    format: "tests",
    innings: { user1, star1, user2, star2 },
    userTotal,
    starTotal,
  };
}

function simulateLimitedOversMatch(userLineup, starLineup, conditions = {}) {
  const userPlan = buildMatchPlan(userLineup);
  const starPlan = buildMatchPlan(starLineup);
  const user1 = buildLimitedOversBattingScorecard(userLineup, starLineup, 1, conditions, null, 50, {
    battingOrder: userPlan.battingOrder,
  });
  const star1 = buildLimitedOversBattingScorecard(starLineup, userLineup, 2, conditions, user1.total + 1, 50, {
    battingOrder: starPlan.battingOrder,
  });
  const user1Bowling = buildLimitedOversBowlingScorecard(starLineup, user1.total, user1.balls, user1.wickets, 0, {
    rankedBowlers: starPlan.bowlingRanks,
  });
  const star1Bowling = buildLimitedOversBowlingScorecard(userLineup, star1.total, star1.balls, star1.wickets, user1.total - star1.total, {
    rankedBowlers: userPlan.bowlingRanks,
  });

  user1.bowling = user1Bowling;
  star1.bowling = star1Bowling;

  const result =
    user1.total > star1.total
        ? "win"
        : user1.total < star1.total
          ? "loss"
          : "draw";

  return {
    result,
    format: "limited-overs",
    innings: {
      user1,
      star1,
      user2: buildDidNotBatInnings(userLineup, userPlan.battingOrder),
      star2: buildDidNotBatInnings(starLineup, starPlan.battingOrder),
    },
    userTotal: user1.total,
    starTotal: star1.total,
  };
}

function buildSeries() {
  if (STATE.competition === "worldcup") {
    return buildWorldCupTournament();
  }

  const competition = competitionConfig();
  const userLine = userLineup();
  const opponentLabel = competition.oppositionShortTitle;
  const excludedNames = new Set(userLine.map((player) => normalizeName(player.name)));
  const starLine = challengeLineupLoaded() ? STATE.challenge.lineup : buildAllStarXI(excludedNames);
  const userTeam = teamMetricsFromLineup(userLine);
  const starTeam = teamMetricsFromLineup(starLine);
  const matches = [];
  let userWins = 0;
  let starWins = 0;
  let draws = 0;

  const format = competition.format;

  for (let matchNumber = 1; matchNumber <= 5; matchNumber += 1) {
    const conditions = {
      pitch: format === "limited-overs"
        ? matchNumber % 2 === 1
          ? "balanced"
          : "flat"
        : matchNumber % 2 === 1
          ? "green"
          : "balanced",
    };

    const match = format === "limited-overs"
      ? simulateLimitedOversMatch(userLine, starLine, conditions)
      : simulateTestMatch(userLine, starLine, conditions);

    const outcome = match.result;

    if (outcome === "win") userWins += 1;
    else if (outcome === "loss") starWins += 1;
    else draws += 1;

    const userInnings1 = match.innings.user1;
    const starInnings1 = match.innings.star1;
    const userInnings2 = match.innings.user2;
    const starInnings2 = match.innings.star2;

    matches.push({
      format,
      testNumber: matchNumber,
      matchNumber,
      venue: format === "limited-overs"
        ? matchNumber % 2 === 1
          ? "Day game"
          : "Night game"
        : matchNumber % 2 === 1
          ? "Home conditions"
          : "Balanced conditions",
      result: outcome,
      summary: matchMarginText(match),
      headline: generateHeadline(match),
      innings: format === "limited-overs"
        ? [
            { label: "Your XI innings", score: inningsScoreLabel(userInnings1) },
            { label: `${opponentLabel} innings`, score: inningsScoreLabel(starInnings1) },
          ]
        : [
            { label: "Your XI 1st inns", score: inningsScoreLabel(userInnings1) },
            { label: `${opponentLabel} 1st inns`, score: inningsScoreLabel(starInnings1) },
            { label: "Your XI 2nd inns", score: inningsScoreLabel(userInnings2) },
            { label: `${opponentLabel} 2nd inns`, score: inningsScoreLabel(starInnings2) },
          ],
      scoreline: format === "limited-overs"
        ? `${inningsScoreLabel(userInnings1)} | ${inningsScoreLabel(starInnings1)}`
        : `${inningsScoreLabel(userInnings1)} & ${inningsScoreLabel(userInnings2)} | ${inningsScoreLabel(starInnings1)} & ${inningsScoreLabel(starInnings2)}`,
      inningsData: {
        user1: buildInningsSummary(
          format === "limited-overs" ? "Your XI innings" : "Your XI 1st innings",
          userInnings1,
          match.innings.user1.bowling,
        ),
        star1: buildInningsSummary(
          format === "limited-overs" ? `${opponentLabel} innings` : `${opponentLabel} 1st innings`,
          starInnings1,
          match.innings.star1.bowling,
        ),
        user2: buildInningsSummary("Your XI 2nd innings", userInnings2, match.innings.user2.bowling),
        star2: buildInningsSummary(`${opponentLabel} 2nd innings`, starInnings2, match.innings.star2.bowling),
      },
    });

    const matchRecord = matches[matches.length - 1];
    matchRecord.userBox = buildMatchBoxScore(
      format === "limited-overs"
        ? {
            batting: [matchRecord.inningsData.user1],
            bowling: [matchRecord.inningsData.star1],
          }
        : {
            batting: [matchRecord.inningsData.user1, matchRecord.inningsData.user2],
            bowling: [matchRecord.inningsData.star1, matchRecord.inningsData.star2],
          },
    );
    matchRecord.starBox = buildMatchBoxScore(
      format === "limited-overs"
        ? {
            batting: [matchRecord.inningsData.star1],
            bowling: [matchRecord.inningsData.user1],
          }
        : {
            batting: [matchRecord.inningsData.star1, matchRecord.inningsData.star2],
            bowling: [matchRecord.inningsData.user1, matchRecord.inningsData.user2],
          },
    );
  }

  const leaders = collectSeriesStats({ matches });
  const achievements = buildAchievementList({ userWins, starWins, matches }, leaders);

  return {
    userLineup: userLine,
    starLineup: starLine,
    userTeam,
    starTeam,
    matches,
    revealed: 0,
    userWins,
    starWins,
    draws,
    leaders,
    achievements,
    playerOfSeries: leaders.overallLeader,
  };
}

function clearTimer() {
  if (STATE.timer) {
    clearTimeout(STATE.timer);
    STATE.timer = null;
  }
}

function startSeries() {
  if (dailyChallengeActive()) {
    const dailyMatchLabel = competitionConfig().matchLabel;
    void simulateDailyTest().catch((error) => {
      console.error(`Daily ${dailyMatchLabel} could not start:`, error);
      window.alert(error instanceof Error ? error.message : `Could not play the daily ${dailyMatchLabel}.`);
    });
    return;
  }
  if (!lineupComplete() || challengeCreationMode()) return;
  clearTimer();
  const competition = competitionConfig();
  try {
    trackStandardEvent("simulation_started", { mode: analyticsModeValue() });
    STATE.achievementDetail = null;
    STATE.achievementPinned = false;
    STATE.result = null;
    STATE.seriesShareAsset = null;
    STATE.seriesShareAssetPromise = null;
    clearResultUrlFromBrowser();
    STATE.series = buildSeries();
    if (!isChallengeMode()) {
      void persistSoloTeamIfNeeded();
    }
    if (!challengeLineupLoaded()) {
      prepareSeriesShareAsset(STATE.series);
    }
    setShareStatus("");
    STATE.view = "series";
    renderAll();
  } catch (error) {
    console.error(`${competition.title} series failed to start:`, error);
    STATE.series = null;
    els.seriesStatus.textContent = `Series error: ${error instanceof Error ? error.message : String(error)}`;
    STATE.view = "game";
    renderAll();
    window.alert(`${competition.title} series could not start: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function revealNextSeriesMatch() {
  if (!STATE.series || STATE.series.revealed >= STATE.series.matches.length) return;
  STATE.series.revealed += 1;
  if (challengeLineupLoaded() && STATE.series.revealed === STATE.series.matches.length) {
    const seriesResult = challengeSeriesOutcome(STATE.series);
    trackChallengeEvent("challenge_completed", {
      role: "recipient",
      series_result: seriesResult,
    });
    const result = finalizeChallengeResultIfNeeded();
    if (result) {
      trackChallengeEvent("challenge_response_completed", {
        role: "recipient",
        series_result: seriesResult,
      });
    }
    announce(`Simulation completed. ${completedSeriesOutcomeText(STATE.series)}.`);
    renderAll();
    return;
  }
  if (STATE.series.revealed === STATE.series.matches.length) {
    announce(`Simulation completed. ${completedSeriesOutcomeText(STATE.series)}.`);
  }
  renderSeries();
}

function revealAllSeriesMatches() {
  if (!STATE.series) return;
  const wasComplete = STATE.series.revealed >= STATE.series.matches.length;
  STATE.series.revealed = STATE.series.matches.length;
  if (challengeLineupLoaded() && !wasComplete) {
    const seriesResult = challengeSeriesOutcome(STATE.series);
    trackChallengeEvent("challenge_completed", {
      role: "recipient",
      series_result: seriesResult,
    });
    const result = finalizeChallengeResultIfNeeded();
    if (result) {
      trackChallengeEvent("challenge_response_completed", {
        role: "recipient",
        series_result: seriesResult,
      });
    }
    announce(`Simulation completed. ${completedSeriesOutcomeText(STATE.series)}.`);
    renderAll();
    return;
  }
  if (!wasComplete) {
    announce(`Simulation completed. ${completedSeriesOutcomeText(STATE.series)}.`);
  }
  renderSeries();
}

function goHome() {
  if (routeUsesDedicatedPath()) {
    window.location.assign(currentPublicPageDef()?.path ?? "/");
    return;
  }

  clearTimer();
  clearRollAnimation();
  STATE.view = "home";
  clearRouteError();
  if (dailyChallengeActive()) {
    resetDailyState({ preserveSummary: true });
  }
  if (resultSnapshotLoaded()) {
    STATE.result = null;
    STATE.challenge = null;
    STATE.challengeResponseName = "";
    clearResultUrlFromBrowser();
    clearChallengeUrlFromBrowser();
  }
  if (!challengeLineupLoaded() && isChallengeMode()) {
    STATE.mode = normalizePlayableMode(STATE.challengeDraftMode);
    STATE.challengeDraftName = "";
  }
  STATE.lineup.clear();
  STATE.currentSquad = null;
  STATE.selectedPlayerId = null;
  STATE.series = null;
  STATE.seriesShareAsset = null;
  STATE.seriesShareAssetPromise = null;
  resetSubmissionState();
  setShareStatus("");
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  renderAll();
  if (STATE.competition === "ashes") {
    void loadDailySummary().catch((error) => {
      console.error("Daily summary reload failed:", error);
    });
  }
}

function goBuilder() {
  if (resultSnapshotLoaded()) {
    goHome();
    return;
  }
  clearTimer();
  clearRollAnimation();
  STATE.view = "game";
  STATE.series = null;
  STATE.seriesShareAsset = null;
  STATE.seriesShareAssetPromise = null;
  setShareStatus("");
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  renderAll();
}

function startChallengeBack() {
  const mode = currentChallengePlayableMode();
  trackChallengeEvent("challenge_back_clicked", { role: "recipient", source: "series-complete" });
  trackChallengeEvent("challenge_create_clicked", { role: "creator", source: "challenge-back" });
  trackChallengeEvent("challenge_started", { role: "creator", source: "challenge-back" });
  trackChallengeEvent("challenge_back_created", { role: "creator", source: "challenge-back" });
  if (isShortResultPath()) {
    replaceBrowserPath("/");
  }
  STATE.challenge = null;
  STATE.result = null;
  STATE.challengeResponseName = "";
  clearChallengeUrlFromBrowser();
  clearResultUrlFromBrowser();
  STATE.competition = "ashes";
  STATE.squads = ASHES_SQUADS;
  STATE.challengeDraftMode = mode;
  STATE.challengeDraftName = "";
  STATE.mode = "challenge";
  STATE.view = "game";
  STATE.lineup.clear();
  STATE.currentSquad = null;
  STATE.selectedPlayerId = null;
  STATE.series = null;
  STATE.seriesShareAsset = null;
  STATE.seriesShareAssetPromise = null;
  resetSubmissionState();
  setShareStatus("");
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  addCatalogMetadata();
  renderAll();
}

function resetBuilder() {
  if (dailyChallengeActive()) {
    goHome();
    return;
  }
  if (resultSnapshotLoaded()) {
    goHome();
    return;
  }
  clearTimer();
  clearRollAnimation();
  STATE.lineup.clear();
  STATE.currentSquad = null;
  STATE.selectedPlayerId = null;
  STATE.series = null;
  STATE.seriesShareAsset = null;
  STATE.seriesShareAssetPromise = null;
  resetSubmissionState();
  setShareStatus("");
  STATE.view = "game";
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  renderAll();
}

function wireControls() {
  const refreshDailySummaryOnReturn = () => {
    if (STATE.view !== "home" || dailyChallengeActive()) return;
    if (!["home", "ashes", "worldCup"].includes(currentPublicPageKey() ?? "")) return;
    void loadDailySummary({ competition: STATE.competition }).catch((error) => {
      console.error("Daily summary refresh failed:", error);
    });
  };

  els.navToggle.addEventListener("click", () => {
    toggleSiteNav();
  });
  els.navLinkNodes.forEach((link) => {
    link.addEventListener("click", () => {
      closeSiteNav();
    });
  });
  els.homePrimaryCta.addEventListener("click", () => {
    trackStandardEvent("mode_selected", { mode: "daily" });
  });
  els.homeSecondaryCta.addEventListener("click", () => {
    trackStandardEvent("mode_selected", { mode: "classic" });
  });

  els.playGame.addEventListener("click", () => {
    if (STATE.routeError && routeUsesDedicatedPath()) {
      replaceBrowserPath("/");
    }
    clearRouteError();
    if (challengeLineupLoaded()) {
      STATE.challengeResponseName = normalizeChallengeCreatorName(els.homeResponseName.value);
      trackChallengeEvent("challenge_accepted", { role: "recipient", source: "invite" });
      trackChallengeEvent("challenge_started", { role: "recipient", source: "invite" });
    }
    STATE.view = "game";
    renderAll();
    scrollViewportTop();
  });
  els.homeLeaderboard.addEventListener("click", () => {
    window.location.assign(leaderboardPathForCompetition(STATE.competition));
  });
  els.leaderboardHome.addEventListener("click", () => {
    window.location.assign("/");
  });
  els.backHome.addEventListener("click", goHome);
  els.backBuilder.addEventListener("click", goBuilder);
  els.rollSquad.addEventListener("click", rollSquad);
  els.startSeries.addEventListener("click", startSeries);
  els.copyChallengeLink.addEventListener("click", async () => {
    try {
      await copyChallengeLink();
    } catch (error) {
      console.error("Copy challenge invite failed:", error);
      setChallengeStatus("Could not copy the invite.");
    }
  });
  els.challengeBack.addEventListener("click", startChallengeBack);
  els.seriesNext.addEventListener("click", revealNextSeriesMatch);
  els.seriesAll.addEventListener("click", revealAllSeriesMatches);
  els.playAgain.addEventListener("click", goHome);
  if (els.dailyPractice) {
    els.dailyPractice.addEventListener("click", () => {
      void startDailyPractice().catch((error) => {
        console.error("Practice mode failed:", error);
        window.alert(error instanceof Error ? error.message : "Could not start practice mode.");
      });
    });
  }
  els.seriesLeaderboard.addEventListener("click", () => {
    window.location.assign(leaderboardPathForCompetition(STATE.competition));
  });
  els.homeChallenge.addEventListener("click", () => {
    trackStandardEvent("mode_selected", { mode: "friend_classic" });
    window.location.assign("/challenge");
  });
  els.homeDaily.addEventListener("click", () => {
    trackStandardEvent("mode_selected", { mode: STATE.competition === "worldcup" ? "worldcup_daily" : "daily" });
    window.location.assign(dailyPathForCompetition(STATE.competition));
  });
  els.homeCompetition.addEventListener("click", () => {
    trackStandardEvent("mode_selected", { mode: STATE.competition === "worldcup" ? "classic" : "worldcup" });
    window.location.assign(STATE.competition === "worldcup" ? "/ashes" : "/world-cup");
  });
  els.challengeName.addEventListener("input", () => {
    STATE.challengeDraftName = els.challengeName.value;
    els.challengeLink.value = currentChallengeUrl();
    if (!lineupComplete()) {
      setChallengeStatus("");
    }
  });
  els.challengeName.addEventListener("blur", () => {
    STATE.challengeDraftName = normalizeChallengeCreatorName(els.challengeName.value);
    renderChallengePanel();
  });
  els.challengeMode.addEventListener("change", () => {
    if (!challengeCreationMode() || challengeModeSelectionLocked()) {
      els.challengeMode.value = currentChallengePlayableMode();
      renderChallengePanel();
      return;
    }

    STATE.challengeDraftMode = normalizePlayableMode(els.challengeMode.value);
    trackStandardEvent("mode_selected", {
      mode: STATE.challengeDraftMode === "memory" ? "friend_memory" : "friend_classic",
    });
    setChallengeStatus("");
    renderAll();
  });
  els.homeResponseName.addEventListener("input", () => {
    STATE.challengeResponseName = els.homeResponseName.value;
  });
  els.homeResponseName.addEventListener("blur", () => {
    STATE.challengeResponseName = normalizeChallengeCreatorName(els.homeResponseName.value);
    renderAll();
  });
  els.homeMode.addEventListener("change", () => {
    if (challengeLineupLoaded()) {
      renderAll();
      return;
    }

    if (STATE.mode === "challenge") {
      STATE.challengeDraftMode = normalizePlayableMode(els.homeMode.value);
      STATE.mode = STATE.challengeDraftMode;
      trackStandardEvent("mode_selected", {
        mode: STATE.challengeDraftMode === "memory" ? "friend_memory" : "friend_classic",
      });
      setChallengeStatus("");
      renderAll();
      return;
    }

    STATE.mode = normalizePlayableMode(els.homeMode.value);
    trackStandardEvent("mode_selected", { mode: STATE.mode });
    renderAll();
  });
  els.leaderboardMetric.addEventListener("change", () => {
    STATE.leaderboard.metric = els.leaderboardMetric.value;
    void loadLeaderboard();
  });
  els.leaderboardPeriod.addEventListener("change", () => {
    STATE.leaderboard.period = els.leaderboardPeriod.value;
    void loadLeaderboard();
  });
  els.leaderboardMode.addEventListener("change", () => {
    STATE.leaderboard.mode = els.leaderboardMode.value;
    void loadLeaderboard();
  });
  window.addEventListener("focus", refreshDailySummaryOnReturn);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSiteNav();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshDailySummaryOnReturn();
    }
  });
  els.shareResult.addEventListener("click", async () => {
    try {
      if (!STATE.series) return;
      if (resultSnapshotLoaded() || (challengeLineupLoaded() && seriesComplete())) {
        await shareChallengeResult("series-actions");
        return;
      }
      const text = formatShareText();
      const title = competitionConfig().title;
      const file = await ensureSeriesShareAsset();

      if (file && navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title,
            text,
            files: [file],
          });
          trackStandardEvent("result_shared", { share_destination: "web_share" });
          announce("Share sheet opened.");
          return;
        } catch (error) {
          if (!(error instanceof DOMException && error.name === "AbortError")) {
            console.warn("Native share with image failed:", error);
          } else {
            return;
          }
        }
      }

      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text,
            url: shareUrl(),
          });
          trackStandardEvent("result_shared", { share_destination: "web_share" });
          announce("Share sheet opened.");
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          console.warn("Native share failed:", error);
        }
      }

      window.open(
        `https://x.com/intent/post?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
      trackStandardEvent("result_shared", { share_destination: "x" });
      announce("Share window opened.");
    } catch (error) {
      console.error("Share action failed:", error);
      setShareStatus("Could not prepare the share.");
    }
  });
  els.whatsappShare.addEventListener("click", async () => {
    try {
      if (resultSnapshotLoaded() || (challengeLineupLoaded() && seriesComplete())) {
        const result = currentChallengeResultRecord();
        if (!result) return;
        const url = currentResultUrl() || result.shortUrl || resultUrlForRecord(result);
        openWhatsAppShare(formatChallengeResultShareText(result, url));
      } else {
        openWhatsAppShare(formatShareText());
      }
      trackStandardEvent("result_shared", { share_destination: "whatsapp" });
      setShareStatus("WhatsApp share opened.");
      announce("WhatsApp share opened.");
    } catch (error) {
      console.error("WhatsApp share failed:", error);
      setShareStatus("Could not open WhatsApp share.");
    }
  });
  els.sendResultBack.addEventListener("click", async () => {
    try {
      await shareChallengeResult("send-result-back");
    } catch (error) {
      console.error("Result send-back failed:", error);
      setShareStatus("Could not prepare the result.");
    }
  });
  els.copyLink.addEventListener("click", async () => {
    try {
      if (resultSnapshotLoaded() || (challengeLineupLoaded() && seriesComplete())) {
        await copyChallengeResultLink();
      } else {
        await copySeriesLink();
      }
    } catch (error) {
      console.error("Copy link failed:", error);
      setShareStatus("Could not copy the link.");
    }
  });
  els.downloadShare.addEventListener("click", async () => {
    try {
      if (resultSnapshotLoaded() || (challengeLineupLoaded() && seriesComplete())) {
        await downloadChallengeResultImage();
      } else {
        await downloadSeriesShareImage();
      }
    } catch (error) {
      console.error("Download image failed:", error);
      setShareStatus("Could not download the image.");
    }
  });
  els.resetBuilder.addEventListener("click", resetBuilder);

  els.feedbackToggle.addEventListener("click", () => {
    toggleFeedbackPanel();
  });

  els.feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = els.feedbackMessage.value.trim();
    const trap = els.feedbackHoneypot.value.trim();

    if (trap) {
      setFeedbackStatus("Thanks for the feedback.", "success");
      els.feedbackForm.reset();
      toggleFeedbackPanel(false);
      return;
    }

    if (message.length < 5) {
      setFeedbackStatus("Please enter a longer message.", "error");
      return;
    }

    els.feedbackSubmit.disabled = true;
    setFeedbackStatus("Sending...", "pending");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          pageUrl: canonicalUrlForCurrentPage(),
          mode: STATE.mode,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Could not send feedback.");
      }

      setFeedbackStatus("Thanks. Your message has been sent.", "success");
      els.feedbackForm.reset();
      els.feedbackHoneypot.value = "";
      window.setTimeout(() => {
        if (els.feedbackStatus?.dataset.kind === "success") {
          closeFeedbackPanel();
        }
      }, 1400);
    } catch (error) {
      console.error("Feedback submission failed:", error);
      setFeedbackStatus(
        error instanceof Error ? error.message : "Could not send feedback.",
        "error",
      );
    } finally {
      els.feedbackSubmit.disabled = false;
    }
  });

  if (!STATE.achievementHelpBound) {
    STATE.achievementHelpBound = true;

    els.seriesInsights.addEventListener("mouseover", (event) => {
      const badge = event.target.closest("[data-achievement-key]");
      if (!badge) return;
      setAchievementDetail(badge.dataset.achievementKey, false);
    });

    els.seriesInsights.addEventListener("mouseout", (event) => {
      const badge = event.target.closest("[data-achievement-key]");
      if (!badge || STATE.achievementPinned) return;
      const related = event.relatedTarget;
      if (related && badge.contains(related)) return;
      if (related && els.seriesInsights.contains(related) && related.closest?.("[data-achievement-key]")) return;
      clearAchievementDetail();
    });

    els.seriesInsights.addEventListener("click", (event) => {
      const badge = event.target.closest("[data-achievement-key]");
      if (!badge) return;
      const name = badge.dataset.achievementKey;
      const isPinned = STATE.achievementPinned && STATE.achievementDetail === name;
      setAchievementDetail(isPinned ? null : name, !isPinned);
      event.preventDefault();
    });

    document.addEventListener("click", (event) => {
      if (!STATE.achievementPinned) return;
      if (els.seriesInsights.contains(event.target)) return;
      clearAchievementDetail();
    });
  }
}

function shareUrl() {
  if (STATE.view === "leaderboard" || isLeaderboardPath()) {
    return canonicalUrlForPageKey(leaderboardPageKeyForCompetition());
  }
  if (resultSnapshotLoaded()) return currentResultUrl();
  return challengeLineupLoaded() ? currentChallengeUrl() : canonicalUrlForCurrentPage();
}

function canonicalUrlForCurrentPage() {
  if (STATE.view === "leaderboard" || isLeaderboardPath()) {
    return canonicalUrlForPageKey(leaderboardPageKeyForCompetition());
  }

  if (resultSnapshotLoaded()) {
    return currentResultUrl() || resultUrlForRecord(STATE.result, CANONICAL_SITE_ORIGIN);
  }

  if (challengeLineupLoaded()) {
    return currentChallengeUrl()
      || challengeUrlForLineup(
        STATE.challenge.lineup,
        loadedChallengeCreatorName(),
        currentChallengePlayableMode(),
        CANONICAL_SITE_ORIGIN,
      );
  }

  if (STATE.routeError && (isShortChallengePath() || isShortResultPath())) {
    return new URL(currentPathname(), CANONICAL_SITE_ORIGIN).href;
  }

  return pageUrlForOrigin(CANONICAL_SITE_ORIGIN).href;
}

function ensureHeadNode(selector, tagName, attributes) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement(tagName);
    document.head.append(node);
  }

  for (const [attribute, value] of Object.entries(attributes)) {
    node.setAttribute(attribute, value);
  }

  return node;
}

function syncSeoMetadata() {
  const canonicalUrl = canonicalUrlForCurrentPage();
  const leaderboardPage = STATE.view === "leaderboard" || isLeaderboardPath();
  const shortChallengePage = isShortChallengePath();
  const shortResultPage = isShortResultPath();
  const routeError = STATE.routeError;
  const publicPage = currentPublicPageDef();
  const creatorName = currentChallengeCreatorName();
  const challengeMode = currentChallengePlayableMode() === "memory" ? "Memory" : "Classic";
  const resultLoaded = resultSnapshotLoaded();
  const resultTitle = resultLoaded
    ? `${currentSeriesUserLabel()} vs ${currentSeriesOppositionLabel()} | Ashes 5-0`
    : null;
  const resultDescription = resultLoaded
    ? `${currentSeriesUserLabel()} completed an Ashes 5-0 ${challengeMode.toLowerCase()} challenge against ${currentSeriesOppositionLabel()}. Final score: ${challengeSeriesScore(STATE.result)}.`
    : null;
  const challengeTitle = challengeLineupLoaded()
    ? creatorName
      ? `${creatorName}'s Ashes 5-0 ${challengeMode} Challenge`
      : `Ashes 5-0 ${challengeMode} Challenge`
    : null;
  const challengeDescription = challengeLineupLoaded()
    ? creatorName
      ? `Open ${creatorName}'s Ashes 5-0 ${challengeMode.toLowerCase()} challenge, draft your XI, and play the five-Test series.`
      : `Open an Ashes 5-0 ${challengeMode.toLowerCase()} challenge, draft your XI, and play the five-Test series.`
    : SEO_HOME_DESCRIPTION;
  const leaderboardPageDef = PUBLIC_PAGE_DEFS[leaderboardPageKeyForCompetition()];
  const pageTitle = leaderboardPage
    ? leaderboardPageDef.title
    : resultTitle
      ?? challengeTitle
      ?? (routeError && (shortChallengePage || shortResultPage)
        ? "Link Not Found | Ashes 5-0"
        : publicPage?.title ?? pageTitleForCompetition(competitionConfig()));
  const pageDescription = leaderboardPage
    ? leaderboardPageDef.description
    : resultDescription
      ?? (challengeLineupLoaded() ? challengeDescription : routeError?.message || publicPage?.description || SEO_HOME_DESCRIPTION);
  const robots = leaderboardPage
    ? "index, follow"
    : resultLoaded || challengeLineupLoaded() || shortChallengePage || shortResultPage
      ? "noindex, follow"
      : "index, follow";

  ensureHeadNode('link[rel="canonical"]', "link", {
    rel: "canonical",
    href: canonicalUrl,
  });
  ensureHeadNode('meta[property="og:url"]', "meta", {
    property: "og:url",
    content: canonicalUrl,
  });
  ensureHeadNode('meta[name="description"]', "meta", {
    name: "description",
    content: pageDescription,
  });
  ensureHeadNode('meta[property="og:title"]', "meta", {
    property: "og:title",
    content: pageTitle,
  });
  ensureHeadNode('meta[property="og:description"]', "meta", {
    property: "og:description",
    content: pageDescription,
  });
  ensureHeadNode('meta[name="twitter:title"]', "meta", {
    name: "twitter:title",
    content: pageTitle,
  });
  ensureHeadNode('meta[name="twitter:description"]', "meta", {
    name: "twitter:description",
    content: pageDescription,
  });
  ensureHeadNode('meta[name="twitter:url"]', "meta", {
    name: "twitter:url",
    content: canonicalUrl,
  });
  ensureHeadNode('meta[name="robots"]', "meta", {
    name: "robots",
    content: robots,
  });
}

function pageTitleForCompetition(competition) {
  const publicPage = currentPublicPageDef();

  if (STATE.view === "leaderboard" || isLeaderboardPath()) {
    return PUBLIC_PAGE_DEFS[leaderboardPageKeyForCompetition()].title;
  }

  if (STATE.routeError && (isShortChallengePath() || isShortResultPath())) {
    return "Link Not Found | Ashes 5-0";
  }

  if (resultSnapshotLoaded()) {
    return `${currentSeriesUserLabel()} vs ${currentSeriesOppositionLabel()} | Challenge Result | Ashes 5-0`;
  }

  if (challengeLineupLoaded()) {
    const creatorName = loadedChallengeCreatorName();
    const challengeMode = currentChallengePlayableMode() === "memory" ? "Memory" : "Classic";
    return creatorName
      ? `${creatorName}'s ${challengeMode} Challenge | Ashes 5-0`
      : `${challengeMode} Challenge | Ashes 5-0`;
  }

  if (dailyChallengeActive()) {
    return PUBLIC_PAGE_DEFS[dailyPageKeyForCompetition()].title;
  }

  if (publicPage?.title) {
    return publicPage.title;
  }

  return competition.theme === "worldcup"
    ? PUBLIC_PAGE_DEFS.worldCup.title
    : SEO_HOME_TITLE;
}

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function fitCanvasText(ctx, text, maxWidth, maxSize, minSize, weight = 700, family = "Inter") {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1;
  }
  ctx.font = `${weight} ${size}px ${family}`;
}

function shareScoreText(series = STATE.series) {
  if (!series) return "";
  return `${series.userWins}-${series.starWins}${(series.draws ?? 0) ? `-${series.draws}` : ""}`;
}

function singleMatchOutcomeText(series = STATE.series, matchLabel = competitionConfig().matchLabel) {
  if (!series) return `${matchLabel} complete`;
  if (series.userWins > series.starWins) return `Won the ${matchLabel}`;
  if (series.userWins < series.starWins) return `Lost the ${matchLabel}`;
  return `Drew the ${matchLabel}`;
}

function primaryShareButtonLabel() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function" ? "Share" : "Share to X";
}

function shareAssetFileName({ challenge = false } = {}) {
  const competitionSlug = dailyChallengeActive()
    ? currentDailyCompetition() === "worldcup"
      ? "world-cup"
      : "ashes"
    : (STATE.series?.tournamentType === "worldcup" || STATE.competition === "worldcup")
      ? "world-cup"
      : "ashes";

  if (challenge) {
    const challengeMode = currentChallengePlayableMode() === "memory" ? "memory" : "classic";
    return `${competitionSlug}-challenge-${challengeMode}-result.png`;
  }

  if (dailyChallengeActive()) {
    return `${competitionSlug}-${currentDailyAttemptMode() === "practice" ? "daily-practice" : "daily"}-result.png`;
  }

  return `${competitionSlug}-${isMemoryMode() ? "memory" : "classic"}-result.png`;
}

function sharePlayerMetaText(player, slotIndex = -1) {
  const role = playerRoleText(player);

  if (dailyChallengeActive()) {
    const fixedSlotIndexes = new Set((STATE.daily.fixedPlayers ?? []).map((entry) => entry?.slotIndex));
    const chosenSlotIndexes = new Set((STATE.daily.lockedSelections ?? []).map((entry) => entry?.slotIndex));
    const source = fixedSlotIndexes.has(slotIndex)
      ? "Locked in"
      : chosenSlotIndexes.has(slotIndex)
        ? "Your pick"
        : "";
    return source ? `${role} · ${source}` : role;
  }

  const year = String(player?.squadYear ?? "").trim();
  return year ? `${role} · ${year}` : role;
}

function buildSeriesShareContext(series = STATE.series) {
  const competition = competitionConfig();
  const isWorldCup = series?.tournamentType === "worldcup" || competition.theme === "worldcup";
  const isDaily = dailyChallengeActive();
  const rankedDaily = isDaily && currentDailyAttemptMode() !== "practice";
  const metrics = teamMetricsFromLineup(series?.userLineup ?? []);

  const modeDeck = isDaily
    ? isWorldCup
      ? rankedDaily
        ? "World Cup Daily · One-off ODI"
        : "World Cup Daily Practice · One-off ODI"
      : rankedDaily
        ? "Daily Challenge · One-off Test"
        : "Daily Practice · One-off Test"
    : isWorldCup
      ? `${modeLabel()} · ODI tournament`
      : `${modeLabel()} · Five-Test series`;

  const resultHeadline = isWorldCup
    ? series?.statusText ?? "Tournament complete"
    : isDaily
      ? singleMatchOutcomeText(series, competition.matchLabel)
      : completedSeriesOutcomeText(series);

  const resultSummary = isWorldCup
    ? series?.matches?.[series.matches.length - 1]?.summary ?? "ODI tournament complete"
    : isDaily
      ? series?.matches?.[0]?.summary ?? `${competition.matchLabel} complete`
      : completedSeriesSummaryText(series);

  return {
    title: "Ashes 5-0",
    modeDeck,
    resultHeadline,
    resultSummary,
    lineupHeading: isDaily ? "Completed XI" : "Selected XI",
    cta: isWorldCup ? "Can you beat this ODI XI?" : "Can you beat this XI?",
    fileName: shareAssetFileName(),
    metricCards: [
      { label: "Mode", value: modeLabel() },
      { label: "Format", value: isDaily ? `One ${competition.matchLabel}` : isWorldCup ? "ODI tournament" : "5 Tests" },
      { label: "Batting", value: metrics.batting || 0 },
      { label: "Overall", value: `${metrics.overall || 0} · ${metrics.grade || "N/A"}` },
    ],
  };
}

async function createSeriesShareFile(series, shareContext) {
  if (!series) return null;
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font load failures and fall back to system fonts.
    }
  }

  const width = 1600;
  const height = 1520;
  const scale = Math.min(2, Math.max(1, Math.floor(window.devicePixelRatio || 1)));
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(scale, scale);

  const isWorldCup = series?.tournamentType === "worldcup" || STATE.competition === "worldcup";
  const palette = isWorldCup
    ? {
        bgStart: "#06162f",
        bgMid: "#0b2448",
        bgEnd: "#04101f",
        glowA: "rgba(103, 183, 255, 0.18)",
        glowB: "rgba(180, 212, 255, 0.08)",
        cardFill: "rgba(239, 245, 255, 0.95)",
        cardAltFill: "rgba(226, 237, 255, 0.95)",
        stroke: "rgba(179, 206, 255, 0.14)",
        accent: "#67b7ff",
        accentSoft: "#2f7dd3",
        text: "#f8fbff",
        textStrong: "#eaf3ff",
        muted: "rgba(232, 241, 255, 0.76)",
        darkText: "#10233f",
      }
    : {
        bgStart: "#123524",
        bgMid: "#0f2d1f",
        bgEnd: "#08150f",
        glowA: "rgba(212, 175, 55, 0.18)",
        glowB: "rgba(245, 240, 230, 0.08)",
        cardFill: "rgba(245, 240, 230, 0.94)",
        cardAltFill: "rgba(236, 228, 210, 0.94)",
        stroke: "rgba(31, 31, 31, 0.08)",
        accent: "#d4af37",
        accentSoft: "#b8860b",
        text: "#f8f8f8",
        textStrong: "rgba(248, 248, 248, 0.82)",
        muted: "rgba(248, 248, 248, 0.7)",
        darkText: "#1f1f1f",
      };
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, palette.bgStart);
  bg.addColorStop(0.55, palette.bgMid);
  bg.addColorStop(1, palette.bgEnd);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = palette.glowA;
  ctx.beginPath();
  ctx.arc(width - 180, 150, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.glowB;
  ctx.beginPath();
  ctx.arc(140, height - 180, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.fillStyle = palette.text;
  fitCanvasText(ctx, shareContext.title, 520, 66, 42, 800, "Oswald");
  ctx.fillText(shareContext.title, 80, 118);

  ctx.fillStyle = palette.textStrong;
  fitCanvasText(ctx, shareContext.modeDeck, width - 160, 28, 18, 600, "Inter");
  ctx.fillText(shareContext.modeDeck, 80, 155);

  ctx.fillStyle = palette.accent;
  fitCanvasText(ctx, shareContext.resultHeadline, width - 160, 42, 22, 700, "Inter");
  ctx.fillText(shareContext.resultHeadline, 80, 206);

  ctx.fillStyle = palette.muted;
  fitCanvasText(ctx, shareContext.resultSummary, width - 160, 18, 12, 600, "Inter");
  ctx.fillText(shareContext.resultSummary, 80, 238);

  const cardY = 282;
  const cardW = 344;
  const cardH = 112;
  const gap = 20;

  shareContext.metricCards.forEach((card, index) => {
    const x = 80 + index * (cardW + gap);
    ctx.fillStyle = index % 2 === 0 ? palette.cardFill : palette.cardAltFill;
    roundRectPath(ctx, x, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = palette.stroke;
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    fitCanvasText(ctx, card.label, cardW - 36, 18, 14, 800, "Inter");
    ctx.fillText(card.label, x + 18, cardY + 34);

    ctx.fillStyle = palette.darkText;
    fitCanvasText(ctx, String(card.value), cardW - 36, 38, 24, 800, "Oswald");
    ctx.fillText(String(card.value), x + 18, cardY + 84);
  });

  ctx.fillStyle = palette.accent;
  fitCanvasText(ctx, shareContext.lineupHeading, 420, 28, 18, 800, "Inter");
  ctx.fillText(shareContext.lineupHeading, 80, 470);

  ctx.fillStyle = palette.muted;
  fitCanvasText(ctx, shareContext.cta, width - 320, 16, 12, 600, "Inter");
  ctx.fillText(shareContext.cta, 250, 470);

  const rowsTop = 502;
  const rowHeight = 80;
  const rowGap = 10;
  const rowWidth = width - 160;

  series.userLineup.forEach((player, index) => {
    const y = rowsTop + index * (rowHeight + rowGap);
    const slot = XI_SLOTS[index];
    const metaText = sharePlayerMetaText(player, index);
    ctx.fillStyle = index % 2 === 0 ? palette.cardFill : palette.cardAltFill;
    roundRectPath(ctx, 80, y, rowWidth, rowHeight, 22);
    ctx.fill();
    ctx.strokeStyle = palette.stroke;
    ctx.stroke();

    ctx.fillStyle = palette.accentSoft;
    fitCanvasText(ctx, slot.label, 110, 18, 13, 800, "Inter");
    ctx.fillText(slot.label, 104, y + 28);

    ctx.fillStyle = palette.darkText;
    fitCanvasText(ctx, player.name, 470, 28, 18, 800, "Inter");
    ctx.fillText(player.name, 104, y + 58);

    ctx.fillStyle = isWorldCup ? "#4a6384" : "#5f5d56";
    fitCanvasText(ctx, metaText, 440, 16, 11, 600, "Inter");
    ctx.fillText(metaText, 1000, y + 48);
  });

  ctx.fillStyle = palette.textStrong;
  fitCanvasText(ctx, "Play at ashes-5-0.co.uk", 320, 20, 13, 700, "Inter");
  ctx.fillText("Play at ashes-5-0.co.uk", 80, height - 82);

  ctx.fillStyle = palette.muted;
  fitCanvasText(ctx, "ashes-5-0.co.uk", 300, 18, 13, 600, "Roboto Mono");
  ctx.fillText("ashes-5-0.co.uk", 80, height - 52);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((value) => {
      if (!value) {
        reject(new Error("Could not render share image."));
        return;
      }
      resolve(value);
    }, "image/png");
  });

  return new File([blob], shareContext.fileName, { type: "image/png" });
}

async function createChallengeResultShareFile(result) {
  if (!result) return null;
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font load failures and fall back to system fonts.
    }
  }

  const width = 1400;
  const height = 980;
  const scale = Math.min(2, Math.max(1, Math.floor(window.devicePixelRatio || 1)));
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.scale(scale, scale);

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#123524");
  bg.addColorStop(0.5, "#0f2d1f");
  bg.addColorStop(1, "#08150f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(212, 175, 55, 0.16)";
  ctx.beginPath();
  ctx.arc(width - 160, 150, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(245, 240, 230, 0.08)";
  ctx.beginPath();
  ctx.arc(160, height - 160, 240, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.fillStyle = "#f8f8f8";
  fitCanvasText(ctx, "Ashes 5-0 Challenge", 640, 64, 38, 800, "Oswald");
  ctx.fillText("Ashes 5-0 Challenge", 80, 110);

  ctx.fillStyle = "rgba(248,248,248,0.76)";
  fitCanvasText(ctx, `${currentChallengePlayableMode() === "memory" ? "Memory" : "Classic"} result`, 420, 24, 18, 600, "Inter");
  ctx.fillText(`${currentChallengePlayableMode() === "memory" ? "Memory" : "Classic"} result`, 80, 144);

  const responderLabel = responderTeamLabelFromName(result.responderDisplayName, "Your XI");
  const challengerLabel = challengerTeamLabelFromName(result.challengerDisplayName);
  const score = challengeSeriesScore(result);
  const outcome = challengeSeriesOutcome(result);
  const outcomeText = outcome === "win"
    ? `${responderLabel} won ${score}`
    : outcome === "loss"
      ? `${challengerLabel} won ${score}`
      : `Series drawn ${score}`;

  ctx.fillStyle = "#d4af37";
  fitCanvasText(ctx, outcomeText, width - 160, 30, 18, 700, "Inter");
  ctx.fillText(outcomeText, 80, 188);

  const cardY = 240;
  const cardH = 140;
  const cardW = 580;
  [
    { x: 80, label: "Responder", value: responderLabel },
    { x: width - 80 - cardW, label: "Challenger", value: challengerLabel },
  ].forEach((card, index) => {
    ctx.fillStyle = index === 0 ? "rgba(245, 240, 230, 0.95)" : "rgba(236, 228, 210, 0.95)";
    roundRectPath(ctx, card.x, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(31,31,31,0.08)";
    ctx.stroke();

    ctx.fillStyle = "#b8860b";
    fitCanvasText(ctx, card.label, 180, 18, 14, 800, "Inter");
    ctx.fillText(card.label, card.x + 24, cardY + 38);

    ctx.fillStyle = "#1f1f1f";
    fitCanvasText(ctx, card.value, cardW - 48, 38, 24, 800, "Oswald");
    ctx.fillText(card.value, card.x + 24, cardY + 92);
  });

  ctx.fillStyle = "#f8f8f8";
  fitCanvasText(ctx, score, 340, 92, 48, 800, "Oswald");
  const scoreWidth = ctx.measureText(score).width;
  ctx.fillText(score, width / 2 - scoreWidth / 2, 455);

  ctx.fillStyle = "rgba(248,248,248,0.76)";
  fitCanvasText(ctx, "Five-Test series score", 260, 18, 12, 600, "Roboto Mono");
  const labelWidth = ctx.measureText("Five-Test series score").width;
  ctx.fillText("Five-Test series score", width / 2 - labelWidth / 2, 486);

  ctx.fillStyle = "#d4af37";
  fitCanvasText(ctx, "Test-by-test", 220, 22, 16, 800, "Inter");
  ctx.fillText("Test-by-test", 80, 560);

  result.matches.forEach((match, index) => {
    const x = 80 + index * 252;
    const y = 590;
    ctx.fillStyle = match.result === "win"
      ? "rgba(34, 93, 65, 0.96)"
      : match.result === "loss"
        ? "rgba(84, 40, 34, 0.96)"
        : "rgba(77, 74, 66, 0.96)";
    roundRectPath(ctx, x, y, 220, 116, 22);
    ctx.fill();

    ctx.fillStyle = "#f8f8f8";
    fitCanvasText(ctx, `Test ${index + 1}`, 120, 18, 14, 800, "Inter");
    ctx.fillText(`Test ${index + 1}`, x + 18, y + 34);
    fitCanvasText(ctx, match.summary, 184, 22, 12, 700, "Oswald");
    ctx.fillText(match.summary, x + 18, y + 72);

    ctx.fillStyle = "rgba(248,248,248,0.72)";
    fitCanvasText(ctx, match.venue, 184, 13, 10, 600, "Roboto Mono");
    ctx.fillText(match.venue, x + 18, y + 98);
  });

  const playerOfSeries = result.playerOfSeries?.name
    ? `${result.playerOfSeries.name} (${result.playerOfSeries.side === "your" ? responderLabel : challengerLabel})`
    : "Awaiting";
  ctx.fillStyle = "rgba(245, 240, 230, 0.95)";
  roundRectPath(ctx, 80, 760, width - 160, 140, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(31,31,31,0.08)";
  ctx.stroke();

  ctx.fillStyle = "#b8860b";
  fitCanvasText(ctx, "Player of the series", 260, 18, 14, 800, "Inter");
  ctx.fillText("Player of the series", 104, 798);

  ctx.fillStyle = "#1f1f1f";
  fitCanvasText(ctx, playerOfSeries, width - 220, 36, 20, 800, "Oswald");
  ctx.fillText(playerOfSeries, 104, 852);

  ctx.fillStyle = "#5f5d56";
  fitCanvasText(ctx, "ashes-5-0.co.uk", 260, 18, 12, 600, "Roboto Mono");
  ctx.fillText("ashes-5-0.co.uk", 104, 884);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((value) => {
      if (!value) {
        reject(new Error("Could not render result image."));
        return;
      }
      resolve(value);
    }, "image/png");
  });

  return new File([blob], shareAssetFileName({ challenge: true }), { type: "image/png" });
}

function prepareSeriesShareAsset(series) {
  if (!series || STATE.seriesShareAsset || STATE.seriesShareAssetPromise) return;
  const seriesRef = series;
  const shareContext = buildSeriesShareContext(seriesRef);
  STATE.seriesShareAssetPromise = createSeriesShareFile(seriesRef, shareContext)
    .then((file) => {
      if (STATE.series === seriesRef) {
        STATE.seriesShareAsset = file;
      }
      return file;
    })
    .catch((error) => {
      console.error("Share image generation failed:", error);
      return null;
    })
    .finally(() => {
      if (STATE.series === seriesRef) {
        STATE.seriesShareAssetPromise = null;
      }
    });
}

function prepareChallengeResultShareAsset(result) {
  if (!result || STATE.seriesShareAsset || STATE.seriesShareAssetPromise) return;
  const resultRef = result;
  STATE.seriesShareAssetPromise = createChallengeResultShareFile(resultRef)
    .then((file) => {
      if (STATE.result === resultRef) {
        STATE.seriesShareAsset = file;
      }
      return file;
    })
    .catch((error) => {
      console.error("Challenge result image generation failed:", error);
      return null;
    })
    .finally(() => {
      if (STATE.result === resultRef) {
        STATE.seriesShareAssetPromise = null;
      }
    });
}

function setShareStatus(message) {
  if (!els.shareStatus) return;
  els.shareStatus.textContent = message;
}

function openWhatsAppShare(text) {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

async function writeTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("input");
  input.value = text;
  input.setAttribute("readonly", "readonly");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();

  if (!copied) {
    throw new Error("Could not copy text.");
  }
}

async function ensureSeriesShareAsset() {
  const result = resultSnapshotLoaded() ? STATE.result : challengeLineupLoaded() && seriesComplete() ? finalizeChallengeResultIfNeeded() : null;
  if (result) {
    if (STATE.seriesShareAsset) return STATE.seriesShareAsset;
    if (!STATE.seriesShareAssetPromise) {
      prepareChallengeResultShareAsset(result);
    }

    try {
      const file = await STATE.seriesShareAssetPromise;
      return file ?? STATE.seriesShareAsset ?? null;
    } catch {
      return STATE.seriesShareAsset ?? null;
    }
  }

  if (!STATE.series) return null;
  if (STATE.seriesShareAsset) return STATE.seriesShareAsset;
  if (!STATE.seriesShareAssetPromise) {
    prepareSeriesShareAsset(STATE.series);
  }

  try {
    const file = await STATE.seriesShareAssetPromise;
    return file ?? STATE.seriesShareAsset ?? null;
  } catch {
    return STATE.seriesShareAsset ?? null;
  }
}

async function copySeriesLink() {
  const url = shareUrl();
  await writeTextToClipboard(url);
  setShareStatus("Link copied.");
  announce("Link copied.");
}

function currentChallengeResultRecord() {
  return resultSnapshotLoaded() ? STATE.result : challengeLineupLoaded() && seriesComplete() ? finalizeChallengeResultIfNeeded() : null;
}

function challengeResultTitle(result) {
  const responderLabel = responderTeamLabelFromName(result?.responderDisplayName, "Your XI");
  const challengerLabel = challengerTeamLabelFromName(result?.challengerDisplayName);
  return `${responderLabel} vs ${challengerLabel}`;
}

function formatChallengeResultShareText(result, url = currentResultUrl() || resultUrlForRecord(result)) {
  const score = challengeSeriesScore(result);
  const outcome = challengeSeriesOutcome(result);
  if (outcome === "win") {
    return `I took on your Ashes 5-0 XI and won the series ${score}. See both teams and the full result: ${url}`;
  }
  if (outcome === "loss") {
    return `Your Ashes 5-0 XI beat mine ${score}. See how the series played out: ${url}`;
  }
  return `Our Ashes 5-0 XIs drew the series ${score}. We need a rematch: ${url}`;
}

async function copyChallengeLink() {
  const url = challengeLineupLoaded() ? currentChallengeUrl() : await ensureGeneratedChallengeLink();
  if (!url) {
    throw new Error("Challenge invite is not ready.");
  }

  await writeTextToClipboard(
    challengeInviteText(url, currentChallengeCreatorName(), currentChallengePlayableMode()),
  );
  trackStandardEvent("challenge_link_copied", { mode: analyticsModeValue() });
  trackChallengeEvent("challenge_link_copied", { role: challengeLineupLoaded() ? "recipient" : "creator" });
  setChallengeStatus("Invite copied.");
  announce("Invite copied.");
}

async function copyChallengeResultLink() {
  let result = currentChallengeResultRecord();
  if (!result) {
    throw new Error("Challenge result is not ready.");
  }

  if (challengeLineupLoaded() && STATE.challenge?.publicId && !result.shortUrl) {
    result = await ensurePersistedChallengeResult();
  }

  const url = currentResultUrl() || result.shortUrl || resultUrlForRecord(result);
  await writeTextToClipboard(url);
  trackChallengeEvent("challenge_result_link_copied", {
    role: "recipient",
    source: "series-complete",
    series_result: challengeSeriesOutcome(result),
  });
  setShareStatus("Result link copied.");
  announce("Result link copied.");
}

async function downloadSeriesShareImage() {
  const file = await ensureSeriesShareAsset();
  if (!file) {
    setShareStatus("Image is still generating. Try again in a moment.");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = file.name || shareAssetFileName();
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  setShareStatus("Download started.");
  announce("Download started.");
}

async function downloadChallengeResultImage() {
  const result = currentChallengeResultRecord();
  if (!result) {
    throw new Error("Challenge result is not ready.");
  }

  const file = await ensureSeriesShareAsset();
  if (!file) {
    setShareStatus("Result image is still generating. Try again in a moment.");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = file.name || shareAssetFileName({ challenge: true });
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  trackChallengeEvent("challenge_result_image_downloaded", {
    role: "recipient",
    source: "series-complete",
    series_result: challengeSeriesOutcome(result),
  });
  setShareStatus("Download started.");
  announce("Download started.");
}

async function shareChallengeResult(source = "series-complete") {
  let result = currentChallengeResultRecord();
  if (!result) {
    throw new Error("Challenge result is not ready.");
  }

  if (challengeLineupLoaded() && STATE.challenge?.publicId && !result.shortUrl) {
    result = await ensurePersistedChallengeResult();
  }

  const url = currentResultUrl() || result.shortUrl || resultUrlForRecord(result);
  const text = formatChallengeResultShareText(result, url);
  const title = challengeResultTitle(result);

  trackChallengeEvent("challenge_result_share_clicked", {
    role: "recipient",
    source,
    series_result: challengeSeriesOutcome(result),
  });

  const file = await ensureSeriesShareAsset();

  if (file && navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ title, text, url, files: [file] });
      trackStandardEvent("result_shared", { share_destination: "web_share" });
      trackChallengeEvent("challenge_result_share_api_resolved", {
        role: "recipient",
        source,
        series_result: challengeSeriesOutcome(result),
      });
      setShareStatus("Result ready to share.");
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.warn("Native challenge result file share failed:", error);
    }
  }

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      trackStandardEvent("result_shared", { share_destination: "web_share" });
      trackChallengeEvent("challenge_result_share_api_resolved", {
        role: "recipient",
        source,
        series_result: challengeSeriesOutcome(result),
      });
      setShareStatus("Result ready to share.");
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.warn("Native challenge result share failed:", error);
    }
  }

  await writeTextToClipboard(text);
  trackStandardEvent("result_shared", { share_destination: "copy" });
  setShareStatus("Result link copied.");
}

function formatShareText() {
  if (!STATE.series) {
    return `I just played ${competitionConfig().title}. ${shareUrl()}`;
  }

  const competition = competitionConfig();
  if (STATE.series.tournamentType === "worldcup") {
    return `I just finished a ${modeLabel()} World Cup XI run and ended as ${STATE.series.statusText ?? "tournament complete"}. ${shareUrl()}`;
  }
  if (dailyChallengeActive()) {
    return `I just finished the ${competition.title} and ${singleMatchOutcomeText(STATE.series, competition.matchLabel).toLowerCase()}. ${shareUrl()}`;
  }

  const seriesResult =
    STATE.series.userWins > STATE.series.starWins
      ? "won"
      : STATE.series.userWins < STATE.series.starWins
        ? "lost"
        : "drew";
  return `I just finished a ${modeLabel()} ${competition.title} and ${seriesResult} the ${competition.seriesDescriptor} ${shareScoreText(STATE.series)}. ${shareUrl()}`;
}

function init() {
  bindElements();
  resetSubmissionState();
  STATE.daily.participantId = loadOrCreateDailyParticipantId();
  const routeType = String(BOOTSTRAP?.route?.type ?? "").trim();
  const currentPageKey = currentPublicPageKey();
  const preferredMode = parsePreferredModeFromLocation();

  if (currentPageKey === "ashes" && preferredMode) {
    STATE.mode = preferredMode;
  }

  const result = loadResultFromUrl();
  if (result) {
    STATE.challenge = null;
    STATE.result = result;
    STATE.challengeDraftMode = result.mode;
    STATE.challengeResponseName = result.responderDisplayName;
    STATE.competition = "ashes";
    STATE.squads = ASHES_SQUADS;
    STATE.mode = "challenge";
    STATE.series = seriesFromResultRecord(result);
    STATE.view = "series";
    prepareChallengeResultShareAsset(result);
    trackChallengeEvent("challenge_result_page_viewed", {
      role: "viewer",
      source: "result-link",
      series_result: challengeSeriesOutcome(result),
      has_creator_name: result.challengerDisplayName ? "true" : "false",
    });
  } else {
    const challenge = loadChallengeFromUrl();
    if (challenge) {
      STATE.challenge = challenge;
      STATE.challengeDraftMode = challenge.mode;
      STATE.competition = "ashes";
      STATE.squads = ASHES_SQUADS;
      STATE.mode = "challenge";
      trackStandardEvent("challenge_opened", {
        mode: challenge.mode === "memory" ? "friend_memory" : "friend_classic",
      });
      trackChallengeEvent("challenge_link_opened", {
        role: "recipient",
        challenge_mode: normalizePlayableMode(challenge.mode),
        challenge_ref: challengeRefForCode(challenge.code),
        has_creator_name: challenge.creatorName ? "true" : "false",
      });
    } else if (BOOTSTRAP?.route?.type === "result") {
      const bootstrappedResult = applyResultApiPayload(BOOTSTRAP.result);
      const bootstrappedSeries = bootstrappedResult ? seriesFromResultRecord(bootstrappedResult) : null;
      if (bootstrappedResult && bootstrappedSeries) {
        STATE.challenge = null;
        STATE.result = bootstrappedResult;
        STATE.challengeDraftMode = bootstrappedResult.mode;
        STATE.challengeResponseName = bootstrappedResult.responderDisplayName;
        STATE.competition = "ashes";
        STATE.squads = ASHES_SQUADS;
        STATE.mode = "challenge";
        STATE.series = bootstrappedSeries;
        STATE.view = "series";
        prepareChallengeResultShareAsset(bootstrappedResult);
        trackChallengeEvent("challenge_result_page_viewed", {
          role: "viewer",
          source: "result-link",
          series_result: challengeSeriesOutcome(bootstrappedResult),
          has_creator_name: bootstrappedResult.challengerDisplayName ? "true" : "false",
        });
      } else {
        setRouteError(
          "Result unavailable",
          "That saved result could not be loaded. Start a fresh XI, open the leaderboard, or ask for a new result link.",
        );
      }
    } else if (BOOTSTRAP?.route?.type === "challenge") {
      const bootstrappedChallenge = applyChallengeApiPayload(BOOTSTRAP.challenge, BOOTSTRAP.team);
      if (bootstrappedChallenge) {
        STATE.challenge = bootstrappedChallenge;
        STATE.challengeDraftMode = bootstrappedChallenge.mode;
        STATE.competition = "ashes";
        STATE.squads = ASHES_SQUADS;
        STATE.mode = "challenge";
        trackStandardEvent("challenge_opened", {
          mode: bootstrappedChallenge.mode === "memory" ? "friend_memory" : "friend_classic",
        });
        trackChallengeEvent("challenge_link_opened", {
          role: "recipient",
          challenge_mode: normalizePlayableMode(bootstrappedChallenge.mode),
          has_creator_name: bootstrappedChallenge.creatorName ? "true" : "false",
        });
      } else {
        setRouteError(
          "Challenge unavailable",
          "That saved challenge could not be loaded. Start a fresh XI, open the leaderboard, or ask for a new invite.",
        );
      }
    } else if (BOOTSTRAP?.route?.type === "challenge-not-found") {
      STATE.competition = "ashes";
      STATE.squads = ASHES_SQUADS;
      setRouteError(
        "Challenge not found",
        "That saved challenge link is unavailable. Start a fresh XI, open the leaderboard, or ask for a fresh invite.",
      );
    } else if (BOOTSTRAP?.route?.type === "result-not-found") {
      STATE.competition = "ashes";
      STATE.squads = ASHES_SQUADS;
      setRouteError(
        "Result not found",
        "That saved result link is unavailable. Start a fresh XI, open the leaderboard, or ask for a fresh result link.",
      );
    } else if (routeType === "leaderboard" || currentPageKey === "leaderboard") {
      STATE.challenge = null;
      STATE.result = null;
      STATE.challengeDraftName = "";
      STATE.challengeResponseName = "";
      STATE.challengeDraftMode = "classic";
      STATE.competition = "ashes";
      STATE.squads = ASHES_SQUADS;
      STATE.mode = "classic";
      STATE.view = "leaderboard";
      STATE.leaderboard.competition = "ashes";
      STATE.leaderboard.totalTeams = null;
      STATE.leaderboard.entries = [];
      STATE.leaderboard.error = "";
      STATE.leaderboard.loading = true;
    } else if (routeType === "world-cup-leaderboard" || currentPageKey === "worldCupLeaderboard") {
      STATE.challenge = null;
      STATE.result = null;
      STATE.challengeDraftName = "";
      STATE.challengeResponseName = "";
      STATE.challengeDraftMode = "classic";
      STATE.competition = "worldcup";
      STATE.squads = WORLD_CUP_SQUADS;
      STATE.mode = "classic";
      STATE.view = "leaderboard";
      STATE.leaderboard.competition = "worldcup";
      STATE.leaderboard.loading = true;
    } else if (routeType === "challenge-landing" || currentPageKey === "challenge") {
      STATE.challenge = null;
      STATE.result = null;
      STATE.challengeDraftMode = preferredMode || "classic";
      STATE.competition = "ashes";
      STATE.squads = ASHES_SQUADS;
      STATE.mode = "challenge";
      STATE.view = "game";
    } else if (currentPageKey === "ashes") {
      STATE.challenge = null;
      STATE.result = null;
      STATE.competition = "ashes";
      STATE.squads = ASHES_SQUADS;
      STATE.mode = preferredMode || "classic";
      STATE.view = "game";
    } else if (routeType === "world-cup" || currentPageKey === "worldCup") {
      STATE.challenge = null;
      STATE.result = null;
      STATE.competition = "worldcup";
      STATE.squads = WORLD_CUP_SQUADS;
      STATE.mode = "classic";
      STATE.view = "game";
    } else if (routeType === "daily" || currentPageKey === "daily") {
      prepareDailyView("ashes");
      STATE.view = "game";
      STATE.mode = "memory";
      STATE.daily.summary = {
        date: BOOTSTRAP?.route?.currentDate ?? currentDailyReferenceDateText(),
        totalRolls: 4,
      };
      STATE.daily.challenge = STATE.daily.summary;
    } else if (routeType === "world-cup-daily" || currentPageKey === "worldCupDaily") {
      prepareDailyView("worldcup");
      STATE.view = "game";
      STATE.mode = "memory";
      STATE.daily.summary = {
        date: BOOTSTRAP?.route?.currentDate ?? currentDailyReferenceDateText(),
        totalRolls: 4,
      };
      STATE.daily.challenge = STATE.daily.summary;
    }
  }
  addCatalogMetadata();
  wireControls();
  renderAll();
  trackStandardEvent("landing_view", {
    page: currentPageKey || "unknown",
  });
  if (STATE.view === "leaderboard") {
    void loadLeaderboard();
  }
  if (routeType === "daily" || currentPageKey === "daily") {
    void openDailyChallenge("ashes", { autoStart: true }).catch((error) => {
      console.error("Daily summary preload failed:", error);
      renderAll();
    });
  } else if (routeType === "world-cup-daily" || currentPageKey === "worldCupDaily") {
    void openDailyChallenge("worldcup", { autoStart: true }).catch((error) => {
      console.error("Daily summary preload failed:", error);
      renderAll();
    });
  }
  if (["home", "ashes", "worldCup"].includes(currentPageKey ?? "")) {
    const summaryCompetition = currentPageKey === "worldCup" ? "worldcup" : "ashes";
    const onDailyRoute = routeType === "daily" || currentPageKey === "daily" || routeType === "world-cup-daily" || currentPageKey === "worldCupDaily";
    if (!onDailyRoute) {
      void loadDailySummary({ competition: summaryCompetition }).catch((error) => {
        console.error("Daily summary preload failed:", error);
      });
    }
  } else if (STATE.competition === "ashes" && routeType !== "daily" && currentPageKey !== "daily") {
    void loadDailySummary({ competition: "ashes" }).catch((error) => {
      console.error("Daily summary preload failed:", error);
    });
  }
  document.body.classList.add("app-ready");
}

init();
