import { CANONICAL_SITE_ORIGIN } from "../../site/shared/ashes-core.js";
import { SITE_SOCIAL_IMAGE_URL } from "../../site/shared/public-pages.js";

const DEFAULT_TITLE = "Ashes 5-0 Game - Build an All-Time Cricket XI";
const DEFAULT_DESCRIPTION =
  "Can your all-time Ashes XI win 5-0? Roll historic squads, make hidden picks, simulate a five-Test series and challenge friends to beat your team.";

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

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

export function replaceElementInnerHtml(html, dataAttribute, replacement) {
  const pattern = new RegExp(
    `(<([a-z0-9-]+)([^>]*\\s${escapeRegex(dataAttribute)}(?:=(?:"[^"]*"|'[^']*'|[^\\s>]+))?[^>]*)>)[\\s\\S]*?(</\\2>)`,
    "iu",
  );
  return html.replace(pattern, `$1${replacement}$4`);
}

export function replaceElementText(html, dataAttribute, text) {
  return replaceElementInnerHtml(html, dataAttribute, escapeHtml(text));
}

export function retagElement(html, dataAttribute, nextTagName) {
  const pattern = new RegExp(
    `<([a-z0-9-]+)([^>]*\\s${escapeRegex(dataAttribute)}(?:=(?:"[^"]*"|'[^']*'|[^\\s>]+))?[^>]*)>([\\s\\S]*?)</\\1>`,
    "iu",
  );
  return html.replace(pattern, `<${nextTagName}$2>$3</${nextTagName}>`);
}

export function setElementHidden(html, dataAttribute, hidden) {
  const pattern = new RegExp(`(<[a-z0-9-]+[^>]*\\s${escapeRegex(dataAttribute)}(?:=(?:"[^"]*"|'[^']*'|[^\\s>]+))?[^>]*)(>)`, "iu");
  return html.replace(pattern, (_, start, end) => {
    const hasHidden = /\shidden(?:=|>|\s)/iu.test(start + end);
    if (hidden && !hasHidden) {
      return `${start} hidden${end}`;
    }
    if (!hidden && hasHidden) {
      return `${start.replace(/\shidden(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/iu, "")}${end}`;
    }
    return `${start}${end}`;
  });
}

export function setBodyAttribute(html, attributeName, value) {
  const bodyPattern = /<body([^>]*)>/iu;
  return html.replace(bodyPattern, (_, attrs) => {
    const attrPattern = new RegExp(`\\s${escapeRegex(attributeName)}=(?:"[^"]*"|'[^']*'|[^\\s>]+)`, "iu");
    const cleaned = attrs.replace(attrPattern, "");
    return `<body${cleaned} ${attributeName}="${escapeHtml(value)}">`;
  });
}

export function insertBefore(html, anchor, markup) {
  return html.replace(anchor, `${markup}${anchor}`);
}

export async function renderSpaPage(context, options = {}) {
  const title = options.title ?? DEFAULT_TITLE;
  const description = options.description ?? DEFAULT_DESCRIPTION;
  const canonical = options.canonical ?? `${CANONICAL_SITE_ORIGIN}/`;
  const ogUrl = options.ogUrl ?? canonical;
  const ogTitle = options.ogTitle ?? title;
  const ogDescription = options.ogDescription ?? description;
  const ogImage = options.ogImage ?? SITE_SOCIAL_IMAGE_URL;
  const twitterCard = options.twitterCard ?? "summary_large_image";
  const robots = options.robots ?? "index, follow";
  const bootstrapScript = buildBootstrapScript(options.bootstrap);
  const structuredDataMarkup = options.structuredData
    ? `<script type="application/ld+json">${escapeBootstrapJson(options.structuredData)}</script>\n`
    : "";

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
    /<meta\s+property="og:image"[^>]*>/u,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="robots"[^>]*>/u,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:card"[^>]*>/u,
    `<meta name="twitter:card" content="${escapeHtml(twitterCard)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:title"[^>]*>/u,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:description"[^>]*>/u,
    `<meta name="twitter:description" content="${escapeHtml(ogDescription)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:url"[^>]*>/u,
    `<meta name="twitter:url" content="${escapeHtml(ogUrl)}" />`,
    "</head>",
  );
  html = replaceOrInsert(
    html,
    /<meta\s+name="twitter:image"[^>]*>/u,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    "</head>",
  );

  if (structuredDataMarkup) {
    html = html.replace("</head>", `${structuredDataMarkup}</head>`);
  }

  if (bootstrapScript) {
    html = html.replace(
      /<script type="module" src="\/app\.js"><\/script>/u,
      `${bootstrapScript}<script type="module" src="/app.js"></script>`,
    );
  }

  if (typeof options.htmlTransform === "function") {
    html = options.htmlTransform(html);
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
