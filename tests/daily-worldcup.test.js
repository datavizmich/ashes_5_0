import assert from "node:assert/strict";
import test from "node:test";

import { buildDailyAttemptResponse, buildDailySimulationResult } from "../functions/_lib/daily-worldcup.js";
import {
  buildDailyCompletedXI,
  buildDailyRollPublicState,
  getCurrentDailyChallenge,
} from "../site/shared/daily-worldcup.js";

const WORLD_CUP_DATE = "2026-08-06";
const worldCupDefinition = getCurrentDailyChallenge(WORLD_CUP_DATE);

function buildAttempt({
  currentRollNumber = 1,
  draftComplete = false,
  simulationComplete = false,
  attemptMode = "ranked",
  displayName = "",
  result = null,
} = {}) {
  return {
    id: "worldcup-attempt-1",
    challengeId: worldCupDefinition.id,
    participantId: "participant-worldcup",
    attemptMode,
    displayName,
    currentRollNumber,
    draftComplete,
    simulationComplete,
    result,
  };
}

function selectFirstValidPlayer(rollNumber, selections = []) {
  const roll = buildDailyRollPublicState(worldCupDefinition, rollNumber, selections);
  const player = roll?.players?.find((entry) => entry.selectable && (entry.validSlotIndexes ?? []).length);
  assert.ok(roll, `Expected roll ${rollNumber} to exist.`);
  assert.ok(player, `Expected a selectable player on roll ${rollNumber}.`);

  return {
    rollNumber,
    squadId: roll.squadId,
    playerId: player.id,
    stableId: player.stableId,
    slotIndex: player.validSlotIndexes[0],
  };
}

function completedSelections() {
  const rollOne = selectFirstValidPlayer(1, []);
  const rollTwo = selectFirstValidPlayer(2, [rollOne]);
  const rollThree = selectFirstValidPlayer(3, [rollOne, rollTwo]);
  const rollFour = selectFirstValidPlayer(4, [rollOne, rollTwo, rollThree]);
  return [rollOne, rollTwo, rollThree, rollFour];
}

test("world cup daily challenge exposes a deterministic ODI draft on August 6, 2026", () => {
  const definition = getCurrentDailyChallenge(WORLD_CUP_DATE);

  assert.equal(definition.id, "daily-worldcup-2026-08-06");
  assert.equal(definition.date, WORLD_CUP_DATE);
  assert.equal(definition.fixedAssignments.length, 7);
  assert.equal(definition.rolls.length, 4);
  assert.equal(definition.conditions.venueLabel, "Mumbai");
});

test("world cup daily attempt response only exposes the current roll before the XI is complete", () => {
  const response = buildDailyAttemptResponse(worldCupDefinition, buildAttempt(), []);
  const currentSquadId = worldCupDefinition.rolls[0].squadId;

  assert.equal(response.currentRoll.rollNumber, 1);
  assert.equal(response.currentRoll.squadId, currentSquadId);
  assert.ok(response.currentRoll.players.every((player) => player.squadId === currentSquadId));
  assert.equal(response.completedXI, undefined);
  assert.equal(response.recap, undefined);
  assert.equal(response.result, undefined);
});

test("world cup daily simulation produces a single limited-overs result from a completed XI", () => {
  const selections = completedSelections();
  const completedXI = buildDailyCompletedXI(worldCupDefinition, selections);
  const result = buildDailySimulationResult(worldCupDefinition, selections);

  assert.equal(completedXI.length, 11);
  assert.equal(result.format, "limited-overs");
  assert.equal(result.matches.length, 1);
  assert.equal(result.matches[0].format, "limited-overs");
  assert.equal(result.matches[0].innings.length, 2);
});
