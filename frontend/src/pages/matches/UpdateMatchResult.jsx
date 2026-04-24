import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";

export default function UpdateMatchResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);

  const [teamARuns, setTeamARuns] = useState("");
  const [teamAOvers, setTeamAOvers] = useState("");

  const [teamBRuns, setTeamBRuns] = useState("");
  const [teamBOvers, setTeamBOvers] = useState("");
  const [totalOvers, setTotalOvers] = useState(10);

  const [resultSummary, setResultSummary] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMatch();
  }, []);

  const fetchMatch = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/matches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMatch(res.data);
      setTotalOvers(res.data.overs);
    } catch (error) {
      console.error(error);
    }
  };

  const submitResult = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/matches/${id}/update-result`,
        {
          teamARuns,
          teamAOvers,
          teamBRuns,
          teamBOvers,
          resultSummary,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast("Match result updated", "success");
      navigate(-1);
    } catch (error) {
      toast(error.response?.data?.message || "Error updating match", "error");
    }
  };

  if (!match) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        {/* Match Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold dark:text-white">
            Update Match Result
          </h2>

          <p className="text-gray-500 mt-1">
            {match.teamA.name} vs {match.teamB.name}
          </p>

          <p className="text-xs text-gray-400 mt-1">Max Overs: {totalOvers}</p>

          {(match.round === "semi_final" || match.round === "final") && (
            <p className="mt-2 text-xs font-medium text-rose-500">
              Knockout matches must produce a winner. Draws are not allowed here.
            </p>
          )}
        </div>

        {/* Team A */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 dark:text-gray-200">
            {match.teamA.name}
          </h3>

          <div className="flex gap-3">
            <input
              type="number"
              value={teamARuns}
              onChange={(e) => setTeamARuns(e.target.value)}
              placeholder="Runs"
              className="w-1/2 p-3 rounded border dark:bg-gray-700"
            />

            <input
              type="number"
              value={teamAOvers}
              onChange={(e) => setTeamAOvers(e.target.value)}
              max={totalOvers}
              placeholder="Overs"
              className="w-1/2 p-3 rounded border dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Team B */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 dark:text-gray-200">
            {match.teamB.name}
          </h3>

          <div className="flex gap-3">
            <input
              type="number"
              value={teamBRuns}
              onChange={(e) => setTeamBRuns(e.target.value)}
              placeholder="Runs"
              className="w-1/2 p-3 rounded border dark:bg-gray-700"
            />

            <input
              type="number"
              value={teamBOvers}
              onChange={(e) => setTeamBOvers(e.target.value)}
              max={totalOvers}
              placeholder="Overs"
              className="w-1/2 p-3 rounded border dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Result Summary */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 dark:text-gray-200">
            Result Summary
          </h3>
          <input
            type="text"
            value={resultSummary}
            onChange={(e) => setResultSummary(e.target.value)}
            placeholder={`(e.g.)${match.teamA.name} OR ${match.teamB.name} won by ..`}
            className="w-full p-2 rounded border dark:bg-gray-700 placeholder:text-xs sm:placeholder:text-sm "
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-gray-400 rounded text-white"
          >
            Cancel
          </button>

          <button
            onClick={submitResult}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
          >
            Submit Result
          </button>
        </div>
      </div>
    </div>
  );
}
