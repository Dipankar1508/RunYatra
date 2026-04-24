import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { STAGE_META } from "../../utils/tournamentStages";

function MatchStatusBadge({ status }) {
  return (
    <span
      className={`flex items-center justify-center gap-1 h-8 px-3 text-xs font-semibold rounded-md ${
        status === "completed"
          ? "bg-green-500 text-white"
          : status === "live"
            ? "bg-yellow-400 text-black"
            : "bg-blue-500 text-white"
      }`}
    >
      {status === "completed" && <CheckCircleIcon sx={{ fontSize: 16 }} />}
      {status === "live" && <FiberManualRecordIcon sx={{ fontSize: 14 }} />}
      {status === "scheduled" && <AccessTimeIcon sx={{ fontSize: 16 }} />}
      <span className="hidden sm:inline">{status.toUpperCase()}</span>
    </span>
  );
}

export default function TournamentScheduleSection({
  round,
  matches = [],
  canUpdate = false,
  onUpdateResult,
  isUpdateDisabled,
}) {
  if (!matches.length) {
    return null;
  }

  const meta = STAGE_META[round] || STAGE_META.group;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {meta.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {matches.length} {matches.length === 1 ? "match" : "matches"}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}
        >
          {meta.title}
        </span>
      </div>

      <div className="space-y-5">
        {matches.map((match) => {
          const disabled = isUpdateDisabled?.(match) ?? false;

          return (
            <div
              key={match._id}
              className={`rounded-2xl border ${meta.borderClass} bg-white p-5 shadow-md transition-all hover:shadow-lg dark:bg-gray-800`}
            >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  {match.slotLabel || `Match ${match.matchNumber}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MatchStatusBadge status={match.status} />

                {canUpdate && (
                  <button
                    disabled={disabled}
                    onClick={() => onUpdateResult?.(match._id)}
                    className={`flex h-8 items-center justify-center rounded-md px-3 text-white transition ${
                      disabled
                        ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
                    <span className="ml-1 hidden text-xs sm:inline">
                      Update Result
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-2 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white sm:flex">
                  {match.teamA?.name?.[0]}
                </div>

                <p className="mt-2 text-sm font-semibold leading-tight sm:text-base">
                  {match.teamA?.name}
                </p>

                {match.result === "teamA" && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-200">
                    <EmojiEventsIcon sx={{ fontSize: 14 }} />
                    Winner
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-lg font-bold text-purple-600 sm:text-xl">
                  VS
                </span>
                {match.resultSummary && (
                  <p className="max-w-[12rem] text-xs text-gray-500 dark:text-gray-400">
                    {match.resultSummary}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white sm:flex">
                  {match.teamB?.name?.[0]}
                </div>

                <p className="mt-2 text-sm font-semibold leading-tight sm:text-base">
                  {match.teamB?.name}
                </p>

                {match.result === "teamB" && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-200">
                    <EmojiEventsIcon sx={{ fontSize: 14 }} />
                    Winner
                  </span>
                )}
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
