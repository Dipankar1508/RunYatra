import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export default function TeamManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [team, setTeam] = useState(null);

  const [tab, setTab] = useState("squad");

  const [playerName, setPlayerName] = useState("");
  const [role, setRole] = useState("batsman");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [battingStyle, setBattingStyle] = useState("right-hand");
  const [bowlingStyle, setBowlingStyle] = useState("medium");

  const [editingCaptain, setEditingCaptain] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tabs = [
    { id: "squad", label: "Squad" },
    { id: "addPlayer", label: "Add Player" },
    { id: "schedule", label: "Schedule" },
    { id: "points", label: "Points Table" },
  ];

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/teams/search/${id}`);
      setTeam(res.data);
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
      setTab("squad");

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

  if (!team) return <div className="p-6">Loading team...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          {team.name}
        </h1>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          <DeleteIcon />
        </button>
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

      {tab === "squad" && (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Squad ({team.players.length + 1})</h2>

          <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className="font-semibold">
                  Captain: {team.captain.name} &nbsp;
                  {team.captainDetails && (
                    <span className="text-sm font-normal">
                      ({team.captainDetails.role})
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCaptain(true);
                  setTab("addPlayer");

                  if (team.captainDetails) {
                    setRole(team.captainDetails.role || "batsman");
                    setAge(team.captainDetails.age || "");
                    setGender(team.captainDetails.gender || "male");
                    setJerseyNumber(team.captainDetails.jerseyNumber || "");
                    setBattingStyle(
                      team.captainDetails.battingStyle || "right-hand",
                    );
                    setBowlingStyle(
                      team.captainDetails.bowlingStyle || "medium",
                    );
                  }
                }}
                className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
              >
                <span className="sm:hidden block">
                  {team.captainDetails ? (
                    <EditIcon fontSize="small" />
                  ) : (
                    <AddIcon fontSize="small" />
                  )}
                </span>
                {/* Desktop Text */}
                <span className="hidden sm:block ">
                  {team.captainDetails ? "Edit Details" : "Add Details"}
                </span>{" "}
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
                  {/* Mobile dustbin */}
                  <button
                    onClick={() => removePlayer(p.name)}
                    className="text-red-500 block sm:hidden"
                  >
                    <DeleteIcon />
                  </button>
                  {/* Desktop button */}
                  <button
                    onClick={() => removePlayer(p.name)}
                    className="px-3 py-1 bg-red-500 text-white rounded hidden sm:block"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
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
        </div>
      )}

      {/* SCHEDULE TAB */}

      {tab === "schedule" && (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Team Schedule</h2>

          <p>No matches scheduled yet.</p>
        </div>
      )}

      {/* POINTS TAB */}

      {tab === "points" && (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Points Table</h2>

          <p>Points table will appear here.</p>
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
