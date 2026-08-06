import assert from "node:assert/strict";
import test from "node:test";

import { onRequestGet as leaderboardApiRoute } from "../functions/api/leaderboards/players.js";

test("leaderboard API proxies the canonical site during localhost Pages development", async () => {
  const originalFetch = globalThis.fetch;
  const payload = {
    ok: true,
    metric: "selected",
    period: "all",
    mode: "all",
    totalTeams: 123,
    entries: [{ playerId: "don-bradman", name: "Don Bradman", count: 42 }],
    limit: 20,
  };

  let requestedUrl = "";
  globalThis.fetch = async (url) => {
    requestedUrl = String(url);
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  };

  try {
    const response = await leaderboardApiRoute({
      request: new Request("http://localhost:8788/api/leaderboards/players?metric=selected&period=all&mode=all&competition=worldcup"),
      env: {
        DB: {
          prepare() {
            throw new Error("Local DB should not be queried when proxying the leaderboard.");
          },
        },
      },
    });

    assert.equal(requestedUrl, "https://ashes-5-0.co.uk/api/leaderboards/players?metric=selected&period=all&mode=all&competition=worldcup");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), payload);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("leaderboard API filters results by competition on the production query path", async () => {
  const prepared = [];
  const bound = [];
  const db = {
    prepare(sql) {
      prepared.push(sql);
      return {
        bind(...values) {
          bound.push(values);
          return this;
        },
      };
    },
    async batch() {
      return [
        { results: [{ total_teams: 7 }] },
        { results: [{ id: "sachin-tendulkar", name: "Sachin Tendulkar", count: 4 }] },
      ];
    },
  };

  const response = await leaderboardApiRoute({
    request: new Request("https://ashes-5-0.co.uk/api/leaderboards/players?metric=selected&period=all&mode=all&competition=worldcup"),
    env: { DB: db },
  });

  assert.equal(response.status, 200);
  assert.match(prepared[0], /COALESCE\(t\.competition, 'ashes'\) = \?/u);
  assert.deepEqual(bound[0], ["worldcup"]);
  assert.deepEqual(bound[1], ["worldcup", 20]);
  assert.deepEqual(await response.json(), {
    ok: true,
    competition: "worldcup",
    metric: "selected",
    period: "all",
    mode: "all",
    totalTeams: 7,
    entries: [{ playerId: "sachin-tendulkar", name: "Sachin Tendulkar", count: 4 }],
    limit: 20,
  });
});
