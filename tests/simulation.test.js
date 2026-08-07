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
