import assert from "node:assert/strict";
import test from "node:test";
import { DAILY_GAMES, dailyCardState, renderDailyCards } from "../site/shared/homepage.js";
import { fetchDailySummary } from "../site/ui/daily-hub.js";
import { formatDailyShare } from "../site/shared/daily-share.js";

const [ashes, worldcup] = DAILY_GAMES;
test("both formats are navigable before any status request completes", () => {
  const html = renderDailyCards();
  assert.match(html, /href="\/daily"/);
  assert.match(html, /href="\/world-cup\/daily"/);
  assert.doesNotMatch(html, /disabled/);
});
test("daily card distinguishes unstarted, draft, simulation and completed states", () => {
  assert.equal(dailyCardState(ashes, {}).action, "Play Ashes Daily →");
  assert.equal(dailyCardState(worldcup, {rankedAttempt: {attemptId: "a"}}).action, "Continue World Cup Daily →");
  assert.equal(dailyCardState(worldcup, {rankedAttempt: {attemptId: "a", draftComplete: true}}).action, "Play your ODI →");
  assert.equal(dailyCardState(ashes, {rankedAttempt: {attemptId: "a", draftComplete: true, simulationComplete: true}}).completed, true);
});
test("status requests stay read-only and use separate competition endpoints", async () => {
  const urls = [];
  const mockFetch = async (url, options) => {
    urls.push(url);
    assert.equal(options.cache, "no-store");
    assert.equal(options.method, undefined); // fetch defaults to GET
    return {ok: true, json: async () => ({ok: true, challenge: {id: url, date: "2026-10-02"}})};
  };
  const results = await Promise.all(DAILY_GAMES.map(game => fetchDailySummary(game, "participant", mockFetch)));
  assert.equal(urls[0], "/api/daily/current?participantId=participant");
  assert.equal(urls[1], "/api/world-cup/daily/current?participantId=participant");
  assert.notEqual(results[0].id, results[1].id);
});
test("one failing status request does not discard the other game's status", async () => {
  const mockFetch = async url => {
    if (url.includes("world-cup")) throw new Error("offline");
    return {ok: true, json: async () => ({challenge: {id: "ashes", date: "2026-10-02"}})};
  };
  const results = await Promise.allSettled(DAILY_GAMES.map(game => fetchDailySummary(game, "", mockFetch)));
  assert.equal(results[0].status, "fulfilled");
  assert.equal(results[1].status, "rejected");
});
test("malformed API success is rejected, not shown as ready/completed", async () => {
  await assert.rejects(fetchDailySummary(ashes, "", async () => ({ok: true, json: async () => ({ok: true})})));
});
test("daily shares identify competition, date and practice without player spoilers", () => {
  const text = formatDailyShare({competition: "worldcup", date: "2026-10-02", outcome: "Won by 5 wickets", url: "https://ashes-5-0.co.uk/world-cup/daily", practice: true});
  assert.match(text, /World Cup Daily/);
  assert.match(text, /2026-10-02 · Practice/);
  assert.match(text, /Won by 5 wickets/);
  assert.match(text, /world-cup\/daily/);
});
