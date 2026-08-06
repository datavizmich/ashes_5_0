import { errorResponse, json, methodNotAllowed } from "../../_lib/http.js";
import { CANONICAL_SITE_ORIGIN } from "../../../site/shared/ashes-core.js";

const METRICS = new Set(["selected"]);
const PERIODS = new Set(["all", "30d"]);
const MODES = new Set(["all", "classic", "memory"]);
const COMPETITIONS = new Set(["ashes", "worldcup"]);
const MAX_LEADERBOARD_ROWS = 20;

function isMissingSchemaError(error) {
  return error instanceof Error && /\bno such table\b/i.test(error.message);
}

function isLocalPagesRequest(requestUrl) {
  const { hostname } = new URL(requestUrl);
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0";
}

async function proxyCanonicalLeaderboard(request) {
  const currentUrl = new URL(request.url);
  const upstreamUrl = new URL(`${currentUrl.pathname}${currentUrl.search}`, CANONICAL_SITE_ORIGIN);
  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      Accept: request.headers.get("accept") ?? "application/json",
    },
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function buildFilters(period, mode, competition) {
  const whereClauses = [];
  const bindings = [];

  whereClauses.push("COALESCE(t.competition, 'ashes') = ?");
  bindings.push(competition);

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
  const competition = String(url.searchParams.get("competition") ?? "ashes");

  if (!METRICS.has(metric)) {
    return errorResponse(400, "Unsupported leaderboard metric.");
  }
  if (!PERIODS.has(period)) {
    return errorResponse(400, "Unsupported leaderboard period.");
  }
  if (!MODES.has(mode)) {
    return errorResponse(400, "Unsupported leaderboard mode.");
  }
  if (!COMPETITIONS.has(competition)) {
    return errorResponse(400, "Unsupported leaderboard competition.");
  }

  if (!context.env.DB || typeof context.env.DB.prepare !== "function") {
    return errorResponse(500, "DB binding 'DB' is missing for the leaderboard function.");
  }

  if (isLocalPagesRequest(context.request.url)) {
    try {
      return await proxyCanonicalLeaderboard(context.request);
    } catch (error) {
      return errorResponse(
        502,
        error instanceof Error ? `Leaderboard proxy failed: ${error.message}` : "Leaderboard proxy failed.",
      );
    }
  }

  try {
    const filters = buildFilters(period, mode, competition);
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
      competition,
      metric,
      period,
      mode,
      totalTeams,
      entries,
      limit: MAX_LEADERBOARD_ROWS,
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return errorResponse(
        503,
        "Leaderboard data is unavailable until the local D1 migrations have been applied.",
      );
    }

    return errorResponse(
      500,
      error instanceof Error ? `Leaderboard query failed: ${error.message}` : "Leaderboard query failed.",
    );
  }
}

export function onRequest() {
  return methodNotAllowed();
}
