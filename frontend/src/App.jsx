import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Landing from "./layout/Landing";
import NotFound from "./components/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";

import ProtectedRoute from "./context/ProtectedRoute";
import PublicRoute from "./context/PublicRoute";
import RoleRoute from "./context/RoleRoute";

import TeamDashboard from "./pages/dashboard/TeamDashboard";
import CreateTeam from "./pages/team/CreateTeam";
import TeamManager from "./pages/team/TeamManager";
import OrganizerDashboard from "./pages/dashboard/OrganizerDashboard";
import TournamentManage from "./pages/tournament/TournamentManage";
import CreateTournament from "./pages/tournament/CreateTournament";
import JoinTournament from "./pages/tournament/JoinTournament";
import UpdateMatchResult from "./pages/matches/UpdateMatchResult";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Tournamnet Routes */}
        <Route
          path="/organizer-dashboard"
          element={
            <RoleRoute allowedRoles={["organizer"]}>
              <OrganizerDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/tournaments/:id/manage"
          element={
            <RoleRoute allowedRoles={["organizer"]}>
              <TournamentManage />
            </RoleRoute>
          }
        />

        <Route
          path="/tournaments/create"
          element={
            <RoleRoute allowedRoles={["organizer"]}>
              <CreateTournament />
            </RoleRoute>
          }
        />

        {/* Team Routes */}
        <Route
          path="/team-dashboard"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <TeamDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/create-team"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <CreateTeam />
            </RoleRoute>
          }
        />

        <Route
          path="/team/:id"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <TeamManager />
            </RoleRoute>
          }
        />

        <Route
          path="/join-tournament/:teamId"
          element={
            <RoleRoute allowedRoles={["user"]}>
              <JoinTournament />
            </RoleRoute>
          }
        />

        {/* Match Routes */}

        <Route
          path="/matches/:id/update"
          element={
            <RoleRoute allowedRoles={["organizer"]}>
              <UpdateMatchResult />
            </RoleRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
