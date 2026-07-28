import assert from "node:assert/strict";
import test from "node:test";

import { buildDailyAttemptResponse, buildDailySimulationResult } from "../functions/_lib/daily.js";
import { ensureDailyStoreSchema } from "../functions/_lib/daily-store.js";
import {
  buildDailyCommunityStats,
  buildDailyCompletedXI,
  buildDailyResultsLeaderboard,
  buildDailyRollPublicState,
  canSelectDailyPlayer,
  countDailyCompletionPaths,
  getDailyFixedPlayers,
  getCurrentDailyChallenge,
} from "../site/shared/daily-ashes.js";

const SUNDAY_DATE = "2026-07-26";
const MONDAY_DATE = "2026-07-27";
const sundayDefinition = getCurrentDailyChallenge(SUNDAY_DATE);

function playerForRoll(rollNumber, stableId, selections = []) {
  const roll = buildDailyRollPublicState(sundayDefinition, rollNumber, selections);
  const player = roll?.players?.find((entry) => entry.stableId === stableId);
  assert.ok(player, `Expected ${stableId} to be present on roll ${rollNumber}.`);
  return player;
}

function selectionFor(rollNumber, stableId, selections = [], preferredSlotIndex = null) {
  const roll = buildDailyRollPublicState(sundayDefinition, rollNumber, selections);
  const player = playerForRoll(rollNumber, stableId, selections);
  const slotIndex = preferredSlotIndex ?? player.validSlotIndexes?.[0] ?? null;

  assert.ok(Number.isInteger(slotIndex), `Expected ${stableId} to have a valid slot on roll ${rollNumber}.`);
  assert.ok(player.validSlotIndexes.includes(slotIndex), `Expected slot ${slotIndex} to be valid for ${stableId}.`);

  return {
    rollNumber,
    squadId: roll.squadId,
    playerId: player.id,
    stableId,
    slotIndex,
  };
}

function pathASelections() {
  const rollOne = selectionFor(1, "andrew-flintoff", [], 6);
  const rollTwo = selectionFor(2, "michael-hussey", [rollOne], 4);
  const rollThree = selectionFor(3, "jofra-archer", [rollOne, rollTwo], 9);
  const rollFour = selectionFor(4, "pat-cummins", [rollOne, rollTwo, rollThree], 10);
  return [rollOne, rollTwo, rollThree, rollFour];
}

function pathBSelections() {
  const rollOne = selectionFor(1, "matthew-hoggard", [], 9);
  const rollTwo = selectionFor(2, "andrew-symonds", [rollOne], 6);
  const rollThree = selectionFor(3, "joe-root", [rollOne, rollTwo], 4);
  const rollFour = selectionFor(4, "pat-cummins", [rollOne, rollTwo, rollThree], 10);
  return [rollOne, rollTwo, rollThree, rollFour];
}

function buildAttempt({
  currentRollNumber = 1,
  draftComplete = false,
  simulationComplete = false,
  attemptMode = "ranked",
  displayName = "",
  result = null,
} = {}) {
  return {
    id: "attempt-1",
    challengeId: sundayDefinition.id,
    participantId: "participant-12345",
    attemptMode,
    displayName,
    currentRollNumber,
    draftComplete,
    simulationComplete,
    result,
  };
}

test("daily challenge uses the same deterministic sequence for Sunday, July 26, 2026", () => {
  const first = getCurrentDailyChallenge(SUNDAY_DATE);
  const second = getCurrentDailyChallenge(SUNDAY_DATE);

  assert.equal(first.id, second.id);
  assert.deepEqual(first.fixedAssignments, second.fixedAssignments);
  assert.deepEqual(first.rolls, second.rolls);
  assert.deepEqual(first.oppositionStableIds, second.oppositionStableIds);
  assert.deepEqual(first.conditions, second.conditions);
});

test("daily challenge generates a fresh deterministic challenge for Monday, July 27, 2026", () => {
  const mondayFirst = getCurrentDailyChallenge(MONDAY_DATE);
  const mondaySecond = getCurrentDailyChallenge(MONDAY_DATE);

  assert.equal(mondayFirst.id, "daily-ashes-2026-07-27");
  assert.equal(mondayFirst.date, MONDAY_DATE);
  assert.equal(mondayFirst.id, mondaySecond.id);
  assert.deepEqual(mondayFirst.fixedAssignments, mondaySecond.fixedAssignments);
  assert.deepEqual(mondayFirst.rolls, mondaySecond.rolls);
  assert.equal(mondayFirst.fixedAssignments.length, 7);
  assert.equal(mondayFirst.rolls.length, 4);
  assert.notEqual(mondayFirst.id, sundayDefinition.id);
});

test("daily challenge resolves all seven fixed players and offers valid roll-one choices", () => {
  const fixedPlayers = getDailyFixedPlayers(sundayDefinition);
  const rollOne = buildDailyRollPublicState(sundayDefinition, 1, []);

  assert.equal(fixedPlayers.length, 7);
  assert.ok(rollOne);
  assert.equal(rollOne.players.length, 5);
  assert.ok(rollOne.players.some((player) => player.selectable));
  assert.ok(rollOne.players.some((player) => (player.validSlotIndexes ?? []).length > 0));
});

test("daily schema bootstrap creates the daily tables once per database binding", async () => {
  const prepared = [];
  let batchCalls = 0;
  const alteredStatements = [];
  const db = {
    prepare(statement) {
      prepared.push(statement);
      return {
        bind() {
          return this;
        },
        async all() {
          if (statement === "PRAGMA table_info(daily_attempts)") {
            return { results: [{ name: "id" }] };
          }
          if (statement === "PRAGMA table_info(daily_attempt_selections)") {
            return { results: [{ name: "attempt_id" }] };
          }
          return { results: [] };
        },
        async run() {
          alteredStatements.push(statement);
          return {};
        },
      };
    },
    async batch(statements) {
      batchCalls += 1;
      return statements;
    },
  };

  await ensureDailyStoreSchema(db);
  await ensureDailyStoreSchema(db);

  assert.equal(batchCalls, 1);
  assert.equal(prepared.filter((statement) => /^CREATE /u.test(statement)).length, 6);
  assert.ok(prepared.includes("PRAGMA table_info(daily_attempts)"));
  assert.ok(prepared.includes("PRAGMA table_info(daily_attempt_selections)"));
  assert.ok(alteredStatements.includes("ALTER TABLE daily_attempts ADD COLUMN display_name TEXT NOT NULL DEFAULT ''"));
  assert.ok(alteredStatements.includes("ALTER TABLE daily_attempt_selections ADD COLUMN slot_index INTEGER"));
  const slotIndexCreateIndex = prepared.findIndex((statement) => statement.includes("idx_daily_attempt_selections_slot"));
  const slotIndexAlter = prepared.findIndex((statement) => statement === "ALTER TABLE daily_attempt_selections ADD COLUMN slot_index INTEGER");
  assert.ok(slotIndexCreateIndex > slotIndexAlter);
});

test("attempt response only exposes the current roll before drafting is complete", () => {
  const response = buildDailyAttemptResponse(sundayDefinition, buildAttempt(), []);
  const currentSquadId = sundayDefinition.rolls[0].squadId;

  assert.equal(response.currentRoll.rollNumber, 1);
  assert.equal(response.currentRoll.squadId, currentSquadId);
  assert.ok(response.currentRoll.players.length > 0);
  assert.ok(response.currentRoll.players.every((player) => player.squadId === currentSquadId));
  assert.equal(response.recap, undefined);
  assert.equal(response.completedXI, undefined);
  assert.equal(response.communityStats, undefined);
  assert.equal(response.dailyLeaderboard, undefined);
});

test("future rolls stay hidden until the previous choice is locked", () => {
  const rollOne = selectionFor(1, "andrew-flintoff", [], 6);
  const response = buildDailyAttemptResponse(sundayDefinition, buildAttempt({ currentRollNumber: 2 }), [rollOne]);
  const currentSquadId = sundayDefinition.rolls[1].squadId;

  assert.equal(response.currentRoll.rollNumber, 2);
  assert.equal(response.currentRoll.squadId, currentSquadId);
  assert.ok(response.currentRoll.players.every((player) => player.squadId === currentSquadId));
  assert.equal(response.lockedSelections.length, 1);
});

test("a player cannot be selected from a future roll or into an invalid slot", () => {
  const rollOne = selectionFor(1, "andrew-flintoff", [], 6);
  const futurePlayer = playerForRoll(2, "michael-hussey");
  const paceOnlyPlayer = playerForRoll(1, "matthew-hoggard");

  assert.equal(canSelectDailyPlayer(sundayDefinition, [], 1, futurePlayer.id, 4), false);
  assert.equal(canSelectDailyPlayer(sundayDefinition, [rollOne], 1, rollOne.playerId, rollOne.slotIndex), false);
  assert.equal(canSelectDailyPlayer(sundayDefinition, [], 1, paceOnlyPlayer.id, 4), false);
  assert.equal(canSelectDailyPlayer(sundayDefinition, [], 1, paceOnlyPlayer.id, 9), true);
});

test("locked selections remain final and the full recap appears only after four choices", () => {
  const selections = pathASelections();
  const response = buildDailyAttemptResponse(
    sundayDefinition,
    buildAttempt({ currentRollNumber: 4, draftComplete: true }),
    selections,
    [{ id: "attempt-1", selections }],
  );

  assert.equal(response.currentRoll, undefined);
  assert.equal(response.lockedSelections.length, 4);
  assert.equal(response.recap.length, 4);
  assert.equal(response.completedXI.length, 11);
  assert.equal(response.communityStats, undefined);
  assert.equal(response.dailyLeaderboard, undefined);
});

test("simulation-complete responses expose community stats and the daily leaderboard on the result view", () => {
  const selections = pathASelections();
  const result = buildDailySimulationResult(sundayDefinition, selections);
  const response = buildDailyAttemptResponse(
    sundayDefinition,
    buildAttempt({
      currentRollNumber: 4,
      draftComplete: true,
      simulationComplete: true,
      displayName: "Alice",
      result,
    }),
    selections,
    [{ id: "attempt-1", displayName: "Alice", selections, result, completedAt: "2026-07-27T10:00:00Z" }],
  );

  assert.ok(response.communityStats);
  assert.ok(response.dailyLeaderboard);
  assert.ok(response.result);
});

test("reasonable selection paths still produce valid completed XIs and multiple valid completion paths", () => {
  const pathA = pathASelections();
  const pathB = pathBSelections();

  assert.equal(buildDailyCompletedXI(sundayDefinition, pathA)?.length, 11);
  assert.equal(buildDailyCompletedXI(sundayDefinition, pathB)?.length, 11);
  assert.ok(countDailyCompletionPaths(sundayDefinition, [], 1, 8) >= 4);
});

test("daily simulation is deterministic for the same completed XI", () => {
  const selections = pathASelections();
  const first = buildDailySimulationResult(sundayDefinition, selections);
  const second = buildDailySimulationResult(sundayDefinition, selections);

  assert.deepEqual(first, second);
});

test("daily leaderboard ranks winning margins and prefers entered display names", () => {
  const leaderboard = buildDailyResultsLeaderboard([
    {
      id: "attempt-c",
      displayName: "",
      result: { matches: [{ summary: "Won by an innings and 12 runs" }] },
      completedAt: "2026-07-27T09:00:00Z",
    },
    {
      id: "attempt-b",
      displayName: "Bob",
      result: { matches: [{ summary: "Won by 7 wickets" }] },
      completedAt: "2026-07-27T09:05:00Z",
    },
    {
      id: "attempt-a",
      displayName: "Alice",
      result: { matches: [{ summary: "Won by 85 runs" }] },
      completedAt: "2026-07-27T09:10:00Z",
    },
    {
      id: "attempt-d",
      displayName: "Dana",
      result: { matches: [{ summary: "Match drawn" }] },
      completedAt: "2026-07-27T09:15:00Z",
    },
  ], "attempt-b");

  assert.equal(leaderboard.entries.length, 3);
  assert.equal(leaderboard.entries[0].displayName, "Anonymous");
  assert.equal(leaderboard.entries[0].margin, "Won by an innings and 12 runs");
  assert.equal(leaderboard.entries[1].displayName, "Bob");
  assert.equal(leaderboard.entries[1].isCurrentUser, true);
});

test("community percentages are grouped by roll and ignore unranked practice attempts", () => {
  const pathA = pathASelections();
  const pathB = pathBSelections();

  const community = buildDailyCommunityStats(sundayDefinition, [
    { selections: pathA },
    { selections: pathA },
    { selections: pathB },
  ], pathA);

  const rollOne = community.rolls.find((roll) => roll.rollNumber === 1);
  const rollTwo = community.rolls.find((roll) => roll.rollNumber === 2);

  assert.equal(rollOne.selections.find((player) => player.stableId === "andrew-flintoff")?.percentage, 67);
  assert.equal(rollOne.selections.find((player) => player.stableId === "matthew-hoggard")?.percentage, 33);
  assert.equal(rollTwo.selections.find((player) => player.stableId === "michael-hussey")?.percentage, 67);
  assert.equal(community.sameFourChoicesPercentage, 67);
});
