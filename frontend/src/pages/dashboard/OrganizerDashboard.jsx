import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import axios from "axios";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "organizer") {
      navigate("/");
      return;
    }

    fetchTournaments();
  }, [user, navigate]);

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userID = storedUser.id;

      // console.log("User ID:", userID);
      const res = await axios.get(
        `${API_BASE_URL}/tournaments/organizer/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("res.data:", res.data);
      const myTournaments = res.data;

      setTournaments(myTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManager = (id) => {
    navigate(`/tournaments/${id}/manage`);
  };

  const handleCreateTournament = () => {
    navigate("/tournaments/create");
  };

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Organizer Dashboard</h1>

      <button
        onClick={handleCreateTournament}
        className="px-5 py-3 bg-orange-400 hover:bg-orange-600 text-white rounded-lg mb-6"
      >
        Create Tournament
      </button>

      <h2 className="text-xl mb-4">My Tournaments</h2>

      {tournaments.length === 0 ? (
        <p className="text-gray-500">No tournaments created yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {tournaments.map((t) => {
            const usedCodes = t.joinCodes.filter((c) => c.used).length;
            const totalCodes = t.joinCodes.length;

            return (
              <div
                key={t._id}
                className="p-5 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
              >
                {/* Tournament Name */}
                <h3 className="text-xl font-bold mb-2">{t.name}</h3>

                {/* Location */}
                <p className="text-sm text-gray-500 mb-1">📍 {t.location}</p>

                {/* Dates */}
                <p className="text-sm text-gray-500 mb-3">
                  📅 {new Date(t.startDate).toLocaleDateString("en-GB")} —{" "}
                  {new Date(t.endDate).toLocaleDateString("en-GB")}
                </p>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-xs rounded-full mb-3 inline-block
        ${
          t.status === "upcoming"
            ? "bg-blue-100 text-blue-600"
            : t.status === "ongoing"
            ? "bg-green-100 text-green-600"
            : "bg-gray-200 text-gray-600"
        }`}
                >
                  {t.status}
                </span>

                {/* Tournament Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <p>
                    👥 Teams:{" "}
                    <span className="font-semibold">
                      {t.teams.length}/{t.rules.maxTeams}
                    </span>
                  </p>

                  <p>
                    🏏 Overs:{" "}
                    <span className="font-semibold">
                      {t.rules.oversPerMatch}
                    </span>
                  </p>

                  <p>
                    👤 Players/Team:{" "}
                    <span className="font-semibold">
                      {t.rules.playersPerTeam}
                    </span>
                  </p>

                  <p>
                    🔑 Join Codes:{" "}
                    <span className="font-semibold">
                      {usedCodes}/{totalCodes}
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleManager(t._id)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
