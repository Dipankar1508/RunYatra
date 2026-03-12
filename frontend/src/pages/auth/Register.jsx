import { useState } from "react";
import axios from "axios";
import { data, Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, form);
      toast(res.data.message, "success");
      // console.log(res.data);
      // alert(res.data.message);
      navigate("/login");
    } catch (err) {
      toast(err.response?.data?.message || "Registration failed", "error");
      console.log(err.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">RunYatra</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-orange-400
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-orange-400
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-orange-400
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Account Type
            </label>

            <select
              name="role"
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-orange-400
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="user">Player</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          {/* Button */}
          <button
            className="w-full py-3 bg-orange-500 hover:bg-orange-600
            text-white font-semibold rounded-lg transition"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
