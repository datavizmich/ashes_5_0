import assert from "node:assert/strict";
import test from "node:test";

import {
  buildSingleLimitedOversMatch,
  buildSingleTestSeries,
  teamMetricsFromLineup,
} from "../site/shared/ashes-sim.js";

function player(name, roles, batting, bowling, fielding = 72, experience = 72) {
  return {
    id: name.toLowerCase().replace(/\s+/gu, "-"),
    name,
    roles,
    batting,
    bowling,
    fielding,
    experience,
  };
}

function buildBalancedLineup({ allRounderBowling = 74, baseBatting = 76, baseBowling = 74 } = {}) {
  return [
    player("Opener One", ["Opener"], baseBatting + 8, 18, 70, 78),
    player("Opener Two", ["Opener"], baseBatting + 6, 16, 71, 77),
    player("Number Three", ["Top Order"], baseBatting + 7, 22, 72, 79),
    player("Middle Four", ["Middle Order"], baseBatting + 5, 24, 73, 75),
    player("Middle Five", ["Middle Order"], baseBatting + 3, 28, 74, 74),
    player("Keeper", ["Wicketkeeper"], baseBatting + 2, 18, 84, 76),
    player("All Rounder", ["All-rounder"], baseBatting, allRounderBowling, 76, 78),
    player("Spinner", ["Spinner"], baseBatting - 18, baseBowling + 10, 69, 73),
    player("Quick One", ["Fast Bowler"], baseBatting - 22, baseBowling + 12, 68, 74),
    player("Quick Two", ["Fast Bowler"], baseBatting - 24, baseBowling + 8, 67, 71),
    player("Quick Three", ["Fast Bowler"], baseBatting - 20, baseBowling + 6, 68, 70),
  ];
}

function sumBowlingRuns(bowling = []) {
  return bowling.reduce((sum, bowler) => sum + (bowler.runs ?? 0), 0);
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
}

test("team bowling metric improves when the all-rounder is a genuine bowling option", () => {
  const weakAllRounder = buildBalancedLineup({ allRounderBowling: 36 });
  const strongAllRounder = buildBalancedLineup({ allRounderBowling: 88 });

  assert.ok(teamMetricsFromLineup(strongAllRounder).bowling > teamMetricsFromLineup(weakAllRounder).bowling);
});

test("limited-overs bowling figures reconcile to each innings total", () => {
  const result = buildSingleLimitedOversMatch(
    buildBalancedLineup({ allRounderBowling: 82 }),
    buildBalancedLineup({ allRounderBowling: 70, baseBatting: 72, baseBowling: 71 }),
    { pitch: "balanced", venueLabel: "Mumbai" },
    "limited-overs-reconcile",
  );
  const inningsData = result.matches[0].inningsData;

  assert.equal(sumBowlingRuns(inningsData.user1.bowling), inningsData.user1.batting.total);
  assert.equal(sumBowlingRuns(inningsData.star1.bowling), inningsData.star1.batting.total);
});

test("test bowling figures reconcile to each completed innings total", () => {
  const result = buildSingleTestSeries(
    buildBalancedLineup({ allRounderBowling: 84, baseBatting: 80, baseBowling: 78 }),
    buildBalancedLineup({ allRounderBowling: 68, baseBatting: 74, baseBowling: 72 }),
    { pitch: "green", venueLabel: "Lord's" },
    "test-reconcile",
  );
  const inningsData = result.matches[0].inningsData;

  assert.equal(sumBowlingRuns(inningsData.user1.bowling), inningsData.user1.batting.total);
  assert.equal(sumBowlingRuns(inningsData.star1.bowling), inningsData.star1.batting.total);
  assert.equal(sumBowlingRuns(inningsData.user2.bowling), inningsData.user2.batting.total);
  if (!inningsData.star2.batting.didNotBat) {
    assert.equal(sumBowlingRuns(inningsData.star2.bowling), inningsData.star2.batting.total);
  }
});

test("a much stronger ODI XI beats a much weaker ODI XI most of the time", () => {
  const strong = buildBalancedLineup({ allRounderBowling: 90, baseBatting: 92, baseBowling: 89 }).map((entry) => ({
    ...entry,
    fielding: 84,
    experience: 86,
  }));
  const weak = buildBalancedLineup({ allRounderBowling: 52, baseBatting: 58, baseBowling: 56 }).map((entry) => ({
    ...entry,
    fielding: 62,
    experience: 60,
  }));

  let wins = 0;
  let losses = 0;
  for (let index = 0; index < 30; index += 1) {
    const result = buildSingleLimitedOversMatch(strong, weak, { pitch: "balanced" }, `strength-${index}`);
    if (result.matches[0].result === "win") wins += 1;
    if (result.matches[0].result === "loss") losses += 1;
  }

  assert.ok(wins >= 20, `Expected the stronger XI to win often, received ${wins} wins.`);
  assert.ok(losses <= 5, `Expected the stronger XI to avoid frequent losses, received ${losses} losses.`);
});

test("balanced ODI simulations usually use most of the 50 overs without defaulting to all out", () => {
  const strong = buildBalancedLineup({ allRounderBowling: 82 });
  const steady = buildBalancedLineup({ allRounderBowling: 70, baseBatting: 72, baseBowling: 71 });
  const totals = [];
  const overs = [];
  let allOuts = 0;
  let full50s = 0;

  for (let index = 0; index < 80; index += 1) {
    const match = buildSingleLimitedOversMatch(strong, steady, { pitch: "balanced" }, `odi-shape-${index}`).matches[0];
    for (const innings of [match.inningsData.user1.batting, match.inningsData.star1.batting]) {
      totals.push(innings.total);
      overs.push(innings.balls / 6);
      if (innings.wickets >= 10) allOuts += 1;
      if (innings.balls >= 300) full50s += 1;
    }
  }

  const meanTotal = average(totals);
  const meanOvers = average(overs);
  const allOutRate = allOuts / totals.length;
  const full50Rate = full50s / totals.length;

  assert.ok(meanTotal >= 230 && meanTotal <= 275, `Expected ODI totals in a plausible band, received ${meanTotal.toFixed(1)}.`);
  assert.ok(meanOvers >= 45, `Expected ODI innings to use most of the overs, received ${meanOvers.toFixed(1)}.`);
  assert.ok(allOutRate <= 0.5, `Expected ODI all-out rate to stay below half of innings, received ${(allOutRate * 100).toFixed(1)}%.`);
  assert.ok(full50Rate >= 0.45, `Expected many ODI innings to reach the 50-over limit, received ${(full50Rate * 100).toFixed(1)}%.`);
});

test("balanced Test simulations restore higher first-innings scores and occasional draws", () => {
  const strong = buildBalancedLineup({ allRounderBowling: 82, baseBatting: 80, baseBowling: 78 });
  const steady = buildBalancedLineup({ allRounderBowling: 70, baseBatting: 72, baseBowling: 71 });
  const firstInningsTotals = [];
  const allOvers = [];
  let firstInningsDeclarations = 0;
  let laterDeclarations = 0;
  let draws = 0;
  let timeClosedInnings = 0;

  for (let index = 0; index < 80; index += 1) {
    const match = buildSingleTestSeries(strong, steady, { pitch: "balanced", venueLabel: "Neutral Test venue" }, `test-shape-${index}`).matches[0];
    firstInningsTotals.push(match.inningsData.user1.batting.total, match.inningsData.star1.batting.total);
    if (match.inningsData.user1.batting.declared) firstInningsDeclarations += 1;
    if (match.inningsData.star1.batting.declared) firstInningsDeclarations += 1;
    if (match.inningsData.user2.batting.declared) laterDeclarations += 1;
    if (match.inningsData.star2.batting.declared) laterDeclarations += 1;
    for (const innings of [match.inningsData.user1.batting, match.inningsData.star1.batting, match.inningsData.user2.batting, match.inningsData.star2.batting]) {
      if (!innings.didNotBat) {
        allOvers.push(innings.balls / 6);
        if (!innings.declared && innings.wickets < 10 && innings.balls > 0) {
          timeClosedInnings += 1;
        }
      }
    }
    if (match.result === "draw") draws += 1;
  }

  const meanFirstInnings = average(firstInningsTotals);
  const meanOvers = average(allOvers);

  assert.ok(meanFirstInnings >= 320 && meanFirstInnings <= 410, `Expected Test first innings in a plausible band, received ${meanFirstInnings.toFixed(1)}.`);
  assert.ok(meanOvers >= 80, `Expected Test innings to consume substantial time, received ${meanOvers.toFixed(1)} overs.`);
  assert.equal(firstInningsDeclarations, 0, "Expected first-innings declarations to be absent in the sample.");
  assert.ok(laterDeclarations <= 4, `Expected later Test declarations to stay rare, received ${laterDeclarations}.`);
  assert.ok(timeClosedInnings >= 4, `Expected some Test innings to close because time ran out, received ${timeClosedInnings}.`);
  assert.ok(draws >= 1, "Expected the Test sample to include at least one draw.");
});
