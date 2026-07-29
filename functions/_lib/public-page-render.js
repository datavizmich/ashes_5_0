import { CANONICAL_SITE_ORIGIN } from "../../site/shared/ashes-core.js";
import { PUBLIC_PAGE_DEFS, canonicalUrlForPageKey } from "../../site/shared/public-pages.js";
import {
  insertBefore,
  renderSpaPage,
  replaceElementInnerHtml,
  replaceElementText,
  retagElement,
  setBodyAttribute,
  setElementHidden,
} from "./spa.js";

const TITLE_ATTRS = [
  "data-home-title",
  "data-leaderboard-title",
  "data-game-title",
  "data-series-title",
];

const VIEW_ATTRS = {
  home: "data-home-view",
  leaderboard: "data-leaderboard-view",
  game: "data-game-view",
  series: "data-series-view",
};

function todayLongDate() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date());
}

function copyCard({ title, body, list = [] }) {
  return `
    <article class="copy-card">
      <h3>${title}</h3>
      <p>${body}</p>
      ${
        list.length
          ? `<ul>${list.map((item) => `<li>${item}</li>`).join("")}</ul>`
          : ""
      }
    </article>
  `;
}

function copyGrid(cards) {
  return cards.map(copyCard).join("");
}

function breadcrumbStructuredData(name, canonicalUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${CANONICAL_SITE_ORIGIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: canonicalUrl,
      },
    ],
  };
}

function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ashes 5-0",
    url: `${CANONICAL_SITE_ORIGIN}/`,
    description: PUBLIC_PAGE_DEFS.home.description,
  };
}

function applyBaseView(html, { activeView = "home", activeTitleAttr = "data-home-title", competition = "ashes" } = {}) {
  let nextHtml = setBodyAttribute(html, "data-competition", competition);
  nextHtml = setElementHidden(nextHtml, "data-site-nav", false);

  for (const titleAttr of TITLE_ATTRS) {
    nextHtml = retagElement(nextHtml, titleAttr, "h2");
  }
  nextHtml = retagElement(nextHtml, activeTitleAttr, "h1");

  for (const [viewKey, dataAttr] of Object.entries(VIEW_ATTRS)) {
    nextHtml = setElementHidden(nextHtml, dataAttr, viewKey !== activeView);
  }

  return nextHtml;
}

function applyHomeLanding(html, options = {}) {
  let nextHtml = applyBaseView(html, {
    activeView: "home",
    activeTitleAttr: "data-home-title",
    competition: options.competition ?? "ashes",
  });
  nextHtml = setElementHidden(nextHtml, "data-site-nav", Boolean(options.hideSiteNav));

  nextHtml = replaceElementText(nextHtml, "data-home-eyebrow", options.eyebrow ?? "Ashes 5-0");
  nextHtml = replaceElementText(nextHtml, "data-home-title", options.title);
  nextHtml = replaceElementText(nextHtml, "data-home-tagline", options.tagline ?? "Roll a squad. Lock one player. Build your XI.");
  nextHtml = replaceElementText(nextHtml, "data-home-lede", options.lede);
  nextHtml = replaceElementText(nextHtml, "data-home-panel-kicker", options.panelKicker ?? "How it works");
  nextHtml = replaceElementText(nextHtml, "data-home-panel-title", options.panelTitle ?? "Squad Roller");
  nextHtml = replaceElementInnerHtml(nextHtml, "data-home-panel-copy", options.panelCopy ?? "");
  nextHtml = replaceElementText(nextHtml, "data-play-game", options.playLabel ?? "Start a solo game");
  nextHtml = setElementHidden(nextHtml, "data-home-panel-copy", !options.panelCopy);
  nextHtml = setElementHidden(nextHtml, "data-home-config-grid", Boolean(options.hideConfigGrid));
  nextHtml = setElementHidden(nextHtml, "data-home-controls", Boolean(options.controlsHidden));
  nextHtml = setElementHidden(nextHtml, "data-home-response-name-row", true);
  nextHtml = setElementHidden(nextHtml, "data-play-game", Boolean(options.playButtonHidden));

  if (options.rulesHtml) {
    nextHtml = replaceElementInnerHtml(nextHtml, "data-home-rules-grid", options.rulesHtml);
  }

  if (typeof options.homeChallengeHidden === "boolean") {
    nextHtml = setElementHidden(nextHtml, "data-home-challenge", options.homeChallengeHidden);
  }
  if (typeof options.homeDailyHidden === "boolean") {
    nextHtml = setElementHidden(nextHtml, "data-home-daily", options.homeDailyHidden);
  }
  if (typeof options.homeLeaderboardHidden === "boolean") {
    nextHtml = setElementHidden(nextHtml, "data-home-leaderboard", options.homeLeaderboardHidden);
  }
  if (typeof options.homeCompetitionHidden === "boolean") {
    nextHtml = setElementHidden(nextHtml, "data-home-competition", options.homeCompetitionHidden);
  }

  return nextHtml;
}

function applyDailyLanding(html) {
  const dateText = todayLongDate();
  let nextHtml = applyBaseView(html, {
    activeView: "game",
    activeTitleAttr: "data-game-title",
    competition: "ashes",
  });

  nextHtml = replaceElementText(nextHtml, "data-game-squad-count", dateText);
  nextHtml = replaceElementText(nextHtml, "data-game-player-count", "4 hidden rolls");
  nextHtml = replaceElementText(nextHtml, "data-game-mode", "Memory Daily");
  nextHtml = replaceElementText(nextHtml, "data-game-eyebrow", "Daily Challenge");
  nextHtml = replaceElementText(nextHtml, "data-game-title", "Play today's shared Ashes XI challenge");
  nextHtml = replaceElementText(nextHtml, "data-current-squad", "Reveal the first squad");
  nextHtml = replaceElementText(nextHtml, "data-lineup-status", "7 / 11 selected");
  nextHtml = replaceElementText(nextHtml, "data-roster-kicker", "How it works");
  nextHtml = replaceElementText(nextHtml, "data-roster-title", "Seven players are already locked in");
  nextHtml = replaceElementText(
    nextHtml,
    "data-roster-summary",
    "Everyone gets the same hidden sequence. Your first ranked attempt is the entry that counts toward the daily leaderboard.",
  );
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-roster-grid",
    copyGrid([
      {
        title: "7 players pre-selected",
        body: "7 players are already locked into your XI. No new squad is revealed until the draft begins.",
      },
      {
        title: "4 hidden squad rolls",
        body: "4 historic squads appear one at a time. You select 1 player from each squad and cannot preview future rolls.",
      },
      {
        title: "Shared deterministic draft",
        body: `Every player receives the same sequence for ${dateText}, so results are directly comparable.`,
      },
      {
        title: "One Test decides it",
        body: "Once your XI is complete, you play a single Test. Only the first ranked attempt is eligible for the daily leaderboard.",
      },
    ]),
  );
  nextHtml = replaceElementText(nextHtml, "data-board-title", "Your daily XI");
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-board-copy",
    'Future squads stay hidden until you lock each pick. Read the <a href="/how-to-play">full rules</a> or compare completed teams on the <a href="/leaderboard">leaderboard</a>.',
  );
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-board",
    '<div class="placeholder">Load today\'s challenge to reveal the first squad.</div>',
  );
  nextHtml = replaceElementText(nextHtml, "data-roll-squad", "Load today\'s challenge");
  nextHtml = setElementHidden(nextHtml, "data-start-series", true);
  nextHtml = setElementHidden(nextHtml, "data-draft-meter", true);

  return nextHtml;
}

function applyLeaderboardLanding(html) {
  return applyBaseView(html, {
    activeView: "leaderboard",
    activeTitleAttr: "data-leaderboard-title",
    competition: "ashes",
  });
}

function applyHowToPlayLanding(html) {
  return applyHomeLanding(html, {
    eyebrow: "How to Play",
    title: "How to play Ashes 5-0",
    tagline: "Historic squads. Hidden future rolls. One player at a time.",
    lede:
      "Learn the drafting rules, daily format, challenge mode, World Cup mode and how completed teams reach the leaderboard.",
    panelKicker: "Rules",
    panelTitle: "Cricket XI draft guide",
    panelCopy:
      'Use the <a href="/ashes">full Ashes mode</a>, try the <a href="/daily">Daily Challenge</a>, build a private <a href="/challenge">Challenge a Friend</a> link, or switch to <a href="/world-cup">World Cup mode</a>.',
    playButtonHidden: true,
    controlsHidden: true,
    hideConfigGrid: true,
    homeChallengeHidden: true,
    homeDailyHidden: true,
    homeLeaderboardHidden: true,
    homeCompetitionHidden: true,
    rulesHtml: copyGrid([
      {
        title: "Full XI drafting",
        body: "Roll a historic squad, choose one player, and lock that player into a valid XI slot. Keep going until your team is full.",
      },
      {
        title: "Hidden future squad rolls",
        body: "Each choice matters because the next squad stays hidden until you confirm the current pick.",
      },
      {
        title: "Team-composition rules",
        body: "Every slot has a role requirement, so you still need a balanced batting order, wicketkeeper, spin option and pace attack.",
      },
      {
        title: "Five-Test simulation",
        body: "A completed Ashes XI plays a full five-Test series against an all-star side drawn from the same historical pool.",
      },
      {
        title: "Daily Ashes Challenge",
        body: "The daily mode starts with seven fixed players. Four hidden squad rolls follow, one pick per roll, then one Test decides the result.",
      },
      {
        title: "Challenge a Friend",
        body: "Complete a team, generate a private link, and let someone else draft their XI before playing a five-Test head-to-head series.",
      },
      {
        title: "World Cup mode",
        body: "World Cup mode uses historic tournament squads and a tournament route. It keeps its own format and is not presented as an Ashes whitewash.",
      },
      {
        title: "Leaderboards",
        body: "Completed solo teams, friend challenges and finished daily drafts feed the player-selection leaderboard over time.",
      },
      {
        title: "Frequently asked questions",
        body: "Can I see future squads? No. Do daily practice runs count? No. Do short challenge links stay private? Yes, and generated challenge and result URLs are excluded from indexing.",
      },
    ]),
  });
}

function applyAboutLanding(html) {
  return applyHomeLanding(html, {
    eyebrow: "About Ashes 5-0",
    title: "The historic cricket XI game",
    tagline: "Draft a side from the past and see how it performs.",
    lede:
      "Ashes 5-0 is an independent cricket project built around historic squads, hidden future choices and simulation-led series outcomes.",
    panelKicker: "About",
    panelTitle: "What the project is",
    panelCopy:
      'Play the <a href="/ashes">Ashes mode</a>, try the <a href="/daily">Daily Challenge</a>, set up a private <a href="/challenge">friend challenge</a>, or read the <a href="/how-to-play">rules guide</a>.',
    playButtonHidden: true,
    controlsHidden: true,
    hideConfigGrid: true,
    homeChallengeHidden: true,
    homeDailyHidden: true,
    homeLeaderboardHidden: true,
    homeCompetitionHidden: true,
    rulesHtml: copyGrid([
      {
        title: "What Ashes 5-0 is",
        body: "It is a historic cricket drafting game where you build an XI from classic squads and then simulate how that team performs.",
      },
      {
        title: "Why it was created",
        body: "The project focuses on the fun of comparing great cricketers across eras while adding tension through constrained drafting and hidden future rolls.",
      },
      {
        title: "What makes it distinctive",
        body: "You cannot see the next squad before committing to the current pick, so every selection is both a team-building choice and a risk-management decision.",
      },
      {
        title: "Available modes",
        body: "The site includes a full Ashes draft, a Daily Ashes Challenge, Challenge a Friend links, a World Cup mode and a community selection leaderboard.",
      },
      {
        title: "Simulations and ratings",
        body: "At a high level, player ratings feed batting, bowling, fielding and experience balances, which then shape the simulated Test or tournament outcomes.",
      },
      {
        title: "Independent cricket project",
        body: "Ashes 5-0 is an independent project. It does not claim endorsement from the ECB, Cricket Australia, the ICC or any player.",
      },
      {
        title: "Entertainment only",
        body: "Results and rankings are intended for entertainment and comparison rather than official historical judgement.",
      },
      {
        title: "Feedback",
        body: "Use the feedback form in the footer to report bugs, suggest ideas or share thoughts on the drafting and simulation experience.",
      },
    ]),
  });
}

function applyWorldCupLanding(html) {
  let nextHtml = applyHomeLanding(html, {
    competition: "worldcup",
    eyebrow: "World Cup XI",
    title: "Build your World Cup XI",
    tagline: "Roll a World Cup squad. Lock one player. Build your XI.",
    lede:
      "Build a World Cup cricket XI from historic tournament squads, make one selection at a time and see how your side performs across the tournament route.",
    panelKicker: "How it works",
    panelTitle: "World Cup mode",
    panelCopy:
      'Looking for the Test-match format? Return to <a href="/ashes">Ashes mode</a>, browse the <a href="/how-to-play">rules guide</a>, or compare players on the <a href="/leaderboard">leaderboard</a>.',
    playLabel: "Start World Cup",
    homeChallengeHidden: true,
    homeDailyHidden: true,
    homeLeaderboardHidden: true,
  });

  nextHtml = replaceElementText(nextHtml, "data-home-format-value", "ODI");
  nextHtml = replaceElementText(nextHtml, "data-home-format-label", "Match format");
  nextHtml = replaceElementText(nextHtml, "data-home-squads-label", "World Cup squads");
  nextHtml = replaceElementText(nextHtml, "data-home-rule-one", "Roll a historic World Cup squad.");
  nextHtml = replaceElementText(nextHtml, "data-home-rule-three", "Repeat until your XI is full, then simulate the tournament.");
  nextHtml = replaceElementText(nextHtml, "data-home-competition", "Ashes mode");
  return nextHtml;
}

function applyAshesLanding(html) {
  const nextHtml = applyHomeLanding(html, {
    eyebrow: "Ashes 5-0",
    title: "Can your Ashes XI go 5-0?",
    tagline: "Roll a squad. Lock one player. Build your XI.",
    lede:
      "Roll historic England and Australia squads, lock one player at a time and build an all-time Ashes XI capable of completing a five-Test whitewash.",
    panelKicker: "How it works",
    panelTitle: "Ashes mode",
    panelCopy:
      'Try the <a href="/daily">Daily Challenge</a>, create a private <a href="/challenge">Challenge a Friend</a> link, or read the <a href="/how-to-play">full rules</a> before you draft.',
    playLabel: "Start Ashes mode",
  });

  return nextHtml;
}

function applyHomepage(html) {
  const nextHtml = applyHomeLanding(html, {
    eyebrow: "Ashes 5-0",
    title: "Can your Ashes XI go 5-0?",
    tagline: "Roll a squad. Lock one player. Build your XI.",
    lede:
      "Roll historic squads, lock one player at a time and build an all-time XI capable of completing an Ashes whitewash.",
    panelKicker: "How it works",
    panelTitle: "Ashes 5-0",
    panelCopy:
      'Play the full <a href="/ashes">Ashes mode</a>, try the <a href="/daily">Daily Challenge</a>, create a private <a href="/challenge">friend challenge</a>, or explore the <a href="/leaderboard">community picks</a>.',
    playLabel: "Start a solo game",
    hideSiteNav: true,
  });

  return nextHtml;
}

function applyChallengeLanding(html) {
  let nextHtml = applyBaseView(html, {
    activeView: "game",
    activeTitleAttr: "data-game-title",
    competition: "ashes",
  });

  nextHtml = replaceElementText(nextHtml, "data-game-squad-count", "Historic squads");
  nextHtml = replaceElementText(nextHtml, "data-game-player-count", "11 picks");
  nextHtml = replaceElementText(nextHtml, "data-game-mode", "Challenge");
  nextHtml = replaceElementText(nextHtml, "data-game-eyebrow", "Challenge a Friend");
  nextHtml = replaceElementText(nextHtml, "data-game-title", "Build a cricket XI and face a friend");
  nextHtml = replaceElementText(nextHtml, "data-current-squad", "Roll a squad");
  nextHtml = replaceElementText(nextHtml, "data-lineup-status", "Awaiting first pick");
  nextHtml = replaceElementText(nextHtml, "data-roster-kicker", "How it works");
  nextHtml = replaceElementText(nextHtml, "data-roster-title", "How Challenge a Friend works");
  nextHtml = replaceElementText(nextHtml, "data-roster-summary", "Build a team, share a private link, and compare the result when your friend is done.");
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-roster-grid",
    copyGrid([
      {
        title: "1. Build your XI",
        body: "Draft a full historic cricket XI in classic or memory mode and lock the side you want to send.",
      },
      {
        title: "2. Generate and share a private link",
        body: "Create a short URL that saves the team privately and keeps generated challenge pages excluded from indexing.",
      },
      {
        title: "3. Your friend drafts and plays",
        body: "They open the link, draft their own XI and then play a five-Test series against your saved team.",
      },
      {
        title: "4. Compare or challenge them back",
        body: "Review the final result, send it back, and set up a rematch if you both want another go.",
      },
    ]),
  );
  nextHtml = replaceElementText(nextHtml, "data-board-title", "Your challenge XI");
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-board-copy",
    'Need the rules first? Read <a href="/how-to-play">How to Play</a>, compare community picks on the <a href="/leaderboard">leaderboard</a>, or return to the main <a href="/ashes">Ashes mode</a>.',
  );
  nextHtml = replaceElementInnerHtml(
    nextHtml,
    "data-board",
    '<div class="placeholder">Roll an Ashes squad to begin your challenge XI.</div>',
  );
  nextHtml = replaceElementText(nextHtml, "data-roll-squad", "Roll Ashes squad");
  nextHtml = setElementHidden(nextHtml, "data-start-series", true);
  return nextHtml;
}

function pageHtmlTransform(pageKey) {
  switch (pageKey) {
    case "home":
      return applyHomepage;
    case "ashes":
      return applyAshesLanding;
    case "daily":
      return applyDailyLanding;
    case "challenge":
      return applyChallengeLanding;
    case "leaderboard":
      return applyLeaderboardLanding;
    case "howToPlay":
      return applyHowToPlayLanding;
    case "about":
      return applyAboutLanding;
    case "worldCup":
      return applyWorldCupLanding;
    default:
      return (html) => html;
  }
}

function pageBootstrap(pageKey) {
  switch (pageKey) {
    case "daily":
      return {
        route: {
          type: "daily",
          pageKey,
          currentDate: new Date().toISOString().slice(0, 10),
        },
      };
    case "challenge":
      return {
        route: {
          type: "challenge-landing",
          pageKey,
        },
      };
    case "leaderboard":
      return {
        route: {
          type: "leaderboard",
          pageKey,
        },
      };
    case "worldCup":
      return {
        route: {
          type: "world-cup",
          pageKey,
        },
      };
    default:
      return {
        route: {
          type: "landing",
          pageKey,
        },
      };
  }
}

export async function renderPublicPage(context, pageKey) {
  const page = PUBLIC_PAGE_DEFS[pageKey];
  if (!page) {
    throw new Error(`Unknown public page: ${pageKey}`);
  }

  const canonical = canonicalUrlForPageKey(pageKey);
  const structuredData = pageKey === "home"
    ? websiteStructuredData()
    : breadcrumbStructuredData(
      pageKey === "howToPlay" ? "How to Play" : pageKey === "worldCup" ? "World Cup mode" : page.title,
      canonical,
    );

  return renderSpaPage(context, {
    title: page.title,
    description: page.description,
    canonical,
    ogUrl: canonical,
    ogTitle: page.title,
    ogDescription: page.description,
    robots: "index, follow",
    bootstrap: pageBootstrap(pageKey),
    structuredData,
    htmlTransform: pageHtmlTransform(pageKey),
  });
}
