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

      setTournament(res.data);
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

  const generateSchedule = () => {
    console.log("Schedule generation logic here");
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
          <h2 className="text-xl mb-4">Teams Joined</h2>

          {tournament.teams?.length === 0 ? (
            <p>No teams joined yet</p>
          ) : (
            <ul className="list-disc pl-6">
              {tournament.teams?.map((team) => (
                <li key={team._id}>{team.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Matches */}

      {tab === "matches" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Matches</h2>

          <button
            onClick={generateSchedule}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Generate Schedule
          </button>

          <p>Match schedule will appear here.</p>
        </div>
      )}

      {/* Points Table */}

      {tab === "points" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Points Table</h2>

          <p>Points table will appear here.</p>
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
