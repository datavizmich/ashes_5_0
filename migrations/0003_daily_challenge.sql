PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS daily_attempts (
  id TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  attempt_mode TEXT NOT NULL CHECK (attempt_mode IN ('ranked', 'practice')),
  submission_key TEXT NOT NULL UNIQUE,
  current_roll_number INTEGER NOT NULL DEFAULT 1,
  draft_complete INTEGER NOT NULL DEFAULT 0 CHECK (draft_complete IN (0, 1)),
  simulation_complete INTEGER NOT NULL DEFAULT 0 CHECK (simulation_complete IN (0, 1)),
  result_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS daily_attempt_selections (
  attempt_id TEXT NOT NULL,
  roll_number INTEGER NOT NULL,
  squad_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  lineup_player_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (attempt_id, roll_number),
  UNIQUE (attempt_id, player_id),
  UNIQUE (attempt_id, lineup_player_id),
  FOREIGN KEY (attempt_id) REFERENCES daily_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_ranked_attempts_participant
  ON daily_attempts(challenge_id, participant_id)
  WHERE attempt_mode = 'ranked';

CREATE INDEX IF NOT EXISTS idx_daily_attempts_challenge_mode
  ON daily_attempts(challenge_id, attempt_mode, draft_complete, simulation_complete);

CREATE INDEX IF NOT EXISTS idx_daily_attempt_selections_attempt
  ON daily_attempt_selections(attempt_id, roll_number);
