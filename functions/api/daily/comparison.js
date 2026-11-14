import { json, errorResponse, methodNotAllowed } from '../../_lib/http.js';
import { ensureDailyStoreSchema, fetchDailyAttemptById, listCompletedRankedDailyAttempts } from '../../_lib/daily-store.js';
import { buildDailyResultsLeaderboard } from '../../../site/shared/daily-ashes.js';

export async function onRequestGet({request, env}) {
  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) return errorResponse(400, 'Invalid result link.');
  try {
    await ensureDailyStoreSchema(env.DB);
    const attempt = await fetchDailyAttemptById(env.DB, id);
    if (!attempt || attempt.attemptMode !== 'ranked' || !attempt.simulationComplete || attempt.hiddenFromPublic) {
      return errorResponse(404, 'This shared result is unavailable.');
    }
    const match = attempt.challengeId.match(/^daily-(ashes|worldcup)-(\d{4}-\d{2}-\d{2})$/);
    if (!match) return errorResponse(404, 'This shared result is unavailable.');
    const attempts = await listCompletedRankedDailyAttempts(env.DB, attempt.challengeId);
    const entry = buildDailyResultsLeaderboard(attempts).entries.find(entry => entry.attemptId === id);
    if (!entry) return errorResponse(404, 'This shared result is unavailable.');
    // Deliberately expose neither participant credentials nor draft selections.
    return json({ok: true, comparison: {competition: match[1], date: match[2],
      displayName: entry.displayName, margin: entry.margin, rank: entry.rank, attemptId: id}});
  } catch {
    return errorResponse(503, 'Could not load the shared result.');
  }
}
export const onRequest = methodNotAllowed;
