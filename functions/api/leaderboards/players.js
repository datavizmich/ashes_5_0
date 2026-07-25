import { errorResponse, json, methodNotAllowed } from "../../_lib/http.js";

const METRICS = new Set(["selected"]);
const PERIODS = new Set(["all", "30d"]);
const MODES = new Set(["all", "classic", "memory"]);
const MAX_LEADERBOARD_ROWS = 20;

function buildFilters(period, mode) {
  const whereClauses = [];
  const bindings = [];

  if (mode !== "all") {
    whereClauses.push("t.mode = ?");
    bindings.push(mode);
  }

  if (period === "30d") {
    whereClauses.push("datetime(t.created_at) >= datetime('now', '-30 days')");
  }

  return {
    whereSql: whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "",
    bindings,
  };
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const metric = String(url.searchParams.get("metric") ?? "selected");
  const period = String(url.searchParams.get("period") ?? "all");
  const mode = String(url.searchParams.get("mode") ?? "all");

  if (!METRICS.has(metric)) {
    return errorResponse(400, "Unsupported leaderboard metric.");
  }
  if (!PERIODS.has(period)) {
    return errorResponse(400, "Unsupported leaderboard period.");
  }
  if (!MODES.has(mode)) {
    return errorResponse(400, "Unsupported leaderboard mode.");
  }

  if (!context.env.DB || typeof context.env.DB.prepare !== "function") {
    return errorResponse(500, "DB binding 'DB' is missing for the leaderboard function.");
  }

  try {
    const filters = buildFilters(period, mode);
    const totalTeamsQuery = context.env.DB.prepare(
      `SELECT COUNT(*) AS total_teams
       FROM teams t
       ${filters.whereSql}`,
    ).bind(...filters.bindings);

    const rowsQuery = context.env.DB.prepare(
      `SELECT p.id, p.name, COUNT(*) AS count
       FROM team_players tp
       JOIN teams t ON t.id = tp.team_id
       JOIN players p ON p.id = tp.player_id
       ${filters.whereSql}
       GROUP BY p.id, p.name
       ORDER BY count DESC, p.name ASC
       LIMIT ?`,
    ).bind(...filters.bindings, MAX_LEADERBOARD_ROWS);

    const [totalTeamsResult, rowsResult] = await context.env.DB.batch([totalTeamsQuery, rowsQuery]);
    const totalTeams = Number(totalTeamsResult.results?.[0]?.total_teams ?? 0);
    const entries = (rowsResult.results ?? []).map((row) => ({
      playerId: row.id,
      name: row.name,
      count: Number(row.count ?? 0),
    }));

    return json({
      ok: true,
      metric,
      period,
      mode,
      totalTeams,
      entries,
      limit: MAX_LEADERBOARD_ROWS,
    });
  } catch (error) {
    return errorResponse(
      500,
      error instanceof Error ? `Leaderboard query failed: ${error.message}` : "Leaderboard query failed.",
    );
  }
}

export function onRequest() {
  return methodNotAllowed();
}
