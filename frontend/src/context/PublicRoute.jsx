import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PublicRoute({ children }) {
  const { user } = useAuth();

  if (user) {
    if (user.role === "organizer") {
      return <Navigate to="/organizer-dashboard" replace />;
    }
    return <Navigate to="/team-dashboard" replace />;
  }

  return children;
}
