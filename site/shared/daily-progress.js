export function nextDailyResetText(now = new Date()) {
  const remaining = 86400000 - (now.getTime() % 86400000);
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  return `Next daily challenges in ${hours}h ${minutes}m · 00:00 UTC`;
}

export function recentDailyDays(history, today) {
  const completed = new Set([...(history?.ashes ?? []), ...(history?.worldcup ?? [])]);
  return Array.from({length: 7}, (_, index) => {
    const date = new Date(`${today}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - 6 + index);
    const key = date.toISOString().slice(0, 10);
    return {date: key, label: date.toLocaleDateString('en-GB', {weekday: 'short', timeZone: 'UTC'}), completed: completed.has(key)};
  });
}
