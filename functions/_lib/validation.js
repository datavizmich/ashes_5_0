import {
  RESULT_SIMULATION_VERSION,
  TEAM_DATA_VERSION,
  XI_SLOTS,
  lineupIdsToPlayers,
  normalizeDisplayName,
  normalizePlayableMode,
  sanitizePlainText,
  validateLineupPlayerIds,
} from "../../site/shared/ashes-core.js";

function asBoundedInteger(value, label, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}

function ensurePlainObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} is invalid.`);
  }
  return value;
}

function validateSubmissionKey(value, label) {
  const normalized = String(value ?? "").trim();
  if (!/^[A-Za-z0-9_-]{10,64}$/u.test(normalized)) {
    throw new Error(`${label} is invalid.`);
  }
  return normalized;
}

function sanitizeResultBox(box, label) {
  const normalizedBox = ensurePlainObject(box, label);
  const batter = ensurePlainObject(normalizedBox.batter, `${label} batter`);
  const bowler = ensurePlainObject(normalizedBox.bowler, `${label} bowler`);
  return {
    batter: {
      name: sanitizePlainText(batter.name, 60) || "Unknown",
      runs: asBoundedInteger(Math.round(Number(batter.runs) || 0), `${label} batter runs`, 0, 999),
    },
    bowler: {
      name: sanitizePlainText(bowler.name, 60) || "Unknown",
      figures: sanitizePlainText(bowler.figures, 24) || "0/0",
    },
  };
}

function sanitizeLeaderSnapshot(entry) {
  if (!entry) return null;
  const snapshot = ensurePlainObject(entry, "Series leader");
  return {
    side: snapshot.side === "star" ? "star" : "your",
    name: sanitizePlainText(snapshot.name, 60) || "Unknown",
    runs: asBoundedInteger(Math.round(Number(snapshot.runs) || 0), "Leader runs", 0, 9999),
    wickets: asBoundedInteger(Math.round(Number(snapshot.wickets) || 0), "Leader wickets", 0, 999),
    centuries: asBoundedInteger(Math.round(Number(snapshot.centuries) || 0), "Leader centuries", 0, 99),
    fiveFors: asBoundedInteger(Math.round(Number(snapshot.fiveFors) || 0), "Leader five-fors", 0, 99),
    points: asBoundedInteger(Math.round(Number(snapshot.points) || 0), "Leader points", 0, 9999),
  };
}

function sanitizeResultMatch(match, expectedNumber) {
  const normalizedMatch = ensurePlainObject(match, "Test result");
  const innings = Array.isArray(normalizedMatch.innings) ? normalizedMatch.innings : [];
  if (!innings.length || innings.length > 4) {
    throw new Error(`Test ${expectedNumber} innings summary is invalid.`);
  }

  const normalizedInnings = innings.map((entry) => {
    const summary = ensurePlainObject(entry, `Test ${expectedNumber} innings summary`);
    return {
      label: sanitizePlainText(summary.label, 48),
      score: sanitizePlainText(summary.score, 32),
    };
  });

  const result = normalizedMatch.result === "loss" || normalizedMatch.result === "draw"
    ? normalizedMatch.result
    : normalizedMatch.result === "win"
      ? "win"
      : null;
  if (!result) {
    throw new Error(`Test ${expectedNumber} result is invalid.`);
  }

  return {
    format: "tests",
    snapshotOnly: true,
    matchNumber: expectedNumber,
    testNumber: expectedNumber,
    venue: sanitizePlainText(normalizedMatch.venue, 60) || "Historic venue",
    result,
    headline: sanitizePlainText(normalizedMatch.headline, 120) || "Series result",
    summary: sanitizePlainText(normalizedMatch.summary, 120) || "Test complete",
    scoreline: sanitizePlainText(normalizedMatch.scoreline, 120),
    innings: normalizedInnings,
    userBox: sanitizeResultBox(normalizedMatch.userBox, `Test ${expectedNumber} user box`),
    starBox: sanitizeResultBox(normalizedMatch.starBox, `Test ${expectedNumber} opposition box`),
  };
}

export function validateTeamPayload(payload) {
  const team = ensurePlainObject(payload, "Team payload");
  const submissionKey = validateSubmissionKey(team.submissionKey, "Submission key");
  const mode = normalizePlayableMode(team.mode);
  if (!mode) {
    throw new Error("Mode is invalid.");
  }

  if (team.dataVersion !== TEAM_DATA_VERSION) {
    throw new Error("Unsupported team data version.");
  }

  const lineupPlayerIds = Array.isArray(team.lineupPlayerIds)
    ? team.lineupPlayerIds.map((playerId) => String(playerId))
    : null;
  const lineup = validateLineupPlayerIds(lineupPlayerIds);
  if (!lineup) {
    throw new Error(`Team must contain exactly ${XI_SLOTS.length} unique valid players.`);
  }

  return {
    submissionKey,
    mode,
    displayName: normalizeDisplayName(team.displayName),
    lineupPlayerIds,
    lineup,
    dataVersion: team.dataVersion,
  };
}

export function validateChallengeCreationPayload(payload) {
  const body = ensurePlainObject(payload, "Challenge payload");
  return {
    challengeSubmissionKey: validateSubmissionKey(body.challengeSubmissionKey, "Challenge submission key"),
    team: validateTeamPayload(body.team),
  };
}

export function validateSoloTeamPayload(payload) {
  const body = ensurePlainObject(payload, "Solo team payload");
  return {
    team: validateTeamPayload(body.team),
  };
}

export function validateResultCreationPayload(payload, challengeTeam) {
  const body = ensurePlainObject(payload, "Result payload");
  const team = validateTeamPayload(body.team);
  const challengeLineupIds = challengeTeam.lineupPlayerIds;
  if (team.mode !== challengeTeam.mode) {
    throw new Error("Result team mode does not match the challenge.");
  }

  const resultSubmissionKey = validateSubmissionKey(body.resultSubmissionKey, "Result submission key");
  const result = ensurePlainObject(body.result, "Result record");

  if (result.dataVersion !== TEAM_DATA_VERSION) {
    throw new Error("Unsupported result data version.");
  }
  if (result.simulationVersion !== RESULT_SIMULATION_VERSION) {
    throw new Error("Unsupported simulation version.");
  }

  const mode = normalizePlayableMode(result.mode);
  if (!mode || mode !== challengeTeam.mode) {
    throw new Error("Result mode is invalid.");
  }

  const challengerLineup = lineupIdsToPlayers(
    Array.isArray(result.challengerLineup) ? result.challengerLineup.map((player) => player?.id) : [],
  );
  const responderLineup = lineupIdsToPlayers(
    Array.isArray(result.responderLineup) ? result.responderLineup.map((player) => player?.id) : [],
  );

  if (!challengerLineup || !responderLineup) {
    throw new Error("Result lineups are invalid.");
  }

  const challengerIds = challengerLineup.map((player) => player.id);
  const responderIds = responderLineup.map((player) => player.id);
  if (challengerIds.join("|") !== challengeLineupIds.join("|")) {
    throw new Error("Result challenger XI does not match the challenge.");
  }
  if (responderIds.join("|") !== team.lineupPlayerIds.join("|")) {
    throw new Error("Result responder XI does not match the submitted team.");
  }

  const matches = Array.isArray(result.matches)
    ? result.matches.map((match, index) => sanitizeResultMatch(match, index + 1))
    : null;
  if (!matches || matches.length !== 5) {
    throw new Error("Result must contain five completed Tests.");
  }

  const responderWins = asBoundedInteger(Math.round(Number(result.userWins) || 0), "Responder wins", 0, 5);
  const challengerWins = asBoundedInteger(Math.round(Number(result.starWins) || 0), "Challenger wins", 0, 5);
  const draws = asBoundedInteger(Math.round(Number(result.draws) || 0), "Draws", 0, 5);
  if (responderWins + challengerWins + draws !== 5) {
    throw new Error("Result totals must add up to five Tests.");
  }

  const derivedResponderWins = matches.filter((match) => match.result === "win").length;
  const derivedChallengerWins = matches.filter((match) => match.result === "loss").length;
  const derivedDraws = matches.filter((match) => match.result === "draw").length;
  if (responderWins !== derivedResponderWins || challengerWins !== derivedChallengerWins || draws !== derivedDraws) {
    throw new Error("Result summary does not match the Test-by-Test outcomes.");
  }

  const leaderData = result.leaders ? ensurePlainObject(result.leaders, "Series leaders") : null;
  const leaders = leaderData
    ? {
        overallLeader: sanitizeLeaderSnapshot(leaderData.overallLeader),
        mostRuns: sanitizeLeaderSnapshot(leaderData.mostRuns),
        mostWickets: sanitizeLeaderSnapshot(leaderData.mostWickets),
        mostCenturies: sanitizeLeaderSnapshot(leaderData.mostCenturies),
        mostFiveFors: sanitizeLeaderSnapshot(leaderData.mostFiveFors),
        userRuns: asBoundedInteger(Math.round(Number(leaderData.userRuns) || 0), "User runs", 0, 99_999),
        userWickets: asBoundedInteger(Math.round(Number(leaderData.userWickets) || 0), "User wickets", 0, 9_999),
      }
    : null;

  const achievements = Array.isArray(result.achievements)
    ? result.achievements.map((item) => sanitizePlainText(item, 40)).filter(Boolean)
    : [];

  return {
    resultSubmissionKey,
    team,
    result: {
      challengeRef: sanitizePlainText(result.challengeRef, 40),
      mode,
      matches,
      userWins: responderWins,
      starWins: challengerWins,
      draws,
      leaders,
      playerOfSeries: sanitizeLeaderSnapshot(result.playerOfSeries),
      achievements,
      simulationVersion: result.simulationVersion,
      dataVersion: result.dataVersion,
    },
  };
}
