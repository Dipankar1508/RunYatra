import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/Config";
import { toast } from "../../utils/Toastify";
function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form);
      // console.log(res);

      const { token, user } = res.data;
      // console.log("User role:", user.role);

      login(user, token);

      setTimeout(() => {
        if (user.role === "organizer") {
          navigate("/organizer-dashboard", { replace: true });
        } else {
          navigate("/team-dashboard", { replace: true });
        }
      }, 1000);
      toast("Login successful", "success");
    } catch (error) {
      toast(error.response?.data?.message || "login failed", "error");
      console.log(error.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">RunYatra</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Welcome back
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-orange-400
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-orange-400
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-orange-500 hover:underline">
            Register
          </Link>
          <br />
          <Link
            to="/forgot-password"
            className="text-sm text-purple-600 hover:underline"
          >
            Forgot password
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
