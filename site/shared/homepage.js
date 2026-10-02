// Shared by the server renderer and browser. Only trusted, static copy belongs here.
export const HOME_COPY = Object.freeze({
  title: "Your cricket judgement. Two daily challenges.",
  tagline: "Seven players picked. Four choices left. Can your XI win?",
  lede: "Play one Test in Ashes Daily or one ODI in World Cup Daily. Everyone gets the same four squad rolls within each format. Free to play, with no account required.",
  panelTitle: "Build a full XI or challenge a friend",
});

export const DAILY_GAMES = Object.freeze([
  Object.freeze({ key: "ashes", name: "Ashes Daily", path: "/daily", api: "/api/daily/current", mode: "daily", format: "One Test", description: "Complete your England and Australia XI.", hook: "data-home-primary-cta" }),
  Object.freeze({ key: "worldcup", name: "World Cup Daily", path: "/world-cup/daily", api: "/api/world-cup/daily/current", mode: "worldcup_daily", format: "One ODI", description: "Complete your XI from historic World Cup squads.", hook: "data-home-secondary-cta" }),
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
    <p class="daily-hub-status" data-daily-hub-status role="status">Two formats. A fresh challenge in each, every day.</p>
    <p class="daily-hub-reset">New challenges at 00:00 UTC. Progress is remembered in this browser.</p>`;
}

export function renderDraftCards() {
  return `
    <a class="mode-card" href="/ashes?mode=classic" data-home-card="classic"><strong>Ashes Classic Draft</strong><p>Build all 11 places with ratings visible, then play a five-Test series.</p></a>
    <a class="mode-card" href="/ashes?mode=memory" data-home-card="memory"><strong>Ashes Memory Draft</strong><p>Build all 11 places with ratings hidden. Trust your cricket knowledge.</p></a>
    <a class="mode-card mode-card-worldcup" href="/world-cup" data-home-card="worldCup"><strong>World Cup Full Draft</strong><p>Build all 11 places, then play the group stage and knockouts.</p></a>
    <a class="mode-card" href="/challenge" data-home-card="challenge"><strong>Challenge a Friend</strong><p>Draft an Ashes XI and send a private link for a friend to take you on.</p></a>`;
}

export function dailyCardState(game, summary) {
  const attempt = summary?.rankedAttempt;
  if (attempt?.simulationComplete) return { status: "Completed today", action: `View ${game.name} result →`, completed: true };
  if (attempt?.draftComplete) return { status: "Your XI is ready", action: `Play your ${game.format === "One Test" ? "Test" : "ODI"} →`, completed: false };
  if (attempt?.attemptId) return { status: "Draft in progress", action: `Continue ${game.name} →`, completed: false };
  return { status: "Ready to play", action: `Play ${game.name} →`, completed: false };
}
