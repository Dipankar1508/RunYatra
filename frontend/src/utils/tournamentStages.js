export const STAGE_ORDER = ["group", "semi_final", "final"];

export const STAGE_META = {
  group: {
    title: "Group Stage",
    badgeClass:
      "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
    borderClass: "border-sky-200 dark:border-sky-800",
  },
  semi_final: {
    title: "Semi Final",
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
  final: {
    title: "Final",
    badgeClass:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
    borderClass: "border-rose-200 dark:border-rose-800",
  },
};

export function groupMatchesByRound(matches = []) {
  return matches.reduce(
    (acc, match) => {
      const round = match.round || "group";

      if (!acc[round]) {
        acc[round] = [];
      }

      acc[round].push(match);
      return acc;
    },
    { group: [], semi_final: [], final: [] },
  );
}

export function isStageComplete(matches = []) {
  return matches.length > 0 && matches.every((match) => match.status === "completed");
}

export function formatStageName(stage = "group") {
  return stage.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
