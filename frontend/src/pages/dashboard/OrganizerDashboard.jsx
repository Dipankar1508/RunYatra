import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import axios from "axios";
import LoadingScreen from "../../components/LoadingScreen";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SettingsIcon from "@mui/icons-material/Settings";

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
        },
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
    return <LoadingScreen item="Dashboard" />;
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
                className="group relative overflow-hidden rounded-2xl transition-all duration-300
                bg-white dark:bg-slate-800
                border border-gray-200 dark:border-white/10
                shadow-md hover:shadow-xl"
              >
                {/* TOP ACCENT */}
                <div className="h-1 bg-gradient-to-r from-orange-400 to-purple-700" />

                <div className="p-5">
                  {/* HEADER */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-slate-200 font-semibold">
                        <LocationOnIcon sx={{ fontSize: 20 }} />
                        {t.location}
                      </div>
                    </div>

                    {/* STATUS BADGE */}
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold
        ${
          t.status === "upcoming"
            ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300"
            : t.status === "ongoing"
              ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-300"
              : "bg-gray-200 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300"
        }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  {/* DATE */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-200 font-semibold">
                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                    {new Date(t.startDate).toLocaleDateString("en-GB")} —
                    {new Date(t.endDate).toLocaleDateString("en-GB")}
                  </div>

                  {/* STATS BLOCK */}
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-slate-900">
                      <p className="text-gray-500 dark:text-slate-400">Teams</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {t.teams.length}/{t.rules.maxTeams}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-slate-900">
                      <p className="text-gray-500 dark:text-slate-400">Overs</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {t.rules.oversPerMatch}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-slate-900">
                      <p className="text-gray-500 dark:text-slate-400">
                        Players
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {t.rules.playersPerTeam}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-slate-900">
                      <p className="text-gray-500 dark:text-slate-400">
                        Join Codes
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {usedCodes}/{totalCodes}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="mt-6">
                    <button
                      onClick={() => handleManager(t._id)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 
                      dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-400 dark:hover:to-purple-500
                      text-white shadow-md transition"
                    >
                      <SettingsIcon sx={{ fontSize: 18 }} /> Manage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
