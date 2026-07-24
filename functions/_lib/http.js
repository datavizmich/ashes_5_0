const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

function byteLength(text) {
  return new TextEncoder().encode(text).length;
}

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...headers,
    },
  });
}

export function errorResponse(status, error, extras = {}) {
  return json(
    {
      ok: false,
      error,
      ...extras,
    },
    status,
  );
}

export function methodNotAllowed() {
  return errorResponse(405, "Method not allowed.");
}

export async function readJson(request, { maxBytes = 48_000 } = {}) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const error = new Error("Request body must be JSON.");
    error.status = 415;
    throw error;
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    const error = new Error("Request body is too large.");
    error.status = 413;
    throw error;
  }

  const text = await request.text();
  if (byteLength(text) > maxBytes) {
    const error = new Error("Request body is too large.");
    error.status = 413;
    throw error;
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const error = new Error("Invalid JSON request body.");
    error.status = 400;
    throw error;
  }
}
