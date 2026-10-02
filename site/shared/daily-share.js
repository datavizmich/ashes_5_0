export function formatDailyShare({ competition, date, outcome, url, practice = false }) {
  const name = competition === "worldcup" ? "World Cup Daily" : "Ashes Daily";
  return [
    `Ashes 5-0 · ${name} · ${date}${practice ? " · Practice" : ""}`,
    outcome,
    "7 players picked. 4 choices. How would your XI do?",
    url,
  ].filter(Boolean).join("\n");
}
