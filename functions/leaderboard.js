import { renderSpaPage } from "./_lib/spa.js";

export async function onRequestGet(context) {
  return renderSpaPage(context, {
    title: "Player Leaderboard | Ashes 5-0",
    description: "See which Ashes 5-0 players are selected most often across completed XIs.",
    canonical: "https://ashes-5-0.co.uk/leaderboard",
    ogUrl: "https://ashes-5-0.co.uk/leaderboard",
    robots: "index, follow",
    bootstrap: {
      route: {
        type: "leaderboard",
      },
    },
  });
}
