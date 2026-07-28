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
      request: new Request("http://localhost:8788/api/leaderboards/players?metric=selected&period=all&mode=all"),
      env: {
        DB: {
          prepare() {
            throw new Error("Local DB should not be queried when proxying the leaderboard.");
          },
        },
      },
    });

    assert.equal(requestedUrl, "https://ashes-5-0.co.uk/api/leaderboards/players?metric=selected&period=all&mode=all");
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), payload);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
