import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/Config";
import LoadingScreen from "../../components/LoadingScreen";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import GroupsIcon from "@mui/icons-material/Groups";

export default function TeamOverviewInfo({ teamId }) {
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    if (!teamId) return;
    fetchTournament();
  }, [teamId]);

  const fetchTournament = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/teams/${teamId}/tournament-info`,
      );
      setTournament(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!tournament) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <LoadingScreen item="Tournament" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <SportsCricketIcon className="text-purple-600" />
        Tournament Info
      </h2>

      {/* Tournament Name */}
      <div className="mb-5 p-4 rounded-lg bg-purple-100 dark:bg-purple-900">
        <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
          {tournament.name}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {/* Location */}
        <div className="flex items-center gap-2 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
          <LocationOnIcon className="text-red-500" />
          <span>{tournament.location}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
          <CalendarMonthIcon className="text-blue-500" />
          <span>
            {new Date(tournament.startDate).toLocaleDateString("en-GB")} —{" "}
            {new Date(tournament.endDate).toLocaleDateString("en-GB")}
          </span>
        </div>
      </div>

      {/* Rules Section */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <GroupsIcon className="text-green-600" />
          Rules
        </h3>

        <div className="flex justify-between items-center text-center gap-2">
          <div className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-sm font-medium">
            Max {tournament.rules?.oversPerMatch} Overs
          </div>

          <div className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-sm font-medium">
            Max {tournament.rules?.playersPerTeam} Players
          </div>

          <div className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-sm font-medium">
            Max {tournament.rules?.maxTeams} Teams
          </div>
        </div>
      </div>
    </div>
  );
}
