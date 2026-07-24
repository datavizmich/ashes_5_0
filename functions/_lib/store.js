import {
  ASHES_PLAYER_BY_ID,
  challengeUrlForId,
  resultUrlForId,
} from "../../site/shared/ashes-core.js";

function randomUrlSafeToken(byteLength = 6) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  const binary = Array.from(bytes, (value) => String.fromCharCode(value)).join("");
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

export function buildTeamRecord(row) {
  if (!row) return null;
  const lineupPlayerIds = JSON.parse(row.lineup_json);
  return {
    id: row.id,
    submissionKey: row.submission_key,
    source: row.source,
    mode: row.mode,
    displayName: row.display_name ?? "",
    lineupPlayerIds,
    lineup: lineupPlayerIds.map((playerId) => ASHES_PLAYER_BY_ID.get(playerId)).filter(Boolean),
    dataVersion: row.data_version,
    createdAt: row.created_at,
  };
}

export function buildChallengeRecord(row) {
  if (!row) return null;
  return {
    id: row.id,
    url: challengeUrlForId(row.id),
    createdAt: row.created_at,
    expiresAt: row.expires_at ?? null,
  };
}

export function buildResultRecord(row) {
  if (!row) return null;
  const result = JSON.parse(row.result_json);
  return {
    ...result,
    id: row.id,
    publicId: row.id,
    shortUrl: resultUrlForId(row.id),
    challengeId: row.challenge_id,
    createdAt: row.created_at,
  };
}

export async function fetchTeamBySubmissionKey(db, submissionKey) {
  const row = await db
    .prepare(
      `SELECT id, submission_key, source, mode, display_name, lineup_json, data_version, created_at
       FROM teams
       WHERE submission_key = ?1`,
    )
    .bind(submissionKey)
    .first();
  return buildTeamRecord(row);
}

export async function fetchChallengeBySubmissionKey(db, submissionKey) {
  const row = await db
    .prepare(
      `SELECT id, creator_team_id, created_at, expires_at
       FROM challenges
       WHERE submission_key = ?1`,
    )
    .bind(submissionKey)
    .first();
  return buildChallengeRecord(row);
}

export async function fetchChallengeByCreatorTeamId(db, creatorTeamId) {
  const row = await db
    .prepare(
      `SELECT id, creator_team_id, created_at, expires_at
       FROM challenges
       WHERE creator_team_id = ?1`,
    )
    .bind(creatorTeamId)
    .first();
  return buildChallengeRecord(row);
}

export async function fetchResultBySubmissionKey(db, submissionKey) {
  const row = await db
    .prepare(
      `SELECT id, challenge_id, responder_team_id, result_json, challenger_wins, responder_wins, draws, winner,
              simulation_version, created_at
       FROM results
       WHERE submission_key = ?1`,
    )
    .bind(submissionKey)
    .first();
  return buildResultRecord(row);
}

export async function fetchResultByResponderTeamId(db, responderTeamId) {
  const row = await db
    .prepare(
      `SELECT id, challenge_id, responder_team_id, result_json, challenger_wins, responder_wins, draws, winner,
              simulation_version, created_at
       FROM results
       WHERE responder_team_id = ?1`,
    )
    .bind(responderTeamId)
    .first();
  return buildResultRecord(row);
}

export async function fetchChallengeDetails(db, challengeId) {
  const row = await db
    .prepare(
      `SELECT c.id, c.created_at, c.expires_at,
              t.id AS team_id, t.submission_key, t.source, t.mode, t.display_name, t.lineup_json,
              t.data_version, t.created_at AS team_created_at
       FROM challenges c
       JOIN teams t ON t.id = c.creator_team_id
       WHERE c.id = ?1`,
    )
    .bind(challengeId)
    .first();

  if (!row) return null;

  return {
    challenge: buildChallengeRecord(row),
    team: buildTeamRecord({
      id: row.team_id,
      submission_key: row.submission_key,
      source: row.source,
      mode: row.mode,
      display_name: row.display_name,
      lineup_json: row.lineup_json,
      data_version: row.data_version,
      created_at: row.team_created_at,
    }),
  };
}

export async function fetchResultDetails(db, resultId) {
  const row = await db
    .prepare(
      `SELECT r.id, r.challenge_id, r.responder_team_id, r.result_json, r.challenger_wins, r.responder_wins, r.draws,
              r.winner, r.simulation_version, r.created_at,
              c.created_at AS challenge_created_at, c.expires_at,
              creator.id AS creator_team_id, creator.submission_key AS creator_submission_key, creator.source AS creator_source,
              creator.mode AS creator_mode, creator.display_name AS creator_display_name, creator.lineup_json AS creator_lineup_json,
              creator.data_version AS creator_data_version,
              creator.created_at AS creator_created_at,
              responder.id AS responder_team_id_row, responder.submission_key AS responder_submission_key, responder.source AS responder_source,
              responder.mode AS responder_mode, responder.display_name AS responder_display_name, responder.lineup_json AS responder_lineup_json,
              responder.data_version AS responder_data_version,
              responder.created_at AS responder_created_at
       FROM results r
       JOIN challenges c ON c.id = r.challenge_id
       JOIN teams creator ON creator.id = c.creator_team_id
       JOIN teams responder ON responder.id = r.responder_team_id
       WHERE r.id = ?1`,
    )
    .bind(resultId)
    .first();

  if (!row) return null;

  return {
    result: buildResultRecord(row),
    challenge: buildChallengeRecord({
      id: row.challenge_id,
      created_at: row.challenge_created_at,
      expires_at: row.expires_at,
    }),
    creatorTeam: buildTeamRecord({
      id: row.creator_team_id,
      submission_key: row.creator_submission_key,
      source: row.creator_source,
      mode: row.creator_mode,
      display_name: row.creator_display_name,
      lineup_json: row.creator_lineup_json,
      data_version: row.creator_data_version,
      created_at: row.creator_created_at,
    }),
    responderTeam: buildTeamRecord({
      id: row.responder_team_id_row,
      submission_key: row.responder_submission_key,
      source: row.responder_source,
      mode: row.responder_mode,
      display_name: row.responder_display_name,
      lineup_json: row.responder_lineup_json,
      data_version: row.responder_data_version,
      created_at: row.responder_created_at,
    }),
  };
}

export async function createUniquePublicId(db, tableName, byteLength = 6, maxAttempts = 6) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = randomUrlSafeToken(byteLength);
    const existing = await db
      .prepare(`SELECT id FROM ${tableName} WHERE id = ?1`)
      .bind(candidate)
      .first();
    if (!existing) {
      return candidate;
    }
  }

  throw new Error(`Could not allocate a unique public id for ${tableName}.`);
}

export async function createTeam(db, team, source, createdAt) {
  const statements = [
    db.prepare(
      `INSERT INTO teams (id, submission_key, source, mode, display_name, lineup_json, data_version, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
    ).bind(
      team.submissionKey,
      team.submissionKey,
      source,
      team.mode,
      team.displayName || null,
      JSON.stringify(team.lineupPlayerIds),
      team.dataVersion,
      createdAt,
    ),
    ...team.lineup.map((player, index) =>
      db.prepare(
        `INSERT INTO team_players (team_id, player_id, lineup_player_id, slot_index)
         VALUES (?1, ?2, ?3, ?4)`,
      ).bind(
        team.submissionKey,
        player.stableId,
        player.id,
        index,
      )
    ),
  ];

  await db.batch(statements);
  return await fetchTeamBySubmissionKey(db, team.submissionKey);
}

export async function createChallenge(db, challengeSubmissionKey, team, createdAt) {
  const existingChallenge = await fetchChallengeBySubmissionKey(db, challengeSubmissionKey);
  if (existingChallenge) {
    return existingChallenge;
  }

  let creatorTeam = await fetchTeamBySubmissionKey(db, team.submissionKey);
  if (!creatorTeam) {
    creatorTeam = await createTeam(db, team, "challenge_creator", createdAt);
  }

  const existingForTeam = await fetchChallengeByCreatorTeamId(db, creatorTeam.id);
  if (existingForTeam) {
    return existingForTeam;
  }

  const publicId = await createUniquePublicId(db, "challenges");
  await db.batch([
    db.prepare(
      `INSERT INTO challenges (id, submission_key, creator_team_id, created_at, expires_at)
       VALUES (?1, ?2, ?3, ?4, NULL)`,
    ).bind(publicId, challengeSubmissionKey, creatorTeam.id, createdAt),
  ]);

  return buildChallengeRecord({
    id: publicId,
    created_at: createdAt,
    expires_at: null,
  });
}

export async function createSoloTeam(db, team, createdAt) {
  let soloTeam = await fetchTeamBySubmissionKey(db, team.submissionKey);
  if (!soloTeam) {
    soloTeam = await createTeam(db, team, "solo", createdAt);
  }
  return soloTeam;
}

export async function createResult(db, challenge, responderTeamPayload, resultSubmissionKey, resultPayload, createdAt) {
  const existingResult = await fetchResultBySubmissionKey(db, resultSubmissionKey);
  if (existingResult) {
    return existingResult;
  }

  let responderTeam = await fetchTeamBySubmissionKey(db, responderTeamPayload.submissionKey);
  if (!responderTeam) {
    responderTeam = await createTeam(db, responderTeamPayload, "challenge_responder", createdAt);
  }

  const existingForTeam = await fetchResultByResponderTeamId(db, responderTeam.id);
  if (existingForTeam) {
    return existingForTeam;
  }

  const publicId = await createUniquePublicId(db, "results");
  const resultRecord = {
    ...resultPayload,
    responseId: publicId,
    publicId,
    shortUrl: resultUrlForId(publicId),
    challengeId: challenge.challenge.id,
    challengerDisplayName: challenge.team.displayName,
    responderDisplayName: responderTeam.displayName,
    challengerLineup: challenge.team.lineup,
    responderLineup: responderTeam.lineup,
    completedAt: createdAt,
  };

  const winner = resultRecord.userWins > resultRecord.starWins
    ? "responder"
    : resultRecord.userWins < resultRecord.starWins
      ? "challenger"
      : "draw";

  await db.batch([
    db.prepare(
      `INSERT INTO results (id, submission_key, challenge_id, responder_team_id, result_json, challenger_wins,
                            responder_wins, draws, winner, simulation_version, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`,
    ).bind(
      publicId,
      resultSubmissionKey,
      challenge.challenge.id,
      responderTeam.id,
      JSON.stringify(resultRecord),
      resultRecord.starWins,
      resultRecord.userWins,
      resultRecord.draws,
      winner,
      resultRecord.simulationVersion,
      createdAt,
    ),
  ]);

  return buildResultRecord({
    id: publicId,
    challenge_id: challenge.challenge.id,
    responder_team_id: responderTeam.id,
    result_json: JSON.stringify(resultRecord),
    challenger_wins: resultRecord.starWins,
    responder_wins: resultRecord.userWins,
    draws: resultRecord.draws,
    winner,
    simulation_version: resultRecord.simulationVersion,
    created_at: createdAt,
  });
}

export function isoTimestamp() {
  return new Date().toISOString();
}
