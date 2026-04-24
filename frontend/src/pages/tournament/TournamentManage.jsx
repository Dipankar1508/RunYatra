import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";
import { motion } from "framer-motion";

import LoadingScreen from "../../components/LoadingScreen";
import OverviewRules from "../rules/OverviewRules";
import CodesRules from "../rules/CodesRules";
import TeamsRules from "../rules/TeamsRules";
import MatchesRules from "../rules/MatchesRules";
import PointsRules from "../rules/PointsRules";
import TournamentScheduleSection from "../../components/tournament/TournamentScheduleSection";
import TournamentPointsTableCard from "../../components/tournament/TournamentPointsTableCard";
import {
  STAGE_ORDER,
  formatStageName,
  groupMatchesByRound,
  isStageComplete,
} from "../../utils/tournamentStages";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function TournamentManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState("overview");
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [showTeamDeleteConfirm, setShowTeamDeleteConfirm] = useState(false);
  const [scheduleMode, setScheduleMode] = useState("");
  const [matches, setMatches] = useState([]);
  const [pointsTable, setPointsTable] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTournament();
    fetchMatches();
    fetchPointsTable();
  }, [location]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "codes", label: "Join Codes" },
    { id: "teams", label: "Teams" },
    { id: "matches", label: "Matches" },
    { id: "points", label: "Points Table" },
  ];

  const fetchTournament = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/tournaments/search/${id}`);
      console.log(res.data);
      setTournament(res.data);
      fetchMatches();
      fetchPointsTable();
    } catch (error) {
      console.error("Error loading tournament", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/tournaments/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTournament((prev) => ({
        ...prev,
        status: newStatus,
      }));

      toast.success("Tournament status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const generateCodes = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/tournaments/${id}/generate-codes`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // console.log(res.data);
      toast("Codes Generated", "success");
      fetchTournament();
    } catch (error) {
      console.error(error);
    }
  };

  const resetCodes = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/tournaments/${id}/reset-codes`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      fetchTournament();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTournament = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/tournaments/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast("Tournament deleted", "success");
      navigate("/organizer-dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const removeTeam = async (teamId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tournaments/${id}/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast("Team removed", "success");

      fetchTournament();
    } catch (error) {
      toast("Error removing team", "error");
    }
  };

  const generateSchedule = async () => {
    if (!scheduleMode) {
      toast("Select schedule mode", "error");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/schedule/${id}/generate-schedule`,
        { mode: scheduleMode },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast("Schedule generated", "success");

      fetchTournament();
      fetchMatches();
    } catch (error) {
      toast(error.response?.data?.message || "Error generating schedule");
    }
  };

  const resetSchedule = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/schedule/${id}/reset-schedule`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast("Schedule reset", "success");

      fetchTournament();
      fetchMatches();
    } catch (error) {
      toast("Error resetting schedule");
    }
  };
  const fetchMatches = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/matches/tournament/${id}`);
      // console.log(res.data);
      setMatches(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateResult = (matchId) => {
    navigate(`/matches/${matchId}/update`);
  };

  const fetchPointsTable = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/points-table/${id}`);

      setPointsTable(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingScreen item="Tournament" />;
  }
  if (!tournament) return <div className="p-6">Tournament not found</div>;

  const groupedMatches = groupMatchesByRound(matches);
  const groupCompleted = isStageComplete(groupedMatches.group);
  const semiCompleted = isStageComplete(groupedMatches.semi_final);
  const finalCompleted = isStageComplete(groupedMatches.final);
  const canProceedToSemi =
    tournament.scheduleGenerated &&
    groupCompleted &&
    !tournament.semiFinalGenerated;
  const canProceedToFinal =
    tournament.semiFinalGenerated &&
    semiCompleted &&
    !tournament.finalGenerated;
  const canResetEntireSchedule = !tournament.semiFinalGenerated;
  const canResetSemiFinal =
    tournament.semiFinalGenerated && !tournament.finalGenerated;

  const isResultLocked = (match) => {
    if (match.round === "group" && tournament.semiFinalGenerated) {
      return true;
    }

    if (match.round === "semi_final" && tournament.finalGenerated) {
      return true;
    }

    return false;
  };

  const proceedToSemiFinal = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/schedule/${id}/proceed-semi-final`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast("Semi finals created", "success");
      fetchTournament();
      fetchMatches();
    } catch (error) {
      toast(
        error.response?.data?.message || "Error creating semi final schedule",
        "error",
      );
    }
  };

  const resetSemiFinal = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/schedule/${id}/reset-semi-final`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast("Semi final schedule reset", "success");
      fetchTournament();
      fetchMatches();
    } catch (error) {
      toast(
        error.response?.data?.message || "Error resetting semi finals",
        "error",
      );
    }
  };

  const proceedToFinal = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/schedule/${id}/proceed-final`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast("Final created", "success");
      fetchTournament();
      fetchMatches();
    } catch (error) {
      toast(
        error.response?.data?.message || "Error creating final schedule",
        "error",
      );
    }
  };

  const resetFinal = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/schedule/${id}/reset-final`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast("Final schedule reset", "success");
      fetchTournament();
      fetchMatches();
    } catch (error) {
      toast(error.response?.data?.message || "Error resetting final", "error");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">{tournament.name}</h1>

      {/* Tabs */}

      <div
        className="relative mb-6 flex justify-between
        bg-white dark:bg-gray-800
        rounded-xl shadow-2xl p-1"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex-1 text-center
              py-2 px-2
              text-xs sm:text-sm md:text-base
              font-medium
              transition
      ${tab === t.id ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
          >
            {tab === t.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0
          bg-purple-600
          rounded-lg
          z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Overview */}

      {tab === "overview" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center bg-gray-100 dark:bg-gray-700 rounded-xl p-3 sm:p-4 lg:p-6">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                Teams Joined
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                {tournament.teams.length}/{tournament.rules.maxTeams}
              </p>
            </div>

            <div className="text-center bg-gray-100 dark:bg-gray-700 rounded-xl p-3 sm:p-4 lg:p-6">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                Overs / Match
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                {tournament.rules.oversPerMatch}
              </p>
            </div>

            <div className="text-center bg-gray-100 dark:bg-gray-700 rounded-xl p-3 sm:p-4 lg:p-6">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                Players / Team
              </p>
              <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                {tournament.rules.playersPerTeam}
              </p>
            </div>
          </div>

          {/* Tournament Details */}
          <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="flex justify-between bg-gray-50 dark:bg-gray-700/40 p-3 sm:p-4 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">Location</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                {tournament.location}
              </span>
            </div>

            <div className="flex justify-between bg-gray-50 dark:bg-gray-700/40 p-3 sm:p-4 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">Dates</span>
              <span className="font-semibold text-gray-800 dark:text-white text-right">
                {new Date(tournament.startDate).toLocaleDateString("en-GB")} -
                {new Date(tournament.endDate).toLocaleDateString("en-GB")}
              </span>
            </div>

            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/40 p-3 sm:p-4 rounded-lg">
              <span className="text-gray-500 dark:text-gray-400">Status</span>

              <div className="flex items-center gap-2">
                {/* Current Status Badge */}

                <span
                  className={`px-3 py-1 text-xs sm:text-sm rounded-full font-semibold
                  ${
                    tournament.status === "completed"
                      ? "bg-green-500 text-white"
                      : tournament.status === "live"
                        ? "bg-yellow-400 text-black"
                        : "bg-blue-500 text-white"
                  }`}
                >
                  {tournament.status.toUpperCase()}
                </span>

                {/* Status Selector */}

                <select
                  value={tournament.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="
                    text-xs sm:text-sm
                    px-3 py-2
                    rounded-lg
                    border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-800
                    text-gray-700 dark:text-gray-200
                    shadow-sm
                    hover:border-purple-500
                    focus:outline-none
                    focus:ring-2 focus:ring-purple-500
                    focus:border-purple-500
                    transition
                    cursor-pointer
                  "
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-orange-50 p-5 dark:border-purple-900/60 dark:from-purple-950/40 dark:via-gray-800 dark:to-orange-950/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-500 dark:text-purple-300">
                    Tournament Flow
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {formatStageName(tournament.currentStage)}
                  </h3>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm dark:bg-gray-900 dark:text-purple-300">
                  {tournament.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Group Stage",
                    value: groupCompleted ? "Completed" : "In Progress",
                  },
                  {
                    label: "Semi Final",
                    value:
                      groupedMatches.semi_final.length === 0
                        ? "Waiting"
                        : semiCompleted
                          ? "Completed"
                          : "In Progress",
                  },
                  {
                    label: "Final",
                    value:
                      groupedMatches.final.length === 0
                        ? "Waiting"
                        : finalCompleted
                          ? "Completed"
                          : "In Progress",
                  },
                ].map((stage) => (
                  <div
                    key={stage.label}
                    className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                      {stage.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                      {stage.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/70 to-orange-50/60 p-5 shadow-sm dark:border-emerald-900/50 dark:from-gray-900 dark:via-emerald-950/20 dark:to-orange-950/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                    Tournament Winner
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Champion
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                  <EmojiEventsIcon sx={{ fontSize: 24 }} />
                </div>
              </div>

              {tournament.winner ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-white/90 p-5 text-emerald-900 shadow-sm dark:border-emerald-900/60 dark:bg-gray-900/70 dark:text-emerald-200">
                  {/* <p className="text-xs uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
                    Confirmed Winner
                  </p> */}
                  <p className=" text-2xl font-bold sm:text-3xl">
                    {tournament.winner.name}
                  </p>
                  <p className=" text-sm text-emerald-700/80 dark:text-emerald-200/70">
                    This team has completed the tournament journey and currently
                    holds the title.
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-5 dark:border-gray-700 dark:bg-gray-900/50">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Champion not decided yet
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    The winner will appear here once the final is played and the
                    result is submitted.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-red-700 dark:text-red-400">
                Danger Zone
              </h3>

              <p className="text-sm text-red-600 dark:text-red-300">
                Deleting this tournament will remove all teams, matches, and
                results permanently.
              </p>
            </div>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
            >
              Delete Tournament
            </button>
          </div>
          <OverviewRules />
        </div>
      )}

      {/* Join Codes */}

      {tab === "codes" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Join Codes</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tournament.joinCodes?.map((code) => (
              <div
                key={code._id}
                className={`p-3 rounded text-center font-mono
                ${code.used ? "bg-red-200" : "bg-purple-600"}`}
              >
                {code.code}
              </div>
            ))}
          </div>

          <div className="flex gap-6 mt-6">
            <button
              onClick={generateCodes}
              disabled={tournament.joinCodes?.length > 0}
              className={`mb-4 px-4 py-2 rounded text-white
              ${
                tournament.joinCodes?.length > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Generate Join Codes
            </button>
            <button
              onClick={resetCodes}
              className="mb-4 px-4 py-2 bg-orange-400 text-white rounded"
            >
              Reset Join Codes
            </button>
          </div>
          <CodesRules />
        </div>
      )}

      {/* Teams */}

      {tab === "teams" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
              Teams Joined
            </h2>

            <span className="text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full">
              {tournament.teams?.length} Teams
            </span>
          </div>

          {tournament.teams?.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No teams joined yet
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tournament.teams.map((team) => (
                <div
                  key={team._id}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition border dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  {/* TEAM HEADER */}
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <div>
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      {/* <p className="text-sm opacity-90">
                        Captain: {team.captain?.name}
                      </p> */}
                    </div>

                    <button
                      onClick={() => {
                        setTeamToDelete(team._id);
                        setShowTeamDeleteConfirm(true);
                      }}
                      className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded-md"
                    >
                      Remove
                    </button>
                  </div>

                  {/* PLAYERS */}
                  <div className="p-4">
                    <p className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                      Players
                    </p>

                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li className="font-semibold text-indigo-600 dark:text-indigo-400 flex justify-between">
                        <span>Captain: {team.captain?.name}</span>
                        <span className="text-gray-500 capitalize">
                          {team.captainDetails?.role}
                        </span>
                      </li>

                      {team.players.map((p, index) => (
                        <li
                          key={index}
                          className="flex justify-between border-b dark:border-gray-700 pb-1"
                        >
                          <span>{p.name}</span>
                          <span className="text-gray-500 capitalize">
                            {p.role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
          <TeamsRules />
        </div>
      )}

      {/* Matches */}

      {tab === "matches" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Tournament Schedule</h2>
              {/* <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Group generation stays exactly as before. Semi final and final
                progression are manual organizer actions.
              </p> */}
            </div>

            <span className="rounded-full bg-purple-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-700 dark:bg-purple-900/50 dark:text-purple-200">
              {formatStageName(tournament.currentStage)}
            </span>
          </div>

          {!tournament.scheduleGenerated && (
            <div className="mb-8 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-orange-50 p-5 dark:border-purple-900/40 dark:from-gray-900 dark:to-purple-950/30">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Group Stage Generator
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <select
                  value={scheduleMode}
                  onChange={(e) => setScheduleMode(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="">Select Mode</option>
                  <option value="one_to_one">One vs One</option>
                  <option value="one_to_two">One vs Two</option>
                  <option value="one_to_three">One vs Three</option>
                  <option value="one_to_half">Half Teams</option>
                  <option value="one_to_all">Round Robin</option>
                </select>

                <button
                  onClick={generateSchedule}
                  className="rounded-xl bg-purple-600 px-5 py-3 text-white transition hover:bg-purple-700"
                >
                  Generate Group Schedule
                </button>
              </div>
            </div>
          )}

          {tournament.scheduleGenerated && (
            <div className="mb-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-700 dark:bg-gray-900/50">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                  Stage Checks
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Group Completed",
                      value: groupCompleted ? "Yes" : "No",
                    },
                    {
                      label: "Semi Completed",
                      value: semiCompleted ? "Yes" : "No",
                    },
                    {
                      label: "Final Created",
                      value: tournament.finalGenerated ? "Yes" : "No",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5 dark:border-purple-900/40 dark:from-purple-950/20 dark:to-gray-900">
                <p className="text-sm uppercase tracking-[0.2em] text-purple-500 dark:text-purple-300">
                  Organizer Controls
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={resetSchedule}
                    disabled={!canResetEntireSchedule}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                      canResetEntireSchedule
                        ? "bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600"
                        : "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                    }`}
                  >
                    Reset Entire Schedule
                  </button>

                  {canProceedToSemi && (
                    <button
                      onClick={proceedToSemiFinal}
                      className="w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      Proceed To Semi Final
                    </button>
                  )}

                  {tournament.semiFinalGenerated && (
                    <button
                      onClick={resetSemiFinal}
                      disabled={!canResetSemiFinal}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                        canResetSemiFinal
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                      }`}
                    >
                      Reset Semi Final
                    </button>
                  )}

                  {canProceedToFinal && (
                    <button
                      onClick={proceedToFinal}
                      className="w-full rounded-xl bg-purple-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
                    >
                      Proceed To Final
                    </button>
                  )}

                  {tournament.finalGenerated && (
                    <button
                      onClick={resetFinal}
                      className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Reset Final
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {matches.length === 0 ? (
            <p className="text-gray-500">No matches generated yet</p>
          ) : (
            <div className="space-y-6">
              {STAGE_ORDER.map((round) => (
                <TournamentScheduleSection
                  key={round}
                  round={round}
                  matches={groupedMatches[round]}
                  canUpdate
                  onUpdateResult={updateResult}
                  isUpdateDisabled={isResultLocked}
                />
              ))}
            </div>
          )}

          <MatchesRules />
        </div>
      )}

      {/* Points Table */}

      {tab === "points" && (
        <div className="space-y-4">
          <TournamentPointsTableCard pointsTable={pointsTable} />
          <PointsRules />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-[320px]"
          >
            <h2 className="text-xl font-semibold mb-3 text-center">
              Delete Tournament
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
              Are you sure you want to delete this tournament?
            </p>

            <div className="flex justify-center gap-10">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  deleteTournament();
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showTeamDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-[320px]"
          >
            <h2 className="text-xl font-semibold mb-3 text-center">
              Remove Team
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
              Are you sure you want to remove this team from the tournament?
            </p>

            <div className="flex justify-center gap-10">
              <button
                onClick={() => {
                  setShowTeamDeleteConfirm(false);
                  setTeamToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  removeTeam(teamToDelete);
                  setShowTeamDeleteConfirm(false);
                  setTeamToDelete(null);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
