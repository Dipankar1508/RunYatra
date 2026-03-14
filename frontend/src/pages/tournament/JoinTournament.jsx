import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";

export default function JoinTournament() {
  const { teamId } = useParams();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= SEARCH TOURNAMENT ================= */

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE_URL}/tournaments/find/${search}`);
      console.log(res.data);
      setResults(res.data);
    } catch (error) {
      setResults([]);
      toast(error.response?.data?.message || "Tournament not found", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= JOIN TOURNAMENT ================= */

  const handleJoin = async () => {
    if (!joinCode) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}/tournaments/join`,
        {
          teamId,
          joinCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast(res.data.message, "success");

      setSelectedTournament(null);
      setJoinCode("");
    } catch (error) {
      toast(error.response?.data?.message || "Failed to join");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Join Tournament</h1>

      {/* ================= SEARCH BOX ================= */}

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, location or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded border dark:bg-gray-800 w-full sm:w-auto"
        />

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}

      {/* ================= SEARCH RESULTS ================= */}

      {results.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {results.map((tournament) => (
            <div
              key={tournament._id}
              className="p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-2">{tournament.name}</h2>

              <p className="text-sm text-gray-500 mb-2">
                Code: {tournament.tournamentCode || "N/A"}
              </p>

              <div className="text-sm space-y-1">
                <p>
                  📍 <span className="font-medium">Location:</span>{" "}
                  {tournament.location || "N/A"}
                </p>
                <p>
                  🏏 <span className="font-medium">Overs:</span>{" "}
                  {tournament.rules.oversPerMatch}
                </p>

                <p>
                  👥 <span className="font-medium">Players / Team:</span>{" "}
                  {tournament.rules.playersPerTeam}
                </p>

                <p>
                  🏆 <span className="font-medium">Teams:</span>{" "}
                  {tournament.teams.length} / {tournament.rules.maxTeams}
                </p>

                <p>
                  📅 <span className="font-medium">Start:</span>{" "}
                  {new Date(tournament.startDate).toLocaleDateString()}
                </p>

                <p>
                  📅 <span className="font-medium">End:</span>{" "}
                  {new Date(tournament.endDate).toLocaleDateString()}
                </p>

                <p>
                  📊 <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{tournament.status}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedTournament(tournament)}
                className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Select Tournament
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= JOIN SECTION ================= */}
      {selectedTournament && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md m-4">
            <h2 className="text-xl font-bold mb-4">
              Join {selectedTournament.name}
            </h2>

            <p className="text-sm mb-4 text-gray-500">
              Enter the join code provided by the organizer.
            </p>

            <input
              type="text"
              placeholder="Enter Join Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full p-3 rounded border mb-4 dark:bg-gray-700"
            />

            <div className="flex gap-3">
              <button
                onClick={handleJoin}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
              >
                Join Tournament
              </button>

              <button
                onClick={() => {
                  setSelectedTournament(null);
                  setJoinCode("");
                }}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
