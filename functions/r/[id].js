import { renderSpaPage } from "../_lib/spa.js";
import { fetchResultDetails } from "../_lib/store.js";

function scoreLabel(result) {
  return `${result.userWins}-${result.starWins}${result.draws ? `-${result.draws}` : ""}`;
}

export async function onRequestGet(context) {
  const resultId = String(context.params.id ?? "").trim();
  const details = resultId ? await fetchResultDetails(context.env.DB, resultId) : null;

  if (!details) {
    return renderSpaPage(context, {
      status: 404,
      title: "Result Not Found | Ashes 5-0",
      description: "This saved Ashes 5-0 result could not be found. Start a new series or ask for a fresh result link.",
      canonical: `https://ashes-5-0.co.uk/r/${resultId}`,
      ogUrl: `https://ashes-5-0.co.uk/r/${resultId}`,
      robots: "noindex, follow",
      bootstrap: {
        route: {
          type: "result-not-found",
          id: resultId,
        },
      },
    });
  }

  const challengerLabel = details.result.challengerDisplayName
    ? `${details.result.challengerDisplayName}'s XI`
    : "Challenger's XI";
  const responderLabel = details.result.responderDisplayName
    ? `${details.result.responderDisplayName}'s XI`
    : "Responder's XI";
  const title = `${responderLabel} vs ${challengerLabel} | Challenge Result | Ashes 5-0`;
  const description = `${responderLabel} completed an Ashes 5-0 ${details.result.mode} challenge against ${challengerLabel}. Final score: ${scoreLabel(details.result)}.`;

  return renderSpaPage(context, {
    title,
    description,
    canonical: details.result.shortUrl,
    ogUrl: details.result.shortUrl,
    ogTitle: title,
    ogDescription: description,
    robots: "noindex, follow",
    bootstrap: {
      route: {
        type: "result",
        id: details.result.id,
      },
      result: details.result,
      challenge: details.challenge,
      creatorTeam: details.creatorTeam,
      responderTeam: details.responderTeam,
    },
  });
}
