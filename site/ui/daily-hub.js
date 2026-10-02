import { DAILY_GAMES, dailyCardState } from "../shared/homepage.js";
import { readDailyHistory, recordDailyCompletion, dailyHistoryStats } from "../shared/daily-history.js";

// A read-only loader: deliberately does not use app.js's mutable STATE.daily.
export async function fetchDailySummary(game, participantId, fetchImpl = fetch) {
  const query = participantId ? `?participantId=${encodeURIComponent(participantId)}` : "";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetchImpl(`${game.api}${query}`, {
      headers: { Accept: "application/json" }, cache: "no-store", signal: controller.signal,
    });
    const payload = await response.json();
    if (!response.ok || payload.ok === false || !payload.challenge?.id || !payload.challenge?.date) {
      throw new Error("Daily status unavailable");
    }
    return payload.challenge;
  } finally {
    clearTimeout(timeout);
  }
}

export function initDailyHub({ root, participantId, track = () => {} }) {
  if (!root) return;
  let pending = null;
  let lastLoaded = 0;
  let lastDate = "";
  const utcDate = () => new Date().toISOString().slice(0, 10);
  const status = root.querySelector("[data-daily-hub-status]");

  async function refresh({ force = false } = {}) {
    if (pending) return pending;
    if (!force && lastDate === utcDate() && Date.now() - lastLoaded < 60_000) return;
    pending = (async () => {
      const results = await Promise.allSettled(DAILY_GAMES.map((game) => fetchDailySummary(game, participantId)));
      let completed = 0;
      let known = 0;
      results.forEach((result, index) => {
        const game = DAILY_GAMES[index];
        const card = root.querySelector(`[data-daily-card="${game.key}"]`);
        if (!card) return;
        const summary = result.status === "fulfilled" ? result.value : null;
        // Do not display yesterday's completion as today's (including a stale proxy response).
        const current = summary?.date === utcDate();
        const view = dailyCardState(game, current ? summary : null);
        if (current) {
          known += 1;
          completed += Number(view.completed);
          recordDailyCompletion({competition: game.key, date: summary.date,
            attemptMode: summary.rankedAttempt?.attemptMode,
            simulationComplete: summary.rankedAttempt?.simulationComplete});
        }
        card.querySelector("[data-daily-card-action]").textContent = view.action;
        card.querySelector("[data-daily-card-status]").textContent = current ? view.status : "Open the game to check your progress";
        card.dataset.completed = String(current && view.completed);
      });
      const stats = dailyHistoryStats(readDailyHistory(), utcDate());
      const streak = stats.current ? ` ${stats.current} ${stats.current === 1 ? "day" : "days"} played in a row.` : "";
      if (status) status.textContent = known === DAILY_GAMES.length
        ? `${completed} of 2 daily challenges completed today.${streak}`
        : "Progress could not be checked for every game. Both challenges can still be opened.";
      lastDate = utcDate();
      lastLoaded = Date.now();
    })().finally(() => { pending = null; });
    return pending;
  }

  root.addEventListener("click", (event) => {
    const card = event.target.closest?.("[data-daily-card]");
    if (!card) return;
    const game = DAILY_GAMES.find((entry) => entry.key === card.dataset.dailyCard);
    if (game) track("mode_selected", { mode: game.mode, competition: game.key, source: "home_daily_card" });
  });
  window.addEventListener("pageshow", () => { void refresh({ force: true }); });
  window.addEventListener("focus", () => { void refresh(); });
  window.addEventListener("storage", () => { void refresh({ force: true }); });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void refresh();
  });
  // Date rollover without an endlessly polling network request.
  setInterval(() => {
    if (document.visibilityState === "visible" && lastDate !== utcDate()) void refresh();
  }, 60_000);
  void refresh();
}
