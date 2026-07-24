import { ASHES_SQUADS } from "./data/ashes-squads.js";
import { WORLD_CUP_SQUADS } from "./data/wc-squads.js";

const CANONICAL_SITE_ORIGIN = "https://ashes-5-0.co.uk";
const SEO_HOME_TITLE = "Historic Cricket XI Draft Game | Ashes 5-0";
const SEO_HOME_DESCRIPTION =
  "Roll historic cricket squads, draft one player at a time, build your all-time XI and simulate a five-Test series. Free to play with no sign-up.";

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

const STATE = {
  view: "home",
  competition: "ashes",
  squads: ASHES_SQUADS,
  catalog: [],
  challenge: null,
  result: null,
  challengeDraftName: "",
  challengeDraftMode: "classic",
  challengeResponseName: "",
  lineup: new Map(),
  currentSquad: null,
  selectedPlayerId: null,
  mode: "classic",
  series: null,
  timer: null,
  achievementDetail: null,
  achievementPinned: false,
  achievementHelpBound: false,
  seriesShareAsset: null,
  seriesShareAssetPromise: null,
  rollAnimation: null,
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
    homeView: "[data-home-view]",
    gameView: "[data-game-view]",
    seriesView: "[data-series-view]",
    homeEyebrow: "[data-home-eyebrow]",
    homeTitle: "[data-home-title]",
    homeLede: "[data-home-lede]",
    homePanelKicker: "[data-home-panel-kicker]",
    homePanelTitle: "[data-home-panel-title]",
    homePanelCopy: "[data-home-panel-copy]",
    homeConfigGrid: "[data-home-config-grid]",
    homeResponseNameRow: "[data-home-response-name-row]",
    homeResponseName: "[data-home-response-name]",
    homeMode: "[data-home-mode]",
    homeRulesGrid: "[data-home-rules-grid]",
    homeSquadsLabel: "[data-home-squads-label]",
    homePlayersLabel: "[data-home-players-label]",
    homeFormatLabel: "[data-home-format-label]",
    homeFormatValue: "[data-home-format-value]",
    homeRuleOne: "[data-home-rule-one]",
    homeRuleThree: "[data-home-rule-three]",
    totalSquads: "[data-total-squads]",
    totalPlayers: "[data-total-players]",
    homeChallenge: "[data-home-challenge]",
    homeCompetition: "[data-home-competition]",
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
    rosterGrid: "[data-roster-grid]",
    board: "[data-board]",
    rollSquad: "[data-roll-squad]",
    startSeries: "[data-start-series]",
    challengePanel: "[data-challenge-panel]",
    challengeTitle: "[data-challenge-title]",
    challengeCopy: "[data-challenge-copy]",
    challengeNameRow: "[data-challenge-name-row]",
    challengeName: "[data-challenge-name]",
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
    seriesFeed: "[data-series-feed]",
    seriesTableWrap: "[data-series-table-wrap]",
    seriesNext: "[data-series-next]",
    seriesAll: "[data-series-all]",
    draftMeter: "[data-draft-meter]",
    draftBatting: "[data-draft-batting]",
    draftBowling: "[data-draft-bowling]",
    draftFielding: "[data-draft-fielding]",
    draftOverall: "[data-draft-overall]",
    seriesInsights: "[data-series-insights]",
    seriesActions: "[data-series-actions]",
    seriesReveal: "[data-series-reveal]",
    seriesRevealGrid: "[data-series-reveal-grid]",
    playAgain: "[data-play-again]",
    sendResultBack: "[data-send-result-back]",
    challengeBack: "[data-challenge-back]",
    shareResult: "[data-share-result]",
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
  };

  for (const [key, selector] of Object.entries(selectors)) {
    els[key] = document.querySelector(selector);
  }

  const missing = Object.entries(els)
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

function isMemoryMode() {
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
  return STATE.competition === "ashes" && isChallengeMode() && !challengeLineupLoaded() && !resultSnapshotLoaded();
}

function modeLabel() {
  if (isChallengeMode()) {
    return isMemoryMode() ? "Memory Challenge" : "Challenge";
  }
  if (isMemoryMode()) return "Memory";
  return "Classic";
}

function currentPathname() {
  const pathname = window.location.pathname.replace(/\/index\.html$/i, "/");
  return pathname === "" ? "/" : pathname.replace(/\/+$/u, "") || "/";
}

function mobileBuilderViewport() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function scrollBuilderTargetIntoView(target, block = "start") {
  if (!target || !mobileBuilderViewport()) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block,
        inline: "nearest",
      });
    });
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

function baseChallengeAnalyticsProps(overrides = {}) {
  const props = {
    competition: "ashes",
    challenge_mode: currentChallengePlayableMode(),
    challenge_ref: currentChallengeRef(),
    has_creator_name: currentChallengeCreatorName() ? "true" : "false",
    ...overrides,
  };

  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== "" && value !== null && value !== undefined),
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
  const lineup = challengeLineupLoaded() ? STATE.challenge.lineup : lineupComplete() ? userLineup() : null;
  return lineup?.length === XI_SLOTS.length
    ? challengeUrlForLineup(lineup, currentChallengeCreatorName(), currentChallengePlayableMode())
    : "";
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
  return resultSnapshotLoaded() ? resultUrlForRecord(STATE.result) : "";
}

function clearResultUrlFromBrowser() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(RESULT_QUERY_KEY)) return;
  url.searchParams.delete(RESULT_QUERY_KEY);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function writeResultUrlToBrowser(record) {
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
  };
}

function finalizeChallengeResultIfNeeded() {
  if (STATE.result) return STATE.result;
  const result = buildChallengeResultRecord();
  if (!result) return null;

  STATE.result = result;
  STATE.seriesShareAsset = null;
  STATE.seriesShareAssetPromise = null;
  writeResultUrlToBrowser(result);
  return result;
}

function clearRollAnimation() {
  if (STATE.rollAnimation?.timer) {
    clearInterval(STATE.rollAnimation.timer);
  }
  STATE.rollAnimation = null;
}

function competitionConfig() {
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
      homeTitle: "Roll a World Cup squad. Lock one player. Build your XI.",
      homeLede:
        "Each roll produces a historic World Cup squad. Pick one player from the squad to lock into your XI. Build your team, then survive the group stage and knockout rounds.",
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
    homeEyebrow: "Ashes XI",
    homeTitle: loadedChallenge
      ? creatorName
        ? `${creatorName} has challenged you.`
        : "A Challenge XI is waiting. Draft your Ashes side and take it on."
      : isChallengeMode()
        ? "Build an Ashes XI and turn it into an invite link."
        : "Roll an Ashes squad. Lock one player. Build your Test XI.",
    homeLede: loadedChallenge
      ? creatorName
        ? `This link contains ${creatorName}'s saved Ashes XI. Accept the ${challengeModeLabel} challenge, draft your own side, and then play a five-Test series against it.`
        : `This link contains a saved Ashes XI. Draft your own side in the required ${challengeModeLabel} mode, then simulate a five-Test challenge series against it.`
      : isChallengeMode()
        ? "Each roll produces a historic Ashes squad. Pick one player from the squad to lock into your XI. Once the side is complete, copy the Ashes 5-0 invite and send it to someone else so they can play against your team."
        : "Each roll produces a historic Ashes squad. Pick one player from the squad to lock into your XI. Finish your side for a solo five-Test series, or use the new Challenge feature to send it to a friend.",
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

function seriesComplete() {
  return Boolean(STATE.series) && STATE.series.revealed >= STATE.series.matches.length;
}

function ratingLabel(value) {
  return isMemoryMode() && !seriesComplete() ? "??" : String(value);
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

function lineupScore(lineup) {
  const batting = average(lineup.slice(0, 7).map((player) => player.batting));
  const bowling = average(lineup.slice(7).map((player) => player.bowling));
  const fielding = average(lineup.map((player) => player.fielding));
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
  if (STATE.rollAnimation?.active) return STATE.rollAnimation.label;
  return STATE.currentSquad ? STATE.currentSquad.label : "Roll a squad";
}

function lineupComplete() {
  return STATE.lineup.size === XI_SLOTS.length;
}

function userLineup() {
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

function performancePointsForCard(card) {
  return (card.runs ?? 0) + (card.wickets ?? 0) * 25 + (card.centuries ?? 0) * 18 + (card.fiveFors ?? 0) * 22;
}

function formatDismissal(card) {
  if (card.dnb) return "DNB";
  if (card.notOut) return "not out";
  return card.dismissal || "c";
}

function buildBattingScorecard(lineup, opposition, inningsIndex, conditions = {}, chaseTarget = null, firstInningsLead = 0) {
  const order = battingOrder(lineup);
  const battingStrength = lineupScore(lineup).batting;
  const bowlingStrength = lineupScore(opposition).bowling;
  const pitch = conditions.pitch ?? "balanced";
  const extras = clamp(
    Math.round(2 + Math.random() * 12 + bowlingStrength / 18 + inningsIndex * 1.4),
    0,
    24,
  );

  let runs = 0;
  let wickets = 0;
  let declared = false;
  let chaseComplete = false;
  const batters = [];

  for (let index = 0; index < order.length; index += 1) {
    const player = order[index];
    const rawRuns = sampleBatterScore(player, bowlingStrength, pitch, inningsIndex);
    const adjustedRuns = clamp(
      Math.round(rawRuns * (0.85 + battingStrength / 260) + normalRandom() * 5),
      0,
      260,
    );
    const balls = adjustedRuns === 0
      ? clamp(Math.round(2 + Math.random() * 11), 1, 24)
      : clamp(Math.round(adjustedRuns * (1.2 + Math.random() * 0.7) + 5), 1, 260);
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

    runs += adjustedRuns;

    if (chaseTarget !== null && runs + extras >= chaseTarget) {
      card.out = false;
      card.notOut = true;
      card.dismissal = "not out";
      chaseComplete = true;
      batters.push(card);
      break;
    }

    if (shouldDeclare(runs + extras, wickets, inningsIndex, firstInningsLead)) {
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
  const ballsFaced = clamp(Math.round(total * 1.45 + wickets * 4 + Math.random() * 20), 60, 540);
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

function buildBowlingScorecard(lineup, inningsTotal, wickets, teamEdge = 0) {
  const ranked = teamBowlingRanking(lineup, teamEdge);
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
  const totalOvers = clamp(Math.round(inningsTotal / 5), 15, 120);
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
    const ballShare = bowler.balls / (totalOvers * 6);
    bowler.runs = clamp(
      Math.round(inningsTotal * ballShare + (100 - bowler.player.bowling) * 0.22 + Math.random() * 7),
      0,
      Math.max(0, inningsTotal + 24),
    );
    bowler.maidens = clamp(
      Math.round(bowler.balls / 24 + (bowler.player.bowling - 50) / 24 + Math.random() * 1.4),
      0,
      12,
    );
  });

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
          <span class="insight-label">Team grade</span>
          <strong>Overall ${userMetrics.overall} · ${userMetrics.grade}</strong>
          <p>Batting ${userMetrics.batting} · Bowling ${userMetrics.bowling} · Fielding ${userMetrics.fielding}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">XI rating</span>
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

function renderStats() {
  const competition = competitionConfig();
  const loadedChallenge = challengeLineupLoaded();
  els.totalSquads.textContent = String(STATE.squads.length);
  els.totalPlayers.textContent = String(STATE.catalog.length);
  els.gameSquadCount.textContent = `${STATE.squads.length} squads`;
  els.gamePlayerCount.textContent = `${STATE.catalog.length} players`;
  els.homeMode.value = isMemoryMode() ? "memory" : "classic";
  els.homeMode.disabled = loadedChallenge;
  document.title = pageTitleForCompetition(competition);
  els.homeEyebrow.textContent = competition.homeEyebrow;
  els.homeTitle.textContent = competition.homeTitle;
  els.homeLede.textContent = competition.homeLede;
  els.homePanelKicker.textContent = loadedChallenge ? "Challenge received" : "How it works";
  els.homePanelTitle.textContent = loadedChallenge ? "Accept challenge" : "Squad Roller";
  els.homePanelCopy.hidden = loadedChallenge || STATE.competition !== "ashes";
  els.homePanelCopy.textContent = loadedChallenge || STATE.competition !== "ashes"
    ? ""
    : "New feature: turn your completed Ashes XI into a private challenge link.";
  els.homeConfigGrid.hidden = loadedChallenge;
  els.homeResponseNameRow.hidden = !loadedChallenge;
  els.homeResponseName.value = currentChallengeResponseName();
  els.homeRulesGrid.hidden = loadedChallenge;
  els.homeSquadsLabel.textContent = competition.squadsLabel;
  els.homePlayersLabel.textContent = "Total players";
  els.homeFormatLabel.textContent = "Series format";
  els.homeFormatValue.textContent = competition.format === "limited-overs" ? "ODI" : "5 Tests";
  els.homeRuleOne.textContent = `Roll a previous ${competition.name} squad.`;
  els.homeRuleThree.textContent = challengeLineupLoaded()
    ? "Repeat until your XI is full, then simulate the challenge series."
    : challengeCreationMode()
      ? "Repeat until your XI is full, then copy the invite."
      : "Repeat until your XI is full, then simulate the series.";
  els.homeCompetition.textContent = competition.modeButton;
  els.homeChallenge.hidden = loadedChallenge || STATE.competition !== "ashes";
  els.homeCompetition.hidden = loadedChallenge;
  els.playGame.textContent = loadedChallenge
    ? "Accept challenge"
    : STATE.competition === "worldcup"
      ? "Start World Cup game"
      : "Start a solo game";
  els.gameEyebrow.textContent = competition.gameEyebrow;
  els.gameTitle.textContent = competition.gameTitle;
  els.rosterKicker.textContent = competition.rosterKicker;
  els.boardTitle.textContent = competition.boardTitle;
  els.seriesEyebrow.textContent = competition.seriesEyebrow;
  els.seriesTitle.textContent = competition.seriesTitle;
  els.seriesUserLabel.textContent = currentSeriesUserLabel();
  els.seriesOppositionLabel.textContent = competition.oppositionShortTitle;
  if (els.starTitle) els.starTitle.textContent = competition.oppositionTitle;
  document.body.dataset.competition = competition.theme;
}

function renderView() {
  els.homeView.hidden = STATE.view !== "home";
  els.gameView.hidden = STATE.view !== "game";
  els.seriesView.hidden = STATE.view !== "series";
  document.body.dataset.view = STATE.view;
}

function renderGameMeta() {
  const competition = competitionConfig();
  const rolling = Boolean(STATE.rollAnimation?.active);
  const buildingChallenge = challengeCreationMode();
  els.gameMode.textContent = modeLabel();
  els.currentSquad.textContent = currentSquadLabel();
  els.lineupStatus.textContent = `${STATE.lineup.size} / ${XI_SLOTS.length} locked`;
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
        ? "Your XI is complete. Copy the invite below."
        : challengeLineupLoaded()
          ? "Your XI is complete. Start the challenge series."
          : "Your XI is complete. Start the series."
      : STATE.lineup.size
        ? "A player has been locked. Roll another squad to continue."
        : `Roll a ${competition.name} squad to begin.`;
  } else if (selected) {
    els.rosterSummary.textContent = `${selected.name} is selected. Pick a valid slot to lock them in.`;
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
              ? "XI complete. Copy the invite below."
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
      const selectedClass = player.id === STATE.selectedPlayerId ? "selected" : "";
      const unavailable = locked || !playerCanPlay(player);
      const subtitle = `${player.roles[0]} · ${ratingPairLabel(player)}`;
      return `
        <button
          class="player-card ${selectedClass} ${unavailable ? "unavailable" : ""}"
          type="button"
          data-player-id="${player.id}"
          ${unavailable ? "disabled" : ""}
          aria-disabled="${unavailable ? "true" : "false"}"
        >
          <span class="player-name">${escapeHtml(player.name)}</span>
          <span class="player-meta">${escapeHtml(subtitle)}</span>
        </button>
      `;
    })
    .join("");

  els.rosterGrid.querySelectorAll("[data-player-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const playerId = button.dataset.playerId;
      const nextPlayerId = STATE.selectedPlayerId === playerId ? null : playerId;
      STATE.selectedPlayerId = nextPlayerId;
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
  const selected = STATE.catalog.find((player) => player.id === STATE.selectedPlayerId) ?? null;
  const rolling = Boolean(STATE.rollAnimation?.active);
  els.board.dataset.competition = competition.theme;

  els.board.innerHTML = `
    <div class="board-grid">
      ${XI_SLOTS.map((slot, index) => {
        const player = STATE.lineup.get(index) ?? null;
        const canAccept = !rolling && selected ? slotAcceptsPlayer(slot, selected) : false;
        const canClick = Boolean(selected && canAccept && !player);
        return `
          <button
            class="slot ${player ? "filled" : "empty"} ${canClick ? "target" : ""}"
            type="button"
            style="grid-row: ${slot.row}; grid-column: ${slot.col};"
            data-slot-index="${index}"
            ${canClick ? "" : "disabled"}
          >
            <span class="slot-label">${escapeHtml(slot.label)}</span>
            ${
              player
                ? `<span class="slot-name">${escapeHtml(player.name)}</span><span class="slot-sub">${escapeHtml(player.roles[0])}</span>`
                : `<span class="slot-sub">${selected ? "Can fit here" : "Waiting for a player"}</span>`
            }
          </button>
        `;
      }).join("")}
    </div>
  `;

  els.board.querySelectorAll("[data-slot-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.slotIndex);
      const slot = XI_SLOTS[index];
      const player = STATE.catalog.find((candidate) => candidate.id === STATE.selectedPlayerId);
      if (!player || !slot || STATE.lineup.has(index) || !slotAcceptsPlayer(slot, player)) return;
      if (lineupContainsName(player.name)) return;

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
      STATE.selectedPlayerId = null;
      STATE.currentSquad = null;
      renderAll();
      scrollBuilderTargetIntoView(els.rollSquad);
    });
  });
}

function setChallengeStatus(message) {
  if (!els.challengeStatus) return;
  els.challengeStatus.textContent = message;
}

function renderChallengePanel() {
  if (!els.challengePanel) return;

  const showPanel = STATE.view === "game" && STATE.competition === "ashes" && isChallengeMode();
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
      ? "Your XI is locked. Copy the Ashes 5-0 invite below and send it to someone else."
      : `Complete your XI in ${playableModeLabel.toLowerCase()} mode to generate an Ashes 5-0 invite link.`;
  els.challengeNameRow.hidden = loadedChallenge;
  els.challengeName.value = loadedChallenge ? "" : STATE.challengeDraftName;
  els.challengeMeta.hidden = !loadedChallenge;
  els.challengeMeta.textContent = loadedChallenge
    ? creatorName
      ? `Challenge created by ${creatorName} · ${playableModeLabel} mode.`
      : `${playableModeLabel} mode challenge.`
    : "";
  els.challengeLink.value = url;
  if (!ready) {
    setChallengeStatus("");
  }
  els.copyChallengeLink.disabled = !ready;
  els.copyChallengeLink.textContent = "Copy invite";
  if (!loadedChallenge && challengeCreatorName && !ready) {
    els.challengeMeta.hidden = false;
    els.challengeMeta.textContent = `Invite will be shared as ${challengeCreatorName} · ${playableModeLabel} mode.`;
  }
}

function renderSeriesSummary() {
  if (!STATE.series) return;
  const competition = competitionConfig();
  const completed = seriesComplete();
  const revealedAll = STATE.series.revealed >= STATE.series.matches.length;
  const resultLoaded = resultSnapshotLoaded();
  const canSendBack = completed && (challengeLineupLoaded() || resultLoaded);
  const sendTarget = currentChallengeSendTarget();
  els.seriesProgress.textContent = `${STATE.series.revealed} / ${STATE.series.matches.length} ${competition.seriesProgressLabel}`;
  els.seriesStatus.textContent = completed
    ? "Series complete"
    : STATE.series.revealed === 0
      ? "Ready to simulate"
      : "Simulation in progress";
  els.backBuilder.textContent = resultLoaded ? "Home" : "Back to XI";
  els.seriesUserStrength.textContent = `${STATE.series.userTeam.overall} · ${STATE.series.userTeam.grade}`;
  els.seriesStarStrength.textContent = `${STATE.series.starTeam.overall} · ${STATE.series.starTeam.grade}`;
  els.seriesUserLabel.textContent = currentSeriesUserLabel();
  els.seriesOppositionLabel.textContent = competition.oppositionShortTitle;
  els.seriesActions.hidden = !completed;
  els.seriesControlsPanel.hidden = resultLoaded || completed;
  els.sendResultBack.hidden = !canSendBack;
  els.sendResultBack.textContent = sendTarget ? `Send result back to ${sendTarget}` : "Send result back";
  if (els.challengeBack) {
    els.challengeBack.hidden = !completed || (!challengeLineupLoaded() && !resultLoaded);
  }
  els.playAgain.classList.toggle("primary", !canSendBack);
  els.playAgain.classList.toggle("secondary", canSendBack);
  els.sendResultBack.classList.toggle("primary", canSendBack);
  els.sendResultBack.classList.toggle("secondary", !canSendBack);
  els.shareResult.textContent = canSendBack ? "Share result" : "Share to X";
  els.copyLink.textContent = canSendBack ? "Copy result link" : "Copy link";
  els.downloadShare.textContent = canSendBack ? "Download result image" : "Download image";
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

  els.seriesTableWrap.innerHTML = `
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
  renderSeriesFeed();
  renderSeriesTable();
  renderStarLineup();
  renderSeriesInsights();
  renderSeriesReveal();
}

function renderAll() {
  syncSeoMetadata();
  renderStats();
  renderView();
  renderGameMeta();
  renderDraftMeter();
  renderChallengePanel();
  renderRoster();
  renderBoard();
  renderSeries();
}

function rollSquad() {
  if (STATE.view !== "game" || STATE.currentSquad || lineupComplete() || STATE.rollAnimation?.active) return;

  const pool = STATE.squads.filter(squadHasAvailablePlayer);
  const chosen = randomChoice(pool.length ? pool : STATE.squads);
  if (!chosen) return;

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

function sampleOutcome(userTeam, starTeam) {
  const edge = userTeam.overall - starTeam.overall;

  const drawChance = clamp(0.24 - Math.abs(edge) / 500, 0.08, 0.27);

  const winChance =
    (1 - drawChance) *
    (1 / (1 + Math.exp(-edge / 40)));

  const roll = Math.random();

  if (roll < winChance) return "win";
  if (roll < winChance + drawChance) return "draw";
  return "loss";
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

function teamBowlingRanking(lineup, teamEdge = 0) {
  return [...lineup]
    .map((player) => {
      const roleBoost = player.roles.includes("Fast Bowler")
        ? 8
        : player.roles.includes("Spinner")
          ? 7
          : player.roles.includes("All-rounder")
            ? 4
            : 0;

      const noise = normalRandom() * 22;

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

function teamBattingRanking(lineup, teamEdge = 0) {
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

      const noise = normalRandom() * 18;

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

function formatBowlingFigures(player, teamEdge = 0) {
  const bowling = player?.bowling ?? 50;

  const wickets = clamp(
    Math.round(0.5 + bowling / 22 + Math.random() * 3 + teamEdge / 20),
    0,
    7
  );

  const runs = clamp(
    Math.round(
      35 +
      (100 - bowling) * 0.5 +
      Math.random() * 35 -
      wickets * 4 -
      teamEdge * 0.5
    ),
    12,
    140
  );

  return `${wickets}/${runs}`;
}

function simulateBoxScore(lineup, teamEdge = 0) {
  const topBatter = weightedPick(lineup, (player) => {
    const roleBoost = player.roles.includes("Opener")
      ? 1.15
      : player.roles.includes("Top Order")
        ? 1.12
        : player.roles.includes("Middle Order")
          ? 1.08
          : 1;

    return Math.max(1, player.batting ** 2 * roleBoost);
  });

  const topBowler = weightedPick(lineup, (player) => {
    const roleBoost = player.roles.includes("Fast Bowler")
      ? 1.2
      : player.roles.includes("Spinner")
        ? 1.15
        : player.roles.includes("All-rounder")
          ? 0.85
          : 0.25;

    return Math.max(1, player.bowling ** 2 * roleBoost);
  });

  return {
    batter: {
      name: topBatter?.name ?? "Unknown",
      runs: clamp(
        Math.round(
          (topBatter?.batting ?? 50) * 0.85 +
          normalRandom() * 75 +
          teamEdge * 0.8
        ),
        18,
        190
      ),
    },
    bowler: {
      name: topBowler?.name ?? "Unknown",
      figures: formatBowlingFigures(topBowler ?? { bowling: 50 }, teamEdge),
    },
  };
}

function battingOrder(lineup, teamEdge = 0) {
  return teamBattingRanking(lineup, teamEdge).map((item) => item.player);
}

function sampleBatterScore(player, bowlingStrength, pitch, inningsIndex) {
  const batting = player?.batting ?? 45;
  const experience = player?.experience ?? 50;

  const pitchDifficulty = {
    flat: -10,
    balanced: 0,
    green: 12,
    turning: 8,
    deteriorating: 18,
  }[pitch] ?? 0;

  const inningsDifficulty = [0, 3, 6, 14][inningsIndex - 1] ?? 0;

  const mean = clamp(
    22 + batting * 0.55 + experience * 0.12 - bowlingStrength * 0.35 - pitchDifficulty - inningsDifficulty,
    4,
    95
  );

  const duckChance = clamp(0.16 - batting / 900 + pitchDifficulty / 220, 0.04, 0.25);

  if (Math.random() < duckChance) {
    return Math.floor(Math.random() * 6);
  }

  const volatility = 0.95;
  const logMean = Math.log(mean) - (volatility * volatility) / 2;
  const score = Math.exp(logMean + normalRandom() * 6 * volatility);

  return clamp(Math.round(score), 0, 260);
}

function shouldDeclare(runs, wickets, inningsIndex, lead = 0) {
  if (!(inningsIndex === 1 || inningsIndex === 3)) return false;
  if (wickets >= 9) return false;

  if (inningsIndex === 1) {
    return runs >= 500 && Math.random() < 0.25;
  }

  if (inningsIndex === 3) {
    return runs + lead >= 380 && wickets <= 8 && Math.random() < 0.45;
  }

  return false;
}

function simulateInnings(lineup, opposition, inningsIndex, conditions = {}, chaseTarget = null, firstInningsLead = 0) {
  const order = battingOrder(lineup);
  const bowlingStrength = lineupScore(opposition).bowling;
  const pitch = conditions.pitch ?? "balanced";

  let runs = 0;
  let wickets = 0;
  let declared = false;

  for (let i = 0; i < order.length; i += 1) {
    runs += sampleBatterScore(order[i], bowlingStrength, pitch, inningsIndex);
    runs += Math.round(Math.random() * 7); // extras

    if (chaseTarget !== null && runs >= chaseTarget) {
      return {
        runs,
        wickets,
        declared: false,
        chaseComplete: true,
      };
    }

    wickets += 1;

    if (shouldDeclare(runs, wickets, inningsIndex, firstInningsLead)) {
      declared = true;
      break;
    }

    if (wickets >= 10) break;
  }

  return {
    runs,
    wickets,
    declared,
    chaseComplete: false,
  };
}

function buildDidNotBatInnings(lineup) {
  return {
    batters: battingOrder(lineup).map((player) => ({
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

function buildLimitedOversBattingScorecard(lineup, opposition, inningsIndex, conditions = {}, chaseTarget = null, oversLimit = 50) {
  const order = battingOrder(lineup);
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

    const rawRuns = sampleBatterScore(player, bowlingStrength, pitch, inningsIndex);
    const batting = player?.batting ?? 45;
    const aggression = player.roles.includes("Opener")
      ? 1.15
      : player.roles.includes("Top Order")
        ? 1.08
        : player.roles.includes("Middle Order")
          ? 1.0
          : player.roles.includes("All-rounder")
            ? 0.95
            : 0.88;
    const pressure = clamp(0.82 + ballsRemaining / maxBalls * 0.28, 0.82, 1.1);
    const adjustedRuns = clamp(
      Math.round(rawRuns * aggression * pressure * 0.9 + batting * 0.08 + normalRandom() * 5),
      0,
      180,
    );
    const balls = clamp(
      Math.round(4 + adjustedRuns * (0.58 + Math.random() * 0.34) + (100 - batting) * 0.03),
      1,
      ballsRemaining,
    );

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

function buildLimitedOversBowlingScorecard(lineup, inningsBalls, wickets, teamEdge = 0) {
  const ranked = teamBowlingRanking(lineup, teamEdge);
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
    const ballShare = bowler.balls / (totalOvers * 6);
    bowler.runs = clamp(
      Math.round(inningsBalls * ballShare + (100 - bowler.player.bowling) * 0.18 + Math.random() * 6),
      0,
      Math.max(0, inningsBalls + 18),
    );
    bowler.maidens = clamp(
      Math.round(bowler.balls / 30 + (bowler.player.bowling - 50) / 30 + Math.random() * 1.2),
      0,
      10,
    );
  });

  return working
    .map((bowler) => ({
      name: bowler.name,
      overs: ballsToOvers(bowler.balls),
      maidens: bowler.maidens,
      runs: bowler.runs,
      wickets: bowler.wickets,
    }))
    .sort((a, b) => b.wickets - a.wickets || a.runs - b.runs);
}

function simulateTestMatch(userLineup, starLineup, conditions = {}) {
  const user1 = buildBattingScorecard(userLineup, starLineup, 1, conditions);
  const star1 = buildBattingScorecard(starLineup, userLineup, 2, conditions);

  const userLead = user1.total - star1.total;
  const user2 = buildBattingScorecard(userLineup, starLineup, 3, conditions, null, userLead);

  const target = user1.total + user2.total - star1.total + 1;
  const star2 = target <= 0
    ? {
        batters: battingOrder(starLineup).map((player) => ({
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
    : buildBattingScorecard(starLineup, userLineup, 4, conditions, target);

  const user1Bowling = buildBowlingScorecard(starLineup, user1.total, user1.wickets, 0);
  const star1Bowling = buildBowlingScorecard(userLineup, star1.total, star1.wickets, 0);
  const user2Bowling = buildBowlingScorecard(starLineup, user2.total, user2.wickets, userLead);
  const star2Bowling = target <= 0 ? [] : buildBowlingScorecard(userLineup, star2.total, star2.wickets, -userLead);

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
  const user1 = buildLimitedOversBattingScorecard(userLineup, starLineup, 1, conditions, null, 50);
  const star1 = buildLimitedOversBattingScorecard(starLineup, userLineup, 2, conditions, null, 50);
  const user1Bowling = buildLimitedOversBowlingScorecard(starLineup, user1.balls, user1.wickets, 0);
  const star1Bowling = buildLimitedOversBowlingScorecard(userLineup, star1.balls, star1.wickets, user1.total - star1.total);

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
      user2: buildDidNotBatInnings(userLineup),
      star2: buildDidNotBatInnings(starLineup),
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
  if (!lineupComplete() || challengeCreationMode()) return;
  clearTimer();
  const competition = competitionConfig();
  try {
    STATE.achievementDetail = null;
    STATE.achievementPinned = false;
    STATE.result = null;
    STATE.seriesShareAsset = null;
    STATE.seriesShareAssetPromise = null;
    clearResultUrlFromBrowser();
    STATE.series = buildSeries();
    if (!challengeLineupLoaded()) {
      prepareSeriesShareAsset(STATE.series, modeLabel(), competitionConfig().title, competitionConfig().theme);
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
    renderAll();
    return;
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
    renderAll();
    return;
  }
  renderSeries();
}

function goHome() {
  clearTimer();
  clearRollAnimation();
  STATE.view = "home";
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
  setShareStatus("");
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  renderAll();
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
  setShareStatus("");
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  addCatalogMetadata();
  renderAll();
}

function resetBuilder() {
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
  setShareStatus("");
  STATE.view = "game";
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  renderAll();
}

function wireControls() {
  els.playGame.addEventListener("click", () => {
    if (challengeLineupLoaded()) {
      STATE.challengeResponseName = normalizeChallengeCreatorName(els.homeResponseName.value);
      trackChallengeEvent("challenge_accepted", { role: "recipient", source: "invite" });
      trackChallengeEvent("challenge_started", { role: "recipient", source: "invite" });
    }
    STATE.view = "game";
    renderAll();
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
  els.homeChallenge.addEventListener("click", () => {
    trackChallengeEvent("challenge_create_clicked", { role: "creator", source: "homepage" });
    trackChallengeEvent("challenge_started", { role: "creator", source: "homepage" });
    STATE.challengeDraftMode = normalizePlayableMode(STATE.mode);
    STATE.mode = "challenge";
    STATE.view = "game";
    renderAll();
  });
  els.homeCompetition.addEventListener("click", () => {
    STATE.view = "home";
    setCompetition(STATE.competition === "worldcup" ? "ashes" : "worldcup");
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
      setChallengeStatus("");
      renderAll();
      return;
    }

    STATE.mode = normalizePlayableMode(els.homeMode.value);
    renderAll();
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
    } catch (error) {
      console.error("Share action failed:", error);
      setShareStatus("Could not prepare the share.");
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
  if (resultSnapshotLoaded()) return currentResultUrl();
  return challengeLineupLoaded() ? currentChallengeUrl() : canonicalUrlForCurrentPage();
}

function canonicalUrlForCurrentPage() {
  if (resultSnapshotLoaded()) {
    return resultUrlForRecord(STATE.result, CANONICAL_SITE_ORIGIN);
  }

  if (challengeLineupLoaded()) {
    return challengeUrlForLineup(
      STATE.challenge.lineup,
      loadedChallengeCreatorName(),
      currentChallengePlayableMode(),
      CANONICAL_SITE_ORIGIN,
    );
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
    content: resultDescription ?? challengeDescription,
  });
  ensureHeadNode('meta[property="og:title"]', "meta", {
    property: "og:title",
    content: resultTitle ?? challengeTitle ?? SEO_HOME_TITLE,
  });
  ensureHeadNode('meta[property="og:description"]', "meta", {
    property: "og:description",
    content: resultDescription ?? challengeDescription,
  });
  ensureHeadNode('meta[name="robots"]', "meta", {
    name: "robots",
    content: resultLoaded ? "noindex, follow" : "index, follow",
  });
}

function pageTitleForCompetition(competition) {
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

  return competition.theme === "worldcup"
    ? "Historic Cricket XI Draft Game | World Cup Mode | Ashes 5-0"
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

async function createSeriesShareFile(series, modeLabel, competitionTitle, competitionTheme) {
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

  const isWorldCup = competitionTheme === "worldcup";
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
  fitCanvasText(ctx, competitionTitle, 700, 66, 42, 800, "Oswald");
  ctx.fillText(competitionTitle, 80, 118);

  const modeText = `${modeLabel} series complete`;
  ctx.fillStyle = palette.textStrong;
  fitCanvasText(ctx, modeText, 560, 28, 18, 600, "Inter");
  ctx.fillText(modeText, 80, 155);

  const resultText =
    series.userWins > series.starWins
      ? `Your XI won the series ${series.userWins}-${series.starWins}-${series.draws}`
      : series.userWins < series.starWins
        ? `Your XI lost the series ${series.userWins}-${series.starWins}-${series.draws}`
        : `The series finished level ${series.userWins}-${series.starWins}-${series.draws}`;
  ctx.fillStyle = palette.accent;
  fitCanvasText(ctx, resultText, 900, 30, 18, 700, "Inter");
  ctx.fillText(resultText, 80, 192);

  const metrics = teamMetricsFromLineup(series.userLineup);
  const metricCards = [
    { label: "Batting", value: metrics.batting },
    { label: "Bowling", value: metrics.bowling },
    { label: "Fielding", value: metrics.fielding },
    { label: "Overall", value: `${metrics.overall} · ${metrics.grade}` },
  ];

  const cardY = 242;
  const cardW = 344;
  const cardH = 112;
  const gap = 20;

  metricCards.forEach((card, index) => {
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
  fitCanvasText(ctx, "Your XI", 380, 28, 18, 800, "Inter");
  ctx.fillText("Your XI", 80, 430);

  ctx.fillStyle = palette.muted;
  fitCanvasText(ctx, "Player ratings", 360, 16, 12, 600, "Inter");
  ctx.fillText("Player ratings", 185, 430);

  const rowsTop = 462;
  const rowHeight = 80;
  const rowGap = 10;
  const rowWidth = width - 160;

  series.userLineup.forEach((player, index) => {
    const y = rowsTop + index * (rowHeight + rowGap);
    const slot = XI_SLOTS[index];
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
    fitCanvasText(ctx, `Bat ${player.batting}  Bowl ${player.bowling}  Field ${player.fielding}`, 310, 16, 12, 600, "Roboto Mono");
    ctx.fillText(`Bat ${player.batting}  Bowl ${player.bowling}  Field ${player.fielding}`, 1120, y + 33);

    ctx.fillStyle = isWorldCup ? "#0c2d57" : "#123524";
    fitCanvasText(ctx, `Overall ${playerOverall(player)}`, 170, 22, 14, 800, "Oswald");
    ctx.fillText(`Overall ${playerOverall(player)}`, 1290, y + 58);
  });

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

  return new File([blob], `${isWorldCup ? "world-cup" : "ashes"}-xi-team.png`, { type: "image/png" });
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

  return new File([blob], "ashes-5-0-challenge-result.png", { type: "image/png" });
}

function prepareSeriesShareAsset(series, modeLabel, competitionTitle, competitionTheme) {
  if (!series || STATE.seriesShareAsset || STATE.seriesShareAssetPromise) return;
  const seriesRef = series;
  STATE.seriesShareAssetPromise = createSeriesShareFile(seriesRef, modeLabel, competitionTitle, competitionTheme)
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
    const competition = competitionConfig();
    prepareSeriesShareAsset(STATE.series, modeLabel(), competition.title, competition.theme);
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
  const url = currentChallengeUrl();
  if (!url) {
    throw new Error("Challenge invite is not ready.");
  }

  await writeTextToClipboard(
    challengeInviteText(url, currentChallengeCreatorName(), currentChallengePlayableMode()),
  );
  trackChallengeEvent("challenge_link_copied", { role: challengeLineupLoaded() ? "recipient" : "creator" });
  setChallengeStatus("Invite copied.");
}

async function copyChallengeResultLink() {
  const result = currentChallengeResultRecord();
  if (!result) {
    throw new Error("Challenge result is not ready.");
  }

  const url = currentResultUrl() || resultUrlForRecord(result);
  await writeTextToClipboard(url);
  trackChallengeEvent("challenge_result_link_copied", {
    role: "recipient",
    source: "series-complete",
    series_result: challengeSeriesOutcome(result),
  });
  setShareStatus("Result link copied.");
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
  link.download = file.name || `${competitionConfig().theme === "worldcup" ? "world-cup" : "ashes"}-xi-team.png`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  setShareStatus("Download started.");
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
  link.download = file.name || "ashes-5-0-challenge-result.png";
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
}

async function shareChallengeResult(source = "series-complete") {
  const result = currentChallengeResultRecord();
  if (!result) {
    throw new Error("Challenge result is not ready.");
  }

  const url = currentResultUrl() || resultUrlForRecord(result);
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
  setShareStatus("Result link copied.");
}

function formatShareText() {
  if (!STATE.series) {
    return `I just played ${competitionConfig().title}. ${shareUrl()}`;
  }

  const seriesResult =
    STATE.series.userWins > STATE.series.starWins
      ? "won"
      : STATE.series.userWins < STATE.series.starWins
        ? "lost"
        : "drew";
  const competition = competitionConfig();
  return `I just finished a ${modeLabel()} ${competition.title} series and ${seriesResult} the ${competition.seriesDescriptor} ${STATE.series.userWins}-${STATE.series.starWins}-${STATE.series.draws}. ${shareUrl()}`;
}

function init() {
  bindElements();
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
      trackChallengeEvent("challenge_link_opened", {
        role: "recipient",
        challenge_mode: normalizePlayableMode(challenge.mode),
        challenge_ref: challengeRefForCode(challenge.code),
        has_creator_name: challenge.creatorName ? "true" : "false",
      });
    }
  }
  addCatalogMetadata();
  syncSeoMetadata();
  wireControls();
  renderAll();
  document.body.classList.add("app-ready");
}

init();
