// Shared by the server renderer and browser. Only trusted, static copy belongs here.
export const HOME_COPY = Object.freeze({
  title: "Daily cricket challenges",
  tagline: "Four picks. One match.",
  lede: "Pick four players, then play a Test or ODI. Same squads for everyone. Free, with no sign-up.",
  panelTitle: "More ways to play",
});

export const DAILY_GAMES = Object.freeze([
  Object.freeze({ key: "ashes", name: "Ashes Daily", path: "/daily", api: "/api/daily/current", mode: "daily", format: "One Test", description: "England and Australia.", hook: "data-home-primary-cta" }),
  Object.freeze({ key: "worldcup", name: "World Cup Daily", path: "/world-cup/daily", api: "/api/world-cup/daily/current", mode: "worldcup_daily", format: "One ODI", description: "Past World Cup squads.", hook: "data-home-secondary-cta" }),
]);

export function renderDailyCards() {
  return DAILY_GAMES.map((game) => `
    <a class="daily-card daily-card-${game.key}" href="${game.path}" ${game.hook} data-daily-card="${game.key}">
      <span class="daily-card-format">${game.format} · Four picks</span>
      <strong>${game.name}</strong>
      <span class="daily-card-description">${game.description}</span>
      <span class="daily-card-status" data-daily-card-status>New challenge every day</span>
      <span class="daily-card-action" data-daily-card-action>Play ${game.name} →</span>
    </a>`).join("") + `
    <p class="daily-hub-status" data-daily-hub-status role="status">Two new games each day.</p>
    <p class="daily-hub-reset">Resets at 00:00 UTC. Progress saved in this browser.</p>
    <section class="daily-progress-card" aria-labelledby="daily-record-title">
      <h2 id="daily-record-title">Your record</h2>
      <p data-personal-record>Loading your record…</p>
      <div class="daily-week" data-daily-week aria-label="Your last seven days"></div>
      <p class="daily-record-note">Finish either daily to keep your streak. Any result counts.</p>
      <p data-reset-countdown>New challenges at 00:00 UTC</p>
    </section>
    <section class="daily-progress-card" aria-labelledby="daily-streak-title">
      <h2 id="daily-streak-title">Longest streaks · Top 3</h2>
      <ol data-top-streaks><li>Loading streaks…</li></ol>
      <p class="daily-record-note">Longest runs of daily play. Either format counts, once per UTC day. No practice or late replays.</p>
    </section>`;
}

export function renderDraftCards() {
  return `
    <a class="mode-card" href="/ashes?mode=classic" data-home-card="classic"><strong>Ashes Classic Draft</strong><p>Pick your XI with ratings shown. Play five Tests.</p></a>
    <a class="mode-card" href="/ashes?mode=memory" data-home-card="memory"><strong>Ashes Memory Draft</strong><p>Pick your XI with ratings hidden.</p></a>
    <a class="mode-card mode-card-worldcup" href="/world-cup" data-home-card="worldCup"><strong>World Cup Full Draft</strong><p>Pick your XI. Play the groups and knockouts.</p></a>
    <a class="mode-card" href="/challenge" data-home-card="challenge"><strong>Challenge a Friend</strong><p>Pick an Ashes XI and take on a friend.</p></a>`;
}

export function dailyCardState(game, summary) {
  const attempt = summary?.rankedAttempt;
  if (attempt?.simulationComplete) return { status: "Completed today", action: `View ${game.name} result →`, completed: true };
  if (attempt?.draftComplete) return { status: "Your XI is ready", action: `Play your ${game.format === "One Test" ? "Test" : "ODI"} →`, completed: false };
  if (attempt?.attemptId) return { status: "Draft in progress", action: `Continue ${game.name} →`, completed: false };
  return { status: "Ready to play", action: `Play ${game.name} →`, completed: false };
}
