import assert from "node:assert/strict";
import test from "node:test";

import { onRequestGet as adminEntriesRoute } from "../functions/api/admin/daily/challenges/[id]/entries.js";
import { onRequestPost as adminVisibilityRoute } from "../functions/api/admin/daily/attempts/[attemptId]/visibility.js";

function buildAttemptRow(state) {
  return {
    id: state.id,
    challenge_id: state.challengeId,
    participant_id: state.participantId,
    attempt_mode: "ranked",
    submission_key: state.submissionKey,
    display_name: state.displayName,
    current_roll_number: 4,
    draft_complete: 1,
    simulation_complete: 1,
    hidden_from_public: state.hiddenFromPublic,
    hidden_reason: state.hiddenReason,
    result_json: JSON.stringify({
      matches: [{ summary: "Won by 12 runs", headline: "Strong finish" }],
    }),
    created_at: "2026-08-09T10:00:00Z",
    updated_at: state.updatedAt,
    completed_at: "2026-08-09T10:05:00Z",
    hidden_at: state.hiddenAt,
  };
}

function createAdminDb(initial = {}) {
  const state = {
    id: initial.id ?? "attempt-abc",
    challengeId: initial.challengeId ?? "daily-ashes-2026-08-09",
    participantId: initial.participantId ?? "participant-123",
    submissionKey: initial.submissionKey ?? "submission-12345",
    displayName: initial.displayName ?? "Test User",
    hiddenFromPublic: initial.hiddenFromPublic ?? 0,
    hiddenReason: initial.hiddenReason ?? "",
    hiddenAt: initial.hiddenAt ?? null,
    updatedAt: initial.updatedAt ?? "2026-08-09T10:05:00Z",
  };

  return {
    state,
    prepare(sql) {
      return {
        values: [],
        bind(...values) {
          this.values = values;
          return this;
        },
        async all() {
          if (sql === "PRAGMA table_info(daily_attempts)") {
            return {
              results: [
                { name: "id" },
                { name: "display_name" },
                { name: "hidden_from_public" },
                { name: "hidden_reason" },
                { name: "hidden_at" },
              ],
            };
          }
          if (sql === "PRAGMA table_info(daily_attempt_selections)") {
            return {
              results: [
                { name: "attempt_id" },
                { name: "slot_index" },
              ],
            };
          }
          if (sql.includes("FROM daily_attempts") && sql.includes("WHERE challenge_id = ?1 AND attempt_mode = 'ranked'")) {
            return { results: [buildAttemptRow(state)] };
          }
          return { results: [] };
        },
        async first() {
          if (sql.includes("FROM daily_attempts") && sql.includes("WHERE id = ?1")) {
            return buildAttemptRow(state);
          }
          return null;
        },
        async run() {
          if (sql.includes("UPDATE daily_attempts") && sql.includes("hidden_from_public")) {
            state.hiddenFromPublic = this.values[1];
            state.hiddenReason = this.values[2];
            state.hiddenAt = this.values[3];
            state.updatedAt = this.values[4];
          }
          return {};
        },
      };
    },
    async batch(statements) {
      return statements;
    },
  };
}

test("admin daily entries route returns ranked attempts when the token is valid", async () => {
  const db = createAdminDb();
  const response = await adminEntriesRoute({
    request: new Request("https://ashes-5-0.co.uk/api/admin/daily/challenges/daily-ashes-2026-08-09/entries", {
      headers: {
        authorization: "Bearer secret-token",
      },
    }),
    env: {
      ADMIN_MODERATION_TOKEN: "secret-token",
      DB: db,
    },
    params: {
      id: "daily-ashes-2026-08-09",
    },
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.ok, true);
  assert.equal(payload.totalEntries, 1);
  assert.equal(payload.entries[0].attemptId, "attempt-abc");
  assert.equal(payload.entries[0].displayName, "Test User");
  assert.equal(payload.entries[0].hiddenFromPublic, false);
});

test("admin visibility route can hide and unhide a daily attempt", async () => {
  const db = createAdminDb();

  const hideResponse = await adminVisibilityRoute({
    request: new Request("https://ashes-5-0.co.uk/api/admin/daily/attempts/attempt-abc/visibility", {
      method: "POST",
      headers: {
        authorization: "Bearer secret-token",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        hidden: true,
        reason: "offensive name",
      }),
    }),
    env: {
      ADMIN_MODERATION_TOKEN: "secret-token",
      DB: db,
    },
    params: {
      attemptId: "attempt-abc",
    },
  });

  assert.equal(hideResponse.status, 200);
  let payload = await hideResponse.json();
  assert.equal(payload.hiddenFromPublic, true);
  assert.equal(payload.hiddenReason, "offensive name");

  const unhideResponse = await adminVisibilityRoute({
    request: new Request("https://ashes-5-0.co.uk/api/admin/daily/attempts/attempt-abc/visibility", {
      method: "POST",
      headers: {
        "x-admin-token": "secret-token",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        hidden: false,
      }),
    }),
    env: {
      ADMIN_MODERATION_TOKEN: "secret-token",
      DB: db,
    },
    params: {
      attemptId: "attempt-abc",
    },
  });

  assert.equal(unhideResponse.status, 200);
  payload = await unhideResponse.json();
  assert.equal(payload.hiddenFromPublic, false);
  assert.equal(payload.hiddenReason, "");
});
