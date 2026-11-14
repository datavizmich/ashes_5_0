import assert from "node:assert/strict";
import test from "node:test";

import { getCurrentDailyChallenge, buildDailyRollPublicState } from "../site/shared/daily-ashes.js";
import { buildDailySimulationResult } from "../functions/_lib/daily.js";

test("Ashes daily win rate stays near 70% across varied dates and valid selections", () => {
  let wins = 0;
  let total = 0;
  // Sample legal choices without favouring the highest-rated player each roll.
  // Use two date ranges to avoid tuning solely to the first few challenges.
  for (const startOffset of [0, 84]) {
    let seed = 20261115;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let offset = 0; offset < 84; offset += 1) {
      const date = new Date(Date.UTC(2026, 10, 15 + startOffset + offset)).toISOString().slice(0, 10);
      const definition = getCurrentDailyChallenge(date);
      for (let path = 0; path < 12; path += 1) {
        const selections = [];
        for (let rollNumber = 1; rollNumber <= 4; rollNumber += 1) {
          const roll = buildDailyRollPublicState(definition, rollNumber, selections);
          const choices = roll.players.filter(player => player.selectable);
          assert.ok(choices.length, `${date} roll ${rollNumber} must be playable`);
          const player = choices[Math.floor(random() * choices.length)];
          const slotIndex = player.validSlotIndexes[Math.floor(random() * player.validSlotIndexes.length)];
          selections.push({ rollNumber, squadId: roll.squadId, playerId: player.id,
            stableId: player.stableId, slotIndex });
        }
        const result = buildDailySimulationResult(definition, selections);
        wins += Number(result.matches[0].result === "win");
        total += 1;
      }
    }
  }
  const winRate = wins / total;
  assert.ok(winRate >= 0.65 && winRate <= 0.75, `Expected roughly 70% wins, got ${(winRate * 100).toFixed(1)}%`);
});
