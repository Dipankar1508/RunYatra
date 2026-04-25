import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import LoadingScreen from "../../components/LoadingScreen";
import SettingsIcon from "@mui/icons-material/Settings";

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
              className="rounded-2xl overflow-hidden transition-all duration-300
  bg-white dark:bg-slate-800
  border border-gray-200 dark:border-white/10
  shadow-md hover:shadow-xl"
            >
              {/* TOP ACCENT */}
              <div className="h-1 bg-orange-500 dark:bg-purple-600" />

              <div className="p-5">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Team ID: {team._id.slice(-6)}
                    </p>
                  </div>

                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-xl
      bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300"
                  >
                    🏏
                  </div>
                </div>

                {/* INFO BLOCKS */}
                <div className="mt-6 space-y-3">
                  {/* Squad */}
                  <div
                    className="flex justify-between items-center px-4 py-3 rounded-xl
      bg-gray-100 dark:bg-slate-900"
                  >
                    <span className="text-sm text-gray-600 dark:text-slate-400">
                      Squad Size
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {team.players.length + 1} Players
                    </span>
                  </div>

                  {/* Tournament */}
                  <div
                    className="flex justify-between items-center px-4 py-3 rounded-xl
      bg-gray-100 dark:bg-slate-900"
                  >
                    <span className="text-sm text-gray-600 dark:text-slate-400">
                      Tournament
                    </span>

                    {team.tournament ? (
                      <span
                        className="px-3 py-1 text-sm rounded font-semibold
          bg-blue-100 dark:bg-blue-500/20
          text-blue-600 dark:text-blue-300"
                      >
                        {team.tournament.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Not Joined</span>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex gap-3">
                  {/* Manage */}

                  <button
                    onClick={() => navigate(`/team/${team._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r
                    from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 
                      dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-400 dark:hover:to-purple-500
                      text-white shadow-md transition"
                  >
                    <SettingsIcon sx={{ fontSize: 18 }} />
                    Manage
                  </button>

                  {/* Join */}
                  {!team.tournament && (
                    <button
                      onClick={() => navigate(`/join-tournament/${team._id}`)}
                      className="px-4 py-3 rounded-xl font-semibold
          bg-purple-600 hover:bg-purple-700 text-white transition"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
