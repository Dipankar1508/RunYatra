import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/images/RunyatraLogo.png";
import { motion } from "framer-motion";

import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "../utils/Toastify";

import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const goToDashboard = () => {
    if (!user) {
      toast("Please login first", "error");
      navigate("/login");
      return;
    }

    if (user.role === "organizer") {
      navigate("/organizer-dashboard");
    } else if (user.role === "captain") {
      navigate("/team-dashboard");
    }
    // } else {
    //   navigate("/dashboard");
    // }

    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav
      className="relative flex justify-between items-center px-6 py-4
      bg-gradient-to-r from-purple-800/90 via-purple-700/90 to-purple-800/90
      dark:from-gray-900 dark:via-gray-800 dark:to-black
      backdrop-blur-md border-b border-purple-400/30
      shadow-lg shadow-purple-900/30
      text-white z-50"
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center px-2 py-1 rounded-lg 
        bg-white/10 border border-white/20"
      >
        <img
          src={logo}
          className="h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          alt="RunYatra Logo"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        <ThemeToggle />
        <Link to="/" className="hover:text-orange-400">
          Home
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:text-orange-400">
              Login
            </Link>

            <Link
              to="/register"
              className="px-6 py-2 rounded-lg bg-orange-500
              hover:bg-orange-400 transition duration-300"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {/* <span className="text-orange-400 font-semibold">{user.name}</span> */}
            <button
              onClick={goToDashboard}
              className="flex items-center justify-center
              w-10 h-10 rounded-full
              bg-orange-500 text-white font-bold
              hover:bg-orange-400 transition
              shadow-md"
            >
              {user.name?.charAt(0).toUpperCase()}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
      {/* {menuOpen && <ThemeToggle />} */}

      {/* Hamburger Button and dark/light button*/}
      <div className="flex items-center gap-3 md:hidden">
        <ThemeToggle />

        <button className="text-3xl" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-full left-0 w-full
          bg-gradient-to-b from-purple-700/95 to-purple-900/95
          dark:from-gray-900 dark:via-gray-800 dark:to-black
          backdrop-blur-md text-white
          flex flex-col items-center gap-6 py-6
          md:hidden shadow-xl shadow-purple-900/40 rounded-b-xl "
        >
          {/* <ThemeToggle /> */}
          <div className="flex gap-16 items-center">
            {/* HOME */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex flex-col items-center hover:text-orange-400 transition"
            >
              <HomeIcon fontSize="medium" />
              <span className="text-sm mt-1">Home</span>
            </Link>

            {!user ? (
              <>
                {/* LOGIN */}
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center hover:text-orange-400 transition"
                >
                  <LoginIcon fontSize="medium" />
                  <span className="text-sm mt-1">Login</span>
                </Link>

                {/* REGISTER */}
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center hover:text-orange-400 transition"
                >
                  <PersonAddIcon fontSize="medium" />
                  <span className="text-sm mt-1">Register</span>
                </Link>
              </>
            ) : (
              <>
                {/* PROFILE */}
                <button
                  onClick={goToDashboard}
                  className="flex flex-col items-center hover:text-orange-400 transition"
                >
                  <div
                    className="flex items-center justify-center
          w-12 h-12 rounded-full
          bg-orange-500 text-white font-bold text-lg
          hover:bg-orange-400 transition"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm mt-1">Profile</span>
                </button>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center hover:text-red-400 transition"
                >
                  <LogoutIcon fontSize="medium" />
                  <span className="text-sm mt-1">Logout</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;
