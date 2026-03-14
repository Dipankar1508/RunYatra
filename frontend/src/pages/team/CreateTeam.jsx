import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";

export default function CreateTeam() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast("Team name required", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/teams/create`,
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast(res.data.message, "success");

      navigate("/team-dashboard");
    } catch (error) {
      toast(error.response?.data?.message || "Error creating team", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6
    bg-gray-100 dark:bg-gray-900"
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md
        bg-white dark:bg-gray-800
        p-8 rounded-xl shadow-lg
        space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Create Team</h1>

        <div>
          <label className="block mb-2 font-medium">Team Name</label>

          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className="w-full p-3 rounded-lg border
            dark:bg-gray-700 dark:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg
          bg-blue-600 hover:bg-blue-700
          text-white font-semibold
          transition"
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </motion.form>
    </div>
  );
}
