import assert from "node:assert/strict";
import test from "node:test";

import { addDailySelection } from "../functions/_lib/daily-store.js";
import { buildPlayerSeedStatements, createTeam } from "../functions/_lib/store.js";
import { catalogForCompetition } from "../site/shared/ashes-core.js";

function createRecordingDb(teamRow = null) {
  const prepared = [];
  const batchCalls = [];

  return {
    prepared,
    batchCalls,
    prepare(sql) {
      const statement = {
        sql,
        values: [],
        bind(...values) {
          this.values = values;
          return this;
        },
        async run() {
          return {};
        },
        async first() {
          if (sql.includes("FROM teams")) {
            return teamRow;
          }
          return null;
        },
      };
      prepared.push(statement);
      return statement;
    },
    async batch(statements) {
      batchCalls.push(statements.map((statement) => ({ sql: statement.sql, values: statement.values })));
      return statements;
    },
  };
}

test("player seed statements include World Cup players that may not yet exist in D1", () => {
  const db = createRecordingDb();
  const statements = buildPlayerSeedStatements(db, ["sachin-tendulkar", "glenn-maxwell"]);

  assert.equal(statements.length, 2);
  assert.match(statements[0].sql, /INSERT OR IGNORE INTO players/u);
  assert.deepEqual(statements[0].values, ["sachin-tendulkar", "Sachin Tendulkar", "[\"Opener\"]"]);
  assert.deepEqual(statements[1].values, ["glenn-maxwell", "Glenn Maxwell", "[\"All-rounder\"]"]);
});

test("daily selections seed missing World Cup players before inserting the attempt selection", async () => {
  const db = createRecordingDb();
  const firstWorldCupPlayer = catalogForCompetition("worldcup")[0];

  await addDailySelection(
    db,
    "attempt-worldcup-1",
    {
      rollNumber: 1,
      squadId: firstWorldCupPlayer.squadId,
      stableId: firstWorldCupPlayer.stableId,
      playerId: firstWorldCupPlayer.id,
      slotIndex: 0,
    },
    "2026-08-06T20:55:00Z",
  );

  assert.equal(db.batchCalls.length, 1);
  assert.match(db.batchCalls[0][0].sql, /INSERT OR IGNORE INTO players/u);
  assert.equal(db.batchCalls[0][0].values[0], firstWorldCupPlayer.stableId);
  assert.match(db.batchCalls[0][1].sql, /INSERT INTO daily_attempt_selections/u);
  assert.deepEqual(db.batchCalls[0][1].values, [
    "attempt-worldcup-1",
    1,
    firstWorldCupPlayer.squadId,
    firstWorldCupPlayer.stableId,
    firstWorldCupPlayer.id,
    0,
    "2026-08-06T20:55:00Z",
  ]);
});

test("persisted World Cup teams seed player rows before inserting team_players rows", async () => {
  const lineup = catalogForCompetition("worldcup").slice(0, 11);
  const team = {
    submissionKey: "team-worldcup-1",
    competition: "worldcup",
    mode: "classic",
    displayName: "Alice",
    lineupPlayerIds: lineup.map((player) => player.id),
    lineup,
    dataVersion: "ashes-5-0-data-v1",
  };
  const db = createRecordingDb({
    id: team.submissionKey,
    submission_key: team.submissionKey,
    source: "solo",
    competition: team.competition,
    mode: team.mode,
    display_name: team.displayName,
    lineup_json: JSON.stringify(team.lineupPlayerIds),
    data_version: team.dataVersion,
    created_at: "2026-08-06T20:55:00Z",
  });

  const savedTeam = await createTeam(db, team, "solo", "2026-08-06T20:55:00Z");

  assert.equal(db.batchCalls.length, 1);
  assert.match(db.batchCalls[0][0].sql, /INSERT OR IGNORE INTO players/u);
  assert.match(db.batchCalls[0][lineup.length].sql, /INSERT INTO teams/u);
  assert.match(db.batchCalls[0][lineup.length + 1].sql, /INSERT INTO team_players/u);
  assert.equal(savedTeam?.competition, "worldcup");
  assert.equal(savedTeam?.lineup.length, 11);
});
