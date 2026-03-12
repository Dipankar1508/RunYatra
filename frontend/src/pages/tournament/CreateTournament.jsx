import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";

export default function CreateTournament() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    rules: {
      oversPerMatch: 20,
      playersPerTeam: 11,
      maxTeams: 4,
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRulesChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        [name]: value === "" ? "" : Number(value),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/tournaments/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast(res.data.message, "success");

      navigate("/organizer-dashboard");
    } catch (error) {
      toast(
        error.response?.data?.message || "Error creating tournament",
        "error"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center p-6
    bg-gray-100 dark:bg-gray-900 dark:text-white "
    >
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-xl
        bg-white dark:bg-gray-800
        shadow-xl rounded-xl
        p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Create Tournament</h1>

        {/* Tournament Name */}

        <div>
          <label className="block mb-1 font-medium">Tournament Name</label>

          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded border
            dark:bg-gray-700"
          />
        </div>

        {/* Location */}

        <div>
          <label className="block mb-1 font-medium">Location</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 rounded border
            dark:bg-gray-700"
          />
        </div>

        {/* Dates */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>

            <input
              type="date"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 rounded border
              dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">End Date</label>

            <input
              type="date"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 rounded border
              dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Rules */}

        <div className="border-t pt-4">
          <h2 className="font-semibold mb-3 text-lg">Tournament Rules</h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm">Overs</label>
              <input
                type="number"
                name="oversPerMatch"
                min={5}
                value={formData.rules.oversPerMatch}
                onChange={handleRulesChange}
                className="w-full p-2 rounded border
                dark:bg-gray-700"
                placeholder="Min 5"
              />
            </div>

            <div>
              <label className="text-sm">Players</label>
              <input
                type="number"
                name="playersPerTeam"
                min={6}
                max={15}
                value={formData.rules.playersPerTeam}
                onChange={handleRulesChange}
                className="w-full p-2 rounded border
                dark:bg-gray-700"
                placeholder="Min 6"
              />
            </div>

            <div>
              <label className="text-sm">Min Teams</label>
              <input
                type="number"
                name="maxTeams"
                min={4}
                value={formData.rules.maxTeams}
                onChange={handleRulesChange}
                className="w-full p-2 rounded border
                dark:bg-gray-700"
                placeholder="only even teams"
              />
            </div>
          </div>
        </div>

        {/* Submit */}

        <button
          type="submit"
          className="w-full py-2 rounded-lg
          bg-purple-600 text-white
          hover:bg-purple-700 transition"
        >
          Create Tournament
        </button>
      </motion.form>
    </div>
  );
}
