function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

async function readPayload(request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }
  return {};
}

function buildForwardBody(payload) {
  const params = new URLSearchParams();
  params.set("message", String(payload.message ?? "").trim());
  params.set("pageUrl", String(payload.pageUrl ?? "").trim());
  params.set("mode", String(payload.mode ?? "classic").trim());
  params.set("website", String(payload.website ?? "").trim());
  params.set("userAgent", String(payload.userAgent ?? "").trim());
  return params;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const payload = await readPayload(request).catch(() => null);

  if (!payload) {
    return json({ ok: false, error: "Invalid request body." }, 400);
  }

  const message = String(payload.message ?? "").trim();
  const honeypot = String(payload.website ?? "").trim();

  if (honeypot) {
    return json({ ok: true });
  }

  if (message.length < 5) {
    return json({ ok: false, error: "Please enter a longer message." }, 400);
  }

  const scriptUrl = env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return json(
      {
        ok: false,
        error: "Feedback endpoint is not configured. Set GOOGLE_APPS_SCRIPT_URL in Pages environment variables.",
      },
      500,
    );
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: buildForwardBody({
      ...payload,
      message,
      userAgent: request.headers.get("user-agent") ?? "Unknown",
    }),
  });

  const text = await response.text().catch(() => "");
  if (!response.ok) {
    return json(
      {
        ok: false,
        error: text
          ? `Google Sheets feedback endpoint failed (${response.status}). ${text.slice(0, 300)}`
          : `Google Sheets feedback endpoint failed (${response.status}).`,
      },
      502,
    );
  }

  return json({ ok: true });
}

export function onRequest() {
  return json({ ok: false, error: "Method not allowed." }, 405);
}
