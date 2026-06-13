import { ASHES_SQUADS } from "./data/ashes-squads.js";

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

const STATE = {
  view: "home",
  squads: ASHES_SQUADS,
  catalog: [],
  lineup: new Map(),
  currentSquad: null,
  selectedPlayerId: null,
  mode: "classic",
  series: null,
  timer: null,
  achievementDetail: null,
  achievementPinned: false,
  achievementHelpBound: false,
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
    totalSquads: "[data-total-squads]",
    totalPlayers: "[data-total-players]",
    homeMode: "[data-home-mode]",
    gameSquadCount: "[data-game-squad-count]",
    gamePlayerCount: "[data-game-player-count]",
    gameMode: "[data-game-mode]",
    currentSquad: "[data-current-squad]",
    lineupStatus: "[data-lineup-status]",
    rosterTitle: "[data-roster-title]",
    rosterSummary: "[data-roster-summary]",
    rosterGrid: "[data-roster-grid]",
    board: "[data-board]",
    rollSquad: "[data-roll-squad]",
    startSeries: "[data-start-series]",
    playGame: "[data-play-game]",
    backHome: "[data-back-home]",
    backBuilder: "[data-back-builder]",
    seriesProgress: "[data-series-progress]",
    seriesStatus: "[data-series-status]",
    seriesUserStrength: "[data-series-user-strength]",
    seriesStarStrength: "[data-series-star-strength]",
    seriesFeed: "[data-series-feed]",
    seriesTableWrap: "[data-series-table-wrap]",
    starLineup: "[data-star-lineup]",
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
    shareResult: "[data-share-result]",
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

function addCatalogMetadata() {
  STATE.catalog = STATE.squads.flatMap((squad) =>
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
  return STATE.mode === "memory" && !seriesComplete() ? "??" : String(value);
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
    const pool = players.filter((player) => !chosen.has(player.id) && slotAcceptsPlayer(slot, player));
    const fallback = pool.length ? pool : players.filter((player) => !chosen.has(player.id));
    const pick = shuffle(fallback).sort((a, b) => playerSlotScore(b, slot) - playerSlotScore(a, slot))[0] ?? null;
    if (pick) {
      lineup.set(index, pick);
      chosen.add(pick.id);
    }
  });

  return buildLineupFromMap(lineup);
}

function buildAllStarXI() {
  const byName = new Map();
  for (const player of STATE.catalog) {
    const key = normalizeName(player.name);
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
  if (!STATE.series) return "Simulation ready";
  if (STATE.series.userWins > STATE.series.starWins) return "Your XI lead the series";
  if (STATE.series.starWins > STATE.series.userWins) return "All-star XI lead the series";
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
  const batters = inningsList.flatMap((innings) => innings?.batting?.batters ?? []);
  return batters.filter((card) => !card.dnb).sort((a, b) => b.runs - a.runs || b.balls - a.balls)[0] ?? null;
}

function bestBowlerFromInnings(inningsList) {
  const bowlers = inningsList.flatMap((innings) => innings?.bowling ?? []).filter((bowler) => bowler && bowler.overs !== "0");
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
  const { user1, star1, user2, star2 } = match.innings;
  const userTotal = user1.total + user2.total;
  const starTotal = star1.total + star2.total;

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
    return `${userWon ? "Your XI" : "All-star XI"} won by ${wicketsLeft} ${pluralize(wicketsLeft, "wicket")}`;
  }

  if (winningSecond.wickets >= 10 && loserTotal > 0) {
    const runsMargin = winnerTotal - loserTotal;
    return `${userWon ? "Your XI" : "All-star XI"} won by ${runsMargin} ${pluralize(runsMargin, "run")}`;
  }

  const inningsMargin = (userWon ? star1.total + star2.total : user1.total + user2.total) - (userWon ? userTotal : starTotal);
  if (inningsMargin > 0) {
    return `${userWon ? "Your XI" : "All-star XI"} won by an innings and ${inningsMargin} ${pluralize(inningsMargin, "run")}`;
  }

  return match.result === "win" ? "Your XI won" : "All-star XI won";
}

function generateHeadline(match) {
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
    return `${topBowl.name} destroys the chase with ${topBowl.wickets} wickets`;
  }

  if (topBat && topBat.runs >= 140) {
    return `${topBat.name}'s ${topBat.runs} seals the Test`;
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

  const completed = seriesComplete();
  const leaders = collectSeriesStats(STATE.series);
  const achievements = completed ? buildAchievementList(STATE.series, leaders) : [];
  const userMetrics = teamMetricsFromLineup(STATE.series.userLineup);
  const starMetrics = teamMetricsFromLineup(STATE.series.starLineup);
  const strengthPercent = clamp(Math.round(50 + (userMetrics.overall - 60) * 2.2), 1, 99);
  const playerOfSeries = leaders.overallLeader
    ? `${leaders.overallLeader.name} (${leaders.overallLeader.side === "your" ? "Your XI" : "All-star XI"})`
    : "Awaiting";

  els.seriesInsights.innerHTML = `
    <div class="insights-grid">
      <article class="insight-card insight-primary">
        <span class="insight-label">Team grade</span>
        <strong>Overall ${userMetrics.overall} · ${userMetrics.grade}</strong>
        <p>Batting ${userMetrics.batting} · Bowling ${userMetrics.bowling} · Fielding ${userMetrics.fielding}</p>
      </article>
      <article class="insight-card">
        <span class="insight-label">XI rating</span>
        <strong>Your XI is stronger than ${strengthPercent}% of generated XIs</strong>
        <p>All-star XI: ${starMetrics.overall} overall · ${starMetrics.grade}</p>
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
  els.totalSquads.textContent = String(STATE.squads.length);
  els.totalPlayers.textContent = String(STATE.catalog.length);
  els.gameSquadCount.textContent = `${STATE.squads.length} squads`;
  els.gamePlayerCount.textContent = `${STATE.catalog.length} players`;
  els.homeMode.value = STATE.mode;
}

function renderView() {
  els.homeView.hidden = STATE.view !== "home";
  els.gameView.hidden = STATE.view !== "game";
  els.seriesView.hidden = STATE.view !== "series";
  document.body.dataset.view = STATE.view;
}

function renderGameMeta() {
  els.gameMode.textContent = STATE.mode === "memory" ? "Memory" : "Classic";
  els.currentSquad.textContent = currentSquadLabel();
  els.lineupStatus.textContent = `${STATE.lineup.size} / ${XI_SLOTS.length} locked`;
  els.startSeries.hidden = STATE.view !== "game";
  els.startSeries.disabled = !lineupComplete() || STATE.view !== "game";
  els.startSeries.textContent = lineupComplete()
    ? "Simulate the series"
    : `Fill XI to simulate (${STATE.lineup.size}/11)`;
  els.rollSquad.disabled = STATE.view !== "game" || lineupComplete() || Boolean(STATE.currentSquad);
}

function renderRoster() {
  const players = STATE.currentSquad?.players ?? [];
  const selected = STATE.catalog.find((player) => player.id === STATE.selectedPlayerId) ?? null;

  els.rosterTitle.textContent = STATE.currentSquad ? STATE.currentSquad.label : "No squad rolled yet";
  if (!STATE.currentSquad) {
    els.rosterSummary.textContent = lineupComplete()
      ? "Your XI is complete. Start the series."
      : STATE.lineup.size
        ? "A player has been locked. Roll another squad to continue."
        : "Roll an Ashes squad to begin.";
  } else if (selected) {
    els.rosterSummary.textContent = `${selected.name} is selected. Pick a valid slot to lock them in.`;
  } else {
    els.rosterSummary.textContent = `${players.length} players available. Click one, then choose a slot.`;
  }

  if (!players.length) {
    els.rosterGrid.innerHTML = `
      <div class="placeholder">
        ${
          lineupComplete()
            ? "XI complete. Simulate the series."
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
      STATE.selectedPlayerId = STATE.selectedPlayerId === playerId ? null : playerId;
      renderRoster();
      renderBoard();
    });
  });
}

function renderBoard() {
  const selected = STATE.catalog.find((player) => player.id === STATE.selectedPlayerId) ?? null;

  els.board.innerHTML = `
    <div class="board-grid">
      ${XI_SLOTS.map((slot, index) => {
        const player = STATE.lineup.get(index) ?? null;
        const canAccept = selected ? slotAcceptsPlayer(slot, selected) : false;
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
      STATE.selectedPlayerId = null;
      STATE.currentSquad = null;
      renderAll();
    });
  });
}

function renderSeriesSummary() {
  if (!STATE.series) return;
  const completed = seriesComplete();
  els.seriesProgress.textContent = `${STATE.series.revealed} / ${STATE.series.matches.length} Tests`;
  els.seriesStatus.textContent = completed ? "Series complete" : seriesWinnerLabel();
  els.seriesUserStrength.textContent = `${STATE.series.userTeam.overall} · ${STATE.series.userTeam.grade}`;
  els.seriesStarStrength.textContent = `${STATE.series.starTeam.overall} · ${STATE.series.starTeam.grade}`;
  els.seriesActions.hidden = !completed;
}

function renderSeriesFeed() {
  if (!STATE.series) return;
  const visible = STATE.series.matches.slice(0, STATE.series.revealed);
  els.seriesFeed.innerHTML = visible
    .map((match) => {
      const resultClass =
        match.result === "win" ? "result-win" : match.result === "loss" ? "result-loss" : "result-draw";
      return `
        <article class="match-card ${resultClass}">
          <div class="match-meta">Test ${match.testNumber} · ${match.venue}</div>
          <div class="match-row">
            <span class="match-team">Your XI</span>
            <strong class="match-score">${escapeHtml(match.scoreline)}</strong>
            <span class="match-team">All-star XI</span>
          </div>
          <div class="match-headline">${escapeHtml(match.headline)}</div>
          <div class="match-summary">${escapeHtml(match.summary)}</div>
          <div class="innings-grid">
            ${match.innings
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
              <span class="box-heading">Your XI</span>
              <span>Top bat: ${escapeHtml(match.userBox.batter.name)} ${escapeHtml(String(match.userBox.batter.runs))}</span>
              <span>Top bowl: ${escapeHtml(match.userBox.bowler.name)} ${escapeHtml(match.userBox.bowler.figures)}</span>
            </div>
            <div class="box-team">
              <span class="box-heading">All-star XI</span>
              <span>Top bat: ${escapeHtml(match.starBox.batter.name)} ${escapeHtml(String(match.starBox.batter.runs))}</span>
              <span>Top bowl: ${escapeHtml(match.starBox.bowler.name)} ${escapeHtml(match.starBox.bowler.figures)}</span>
            </div>
          </div>
          <details class="scorecard-toggle">
            <summary>Full scorecard</summary>
            <div class="scorecard-stack">
              ${renderDetailedInnings(match, match.inningsData.user1, "Your XI 1st innings")}
              ${renderDetailedInnings(match, match.inningsData.star1, "All-star XI 1st innings")}
              ${renderDetailedInnings(match, match.inningsData.user2, "Your XI 2nd innings")}
              ${renderDetailedInnings(match, match.inningsData.star2, "All-star XI 2nd innings")}
            </div>
          </details>
        </article>
      `;
    })
    .join("");
}

function renderSeriesTable() {
  if (!STATE.series) return;
  if (STATE.series.revealed < STATE.series.matches.length) {
    els.seriesTableWrap.innerHTML = `<div class="placeholder">The table will appear when the series ends.</div>`;
    return;
  }

  const { userWins, starWins, draws } = STATE.series;
  const winner =
    userWins > starWins ? "Your XI" : starWins > userWins ? "All-star XI" : "Series drawn";

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
        <tr class="${winner === "Your XI" ? "highlight" : ""}">
          <td>Your XI</td>
          <td>${userWins}</td>
          <td>${draws}</td>
          <td>${starWins}</td>
        </tr>
        <tr class="${winner === "All-star XI" ? "highlight" : ""}">
          <td>All-star XI</td>
          <td>${starWins}</td>
          <td>${draws}</td>
          <td>${userWins}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderStarLineup() {
  if (!STATE.series) return;
  const revealRatings = seriesComplete() || STATE.mode !== "memory";
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
}

function renderSeriesReveal() {
  if (!STATE.series || !els.seriesReveal || !els.seriesRevealGrid) return;
  const showReveal = STATE.mode === "memory" && seriesComplete();
  els.seriesReveal.hidden = !showReveal;

  if (!showReveal) {
    els.seriesRevealGrid.innerHTML = "";
    return;
  }

  const revealRatings = seriesComplete() || STATE.mode !== "memory";
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
    ${buildSide("Your XI", STATE.series.userLineup, teamMetricsFromLineup(STATE.series.userLineup), "your-side")}
    ${buildSide("All-star XI", STATE.series.starLineup, teamMetricsFromLineup(STATE.series.starLineup), "star-side")}
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
  renderStats();
  renderView();
  renderGameMeta();
  renderDraftMeter();
  renderRoster();
  renderBoard();
  renderSeries();
}

function rollSquad() {
  if (STATE.view !== "game" || STATE.currentSquad || lineupComplete()) return;
  const pool = STATE.squads.filter(squadHasAvailablePlayer);
  const chosen = randomChoice(pool.length ? pool : STATE.squads);
  STATE.currentSquad = chosen ? decorateSquad(chosen) : null;
  STATE.selectedPlayerId = null;
  renderAll();
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

function simulateMatch(userLineup, starLineup, conditions = {}) {
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
    innings: { user1, star1, user2, star2 },
    userTotal,
    starTotal,
  };
}

function buildSeries() {
  const userLine = userLineup();
  const starLine = buildAllStarXI();
  const userTeam = teamMetricsFromLineup(userLine);
  const starTeam = teamMetricsFromLineup(starLine);
  const matches = [];
  let userWins = 0;
  let starWins = 0;
  let draws = 0;

  for (let testNumber = 1; testNumber <= 5; testNumber += 1) {
    const conditions = {
      pitch: testNumber % 2 === 1 ? "green" : "balanced",
    };

    const match = simulateMatch(userLine, starLine, conditions);

    const outcome = match.result;

    if (outcome === "win") userWins += 1;
    else if (outcome === "loss") starWins += 1;
    else draws += 1;

    const userInnings1 = match.innings.user1;
    const starInnings1 = match.innings.star1;
    const userInnings2 = match.innings.user2;
    const starInnings2 = match.innings.star2;

    matches.push({
      testNumber,
      venue: testNumber % 2 === 1 ? "Home conditions" : "Balanced conditions",
      result: outcome,
      summary: matchMarginText(match),
      headline: generateHeadline(match),
      innings: [
        { label: "Your XI 1st inns", score: inningsScoreLabel(userInnings1) },
        { label: "All-star XI 1st inns", score: inningsScoreLabel(starInnings1) },
        { label: "Your XI 2nd inns", score: inningsScoreLabel(userInnings2) },
        { label: "All-star XI 2nd inns", score: inningsScoreLabel(starInnings2) },
      ],
      scoreline: `${inningsScoreLabel(userInnings1)} & ${inningsScoreLabel(userInnings2)} | ${inningsScoreLabel(starInnings1)} & ${inningsScoreLabel(starInnings2)}`,
      inningsData: {
        user1: buildInningsSummary("Your XI 1st innings", userInnings1, match.innings.user1.bowling),
        star1: buildInningsSummary("All-star XI 1st innings", starInnings1, match.innings.star1.bowling),
        user2: buildInningsSummary("Your XI 2nd innings", userInnings2, match.innings.user2.bowling),
        star2: buildInningsSummary("All-star XI 2nd innings", starInnings2, match.innings.star2.bowling),
      },
    });

    const matchRecord = matches[matches.length - 1];
    matchRecord.userBox = buildMatchBoxScore({
      batting: [matchRecord.inningsData.user1, matchRecord.inningsData.user2],
      bowling: [matchRecord.inningsData.star1, matchRecord.inningsData.star2],
    });
    matchRecord.starBox = buildMatchBoxScore({
      batting: [matchRecord.inningsData.star1, matchRecord.inningsData.star2],
      bowling: [matchRecord.inningsData.user1, matchRecord.inningsData.user2],
    });
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
  if (!lineupComplete()) return;
  clearTimer();
  try {
    STATE.achievementDetail = null;
    STATE.achievementPinned = false;
    STATE.series = buildSeries();
    STATE.view = "series";
    renderAll();
    animateSeries();
  } catch (error) {
    console.error("Ashes XI series failed to start:", error);
    STATE.series = null;
    els.seriesStatus.textContent = `Series error: ${error instanceof Error ? error.message : String(error)}`;
    STATE.view = "game";
    renderAll();
    window.alert(`Series could not start: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function animateSeries() {
  if (!STATE.series) return;
  clearTimer();
  STATE.series.revealed = 0;
  els.seriesFeed.innerHTML = "";
  els.seriesTableWrap.innerHTML = `<div class="placeholder">The series table will appear when the series ends.</div>`;
  renderSeries();

  const tick = () => {
    if (!STATE.series || STATE.view !== "series") return;
    STATE.series.revealed += 1;
    renderSeries();

    if (STATE.series.revealed >= STATE.series.matches.length) {
      clearTimer();
      renderSeries();
      return;
    }

    STATE.timer = setTimeout(tick, 700);
  };

  STATE.timer = setTimeout(tick, 500);
}

function goHome() {
  clearTimer();
  STATE.view = "home";
  STATE.lineup.clear();
  STATE.currentSquad = null;
  STATE.selectedPlayerId = null;
  STATE.series = null;
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  renderAll();
}

function goBuilder() {
  clearTimer();
  STATE.view = "game";
  STATE.series = null;
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  renderAll();
}

function resetBuilder() {
  clearTimer();
  STATE.lineup.clear();
  STATE.currentSquad = null;
  STATE.selectedPlayerId = null;
  STATE.series = null;
  STATE.view = "game";
  STATE.achievementDetail = null;
  STATE.achievementPinned = false;
  renderAll();
}

function wireControls() {
  els.playGame.addEventListener("click", () => {
    STATE.view = "game";
    renderAll();
  });
  els.backHome.addEventListener("click", goHome);
  els.backBuilder.addEventListener("click", goBuilder);
  els.rollSquad.addEventListener("click", rollSquad);
  els.startSeries.addEventListener("click", startSeries);
  els.playAgain.addEventListener("click", goHome);
  els.shareResult.addEventListener("click", () => {
    if (!STATE.series) return;
    window.open(
      `https://x.com/intent/post?text=${encodeURIComponent(formatShareText())}`,
      "_blank",
      "noopener,noreferrer",
    );
  });
  els.resetBuilder.addEventListener("click", resetBuilder);

  els.homeMode.addEventListener("change", () => {
    STATE.mode = els.homeMode.value === "memory" ? "memory" : "classic";
    renderAll();
  });

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
          pageUrl: window.location.href,
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
  const url = new URL(window.location.href);
  url.hash = "";
  return url.toString();
}

function formatShareText() {
  if (!STATE.series) {
    return `I just played Ashes XI. ${shareUrl()}`;
  }

  const seriesResult =
    STATE.series.userWins > STATE.series.starWins
      ? "won"
      : STATE.series.userWins < STATE.series.starWins
        ? "lost"
        : "drew";
  const modeLabel = STATE.mode === "memory" ? "Memory" : "Classic";
  return `I just finished an ${modeLabel} Ashes XI series and ${seriesResult} the 5-Test set ${STATE.series.userWins}-${STATE.series.starWins}-${STATE.series.draws}. ${shareUrl()}`;
}

function init() {
  bindElements();
  addCatalogMetadata();
  wireControls();
  renderAll();
}

init();
