import { recentDailyDays, nextDailyResetText } from "../shared/daily-progress.js";
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

  function renderRecord(personal, message = "") {
    const history = personal?.history ?? readDailyHistory();
    const stats = personal ?? dailyHistoryStats(history, utcDate());
    const record = root.querySelector("[data-personal-record]");
    if (record) record.textContent = message || `${stats.current} day streak · Best: ${stats.best} ${stats.best === 1 ? "day" : "days"} · ${stats.gamesPlayed ?? stats.daysPlayed} ${personal ? (stats.gamesPlayed === 1 ? "game" : "games") : (stats.daysPlayed === 1 ? "day" : "days")} played`;
    const week = root.querySelector("[data-daily-week]");
    if (week) {
      week.replaceChildren(...recentDailyDays(history, utcDate()).map(day => {
        const cell = document.createElement("span");
        cell.textContent = `${day.label} ${day.completed ? "✓" : "–"}`;
        cell.dataset.completed = String(day.completed);
        cell.setAttribute("aria-label", `${day.date}: ${day.completed ? "completed" : "not completed"}`);
        return cell;
      }));
    }
  }

  async function refreshProgress() {
    const list = root.querySelector("[data-top-streaks]");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let payload;
      try {
        const response = await fetch(`/api/daily/progress?participantId=${encodeURIComponent(participantId)}`, {signal: controller.signal, cache: "no-store"});
        payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error("Unavailable");
      } finally { clearTimeout(timeout); }
      renderRecord(payload.personal);
      if (list) {
        list.replaceChildren();
        for (const entry of payload.topStreaks) {
          const item = document.createElement("li");
          item.textContent = `${entry.displayName} — ${entry.days} ${entry.days === 1 ? "day" : "days"}`;
          list.append(item);
        }
        if (!payload.topStreaks.length) list.textContent = "No streaks yet. Play a daily to start one.";
      }
    } catch {
      renderRecord(null, "Can’t load your record. Saved days shown below.");
      if (list) list.textContent = "Can’t load streaks right now.";
    }
  }

  function updateCountdown() {
    const node = root.querySelector("[data-reset-countdown]");
    if (node) node.textContent = nextDailyResetText();
  }
  updateCountdown();

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
        card.querySelector("[data-daily-card-status]").textContent = current ? view.status : "Open to check progress";
        card.dataset.completed = String(current && view.completed);
      });
      if (status) status.textContent = known === DAILY_GAMES.length
        ? `${completed} of 2 completed today.`
        : "Can’t check progress. Both games are still available.";
      await refreshProgress();
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
    updateCountdown();
    if (document.visibilityState === "visible" && lastDate !== utcDate()) void refresh();
  }, 60_000);
  void refresh();
}
