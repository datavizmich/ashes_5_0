import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { onRequestGet as aboutRoute } from "../functions/about.js";
import { onRequestGet as ashesRoute } from "../functions/ashes.js";
import { onRequestGet as challengeLandingRoute } from "../functions/challenge.js";
import { onRequestGet as shortChallengeRoute } from "../functions/c/[id].js";
import { onRequestGet as dailyRoute } from "../functions/daily.js";
import { onRequestGet as homeRoute } from "../functions/index.js";
import { onRequestGet as leaderboardRoute } from "../functions/leaderboard.js";
import { onRequestGet as shortResultRoute } from "../functions/r/[id].js";
import { onRequestGet as worldCupRoute } from "../functions/world-cup.js";
import { onRequestGet as howToPlayRoute } from "../functions/how-to-play.js";
import {
  PUBLIC_PAGE_DEFS,
  allIndexablePublicPages,
  canonicalUrlForPageKey,
} from "../site/shared/public-pages.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_INDEX_HTML = readFileSync(join(__dirname, "..", "site", "index.html"), "utf8");
const SITE_SITEMAP = readFileSync(join(__dirname, "..", "site", "sitemap.xml"), "utf8");
const SITE_ROBOTS = readFileSync(join(__dirname, "..", "site", "robots.txt"), "utf8");

const ROUTE_HANDLERS = {
  home: homeRoute,
  ashes: ashesRoute,
  daily: dailyRoute,
  challenge: challengeLandingRoute,
  leaderboard: leaderboardRoute,
  howToPlay: howToPlayRoute,
  about: aboutRoute,
  worldCup: worldCupRoute,
};

function buildAssetsBinding() {
  return {
    async fetch() {
      return new Response(SITE_INDEX_HTML, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    },
  };
}

function buildNullDb() {
  return {
    prepare() {
      return {
        bind() {
          return this;
        },
        async first() {
          return null;
        },
      };
    },
  };
}

function createContext(pathname, { params = {}, db = null } = {}) {
  return {
    params,
    request: new Request(`https://ashes-5-0.co.uk${pathname}`),
    env: {
      ASSETS: buildAssetsBinding(),
      DB: db,
    },
  };
}

async function renderRoute(handler, pathname, options = {}) {
  const response = await handler(createContext(pathname, options));
  const html = await response.text();
  return { response, html };
}

function stripTags(value) {
  return String(value ?? "")
    .replace(/<[^>]+>/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function extractTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/iu)?.[1] ?? "";
}

function extractMeta(html, attribute, key) {
  const pattern = new RegExp(
    `<meta\\s+${attribute}="${key}"\\s+content="([^"]*)"\\s*/?>`,
    "iu",
  );
  return html.match(pattern)?.[1] ?? "";
}

function extractCanonical(html) {
  return html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/iu)?.[1] ?? "";
}

function countH1(html) {
  return (html.match(/<h1\b/giu) ?? []).length;
}

function extractH1Text(html) {
  return stripTags(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/iu)?.[1] ?? "");
}

function extractPrimaryNavHtml(html) {
  return html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/iu)?.[0] ?? "";
}

function extractTopbarHomeHeaders(html) {
  return html.match(/<header class="topbar topbar-home"[\s\S]*?<\/header>/giu) ?? [];
}

test("every intended public route returns successfully with unique metadata and one H1", async () => {
  const seenTitles = new Set();
  const seenDescriptions = new Set();

  for (const page of allIndexablePublicPages()) {
    const handler = ROUTE_HANDLERS[page.key];
    assert.ok(handler, `Missing handler for ${page.key}.`);

    const { response, html } = await renderRoute(handler, page.path);
    assert.equal(response.status, 200, `${page.path} should return HTTP 200.`);
    assert.equal(extractTitle(html), page.title);
    assert.equal(extractMeta(html, "name", "description"), page.description);
    assert.equal(extractCanonical(html), page.canonical);
    assert.equal(extractMeta(html, "property", "og:url"), page.canonical);
    assert.equal(extractMeta(html, "name", "twitter:url"), page.canonical);
    assert.equal(countH1(html), 1, `${page.path} should contain exactly one H1.`);
    assert.equal(extractMeta(html, "name", "robots"), "index, follow");
    assert.equal(extractMeta(html, "property", "og:title"), page.title);
    assert.equal(extractMeta(html, "property", "og:description"), page.description);
    assert.equal(extractMeta(html, "name", "twitter:title"), page.title);
    assert.equal(extractMeta(html, "name", "twitter:description"), page.description);

    assert.ok(!seenTitles.has(page.title), `Duplicate title found: ${page.title}`);
    assert.ok(!seenDescriptions.has(page.description), `Duplicate description found: ${page.description}`);
    seenTitles.add(page.title);
    seenDescriptions.add(page.description);
  }
});

test("homepage leads with Ashes 5-0 and exposes crawlable navigation and footer links", async () => {
  const { html } = await renderRoute(homeRoute, "/");
  const primaryNav = extractPrimaryNavHtml(html);

  assert.equal(extractH1Text(html), "Can your Ashes XI go 5-0?");
  assert.match(primaryNav, /\shidden(?:=|>|\s)/u);
  assert.match(primaryNav, /href="\/"/u);
  assert.doesNotMatch(primaryNav, /href="\/ashes"/u);
  assert.doesNotMatch(primaryNav, /href="\/daily"/u);
  assert.doesNotMatch(primaryNav, /href="\/challenge"/u);
  assert.doesNotMatch(primaryNav, /href="\/leaderboard"/u);
  assert.doesNotMatch(primaryNav, /href="\/how-to-play"/u);
  assert.doesNotMatch(primaryNav, /href="\/about"/u);
  assert.doesNotMatch(primaryNav, /href="\/world-cup"/u);

  for (const href of [
    "/ashes",
    "/daily",
    "/challenge",
    "/leaderboard",
    "/how-to-play",
    "/about",
    "/world-cup",
  ]) {
    assert.match(html, new RegExp(`href="${href}"`, "u"));
  }
});

test("secondary routes expose only one visible home control at the top", async () => {
  const { html } = await renderRoute(dailyRoute, "/daily");
  const primaryNav = extractPrimaryNavHtml(html);
  const topbars = extractTopbarHomeHeaders(html);

  assert.doesNotMatch(primaryNav, /\shidden(?:=|>|\s)/u);
  assert.equal(topbars.length, 2);
  for (const topbar of topbars) {
    assert.match(topbar, /\shidden(?:=|>|\s)/u);
  }
});

test("daily route includes stable explanatory content and is not framed as a five-Test mode", async () => {
  const { html } = await renderRoute(dailyRoute, "/daily");

  assert.equal(extractTitle(html), PUBLIC_PAGE_DEFS.daily.title);
  assert.match(html, /7 players are already locked into your XI\./u);
  assert.match(html, /4 historic squads appear one at a time\./u);
  assert.match(html, /Your first ranked attempt is the entry that counts/u);
  assert.doesNotMatch(extractMeta(html, "name", "description"), /five-Test/u);
});

test("challenge landing explains the friend flow in initial HTML", async () => {
  const { html } = await renderRoute(challengeLandingRoute, "/challenge");

  assert.equal(extractTitle(html), PUBLIC_PAGE_DEFS.challenge.title);
  assert.equal(extractH1Text(html), "Build a cricket XI and face a friend");
  assert.match(html, /1\. Build your XI/u);
  assert.match(html, /2\. Generate and share a private link/u);
  assert.match(html, /3\. Your friend drafts and plays/u);
  assert.match(html, /4\. Compare or challenge them back/u);
});

test("world cup route keeps world-cup-specific metadata and heading language", async () => {
  const { html } = await renderRoute(worldCupRoute, "/world-cup");

  assert.equal(extractTitle(html), PUBLIC_PAGE_DEFS.worldCup.title);
  assert.equal(extractH1Text(html), "Build your World Cup XI");
  assert.equal(extractMeta(html, "name", "description"), PUBLIC_PAGE_DEFS.worldCup.description);
  assert.doesNotMatch(extractMeta(html, "name", "description"), /whitewash|Ashes squad|England and Australia/u);
});

test("how-to-play and about routes expose stable crawler-facing sections", async () => {
  const howToPlay = await renderRoute(howToPlayRoute, "/how-to-play");
  assert.match(howToPlay.html, /Full XI drafting/u);
  assert.match(howToPlay.html, /Hidden future squad rolls/u);
  assert.match(howToPlay.html, /Challenge a Friend/u);
  assert.match(howToPlay.html, /World Cup mode/u);
  assert.match(howToPlay.html, /Frequently asked questions/u);

  const about = await renderRoute(aboutRoute, "/about");
  assert.match(about.html, /What Ashes 5-0 is/u);
  assert.match(about.html, /Why it was created/u);
  assert.match(about.html, /Independent cricket project/u);
  assert.match(about.html, /Entertainment only/u);
  assert.match(about.html, /Feedback/u);
});

test("leaderboard route uses neutral loading content instead of zero placeholders", async () => {
  const { html } = await renderRoute(leaderboardRoute, "/leaderboard");

  assert.match(html, /Loading community statistics\./u);
  assert.doesNotMatch(html, />0<\/strong>/u);
});

test("robots.txt allows crawling and points at the canonical sitemap", () => {
  assert.match(SITE_ROBOTS, /User-agent:\s*\*/u);
  assert.match(SITE_ROBOTS, /Allow:\s*\/\s*/u);
  assert.match(SITE_ROBOTS, /Sitemap:\s*https:\/\/ashes-5-0\.co\.uk\/sitemap\.xml/u);
  assert.doesNotMatch(SITE_ROBOTS, /Disallow:\s*\/(?!\s*$)/u);
});

test("sitemap contains each canonical public page exactly once and excludes non-indexable URLs", () => {
  const locEntries = [...SITE_SITEMAP.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]);

  for (const page of allIndexablePublicPages()) {
    const exactLoc = `<loc>${page.canonical}</loc>`;
    const matches = SITE_SITEMAP.match(new RegExp(exactLoc.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "gu")) ?? [];
    assert.equal(matches.length, 1, `${page.canonical} should appear exactly once in the sitemap.`);
  }

  assert.ok(locEntries.every((loc) => !loc.startsWith("http://")));
  assert.ok(locEntries.every((loc) => !loc.startsWith("https://www.")));
  assert.ok(locEntries.every((loc) => !/\/api\//u.test(loc)));
  assert.ok(locEntries.every((loc) => !/\/c\//u.test(loc)));
  assert.ok(locEntries.every((loc) => !/\/r\//u.test(loc)));
});

test("generated challenge and result pages remain noindex, follow", async () => {
  const challenge = await renderRoute(shortChallengeRoute, "/c/test-link", {
    params: { id: "test-link" },
    db: buildNullDb(),
  });
  assert.equal(challenge.response.status, 404);
  assert.equal(extractMeta(challenge.html, "name", "robots"), "noindex, follow");
  assert.equal(challenge.response.headers.get("x-robots-tag"), "noindex, follow");

  const result = await renderRoute(shortResultRoute, "/r/test-result", {
    params: { id: "test-result" },
    db: buildNullDb(),
  });
  assert.equal(result.response.status, 404);
  assert.equal(extractMeta(result.html, "name", "robots"), "noindex, follow");
  assert.equal(result.response.headers.get("x-robots-tag"), "noindex, follow");
});

test("public page canonicals use the canonical HTTPS non-www hostname", () => {
  for (const pageKey of Object.keys(PUBLIC_PAGE_DEFS)) {
    const canonical = canonicalUrlForPageKey(pageKey);
    assert.match(canonical, /^https:\/\/ashes-5-0\.co\.uk\//u);
    assert.doesNotMatch(canonical, /www\./u);
  }
});
