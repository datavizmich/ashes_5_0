export function formatDailyShare({ competition, date, outcome, url, practice = false }) {
  const name = competition === "worldcup" ? "World Cup Daily" : "Ashes Daily";
  return [
    `Ashes 5-0 · ${name} · ${date}${practice ? " · Practice" : ""}`,
    outcome,
    practice ? "7 players picked. 4 choices. How would your XI do?" : "Can you beat my result? Play the same four picks and compare results.",
    url,
  ].filter(Boolean).join("\n");
}
