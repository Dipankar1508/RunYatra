import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import LoadingScreen from "../../components/LoadingScreen";

export default function TeamDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetchTeams();
  }, [user]);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      // console.log(user);

      const res = await axios.get(`${API_BASE_URL}/teams/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(res.data);

      setTeams(res.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen item="Team" />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>

      <button
        onClick={() => navigate("/create-team")}
        className="px-5 py-3 bg-orange-400 hover:bg-orange-600 text-white rounded-lg mb-6"
      >
        Create Team
      </button>

      <h2 className="text-xl mb-4">My Teams</h2>

      {teams.length === 0 ? (
        <p className="text-gray-500">You haven't created any teams yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team._id}
              className="p-4 rounded-lg shadow bg-white dark:bg-gray-800"
            >
              <h3 className="text-lg font-semibold">{team.name}</h3>

              <p className="text-sm text-gray-500">
                Players: {team.players.length + 1}
              </p>

              {team.tournament ? (
                <p className="text-green-500 mt-2">
                  Tournament: {team.tournament?.name || "Not Joined"}
                </p>
              ) : (
                <button
                  onClick={() => navigate(`/join-tournament/${team._id}`)}
                  className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
                >
                  Join Tournament
                </button>
              )}

              <button
                onClick={() => navigate(`/team/${team._id}`)}
                className="mt-3 ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
