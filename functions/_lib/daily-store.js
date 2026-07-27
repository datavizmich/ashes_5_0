import { createUniquePublicId } from "./store.js";

const DAILY_SCHEMA_BASE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS daily_attempts (
     id TEXT PRIMARY KEY,
     challenge_id TEXT NOT NULL,
     participant_id TEXT NOT NULL,
     attempt_mode TEXT NOT NULL CHECK (attempt_mode IN ('ranked', 'practice')),
     submission_key TEXT NOT NULL UNIQUE,
     display_name TEXT NOT NULL DEFAULT '',
     current_roll_number INTEGER NOT NULL DEFAULT 1,
     draft_complete INTEGER NOT NULL DEFAULT 0 CHECK (draft_complete IN (0, 1)),
     simulation_complete INTEGER NOT NULL DEFAULT 0 CHECK (simulation_complete IN (0, 1)),
     result_json TEXT,
     created_at TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     completed_at TEXT
   )`,
  `CREATE TABLE IF NOT EXISTS daily_attempt_selections (
     attempt_id TEXT NOT NULL,
     roll_number INTEGER NOT NULL,
     squad_id TEXT NOT NULL,
     player_id TEXT NOT NULL,
     lineup_player_id TEXT NOT NULL,
     slot_index INTEGER,
     created_at TEXT NOT NULL,
     PRIMARY KEY (attempt_id, roll_number),
     UNIQUE (attempt_id, player_id),
     UNIQUE (attempt_id, lineup_player_id),
     FOREIGN KEY (attempt_id) REFERENCES daily_attempts(id) ON DELETE CASCADE,
     FOREIGN KEY (player_id) REFERENCES players(id)
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_ranked_attempts_participant
   ON daily_attempts(challenge_id, participant_id)
   WHERE attempt_mode = 'ranked'`,
  `CREATE INDEX IF NOT EXISTS idx_daily_attempts_challenge_mode
   ON daily_attempts(challenge_id, attempt_mode, draft_complete, simulation_complete)`,
  `CREATE INDEX IF NOT EXISTS idx_daily_attempt_selections_attempt
   ON daily_attempt_selections(attempt_id, roll_number)`,
];

const DAILY_SCHEMA_SLOT_INDEX_STATEMENTS = [
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_attempt_selections_slot
   ON daily_attempt_selections(attempt_id, slot_index)
   WHERE slot_index IS NOT NULL`,
];

const dailySchemaReady = new WeakMap();

async function tableColumnNames(db, tableName) {
  const result = await db.prepare(`PRAGMA table_info(${tableName})`).all();
  return new Set((result.results ?? []).map((row) => String(row.name ?? "")));
}

async function ensureDailyStoreColumns(db) {
  const dailyAttemptColumns = await tableColumnNames(db, "daily_attempts");
  if (!dailyAttemptColumns.has("display_name")) {
    await db.prepare("ALTER TABLE daily_attempts ADD COLUMN display_name TEXT NOT NULL DEFAULT ''").run();
  }

  const selectionColumns = await tableColumnNames(db, "daily_attempt_selections");
  if (!selectionColumns.has("slot_index")) {
    await db.prepare("ALTER TABLE daily_attempt_selections ADD COLUMN slot_index INTEGER").run();
  }
}

export async function ensureDailyStoreSchema(db) {
  if (!db || typeof db.prepare !== "function" || typeof db.batch !== "function") {
    throw new Error("Daily challenge database binding is unavailable.");
  }

  const existing = dailySchemaReady.get(db);
  if (existing) {
    await existing;
    return;
  }

  const pending = db
    .batch(DAILY_SCHEMA_BASE_STATEMENTS.map((statement) => db.prepare(statement)))
    .then(() => ensureDailyStoreColumns(db))
    .then(() => db.batch(DAILY_SCHEMA_SLOT_INDEX_STATEMENTS.map((statement) => db.prepare(statement))))
    .then(() => undefined)
    .catch((error) => {
      dailySchemaReady.delete(db);
      throw error;
    });

  dailySchemaReady.set(db, pending);
  await pending;
}

function buildDailyAttemptRecord(row) {
  if (!row) return null;
  return {
    id: row.id,
    challengeId: row.challenge_id,
    participantId: row.participant_id,
    attemptMode: row.attempt_mode,
    submissionKey: row.submission_key,
    displayName: row.display_name ?? "",
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
  const slotIndex = row.slot_index === null || row.slot_index === undefined
    ? null
    : Number(row.slot_index);
  return {
    attemptId: row.attempt_id,
    rollNumber: Number(row.roll_number),
    squadId: row.squad_id,
    stableId: row.player_id,
    playerId: row.lineup_player_id,
    slotIndex: Number.isInteger(slotIndex) ? slotIndex : null,
    createdAt: row.created_at,
  };
}

export async function fetchDailyAttemptById(db, attemptId) {
  const row = await db
    .prepare(
      `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, display_name, current_roll_number,
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
      `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, display_name, current_roll_number,
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
      `SELECT attempt_id, roll_number, squad_id, player_id, lineup_player_id, slot_index, created_at
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
         id, challenge_id, participant_id, attempt_mode, submission_key, display_name, current_roll_number,
         draft_complete, simulation_complete, result_json, created_at, updated_at, completed_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 1, 0, 0, NULL, ?7, ?7, NULL)`,
    )
    .bind(
      publicId,
      payload.challengeId,
      payload.participantId,
      payload.attemptMode,
      payload.submissionKey,
      payload.displayName ?? "",
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
         attempt_id, roll_number, squad_id, player_id, lineup_player_id, slot_index, created_at
       ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
    )
    .bind(
      attemptId,
      selection.rollNumber,
      selection.squadId,
      selection.stableId,
      selection.playerId,
      Number.isInteger(selection.slotIndex) ? selection.slotIndex : null,
      createdAt,
    )
    .run();
}

export async function updateDailyAttemptDisplayName(db, attemptId, displayName, updatedAt) {
  await db
    .prepare(
      `UPDATE daily_attempts
       SET display_name = ?2,
           updated_at = ?3
       WHERE id = ?1`,
    )
    .bind(attemptId, displayName ?? "", updatedAt)
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
      `SELECT id, challenge_id, participant_id, attempt_mode, submission_key, display_name, current_roll_number,
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
      `SELECT s.attempt_id, s.roll_number, s.squad_id, s.player_id, s.lineup_player_id, s.slot_index, s.created_at
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
