export function requireAdminToken(request, env) {
  const configuredToken = String(env?.ADMIN_MODERATION_TOKEN ?? "").trim();
  if (!configuredToken) {
    const error = new Error("Admin moderation token is not configured.");
    error.status = 503;
    throw error;
  }

  const authorization = request.headers.get("authorization") ?? "";
  const bearerToken = authorization.match(/^Bearer\s+(.+)$/iu)?.[1]?.trim() ?? "";
  const headerToken = request.headers.get("x-admin-token")?.trim() ?? "";
  const providedToken = bearerToken || headerToken;

  if (!providedToken || providedToken !== configuredToken) {
    const error = new Error("Admin authorization failed.");
    error.status = 401;
    throw error;
  }
}
