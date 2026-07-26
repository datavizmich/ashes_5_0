import { createUniquePublicId } from "./store.js";

function buildDailyAttemptRecord(row) {
  if (!row) return null;
  return {
    id: row.id,
    challengeId: row.challenge_id,
    participantId: row.participant_id,
    attemptMode: row.attempt_mode,
    submissionKey: row.submission_key,
    currentRollNumber: Number(row.current_roll_number ?? 1),
    draftComplete: Boolean(row.draft_complete),
    simulationComplete: Boolean(row.simulation_complete),
    result: row.result_json ? JSON.parse(row.result_json) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at ?? null,
  };
}

function buildDailySelectionRecord(row) {
  if (!row) return null;
  return {
    attemptId: row.attempt_id,
    rollNumber: Number(row.roll_number),
    squadId: row.squad_id,
    stableId: row.player_id,
    playerId: row.lineup_player_id,
    createdAt: row.created_at,
  };
}

export async function fetchDailyAttemptById(db, attemptId) {
  const row = await db
    .prepare(
      `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, current_roll_number,
              draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       FROM daily_attempts
       WHERE id = ?1`,
    )
    .bind(attemptId)
    .first();
  return buildDailyAttemptRecord(row);
}

export async function fetchRankedDailyAttemptByParticipant(db, challengeId, participantId) {
  const row = await db
    .prepare(
      `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, current_roll_number,
              draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       FROM daily_attempts
       WHERE challenge_id = ?1 AND participant_id = ?2 AND attempt_mode = 'ranked'`,
    )
    .bind(challengeId, participantId)
    .first();
  return buildDailyAttemptRecord(row);
}

export async function listDailySelectionsForAttempt(db, attemptId) {
  const result = await db
    .prepare(
      `SELECT attempt_id, roll_number, squad_id, player_id, lineup_player_id, created_at
       FROM daily_attempt_selections
       WHERE attempt_id = ?1
       ORDER BY roll_number ASC`,
    )
    .bind(attemptId)
    .all();
  return (result.results ?? []).map(buildDailySelectionRecord).filter(Boolean);
}

export async function fetchDailyAttemptState(db, attemptId) {
  const attempt = await fetchDailyAttemptById(db, attemptId);
  if (!attempt) return null;
  const selections = await listDailySelectionsForAttempt(db, attemptId);
  return { attempt, selections };
}

export async function createDailyAttempt(db, payload, createdAt) {
  const publicId = await createUniquePublicId(db, "daily_attempts");
  await db
    .prepare(
      `INSERT INTO daily_attempts (
         id, challenge_id, participant_id, attempt_mode, submission_key, current_roll_number,
         draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, 1, 0, 0, NULL, ?6, ?6, NULL)`,
    )
    .bind(
      publicId,
      payload.challengeId,
      payload.participantId,
      payload.attemptMode,
      payload.submissionKey,
      createdAt,
    )
    .run();

  return await fetchDailyAttemptById(db, publicId);
}

export async function createOrFetchRankedDailyAttempt(db, payload, createdAt) {
  const existing = await fetchRankedDailyAttemptByParticipant(db, payload.challengeId, payload.participantId);
  if (existing) return existing;

  try {
    return await createDailyAttempt(db, { ...payload, attemptMode: "ranked" }, createdAt);
  } catch (error) {
    return await fetchRankedDailyAttemptByParticipant(db, payload.challengeId, payload.participantId);
  }
}

export async function addDailySelection(db, attemptId, selection, createdAt) {
  await db
    .prepare(
      `INSERT INTO daily_attempt_selections (
         attempt_id, roll_number, squad_id, player_id, lineup_player_id, created_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
    )
    .bind(
      attemptId,
      selection.rollNumber,
      selection.squadId,
      selection.stableId,
      selection.playerId,
      createdAt,
    )
    .run();
}

export async function updateDailyAttemptProgress(db, attemptId, currentRollNumber, draftComplete, updatedAt) {
  await db
    .prepare(
      `UPDATE daily_attempts
       SET current_roll_number = ?2,
           draft_complete = ?3,
           updated_at = ?4
       WHERE id = ?1`,
    )
    .bind(attemptId, currentRollNumber, draftComplete ? 1 : 0, updatedAt)
    .run();
}

export async function saveDailyAttemptResult(db, attemptId, result, updatedAt) {
  await db
    .prepare(
      `UPDATE daily_attempts
       SET simulation_complete = 1,
           result_json = ?2,
           updated_at = ?3,
           completed_at = ?3
       WHERE id = ?1`,
    )
    .bind(attemptId, JSON.stringify(result), updatedAt)
    .run();
}

export async function listCompletedRankedDailyAttempts(db, challengeId) {
  const attemptsResult = await db
    .prepare(
      `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, current_roll_number,
              draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       FROM daily_attempts
       WHERE challenge_id = ?1 AND attempt_mode = 'ranked' AND draft_complete = 1`,
    )
    .bind(challengeId)
    .all();

  const attempts = (attemptsResult.results ?? []).map(buildDailyAttemptRecord).filter(Boolean);
  if (!attempts.length) return [];

  const selectionsResult = await db
    .prepare(
      `SELECT s.attempt_id, s.roll_number, s.squad_id, s.player_id, s.lineup_player_id, s.created_at
       FROM daily_attempt_selections s
       JOIN daily_attempts a ON a.id = s.attempt_id
       WHERE a.challenge_id = ?1 AND a.attempt_mode = 'ranked' AND a.draft_complete = 1
       ORDER BY attempt_id ASC, roll_number ASC`,
    )
    .bind(challengeId)
    .all();

  const selectionsByAttemptId = new Map();
  for (const row of selectionsResult.results ?? []) {
    const selection = buildDailySelectionRecord(row);
    if (!selection) continue;
    const existing = selectionsByAttemptId.get(selection.attemptId) ?? [];
    existing.push(selection);
    selectionsByAttemptId.set(selection.attemptId, existing);
  }

  return attempts.map((attempt) => ({
    ...attempt,
    selections: selectionsByAttemptId.get(attempt.id) ?? [],
  }));
}
