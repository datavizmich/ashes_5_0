import { dailyHistoryStats } from '../../site/shared/daily-history.js';
import { normalizeDisplayName } from '../../site/shared/ashes-core.js';

// Only a ranked game finished on its challenge's UTC date earns a streak day.
export const STREAKS_SQL = `
WITH eligible AS (
  SELECT participant_id, display_name, completed_at, substr(challenge_id, -10) AS day
  FROM daily_attempts
  WHERE attempt_mode = 'ranked' AND simulation_complete = 1 AND hidden_from_public = 0
    AND (challenge_id LIKE 'daily-ashes-%' OR challenge_id LIKE 'daily-worldcup-%')
    AND date(completed_at) = substr(challenge_id, -10) AND date(completed_at) <= ?1
), days AS (
  SELECT DISTINCT participant_id, day FROM eligible
), islands AS (
  SELECT participant_id, day,
    julianday(day) - ROW_NUMBER() OVER (PARTITION BY participant_id ORDER BY day) AS island
  FROM days
), runs AS (
  SELECT participant_id, COUNT(*) AS length, MAX(day) AS last_day
  FROM islands GROUP BY participant_id, island
), best AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY participant_id ORDER BY length DESC, last_day DESC) AS position
  FROM runs
), names AS (
  SELECT participant_id, display_name,
    ROW_NUMBER() OVER (PARTITION BY participant_id ORDER BY completed_at DESC, display_name) AS position
  FROM eligible WHERE trim(display_name) <> ''
)
SELECT COALESCE(names.display_name, 'Anonymous') AS display_name, best.length, best.last_day
FROM best LEFT JOIN names ON best.participant_id = names.participant_id AND names.position = 1
WHERE best.position = 1
ORDER BY best.length DESC, best.last_day DESC, best.participant_id LIMIT 3`;

export async function loadDailyProgress(db, participantId, today) {
  const leaders = await db.prepare(STREAKS_SQL).bind(today).all();
  const topStreaks = (leaders.results ?? []).map(row => ({
    displayName: normalizeDisplayName(row.display_name) || 'Anonymous',
    days: Number(row.length), lastDay: row.last_day,
  }));
  if (!participantId) return { topStreaks, personal: null };
  const records = await db.prepare(`SELECT challenge_id, completed_at FROM daily_attempts
    WHERE participant_id = ?1 AND attempt_mode = 'ranked' AND simulation_complete = 1
    AND date(completed_at) <= ?2
    AND (challenge_id LIKE 'daily-ashes-%' OR challenge_id LIKE 'daily-worldcup-%')
    ORDER BY completed_at`).bind(participantId, today).all();
  const history = { ashes: [], worldcup: [] };
  const rows = records.results ?? [];
  for (const row of rows) {
    const date = row.challenge_id.slice(-10);
    if (row.completed_at?.slice(0, 10) !== date) continue;
    history[row.challenge_id.startsWith('daily-worldcup-') ? 'worldcup' : 'ashes'].push(date);
  }
  return { topStreaks, personal: { ...dailyHistoryStats(history, today), gamesPlayed: rows.length, history } };
}
