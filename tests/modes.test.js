import assert from "node:assert/strict";
import test from "node:test";

import { PLAYABLE_MODE_DEFS, playableModeDef } from "../site/shared/modes.js";

test("classic mode shows player ratings while drafting", () => {
  assert.equal(playableModeDef("classic").showPlayerRatings, true);
  assert.match(PLAYABLE_MODE_DEFS.classic.draftNote, /visible/u);
});

test("memory mode hides player ratings while drafting", () => {
  assert.equal(playableModeDef("memory").showPlayerRatings, false);
  assert.match(PLAYABLE_MODE_DEFS.memory.draftNote, /hidden/u);
});
