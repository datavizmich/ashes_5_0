import assert from "node:assert/strict";
import test from "node:test";

import { validatePublicDisplayName } from "../functions/_lib/display-name-moderation.js";

test("public display names allow normal cricket-style names", () => {
  assert.equal(validatePublicDisplayName("Joe Root"), "Joe Root");
  assert.equal(validatePublicDisplayName("O'Connor_99"), "O'Connor_99");
  assert.equal(validatePublicDisplayName(""), "");
});

test("public display names reject blocked or reserved names", () => {
  assert.throws(() => validatePublicDisplayName("admin"), /reserved/u);
  assert.throws(() => validatePublicDisplayName("sh1thead"), /not allowed/u);
  assert.throws(() => validatePublicDisplayName("Naz1Fan"), /not allowed/u);
});

test("public display names reject unsupported characters", () => {
  assert.throws(() => validatePublicDisplayName("Ben🙂"), /only use letters, numbers/u);
});
