import assert from "node:assert/strict";
import test from "node:test";

import { buildDailyAttemptResponse, buildDailySimulationResult } from "../functions/_lib/daily.js";
import {
  buildDailyCompletedXI,
  buildDailyCommunityStats,
  buildDailyRollPublicState,
  canSelectDailyPlayer,
  getCurrentDailyChallenge,
} from "../site/shared/daily-ashes.js";

const DAILY_DATE = "2026-07-26";
const definition = getCurrentDailyChallenge(DAILY_DATE);

function playerIdForRoll(rollNumber, stableId, selections = []) {
  const roll = buildDailyRollPublicState(definition, rollNumber, selections);
  const player = roll?.players?.find((entry) => entry.stableId === stableId);
  assert.ok(player, `Expected ${stableId} to be present on roll ${rollNumber}.`);
  return player.id;
}

function selectionFor(rollNumber, stableId, selections = []) {
  const playerId = playerIdForRoll(rollNumber, stableId, selections);
  const current = buildDailyRollPublicState(definition, rollNumber, selections);
  return {
    rollNumber,
    squadId: current.squadId,
    playerId,
    stableId,
  };
}

function buildAttempt({ currentRollNumber = 1, draftComplete = false, simulationComplete = false, attemptMode = "ranked" } = {}) {
  return {
    id: "attempt-1",
    challengeId: definition.id,
    participantId: "participant-12345",
    attemptMode,
    currentRollNumber,
    draftComplete,
    simulationComplete,
    result: null,
  };
}

test("daily challenge uses the same deterministic sequence for July 26, 2026", () => {
  const first = getCurrentDailyChallenge(DAILY_DATE);
  const second = getCurrentDailyChallenge(DAILY_DATE);

  assert.equal(first.id, second.id);
  assert.deepEqual(first.fixedPlayerStableIds, second.fixedPlayerStableIds);
  assert.deepEqual(first.rolls, second.rolls);
  assert.deepEqual(first.oppositionStableIds, second.oppositionStableIds);
  assert.deepEqual(first.conditions, second.conditions);
});

test("attempt response only exposes the current roll before drafting is complete", () => {
  const response = buildDailyAttemptResponse(definition, buildAttempt(), []);
  const nextSquadId = definition.rolls[1].squadId;

  assert.equal(response.currentRoll.rollNumber, 1);
  assert.ok(response.currentRoll.players.length > 0);
  assert.equal(response.recap, undefined);
  assert.equal(response.completedXI, undefined);
  assert.equal(JSON.stringify(response).includes(nextSquadId), false);
});

test("future rolls stay hidden until the previous choice is locked", () => {
  const selections = [selectionFor(1, "andrew-flintoff")];
  const response = buildDailyAttemptResponse(definition, buildAttempt({ currentRollNumber: 2 }), selections);

  assert.equal(response.currentRoll.rollNumber, 2);
  assert.equal(response.lockedSelections.length, 1);
  assert.equal(JSON.stringify(response).includes(definition.rolls[2].squadId), false);
});

test("a player from a future or already-locked roll cannot be selected", () => {
  const rollOneSelection = selectionFor(1, "andrew-flintoff");
  const futurePlayerId = playerIdForRoll(2, "michael-hussey");

  assert.equal(canSelectDailyPlayer(definition, [], 1, futurePlayerId), false);
  assert.equal(canSelectDailyPlayer(definition, [rollOneSelection], 1, rollOneSelection.playerId), false);
});

test("locked selections remain final and the full recap appears only after four choices", () => {
  const selections = [
    selectionFor(1, "andrew-flintoff"),
    selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
    selectionFor(3, "jofra-archer", [
      selectionFor(1, "andrew-flintoff"),
      selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
    ]),
    selectionFor(4, "pat-cummins", [
      selectionFor(1, "andrew-flintoff"),
      selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
      selectionFor(3, "jofra-archer", [
        selectionFor(1, "andrew-flintoff"),
        selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
      ]),
    ]),
  ];

  const response = buildDailyAttemptResponse(
    definition,
    buildAttempt({ currentRollNumber: 4, draftComplete: true }),
    selections,
    [{ selections }],
  );

  assert.equal(response.currentRoll, undefined);
  assert.equal(response.lockedSelections.length, 4);
  assert.equal(response.recap.length, 4);
  assert.equal(response.completedXI.length, 11);
});

test("reasonable selection paths still produce valid completed XIs", () => {
  const pathA = [
    selectionFor(1, "andrew-flintoff"),
    selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
    selectionFor(3, "jofra-archer", [
      selectionFor(1, "andrew-flintoff"),
      selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
    ]),
    selectionFor(4, "pat-cummins", [
      selectionFor(1, "andrew-flintoff"),
      selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
      selectionFor(3, "jofra-archer", [
        selectionFor(1, "andrew-flintoff"),
        selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
      ]),
    ]),
  ];
  const pathB = [
    selectionFor(1, "matthew-hoggard"),
    selectionFor(2, "andrew-symonds", [selectionFor(1, "matthew-hoggard")]),
    selectionFor(3, "joe-root", [
      selectionFor(1, "matthew-hoggard"),
      selectionFor(2, "andrew-symonds", [selectionFor(1, "matthew-hoggard")]),
    ]),
    selectionFor(4, "pat-cummins", [
      selectionFor(1, "matthew-hoggard"),
      selectionFor(2, "andrew-symonds", [selectionFor(1, "matthew-hoggard")]),
      selectionFor(3, "joe-root", [
        selectionFor(1, "matthew-hoggard"),
        selectionFor(2, "andrew-symonds", [selectionFor(1, "matthew-hoggard")]),
      ]),
    ]),
  ];

  assert.equal(buildDailyCompletedXI(definition, pathA)?.length, 11);
  assert.equal(buildDailyCompletedXI(definition, pathB)?.length, 11);
});

test("daily simulation is deterministic for the same completed XI", () => {
  const selections = [
    selectionFor(1, "andrew-flintoff"),
    selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
    selectionFor(3, "jofra-archer", [
      selectionFor(1, "andrew-flintoff"),
      selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
    ]),
    selectionFor(4, "pat-cummins", [
      selectionFor(1, "andrew-flintoff"),
      selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
      selectionFor(3, "jofra-archer", [
        selectionFor(1, "andrew-flintoff"),
        selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
      ]),
    ]),
  ];

  const first = buildDailySimulationResult(definition, selections);
  const second = buildDailySimulationResult(definition, selections);

  assert.deepEqual(first, second);
});

test("community percentages are grouped by roll and ignore unranked practice attempts", () => {
  const pathA = [
    selectionFor(1, "andrew-flintoff"),
    selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
    selectionFor(3, "jofra-archer", [
      selectionFor(1, "andrew-flintoff"),
      selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
    ]),
    selectionFor(4, "pat-cummins", [
      selectionFor(1, "andrew-flintoff"),
      selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
      selectionFor(3, "jofra-archer", [
        selectionFor(1, "andrew-flintoff"),
        selectionFor(2, "michael-hussey", [selectionFor(1, "andrew-flintoff")]),
      ]),
    ]),
  ];
  const pathB = [
    selectionFor(1, "matthew-hoggard"),
    selectionFor(2, "andrew-symonds", [selectionFor(1, "matthew-hoggard")]),
    selectionFor(3, "joe-root", [
      selectionFor(1, "matthew-hoggard"),
      selectionFor(2, "andrew-symonds", [selectionFor(1, "matthew-hoggard")]),
    ]),
    selectionFor(4, "pat-cummins", [
      selectionFor(1, "matthew-hoggard"),
      selectionFor(2, "andrew-symonds", [selectionFor(1, "matthew-hoggard")]),
      selectionFor(3, "joe-root", [
        selectionFor(1, "matthew-hoggard"),
        selectionFor(2, "andrew-symonds", [selectionFor(1, "matthew-hoggard")]),
      ]),
    ]),
  ];

  const community = buildDailyCommunityStats(definition, [
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
