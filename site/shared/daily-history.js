const STORAGE_KEY = "ashes-daily-history-v1";
const DAY_MS = 86_400_000;
const COMPETITIONS = new Set(["ashes", "worldcup"]);

function validDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(`${value}T00:00:00Z`))
    && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

export function readDailyHistory(storage) {
  try {
    const raw = JSON.parse((storage ?? globalThis.localStorage).getItem(STORAGE_KEY) || "{}");
    return Object.fromEntries([...COMPETITIONS].map(key => [key,
      [...new Set(Array.isArray(raw?.[key]) ? raw[key].filter(validDate) : [])].sort().slice(-730),
    ]));
  } catch { return { ashes: [], worldcup: [] }; }
}

// Call only with the server-confirmed attempt, never a click or a client simulation.
export function recordDailyCompletion({ competition, date, attemptMode, simulationComplete }, storage) {
  if (!COMPETITIONS.has(competition) || !validDate(date) || attemptMode !== "ranked" || !simulationComplete) return;
  const history = readDailyHistory(storage);
  history[competition] = [...new Set([...history[competition], date])].sort().slice(-730);
  try { (storage ?? globalThis.localStorage).setItem(STORAGE_KEY, JSON.stringify(history)); } catch {}
}

export function dailyHistoryStats(history, today) {
  if (!validDate(today)) return { current: 0, best: 0, daysPlayed: 0 };
  const dates = [...new Set([...(history.ashes || []), ...(history.worldcup || [])])]
    .filter(value => validDate(value) && value <= today).sort();
  const days = dates.map(date => Date.parse(`${date}T00:00:00Z`) / DAY_MS);
  const todayDay = Date.parse(`${today}T00:00:00Z`) / DAY_MS;
  let best = 0, run = 0, previous = -Infinity;
  for (const day of days) { run = day === previous + 1 ? run + 1 : 1; best = Math.max(best, run); previous = day; }
  const last = days.at(-1);
  return { current: last === todayDay || last === todayDay - 1 ? run : 0, best, daysPlayed: days.length };
}
