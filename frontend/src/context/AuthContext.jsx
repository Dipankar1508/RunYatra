import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const LAST_ACTIVE_AT_KEY = "lastActiveAt";
const INACTIVITY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000;

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const markUserActive = () => {
    localStorage.setItem(LAST_ACTIVE_AT_KEY, Date.now().toString());
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(LAST_ACTIVE_AT_KEY);
    setUser(null);
  };

  const isSessionExpired = () => {
    const lastActiveAt = localStorage.getItem(LAST_ACTIVE_AT_KEY);

    if (!lastActiveAt) {
      return true;
    }

    return Date.now() - Number(lastActiveAt) > INACTIVITY_LIMIT_MS;
  };

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    markUserActive();

    setUser(userData);
  };

  const logout = () => {
    clearSession();
    navigate("/");
  };

  // restore user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      clearSession();
      return;
    }

    if (isSessionExpired()) {
      clearSession();
      return;
    }

    setUser(JSON.parse(storedUser));
    markUserActive();
  }, []);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const handleActivity = () => {
      markUserActive();
    };

    const checkInactivity = () => {
      if (isSessionExpired()) {
        logout();
      }
    };

    const events = ["click", "keydown", "scroll", "touchstart", "mousemove"];

    events.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    const intervalId = window.setInterval(checkInactivity, 60 * 1000);

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      window.clearInterval(intervalId);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
