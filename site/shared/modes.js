export const PLAYABLE_MODE_DEFS = {
  classic: {
    key: "classic",
    shortLabel: "Classic",
    cardTitle: "Classic Draft",
    showPlayerRatings: true,
    draftNote: "Player ratings are visible while you build your XI.",
    cardCopy: "Build a complete XI with player ratings visible while you draft.",
  },
  memory: {
    key: "memory",
    shortLabel: "Memory",
    cardTitle: "Memory Draft",
    showPlayerRatings: false,
    draftNote: "Player ratings are hidden. Pick using your own cricket knowledge.",
    cardCopy: "Build your XI without seeing player ratings. Rely on your own cricket knowledge.",
  },
};

export function playableModeDef(value) {
  return value === "memory" ? PLAYABLE_MODE_DEFS.memory : PLAYABLE_MODE_DEFS.classic;
}
