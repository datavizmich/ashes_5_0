import { json, errorResponse, methodNotAllowed } from '../../_lib/http.js';
import { ensureDailyStoreSchema } from '../../_lib/daily-store.js';
import { loadDailyProgress } from '../../_lib/daily-progress.js';
import { validateDailyParticipantId } from '../../_lib/daily.js';

export async function onRequestGet({request, env}) {
  try {
    const value = new URL(request.url).searchParams.get('participantId');
    const participantId = value ? validateDailyParticipantId(value) : '';
    await ensureDailyStoreSchema(env.DB);
    return json({ok: true, ...await loadDailyProgress(env.DB, participantId, new Date().toISOString().slice(0, 10))});
  } catch (error) {
    return errorResponse(error.status ?? 503, 'Progress is temporarily unavailable.');
  }
}
export const onRequest = methodNotAllowed;
