import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";

function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const requireLoginOrRedirect = (loggedInTarget) => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate(loggedInTarget);
  };

  const handleCreateTournament = () => {
    const target = user?.role === "organizer" ? "/tournaments/create" : "/team-dashboard";
    requireLoginOrRedirect(target);
  };

  const handleExplorePlatform = () => {
    const target = user?.role === "organizer" ? "/organizer-dashboard" : "/team-dashboard";
    requireLoginOrRedirect(target);
  };

  const handleJoinTournament = () => {
    requireLoginOrRedirect("/team-dashboard");
  };

  return (
    <div className="landing-shell overflow-hidden">
      <Hero
        onCreateTournament={handleCreateTournament}
        onExplorePlatform={handleExplorePlatform}
      />
      <Features onPrimaryAction={handleCreateTournament} />
      <HowItWorks
        onOrganizerAction={handleCreateTournament}
        onTeamAction={handleJoinTournament}
      />
      <CTA
        onCreateTournament={handleCreateTournament}
        onJoinTournament={handleJoinTournament}
      />
    </div>
  );
}

export default Landing;
