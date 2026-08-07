import { CANONICAL_SITE_ORIGIN } from "./ashes-core.js";

export const SITE_SOCIAL_IMAGE_URL = `${CANONICAL_SITE_ORIGIN}/android-chrome-512x512.png`;

export const PUBLIC_PAGE_DEFS = {
  home: {
    key: "home",
    path: "/",
    title: "Ashes 5-0 - Free All-Time Cricket XI Draft Game",
    description:
      "Draft players from historic Ashes squads, build an all-time XI and simulate a five-Test series. Play the free daily cricket challenge or challenge a friend.",
  },
  ashes: {
    key: "ashes",
    path: "/ashes",
    title: "Build a Full Ashes XI | Ashes 5-0",
    description:
      "Build a full Ashes XI from historic squads. Draft in Classic mode with ratings visible or Memory mode with ratings hidden, then simulate a five-Test series.",
  },
  daily: {
    key: "daily",
    path: "/daily",
    title: "Daily Challenge | Ashes 5-0",
    description:
      "Play today's shared Ashes Daily Challenge. Seven players are locked in, everyone gets the same four-player draft, and your first ranked attempt sets your result.",
  },
  challenge: {
    key: "challenge",
    path: "/challenge",
    title: "Challenge a Friend | Ashes 5-0",
    description:
      "Build a historic Ashes XI, send a private challenge link, and see whether a friend can draft a stronger side over a five-Test series.",
  },
  leaderboard: {
    key: "leaderboard",
    path: "/leaderboard",
    title: "Community Favourites | Ashes 5-0",
    description:
      "See which Ashes players are selected most often in completed teams, daily challenges, and community drafts.",
  },
  worldCupDaily: {
    key: "worldCupDaily",
    path: "/world-cup/daily",
    title: "World Cup Daily Challenge | Ashes 5-0",
    description:
      "Play today's shared World Cup Daily Challenge. Seven players are locked in, everyone gets the same four-player ODI draft, and your first ranked attempt sets your result.",
  },
  worldCupLeaderboard: {
    key: "worldCupLeaderboard",
    path: "/world-cup/leaderboard",
    title: "World Cup Community Favourites | Ashes 5-0",
    description:
      "See which World Cup ODI players are selected most often in completed XIs, daily challenges, and community drafts.",
  },
  howToPlay: {
    key: "howToPlay",
    path: "/how-to-play",
    title: "How to Play | Ashes 5-0",
    description:
      "Learn how Classic, Memory, Daily Challenge, Challenge a Friend, and World Cup mode work in Ashes 5-0.",
  },
  about: {
    key: "about",
    path: "/about",
    title: "About | Ashes 5-0",
    description:
      "Learn about Ashes 5-0, the independent cricket project inspired by historic squads, difficult selection calls, and simulation-led results.",
  },
  methodology: {
    key: "methodology",
    path: "/methodology",
    title: "Methodology | Ashes 5-0",
    description:
      "Read a high-level explanation of Ashes 5-0 ratings, era comparisons, team balance, and how the cricket simulations use team strength.",
  },
  feedback: {
    key: "feedback",
    path: "/feedback",
    title: "Feedback | Ashes 5-0",
    description:
      "Share bugs, ideas, and data corrections for Ashes 5-0, including feedback on ratings, copy, and the drafting experience.",
  },
  worldCup: {
    key: "worldCup",
    path: "/world-cup",
    title: "World Cup ODI XI | Ashes 5-0",
    description:
      "Build a World Cup ODI XI from historic tournament squads, then play through the group stage and knockout rounds.",
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
