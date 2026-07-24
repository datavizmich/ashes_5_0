import { CANONICAL_SITE_ORIGIN } from "../../site/shared/ashes-core.js";

const DEFAULT_TITLE = "Historic Cricket XI Draft Game | Ashes 5-0";
const DEFAULT_DESCRIPTION =
  "Roll historic cricket squads, draft one player at a time, build your all-time XI and simulate a five-Test series. Free to play with no sign-up.";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeBootstrapJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e");
}

function replaceOrInsert(html, pattern, replacement, fallbackAnchor) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }
  return html.replace(fallbackAnchor, `${replacement}\n${fallbackAnchor}`);
}

function buildBootstrapScript(bootstrap) {
  if (!bootstrap) return "";
  return `<script>window.__ASHES_BOOTSTRAP__=${escapeBootstrapJson(bootstrap)};</script>\n`;
}

export async function renderSpaPage(context, options = {}) {
  const title = options.title ?? DEFAULT_TITLE;
  const description = options.description ?? DEFAULT_DESCRIPTION;
  const canonical = options.canonical ?? `${CANONICAL_SITE_ORIGIN}/`;
  const ogUrl = options.ogUrl ?? canonical;
  const ogTitle = options.ogTitle ?? title;
  const ogDescription = options.ogDescription ?? description;
  const robots = options.robots ?? "index, follow";
  const bootstrapScript = buildBootstrapScript(options.bootstrap);

  const response = await context.env.ASSETS.fetch(new URL("/", context.request.url));
  const originalHtml = await response.text();

  let html = originalHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/u, `<title>${escapeHtml(title)}</title>`);
  html = replaceOrInsert(
    html,
    /<meta\s+name="description"[^>]*>/u,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<link\s+rel="canonical"[^>]*>/u,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:title"[^>]*>/u,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:description"[^>]*>/u,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+property="og:url"[^>]*>/u,
    `<meta property="og:url" content="${escapeHtml(ogUrl)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="robots"[^>]*>/u,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    "</head>",
  );

  if (bootstrapScript) {
    html = html.replace(
      /<script type="module" src="\.\/app\.js"><\/script>/u,
      `${bootstrapScript}<script type="module" src="./app.js"></script>`,
    );
  }

  return new Response(html, {
    status: options.status ?? 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": robots,
    },
  });
}
