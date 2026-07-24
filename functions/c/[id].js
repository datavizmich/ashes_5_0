import { renderSpaPage } from "../_lib/spa.js";
import { fetchChallengeDetails } from "../_lib/store.js";

export async function onRequestGet(context) {
  const challengeId = String(context.params.id ?? "").trim();
  const details = challengeId ? await fetchChallengeDetails(context.env.DB, challengeId) : null;

  if (!details) {
    return renderSpaPage(context, {
      status: 404,
      title: "Challenge Not Found | Ashes 5-0",
      description: "This Ashes 5-0 challenge link could not be found. Start a new XI or ask for a fresh invite.",
      canonical: `https://ashes-5-0.co.uk/c/${challengeId}`,
      ogUrl: `https://ashes-5-0.co.uk/c/${challengeId}`,
      robots: "noindex, follow",
      bootstrap: {
        route: {
          type: "challenge-not-found",
          id: challengeId,
        },
      },
    });
  }

  const creatorName = details.team.displayName;
  const modeLabel = details.team.mode === "memory" ? "Memory" : "Classic";
  const title = creatorName
    ? `${creatorName}'s ${modeLabel} Challenge | Ashes 5-0`
    : `${modeLabel} Challenge | Ashes 5-0`;
  const description = creatorName
    ? `Open ${creatorName}'s Ashes 5-0 ${modeLabel.toLowerCase()} challenge, draft your XI, and play the five-Test series.`
    : `Open an Ashes 5-0 ${modeLabel.toLowerCase()} challenge, draft your XI, and play the five-Test series.`;

  return renderSpaPage(context, {
    title,
    description,
    canonical: details.challenge.url,
    ogUrl: details.challenge.url,
    robots: "noindex, follow",
    bootstrap: {
      route: {
        type: "challenge",
        id: details.challenge.id,
      },
      challenge: details.challenge,
      team: details.team,
    },
  });
}
