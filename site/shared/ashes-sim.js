function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function createSeededRandom(seedText) {
  let seed = 1779033703 ^ String(seedText ?? "").length;
  for (let index = 0; index < String(seedText ?? "").length; index += 1) {
    seed = Math.imul(seed ^ String(seedText)[index].charCodeAt(0), 3432918353);
    seed = (seed << 13) | (seed >>> 19);
  }

  return () => {
    seed = Math.imul(seed ^ (seed >>> 16), 2246822507);
    seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
    seed ^= seed >>> 16;
    return (seed >>> 0) / 4294967296;
  };
}

function normalRandom(rng) {
  return (
    rng() +
    rng() +
    rng() +
    rng() +
    rng() +
    rng()
  ) / 6 - 0.5;
}

function randomChoice(values, rng) {
  if (!values.length) return null;
  return values[Math.floor(rng() * values.length)];
}

function weightedPick(items, getWeight, rng) {
  const total = items.reduce((sum, item) => sum + Math.max(0, getWeight(item)), 0);
  let roll = rng() * total;

  for (const item of items) {
    roll -= Math.max(0, getWeight(item));
    if (roll <= 0) return item;
  }

  return items[items.length - 1];
}

function pluralize(value, singular, plural = `${singular}s`) {
  return value === 1 ? singular : plural;
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

export function teamMetricsFromLineup(lineup) {
  const score = lineupScore(lineup);
  const batting = clamp(Math.round(score.batting), 0, 99);
  const bowling = clamp(Math.round(score.bowling), 0, 99);
  const fielding = clamp(Math.round(score.fielding), 0, 99);
  const overall = clamp(Math.round(score.power), 0, 99);
  return {
    batting,
    bowling,
    fielding,
    overall,
    grade: gradeFromOverall(overall),
  };
}

function ballsToOvers(balls) {
  const overs = Math.floor(balls / 6);
  const remainder = balls % 6;
  return remainder === 0 ? `${overs}` : `${overs}.${remainder}`;
}

function teamBowlingRanking(lineup, teamEdge, rng, noiseScale = 22) {
  return [...lineup]
    .map((player) => {
      const roleBoost = bowlingRoleBoost(player);
      const noise = normalRandom(rng) * noiseScale;

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
    .sort((left, right) => right.value - left.value);
}

function teamBattingRanking(lineup, teamEdge, rng, noiseScale = 18) {
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

      const noise = normalRandom(rng) * noiseScale;

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
    .sort((left, right) => right.value - left.value);
}

function buildMatchPlan(lineup, rng) {
  return {
    battingOrder: teamBattingRanking(lineup, 0, rng, 7).map((item) => item.player),
    bowlingRanks: teamBowlingRanking(lineup, 0, rng, 8),
  };
}

function battingOrder(lineup, teamEdge, rng) {
  return teamBattingRanking(lineup, teamEdge, rng).map((item) => item.player);
}

function sampleBatterScore(player, bowlingStrength, pitch, inningsIndex, rng) {
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
    95,
  );

  const duckChance = clamp(0.16 - batting / 900 + pitchDifficulty / 220, 0.04, 0.25);

  if (rng() < duckChance) {
    return Math.floor(rng() * 6);
  }

  const volatility = 0.95;
  const logMean = Math.log(mean) - (volatility * volatility) / 2;
  const score = Math.exp(logMean + normalRandom(rng) * 6 * volatility);

  return clamp(Math.round(score), 0, 260);
}

function sampleLimitedOversBatterOutcome(
  player,
  bowlingStrength,
  pitch,
  inningsIndex,
  wickets,
  currentRuns,
  extras,
  chaseTarget,
  ballsRemaining,
  maxBalls,
  rng,
) {
  const batting = player?.batting ?? 45;
  const experience = player?.experience ?? 50;
  const phase = 1 - ballsRemaining / Math.max(1, maxBalls);
  const pitchModifier = {
    flat: 8,
    balanced: 0,
    green: -8,
    turning: -5,
    deteriorating: -7,
  }[pitch] ?? 0;
  const roleAggression = player.roles.includes("Opener")
    ? 1.15
    : player.roles.includes("Top Order")
      ? 1.08
      : player.roles.includes("Middle Order")
        ? 1
        : player.roles.includes("All-rounder")
          ? 0.98
          : 0.9;
  const wicketPressure = wickets >= 6 ? -16 : wickets >= 4 ? -8 : 0;
  const requiredRate =
    chaseTarget === null
      ? 5.6
      : (Math.max(0, chaseTarget - (currentRuns + extras)) * 6) / Math.max(1, ballsRemaining);
  const strikeRate = clamp(
    70 +
      batting * 0.42 +
      experience * 0.05 -
      bowlingStrength * 0.2 +
      pitchModifier +
      phase * 18 +
      (roleAggression - 1) * 48 +
      (requiredRate - 5.6) * 6 +
      wicketPressure +
      normalRandom(rng) * 16,
    45,
    172,
  );
  const ballIntent = player.roles.includes("Opener")
    ? 34
    : player.roles.includes("Top Order")
      ? 28
      : player.roles.includes("Middle Order")
        ? 20
        : player.roles.includes("All-rounder")
          ? 15
          : 11;
  const plannedBalls = clamp(
    Math.round(
      ballIntent * (0.56 + batting / 180) * (1 - phase * 0.45) +
        experience * 0.05 +
        normalRandom(rng) * 7,
    ),
    1,
    ballsRemaining,
  );
  const duckChance = clamp(
    0.14 - batting / 1000 - experience / 2800 + Math.max(0, bowlingStrength - batting) / 850 + (requiredRate > 7 ? 0.015 : 0),
    0.03,
    0.24,
  );

  if (rng() < duckChance) {
    return {
      runs: clamp(Math.floor(rng() * 4), 0, 6),
      balls: clamp(Math.round(1 + rng() * 6), 1, ballsRemaining),
    };
  }

  return {
    runs: clamp(Math.round(plannedBalls * strikeRate / 100 + normalRandom(rng) * 5), 0, 180),
    balls: plannedBalls,
  };
}

function shouldDeclare(runs, wickets, inningsIndex, lead, rng) {
  if (!(inningsIndex === 1 || inningsIndex === 3)) return false;
  if (wickets >= 9) return false;

  if (inningsIndex === 1) {
    return runs >= 500 && rng() < 0.25;
  }

  if (inningsIndex === 3) {
    return runs + lead >= 380 && wickets <= 8 && rng() < 0.45;
  }

  return false;
}

function estimateInningsBalls(batters, extras, wickets, rng, maxBalls = null) {
  const strikerBalls = batters.reduce((sum, card) => sum + (card.dnb ? 0 : card.balls), 0);
  const extraBalls = clamp(Math.round(extras * 0.35 + wickets * 0.8 + Math.max(0, normalRandom(rng) * 8)), 0, 18);
  const estimated = strikerBalls + extraBalls;
  if (maxBalls !== null) return clamp(estimated, 0, maxBalls);
  if (estimated === 0) return 0;
  return clamp(estimated, 60, 540);
}

function buildBattingScorecard(
  lineup,
  opposition,
  inningsIndex,
  conditions,
  rng,
  chaseTarget = null,
  firstInningsLead = 0,
  options = {},
) {
  const order = options.battingOrder ?? battingOrder(lineup, 0, rng);
  const battingStrength = lineupScore(lineup).batting;
  const bowlingStrength = lineupScore(opposition).bowling;
  const pitch = conditions.pitch ?? "balanced";
  const maxBalls = Number.isFinite(options.maxBalls) ? Math.max(0, Math.round(options.maxBalls)) : null;
  const extras = clamp(
    Math.round(2 + rng() * 12 + bowlingStrength / 18 + inningsIndex * 1.4),
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
    const rawRuns = sampleBatterScore(player, bowlingStrength, pitch, inningsIndex, rng);
    let adjustedRuns = clamp(
      Math.round(rawRuns * (0.85 + battingStrength / 260) + normalRandom(rng) * 5),
      0,
      260,
    );
    const plannedBalls = adjustedRuns === 0
      ? clamp(Math.round(2 + rng() * 11), 1, 24)
      : clamp(Math.round(adjustedRuns * (1.2 + rng() * 0.7) + 5), 1, 260);
    const balls = ballsRemaining === null ? plannedBalls : clamp(plannedBalls, 1, ballsRemaining);
    if (balls < plannedBalls && adjustedRuns > 0) {
      adjustedRuns = clamp(Math.round(adjustedRuns * ((balls / plannedBalls) ** 0.92)), 0, adjustedRuns);
    }
    const fours = adjustedRuns === 0
      ? 0
      : clamp(Math.round(adjustedRuns / 11 + rng() * 3), 0, Math.max(0, Math.floor(adjustedRuns / 4)));
    const sixes = adjustedRuns === 0
      ? 0
      : clamp(Math.round(adjustedRuns / 32 + rng() * 2), 0, Math.max(0, Math.floor(adjustedRuns / 6)));
    const dismissalOptions = ["c", "lbw", "b", "st", "c&b"];
    const card = {
      name: player.name,
      runs: adjustedRuns,
      balls,
      fours,
      sixes,
      out: true,
      notOut: false,
      dismissal: randomChoice(dismissalOptions, rng) ?? "c",
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

    if (shouldDeclare(runs + extras, wickets, inningsIndex, firstInningsLead, rng)) {
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
  const ballsFaced = estimateInningsBalls(batters, extras, wickets, rng, maxBalls);
  const notOutCount = batters.filter((card) => card.notOut).length;
  const topBatter = [...batters]
    .filter((card) => !card.dnb)
    .sort((left, right) => right.runs - left.runs)[0] ?? batters[0] ?? null;

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

function reconcileBowlingRuns(bowlers, targetRuns, rng) {
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
        normalRandom(rng) * 3,
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
      tiebreak: rng(),
    }))
    .sort((left, right) => right.remainder - left.remainder || right.tiebreak - left.tiebreak);

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

function buildBowlingScorecard(lineup, inningsTotal, wickets, teamEdge, rng, options = {}) {
  const ranked = options.rankedBowlers ?? teamBowlingRanking(lineup, teamEdge, rng);
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
  weighted.sort((left, right) => right.remainder - left.remainder);
  for (const entry of weighted) {
    if (oversLeft <= 0) break;
    entry.base += 1;
    oversLeft -= 1;
  }

  weighted.forEach((entry) => {
    entry.bowler.balls = entry.base * 6;
  });

  const wicketPool = [];
  for (let index = 0; index < wickets; index += 1) {
    const wicketWorking = weighted.map((entry) => entry.bowler).filter((bowler) => bowler.balls > 0);
    wicketPool.push(
      weightedPick(wicketWorking, (bowler) => Math.max(1, bowler.player.bowling + bowler.value / 3 - bowler.wickets * 12), rng),
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
        rng() * 7,
    );
    bowler.maidens = clamp(
      Math.round(bowler.balls / 24 + (bowler.player.bowling - 50) / 24 + rng() * 1.4),
      0,
      12,
    );
  });

  reconcileBowlingRuns(
    weighted.map((entry) => entry.bowler).filter((bowler) => bowler.balls > 0),
    inningsTotal,
    rng,
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
    .sort((left, right) => right.wickets - left.wickets || left.runs - right.runs);
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
  return batters.filter((card) => !card.dnb).sort((left, right) => right.runs - left.runs || right.balls - left.balls)[0] ?? null;
}

function bestBowlerFromInnings(inningsList) {
  const bowlers = inningsList
    .flatMap((innings) => innings?.bowling ?? innings?.bowlers ?? [])
    .filter((bowler) => bowler && bowler.overs !== "0");
  return bowlers.sort((left, right) => right.wickets - left.wickets || left.runs - right.runs)[0] ?? null;
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

function buildDidNotBatInnings(lineup, rng, battingOrderOverride = null) {
  return {
    batters: (battingOrderOverride ?? battingOrder(lineup, 0, rng)).map((player) => ({
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
  rng,
  chaseTarget = null,
  oversLimit = 50,
  options = {},
) {
  const order = options.battingOrder ?? battingOrder(lineup, 0, rng);
  const bowlingStrength = lineupScore(opposition).bowling;
  const pitch = conditions.pitch ?? "balanced";
  const maxBalls = oversLimit * 6;
  const wicketsLimit = 10;
  const totalExtras = clamp(Math.round(2 + rng() * 9 + bowlingStrength / 16 + inningsIndex * 0.5), 0, 24);

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
      bowlingStrength,
      pitch,
      inningsIndex,
      wickets,
      runs,
      totalExtras,
      chaseTarget,
      ballsRemaining,
      maxBalls,
      rng,
    );
    const adjustedRuns = outcome.runs;
    const balls = outcome.balls;

    ballsRemaining -= balls;
    runs += adjustedRuns;

    const card = {
      name: player.name,
      runs: adjustedRuns,
      balls,
      fours: adjustedRuns === 0
        ? 0
        : clamp(Math.round(adjustedRuns / 8 + rng() * 2), 0, Math.max(0, Math.floor(adjustedRuns / 2))),
      sixes: adjustedRuns === 0
        ? 0
        : clamp(Math.round(adjustedRuns / 28 + rng() * 2), 0, Math.max(0, Math.floor(adjustedRuns / 6))),
      out: true,
      notOut: false,
      dismissal: randomChoice(["c", "lbw", "b", "st", "run out"], rng) ?? "c",
    };

    if (chaseTarget !== null && runs + totalExtras >= chaseTarget) {
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
    .sort((left, right) => right.runs - left.runs)[0] ?? batters[0] ?? null;

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

function buildLimitedOversBowlingScorecard(lineup, inningsTotal, inningsBalls, wickets, teamEdge = 0, rng, options = {}) {
  const ranked = options.rankedBowlers ?? teamBowlingRanking(lineup, teamEdge, rng);
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
      rng,
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
      weightedPick(
        wicketWorking,
        (bowler) => Math.max(1, bowler.player.bowling + bowler.value / 3 - bowler.wickets * 12),
        rng,
      ),
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
        rng() * 6,
    );
    bowler.maidens = clamp(
      Math.round(bowler.balls / 30 + (bowler.player.bowling - 50) / 30 + rng() * 1.2),
      0,
      10,
    );
  });

  reconcileBowlingRuns(working.filter((bowler) => bowler.balls > 0), inningsTotal, rng);

  return working
    .filter((bowler) => bowler.balls > 0)
    .map((bowler) => ({
      name: bowler.name,
      overs: ballsToOvers(bowler.balls),
      maidens: bowler.maidens,
      runs: bowler.runs,
      wickets: bowler.wickets,
    }))
    .sort((left, right) => right.wickets - left.wickets || left.runs - right.runs);
}

function simulateDeterministicLimitedOversMatch(userLineup, oppositionLineup, conditions = {}, rng) {
  const userPlan = buildMatchPlan(userLineup, rng);
  const oppositionPlan = buildMatchPlan(oppositionLineup, rng);
  const user1 = buildLimitedOversBattingScorecard(userLineup, oppositionLineup, 1, conditions, rng, null, 50, {
    battingOrder: userPlan.battingOrder,
  });
  const star1 = buildLimitedOversBattingScorecard(oppositionLineup, userLineup, 2, conditions, rng, user1.total + 1, 50, {
    battingOrder: oppositionPlan.battingOrder,
  });
  const user1Bowling = buildLimitedOversBowlingScorecard(oppositionLineup, user1.total, user1.balls, user1.wickets, 0, rng, {
    rankedBowlers: oppositionPlan.bowlingRanks,
  });
  const star1Bowling = buildLimitedOversBowlingScorecard(userLineup, star1.total, star1.balls, star1.wickets, user1.total - star1.total, rng, {
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
      user2: buildDidNotBatInnings(userLineup, rng, userPlan.battingOrder),
      star2: buildDidNotBatInnings(oppositionLineup, rng, oppositionPlan.battingOrder),
    },
    userTotal: user1.total,
    starTotal: star1.total,
  };
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

  const topBat = [...batters].filter((card) => !card.dnb).sort((left, right) => right.runs - left.runs)[0] ?? null;
  const topBowl = [...bowlers].sort((left, right) => right.wickets - left.wickets || left.runs - right.runs)[0] ?? null;

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

function performancePointsForCard(card) {
  return (card.runs ?? 0) + (card.wickets ?? 0) * 25 + (card.centuries ?? 0) * 18 + (card.fiveFors ?? 0) * 22;
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
  const overallLeader = [...leaders].sort((left, right) => right.points - left.points || right.runs - left.runs || right.wickets - left.wickets)[0] ?? null;

  return {
    overallLeader,
    mostRuns: [...leaders].sort((left, right) => right.runs - left.runs)[0] ?? null,
    mostWickets: [...leaders].sort((left, right) => right.wickets - left.wickets)[0] ?? null,
    mostCenturies: [...leaders].sort((left, right) => right.centuries - left.centuries || right.runs - left.runs)[0] ?? null,
    mostFiveFors: [...leaders].sort((left, right) => right.fiveFors - left.fiveFors || right.wickets - left.wickets)[0] ?? null,
    userRuns: leaders.filter((item) => item.side === "your").reduce((sum, item) => sum + item.runs, 0),
    userWickets: leaders.filter((item) => item.side === "your").reduce((sum, item) => sum + item.wickets, 0),
  };
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

function simulateDeterministicTestMatch(userLineup, oppositionLineup, conditions, rng) {
  const userPlan = buildMatchPlan(userLineup, rng);
  const oppositionPlan = buildMatchPlan(oppositionLineup, rng);
  const user1 = buildBattingScorecard(userLineup, oppositionLineup, 1, conditions, rng, null, 0, {
    battingOrder: userPlan.battingOrder,
  });
  const star1 = buildBattingScorecard(oppositionLineup, userLineup, 2, conditions, rng, null, 0, {
    battingOrder: oppositionPlan.battingOrder,
  });

  const userLead = user1.total - star1.total;
  const user2 = buildBattingScorecard(userLineup, oppositionLineup, 3, conditions, rng, null, userLead, {
    battingOrder: userPlan.battingOrder,
  });

  const target = user1.total + user2.total - star1.total + 1;
  const remainingFourthInningsBalls = Math.max(0, testMatchBallBudget(conditions) - user1.balls - star1.balls - user2.balls);
  const star2 = target <= 0
    ? {
        batters: oppositionPlan.battingOrder.map((player) => ({
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
    : buildBattingScorecard(oppositionLineup, userLineup, 4, conditions, rng, target, 0, {
        battingOrder: oppositionPlan.battingOrder,
        maxBalls: remainingFourthInningsBalls,
      });

  const user1Bowling = buildBowlingScorecard(oppositionLineup, user1.total, user1.wickets, 0, rng, {
    rankedBowlers: oppositionPlan.bowlingRanks,
  });
  const star1Bowling = buildBowlingScorecard(userLineup, star1.total, star1.wickets, 0, rng, {
    rankedBowlers: userPlan.bowlingRanks,
  });
  const user2Bowling = buildBowlingScorecard(oppositionLineup, user2.total, user2.wickets, userLead, rng, {
    rankedBowlers: oppositionPlan.bowlingRanks,
  });
  const star2Bowling = target <= 0
    ? []
    : buildBowlingScorecard(userLineup, star2.total, star2.wickets, -userLead, rng, {
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

export function buildSingleTestSeries(userLineup, oppositionLineup, conditions = {}, seed = "") {
  const rng = createSeededRandom(seed);
  const match = simulateDeterministicTestMatch(userLineup, oppositionLineup, conditions, rng);
  const venueLabel = conditions.venueLabel || conditions.venue || "Daily conditions";
  const userInnings1 = match.innings.user1;
  const starInnings1 = match.innings.star1;
  const userInnings2 = match.innings.user2;
  const starInnings2 = match.innings.star2;

  const matchRecord = {
    format: "tests",
    matchNumber: 1,
    testNumber: 1,
    venue: venueLabel,
    result: match.result,
    summary: matchMarginText(match),
    headline: generateHeadline(match),
    innings: [
      { label: "Your XI 1st inns", score: `${userInnings1.total}/${userInnings1.wickets}${userInnings1.declared ? "d" : ""}` },
      { label: "Opposition 1st inns", score: `${starInnings1.total}/${starInnings1.wickets}${starInnings1.declared ? "d" : ""}` },
      { label: "Your XI 2nd inns", score: `${userInnings2.total}/${userInnings2.wickets}${userInnings2.declared ? "d" : ""}` },
      { label: "Opposition 2nd inns", score: starInnings2.didNotBat ? "DNB" : `${starInnings2.total}/${starInnings2.wickets}${starInnings2.declared ? "d" : ""}` },
    ],
    scoreline: `${userInnings1.total}/${userInnings1.wickets} & ${userInnings2.total}/${userInnings2.wickets} | ${starInnings1.total}/${starInnings1.wickets} & ${starInnings2.didNotBat ? "DNB" : `${starInnings2.total}/${starInnings2.wickets}`}`,
    inningsData: {
      user1: buildInningsSummary("Your XI 1st innings", userInnings1, match.innings.user1.bowling),
      star1: buildInningsSummary("Opposition 1st innings", starInnings1, match.innings.star1.bowling),
      user2: buildInningsSummary("Your XI 2nd innings", userInnings2, match.innings.user2.bowling),
      star2: buildInningsSummary("Opposition 2nd innings", starInnings2, match.innings.star2.bowling),
    },
  };

  matchRecord.userBox = buildMatchBoxScore({
    batting: [matchRecord.inningsData.user1, matchRecord.inningsData.user2],
    bowling: [matchRecord.inningsData.star1, matchRecord.inningsData.star2],
  });
  matchRecord.starBox = buildMatchBoxScore({
    batting: [matchRecord.inningsData.star1, matchRecord.inningsData.star2],
    bowling: [matchRecord.inningsData.user1, matchRecord.inningsData.user2],
  });

  const userWins = match.result === "win" ? 1 : 0;
  const starWins = match.result === "loss" ? 1 : 0;
  const draws = match.result === "draw" ? 1 : 0;
  const matches = [matchRecord];
  const leaders = collectSeriesStats({ matches });

  return {
    userLineup,
    starLineup: oppositionLineup,
    userTeam: teamMetricsFromLineup(userLineup),
    starTeam: teamMetricsFromLineup(oppositionLineup),
    matches,
    revealed: 1,
    userWins,
    starWins,
    draws,
    leaders,
    achievements: [],
    playerOfSeries: leaders.overallLeader,
  };
}

export function buildSingleLimitedOversMatch(userLineup, oppositionLineup, conditions = {}, seed = "") {
  const rng = createSeededRandom(seed);
  const match = simulateDeterministicLimitedOversMatch(userLineup, oppositionLineup, conditions, rng);
  const venueLabel = conditions.venueLabel || conditions.venue || "Daily ODI conditions";
  const userInnings1 = match.innings.user1;
  const starInnings1 = match.innings.star1;

  const matchRecord = {
    format: "limited-overs",
    matchNumber: 1,
    testNumber: 1,
    stage: "daily",
    stageLabel: "Daily ODI",
    venue: venueLabel,
    result: match.result,
    summary: matchMarginText(match),
    headline: generateHeadline(match),
    innings: [
      { label: "Your XI innings", score: `${userInnings1.total}/${userInnings1.wickets}` },
      { label: "Opposition innings", score: `${starInnings1.total}/${starInnings1.wickets}` },
    ],
    scoreline: `${userInnings1.total}/${userInnings1.wickets} | ${starInnings1.total}/${starInnings1.wickets}`,
    inningsData: {
      user1: buildInningsSummary("Your XI innings", userInnings1, match.innings.user1.bowling),
      star1: buildInningsSummary("Opposition innings", starInnings1, match.innings.star1.bowling),
      user2: buildInningsSummary("Your XI 2nd innings", match.innings.user2, []),
      star2: buildInningsSummary("Opposition 2nd innings", match.innings.star2, []),
    },
  };

  matchRecord.userBox = buildMatchBoxScore({
    batting: [matchRecord.inningsData.user1],
    bowling: [matchRecord.inningsData.star1],
  });
  matchRecord.starBox = buildMatchBoxScore({
    batting: [matchRecord.inningsData.star1],
    bowling: [matchRecord.inningsData.user1],
  });

  const userWins = match.result === "win" ? 1 : 0;
  const starWins = match.result === "loss" ? 1 : 0;
  const draws = match.result === "draw" ? 1 : 0;
  const matches = [matchRecord];
  const leaders = collectSeriesStats({ matches });

  return {
    format: "limited-overs",
    tournamentType: "daily-worldcup",
    statusText: match.result === "win" ? "World Cup daily won" : match.result === "loss" ? "World Cup daily lost" : "World Cup daily tied",
    userLineup,
    starLineup: oppositionLineup,
    userTeam: teamMetricsFromLineup(userLineup),
    starTeam: teamMetricsFromLineup(oppositionLineup),
    matches,
    revealed: 1,
    userWins,
    starWins,
    draws,
    leaders,
    achievements: [],
    playerOfSeries: leaders.overallLeader,
  };
}
