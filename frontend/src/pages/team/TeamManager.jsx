import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

import TeamOverviewInfo from "./TeamOverviewInfo";
import TeamOverViewRules from "../rules/TeamOverViewRules";
import AddPlayerRules from "../rules/AddPlayerRules";
import LoadingScreen from "../../components/LoadingScreen";
import TournamentScheduleSection from "../../components/tournament/TournamentScheduleSection";
import { STAGE_ORDER, groupMatchesByRound } from "../../utils/tournamentStages";

import EditIcon from "@mui/icons-material/Edit";

export default function TeamManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [pointsTable, setPointsTable] = useState([]);

  const [tab, setTab] = useState("overview");

  const [playerName, setPlayerName] = useState("");
  const [role, setRole] = useState("batsman");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [battingStyle, setBattingStyle] = useState("right-hand");
  const [bowlingStyle, setBowlingStyle] = useState("medium");

  const [editingCaptain, setEditingCaptain] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [canAddplayer, setCanAddPlayer] = useState(true);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "addPlayer", label: "Add Player" },
    { id: "schedule", label: "Schedule" },
    { id: "points", label: "Points Table" },
  ];

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    if (!team) return;

    if (tab === "schedule") {
      fetchMatches();
    }

    if (tab === "points") {
      fetchPointsTable();
    }
  }, [tab, team]);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/teams/search/${id}`);
      // console.log(res.data);
      setTeam(res.data);
      if (res.data.tournament) {
        setCanAddPlayer(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addPlayer = async () => {
    if (!playerName.trim()) {
      toast("Player name required", "error");
      return;
    }

    try {
      const res = await axios.put(
        `${API_BASE_URL}/teams/${id}/add-player`,
        {
          name: playerName,
          role,
          age,
          gender,
          jerseyNumber,
          battingStyle,
          bowlingStyle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast(res.data.message, "success");

      setPlayerName("");
      setAge("");
      setJerseyNumber("");

      fetchTeam();
    } catch (error) {
      toast(error.response?.data?.message || "Error adding player", "error");
    }
  };

  const saveCaptainDetails = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/teams/${id}/captain-details`,
        {
          role,
          age,
          gender,
          jerseyNumber,
          battingStyle,
          bowlingStyle,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast(res.data.message, "success");

      setEditingCaptain(false);
      setTab("overview");

      fetchTeam();
    } catch (error) {
      toast(
        error.response?.data?.message || "Error saving captain details",
        "error",
      );
    }
  };

  const removePlayer = async (playerName) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/teams/${id}/remove-player`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { playerName },
        },
      );

      toast(res.data.message, "success");

      fetchTeam();
    } catch (error) {
      toast(error.response?.data?.message || "Error removing player", "error");
    }
  };

  const deleteTeam = async () => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowDeleteConfirm(false);

      toast(res.data.message, "success");

      navigate("/team-dashboard");
    } catch (error) {
      toast(error.response?.data?.message || "Error deleting team", "error");
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/matches/tournament/${team.tournament._id}`,
      );
      setMatches(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPointsTable = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/points-table/${team.tournament._id}`,
      );
      setPointsTable(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!team) {
    return <LoadingScreen item="Dashboard" />;
  }

  const groupedMatches = groupMatchesByRound(matches);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          {team.name}
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>

      {/* TAB SYSTEM */}

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
            font-medium transition
            ${tab === t.id ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
          >
            {tab === t.id && (
              <motion.div
                layoutId="teamTab"
                className="absolute inset-0 bg-purple-600 rounded-lg z-0"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* SQUAD TAB */}

      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT SIDE INFO */}
            <TeamOverviewInfo teamId={team?._id} />

            {/* RIGHT SIDE SQUAD */}
            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow">
              {/* <h2 className="text-xl mb-4">Squad </h2> */}
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Squad Info ({team.players.length + 1})
              </h2>
              <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Captain: {team.captain.name}</p>

                  <button
                    onClick={() => {
                      setEditingCaptain(true);
                      setTab("addPlayer");
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                  >
                    <EditIcon fontSize="small" />
                    <span className="hidden sm:block">Edit</span>
                  </button>
                </div>
              </div>

              {team.players.length === 0 ? (
                <p>No players added yet</p>
              ) : (
                <ul className="space-y-2">
                  {team.players.map((p, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center
              p-3 bg-gray-100 dark:bg-gray-700 rounded"
                    >
                      <span>
                        {p.name} ({p.role})
                      </span>

                      <button
                        onClick={() => removePlayer(p.name)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <TeamOverViewRules />
        </div>
      )}

      {/* ADD PLAYER TAB */}

      {tab === "addPlayer" && (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Add Player</h2>

          <div className="space-y-3">
            {!editingCaptain && (
              <input
                type="text"
                placeholder="Player Name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="p-2 rounded border dark:bg-gray-700 w-full"
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="p-2 rounded border dark:bg-gray-700"
              />

              <input
                type="number"
                placeholder="Jersey Number"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                className="p-2 rounded border dark:bg-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="p-2 rounded border dark:bg-gray-700"
              >
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="allrounder">Allrounder</option>
                <option value="wicketkeeper">Wicketkeeper</option>
              </select>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="p-2 rounded border dark:bg-gray-700"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={battingStyle}
                onChange={(e) => setBattingStyle(e.target.value)}
                className="p-2 rounded border dark:bg-gray-700"
              >
                <option value="right-hand">Right Hand</option>
                <option value="left-hand">Left Hand</option>
              </select>

              <select
                value={bowlingStyle}
                onChange={(e) => setBowlingStyle(e.target.value)}
                className="p-2 rounded border dark:bg-gray-700"
              >
                <option value="fast">Fast</option>
                <option value="medium">Medium</option>
                <option value="spin">Spin</option>
              </select>
            </div>
          </div>
          {canAddplayer ? (
            <button
              onClick={() => {
                if (editingCaptain) {
                  saveCaptainDetails();
                } else {
                  addPlayer();
                }
              }}
              className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded w-full sm:auto"
            >
              {editingCaptain ? "Save Captain Details" : "Add Player"}
            </button>
          ) : (
            <p className="text-red-500 text-sm mt-4 text-center">
              Tournament has already started. Players cannot be added.
            </p>
          )}

          <div className="mt-5">
            <AddPlayerRules />
          </div>
        </div>
      )}

      {/* SCHEDULE TAB */}

      {tab === "schedule" && (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-xl ">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Tournament Schedule</h2>
            {/* <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Matches are grouped stage-by-stage so your team can quickly see
              group matches, semi finals, and the final separately.
            </p> */}
          </div>

          {matches.length === 0 ? (
            <p className="text-gray-500">No matches generated yet</p>
          ) : (
            <div className="space-y-6">
              {STAGE_ORDER.map((round) => (
                <TournamentScheduleSection
                  key={round}
                  round={round}
                  matches={groupedMatches[round]}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* POINTS TAB */}

      {tab === "points" && (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-xl shadow-lg">
          <h2 className="text-lg mb-3 font-semibold text-gray-800 dark:text-gray-100">
            Points Table
          </h2>

          {pointsTable.length === 0 ? (
            <p className="text-gray-500">No data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[330px] border-collapse text-xs sm:text-sm">
                {/* Header */}
                <thead>
                  <tr className="bg-purple-600 text-white">
                    <th className="px-2 py-2 text-left">Team</th>
                    <th className="px-2 py-2 text-center">P</th>
                    <th className="px-2 py-2 text-center">W</th>
                    <th className="px-2 py-2 text-center">L</th>
                    <th className="px-2 py-2 text-center">Pts</th>
                    <th className="px-2 py-2 text-center">NRR</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {pointsTable.map((team, index) => (
                    <tr
                      key={team._id}
                      className={`
                  border-b
                  hover:bg-purple-50
                  dark:hover:bg-gray-700
                  ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  }
                `}
                    >
                      <td className="px-2 py-2 font-medium">
                        {index + 1}. {team.team?.name}
                      </td>

                      <td className="px-2 py-2 text-center">{team.played}</td>

                      <td className="px-2 py-2 text-center text-green-600 font-semibold">
                        {team.won}
                      </td>

                      <td className="px-2 py-2 text-center text-red-500">
                        {team.lost}
                      </td>

                      <td className="px-2 py-2 text-center font-bold text-purple-600">
                        {team.points}
                      </td>

                      <td
                        className={`px-2 py-2 text-center font-semibold ${
                          team.netrunrate >= 0
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {team.netrunrate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-3">Delete Team?</h2>

            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-400 rounded"
              >
                Cancel
              </button>

              <button
                onClick={deleteTeam}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
