import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import { XI_SLOTS, playerSlotScore, slotAcceptsPlayer } from "../site/shared/ashes-core.js";
import * as ashes from "../site/shared/daily-ashes.js";
import * as worldcup from "../site/shared/daily-worldcup.js";

const previousDefinitions = {
  ashes: [
    "99af7553142505c57d81d7f2bbe2cc3f5d89f5b10ae376cd61c5333d6c1a1f70",
    "70ca6edf5a0edaec07912850e77ab7701db269ca654401daba5fac318acc903b",
  ],
  worldcup: [
    "4a35026728e79aa7d6684581059d26713e36510d4ddc3fc81f468a207b6d47d7",
    "58c77792b226b62940f7a6007cf066371e070000b923900d9a3c1d86bbc37126",
  ],
};

for (const [competition, api] of Object.entries({ ashes, worldcup })) {
  test(`${competition} preserves challenges created before varied positions launch`, () => {
    for (const [index, date] of ["2026-11-13", "2026-11-14"].entries()) {
      const definition = api.getCurrentDailyChallenge(date);
      const hash = createHash("sha256").update(JSON.stringify(definition)).digest("hex");
      assert.equal(hash, previousDefinitions[competition][index]);
    }
  });

  test(`${competition} daily opposition has the intended strength and remains a valid, separate XI`, () => {
    // Mean role scores from the original opposition picker for these 28 dates.
    const previousMeanScore = competition === "ashes" ? 72.07350649350649 : 73.26528409090909;
    let totalScore = 0;
    for (let offset = 0; offset < 28; offset += 1) {
      const date = new Date(Date.UTC(2026, 10, 15 + offset)).toISOString().slice(0, 10);
      const definition = api.getCurrentDailyChallenge(date);
      const opposition = api.getDailyOppositionPlayers(definition);
      const dailyPlayers = new Set([
        ...definition.fixedPlayerStableIds,
        ...definition.rolls.flatMap(roll => roll.eligibleStableIds),
      ]);
      assert.equal(opposition.length, 11);
      assert.equal(new Set(opposition.map(player => player.stableId)).size, 11);
      opposition.forEach((player, index) => {
        assert.ok(slotAcceptsPlayer(XI_SLOTS[index], player));
        assert.ok(!dailyPlayers.has(player.stableId));
        totalScore += playerSlotScore(player, XI_SLOTS[index]);
      });
    }
    const reduction = previousMeanScore - totalScore / (28 * 11);
    const [minimumReduction, maximumReduction] = competition === "ashes" ? [1.7, 2.6] : [0.3, 1.5];
    assert.ok(reduction > minimumReduction && reduction < maximumReduction, `Unexpected role-score reduction: ${reduction}`);
  });

  test(`${competition} varies daily positions with four playable selections and a shared daily layout`, async () => {
    // A fresh module instance verifies regeneration rather than a cache hit.
    const freshApi = await import(`../site/shared/daily-${competition === "ashes" ? "ashes" : "worldcup"}.js?variety-test`);
    const seenOpenSlots = new Set();
    const layouts = new Set();

    for (let offset = 0; offset < 14; offset += 1) {
      const date = new Date(Date.UTC(2026, 10, 15 + offset)).toISOString().slice(0, 10);
      const definition = api.getCurrentDailyChallenge(date);
      assert.deepEqual(definition, freshApi.getDailyChallengeById(definition.id));
      assert.equal(definition.fixedAssignments.length, 7);
      assert.equal(definition.rolls.length, 4);
      const occupied = new Set(definition.fixedAssignments.map(({ slotIndex }) => slotIndex));
      assert.equal(occupied.size, 7);
      const openSlots = XI_SLOTS.map((_, index) => index).filter(index => !occupied.has(index));
      openSlots.forEach(index => seenOpenSlots.add(index));
      layouts.add(openSlots.join(","));
      assert.ok(api.countDailyCompletionPaths(definition, [], 1, 4) >= 4, `${date} needs multiple completion paths`);

      const selections = [];
      for (let rollNumber = 1; rollNumber <= 4; rollNumber += 1) {
        const roll = api.buildDailyRollPublicState(definition, rollNumber, selections);
        assert.equal(roll.players.length, 5);
        const player = roll.players.find(candidate => candidate.selectable && candidate.validSlotIndexes.length);
        assert.ok(player, `${date} roll ${rollNumber} must remain playable`);
        selections.push({ rollNumber, squadId: roll.squadId, playerId: player.id,
          stableId: player.stableId, slotIndex: player.validSlotIndexes[0] });
      }
      const lineup = api.buildDailyCompletedXI(definition, selections);
      assert.equal(lineup.length, 11);
      assert.equal(new Set(lineup.map(player => player.stableId)).size, 11);
      lineup.forEach((player, index) => assert.ok(slotAcceptsPlayer(XI_SLOTS[index], player)));
    }

    assert.ok(layouts.size >= 4, "Daily layouts should vary across the fortnight");
    assert.ok(seenOpenSlots.has(0) || seenOpenSlots.has(1), "Some days should require an opener");
    assert.ok(seenOpenSlots.has(7), "Some days should require a spinner");
    assert.ok(seenOpenSlots.has(5), "Some days should require a wicketkeeper");
  });
}
