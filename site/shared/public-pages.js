import { CANONICAL_SITE_ORIGIN } from "./ashes-core.js";

export const SITE_SOCIAL_IMAGE_URL = `${CANONICAL_SITE_ORIGIN}/android-chrome-512x512.png`;

export const PUBLIC_PAGE_DEFS = {
  home: {
    key: "home",
    path: "/",
    title: "Ashes 5-0 Game - Build an All-Time Cricket XI",
    description:
      "Can your all-time Ashes XI win 5-0? Roll historic squads, make hidden picks, simulate a five-Test series and challenge friends to beat your team.",
  },
  ashes: {
    key: "ashes",
    path: "/ashes",
    title: "Ashes 5-0 - Build an All-Time Ashes XI",
    description:
      "Roll historic England and Australia squads, choose one player at a time and build an all-time Ashes XI capable of winning a five-Test series 5-0.",
  },
  daily: {
    key: "daily",
    path: "/daily",
    title: "Ashes 5-0 Daily - Today's Cricket XI Challenge",
    description:
      "Play today's shared Ashes challenge. Complete your XI through four hidden squad rolls, play one Test and compare your result with the daily leaderboard.",
  },
  challenge: {
    key: "challenge",
    path: "/challenge",
    title: "Ashes 5-0 Challenge - Build an XI and Face a Friend",
    description:
      "Build a historic cricket XI, send a private challenge link and see whether a friend can draft a team capable of beating yours.",
  },
  leaderboard: {
    key: "leaderboard",
    path: "/leaderboard",
    title: "Ashes 5-0 Leaderboard - Most Selected Cricket Legends",
    description:
      "See the cricket legends most frequently selected in completed Ashes 5-0 teams, Daily Challenges and community drafts.",
  },
  worldCupDaily: {
    key: "worldCupDaily",
    path: "/world-cup/daily",
    title: "World Cup Daily Challenge | Ashes 5-0",
    description:
      "Play today's shared World Cup challenge. Complete your XI through four hidden squad rolls, play one ODI and compare your result with the daily leaderboard.",
  },
  worldCupLeaderboard: {
    key: "worldCupLeaderboard",
    path: "/world-cup/leaderboard",
    title: "World Cup Player Leaderboard | Ashes 5-0",
    description:
      "See the World Cup cricket legends most frequently selected in completed World Cup XIs, daily challenges and community drafts.",
  },
  howToPlay: {
    key: "howToPlay",
    path: "/how-to-play",
    title: "How to Play Ashes 5-0 - Cricket XI Draft Rules",
    description:
      "Learn how to roll historic squads, make hidden player selections, build your XI, play the Daily Ashes Challenge and challenge friends.",
  },
  about: {
    key: "about",
    path: "/about",
    title: "About Ashes 5-0 - The Historic Cricket XI Game",
    description:
      "Learn about Ashes 5-0, a historic cricket drafting game featuring classic squads, Test simulations, daily challenges and friend challenges.",
  },
  worldCup: {
    key: "worldCup",
    path: "/world-cup",
    title: "World Cup Cricket XI Game | Ashes 5-0",
    description:
      "Build a World Cup cricket XI from historic tournament squads, make one selection at a time and simulate how your team performs.",
  },
};

const PUBLIC_PAGE_ENTRIES = Object.values(PUBLIC_PAGE_DEFS);

export function canonicalUrlForPageKey(pageKey) {
  const page = PUBLIC_PAGE_DEFS[pageKey] ?? null;
  return page ? new URL(page.path, CANONICAL_SITE_ORIGIN).href : `${CANONICAL_SITE_ORIGIN}/`;
}

export function publicPageKeyForPath(pathname) {
  const normalized = String(pathname ?? "/").replace(/\/+$/u, "") || "/";
  const match = PUBLIC_PAGE_ENTRIES.find((page) => page.path === normalized);
  return match?.key ?? null;
}

export function publicPageDefForPath(pathname) {
  const pageKey = publicPageKeyForPath(pathname);
  return pageKey ? PUBLIC_PAGE_DEFS[pageKey] : null;
}

export function allIndexablePublicPages() {
  return PUBLIC_PAGE_ENTRIES.map((page) => ({
    ...page,
    canonical: canonicalUrlForPageKey(page.key),
  }));
}
