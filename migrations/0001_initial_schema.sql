PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  roles_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  submission_key TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('solo', 'challenge_creator', 'challenge_responder')),
  mode TEXT NOT NULL CHECK (mode IN ('classic', 'memory')),
  display_name TEXT,
  lineup_json TEXT NOT NULL,
  data_version TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS team_players (
  team_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  lineup_player_id TEXT NOT NULL,
  slot_index INTEGER NOT NULL,
  PRIMARY KEY (team_id, player_id),
  UNIQUE (team_id, slot_index),
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  submission_key TEXT NOT NULL UNIQUE,
  creator_team_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  expires_at TEXT,
  FOREIGN KEY (creator_team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  submission_key TEXT NOT NULL UNIQUE,
  challenge_id TEXT NOT NULL,
  responder_team_id TEXT NOT NULL UNIQUE,
  result_json TEXT NOT NULL,
  challenger_wins INTEGER NOT NULL,
  responder_wins INTEGER NOT NULL,
  draws INTEGER NOT NULL,
  winner TEXT NOT NULL CHECK (winner IN ('challenger', 'responder', 'draw')),
  simulation_version TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id),
  FOREIGN KEY (responder_team_id) REFERENCES teams(id)
);

CREATE INDEX IF NOT EXISTS idx_results_challenge_id ON results(challenge_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at);
CREATE INDEX IF NOT EXISTS idx_teams_mode ON teams(mode);
CREATE INDEX IF NOT EXISTS idx_team_players_player_id ON team_players(player_id);
CREATE INDEX IF NOT EXISTS idx_team_players_team_id ON team_players(team_id);
