import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";
import { motion } from "framer-motion";

export default function TournamentManage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [scheduleMode, setScheduleMode] = useState("");
  const [matches, setMatches] = useState([]);
  const [pointsTable, setPointsTable] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTournament();
  }, []);

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

      setMatches(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPointsTable = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/points-table/${id}`);

      setPointsTable(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!tournament) return <div className="p-6">Tournament not found</div>;

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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl">
          <p>
            <b>Location:</b> {tournament.location}
          </p>

          <p>
            <b>Dates:</b>{" "}
            {new Date(tournament.startDate).toLocaleDateString("en-GB")} -
            {new Date(tournament.endDate).toLocaleDateString("en-GB")}
          </p>

          <p>
            <b>Status:</b> {tournament.status}
          </p>

          <p>
            <b>Teams Joined:</b> {tournament.teams.length} /
            {tournament.rules.maxTeams}
          </p>

          <p>
            <b>Overs per Match:</b> {tournament.rules.oversPerMatch}
          </p>

          <p>
            <b>Players per Team:</b> {tournament.rules.playersPerTeam}
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Delete Tournament
            </button>
          </div>
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
        </div>
      )}

      {/* Teams */}

      {tab === "teams" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Teams Joined</h2>

          {tournament.teams?.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No teams joined yet
            </div>
          ) : (
            <div className="space-y-4">
              {tournament.teams.map((team) => (
                <div
                  key={team._id}
                  className="border rounded-lg dark:border-gray-600"
                >
                  {/* TEAM HEADER */}
                  <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700">
                    <div>
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-sm text-gray-500">
                        Captain: {team.captain?.name}
                      </p>
                    </div>

                    <button
                      onClick={() => removeTeam(team._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>

                  {/* PLAYERS LIST */}
                  <div className="p-4">
                    <p className="font-semibold mb-2">Players</p>

                    <ul className="space-y-1 text-sm">
                      <li>
                        <b>Captain:</b> {team.captain?.name}
                      </li>

                      {team.players.map((p, index) => (
                        <li key={index}>
                          {p.name} ({p.role})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matches */}

      {tab === "matches" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Tournament Schedule</h2>

          {!tournament.scheduleGenerated && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select
                value={scheduleMode}
                onChange={(e) => setScheduleMode(e.target.value)}
                className="p-2 rounded border dark:bg-gray-700"
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
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Generate Schedule
              </button>
            </div>
          )}

          {tournament.scheduleGenerated && (
            <button
              onClick={resetSchedule}
              className="px-4 py-2 mb-6 bg-orange-500 text-white rounded"
            >
              Reset Schedule
            </button>
          )}

          {/* Matches List */}

          {matches.length === 0 ? (
            <p>No matches generated yet</p>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match._id}
                  className="flex justify-between items-center
            p-4 rounded border
            bg-gray-100 dark:bg-gray-700"
                >
                  <div className="font-semibold">Match {match.matchNumber}</div>

                  <div className="flex gap-3 items-center">
                    <span>{match.teamA?.name}</span>
                    <span className="font-bold">vs</span>
                    <span>{match.teamB?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Points Table */}

      {tab === "points" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4 font-semibold">Points Table</h2>

          {pointsTable.length === 0 ? (
            <p>No data yet</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Team</th>
                  <th className="p-2">Played</th>
                  <th className="p-2">Won</th>
                  <th className="p-2">Lost</th>
                  <th className="p-2">Points</th>
                  <th className="p-2">NRR</th>
                </tr>
              </thead>

              <tbody>
                {pointsTable.map((team, index) => (
                  <tr key={team._id} className="border-b">
                    <td className="p-2">
                      {index + 1}. {team.team?.name}
                    </td>

                    <td className="p-2">{team.played}</td>
                    <td className="p-2">{team.won}</td>
                    <td className="p-2">{team.lost}</td>
                    <td className="p-2">{team.points}</td>
                    <td className="p-2">{team.netrunrate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
    </div>
  );
}
