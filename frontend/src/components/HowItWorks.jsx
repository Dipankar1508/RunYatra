import {
  EmojiEvents,
  Groups,
  SportsCricket,
  Leaderboard,
  AddCircle,
  Login,
} from "@mui/icons-material";

function HowItWorks() {
  const organizerSteps = [
    {
      icon: <AddCircle fontSize="large" />,
      title: "Create Tournament",
      desc: "Organizers create a cricket tournament with rules, format and match settings.",
    },
    {
      icon: <Groups fontSize="large" />,
      title: "Manage Teams",
      desc: "Approve teams joining the tournament and organize the player lists.",
    },
    {
      icon: <SportsCricket fontSize="large" />,
      title: "Schedule Matches",
      desc: "Automatically generate match fixtures and manage match results.",
    },
    {
      icon: <Leaderboard fontSize="large" />,
      title: "Track Tournament",
      desc: "View updated standings, points table and tournament progress.",
    },
  ];

  const teamSteps = [
    {
      icon: <Login fontSize="large" />,
      title: "Create Team",
      desc: "Players create their team and add squad members.",
    },
    {
      icon: <EmojiEvents fontSize="large" />,
      title: "Join Tournament",
      desc: "Enter the tournament using the organizer's join code.",
    },
    {
      icon: <SportsCricket fontSize="large" />,
      title: "Play Matches",
      desc: "Participate in scheduled matches and compete against other teams.",
    },
    {
      icon: <Leaderboard fontSize="large" />,
      title: "Track Ranking",
      desc: "Follow your team's progress on the tournament leaderboard.",
    },
  ];

  return (
    <section className="py-24 bg-green-300 dark:bg-gray-900">
      {" "}
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          How RunYatra Works
        </h2>

        <p className="text-gray-500 mt-4">
          A simple workflow for organizers and teams to run cricket tournaments
          smoothly.
        </p>
      </div>
      {/* Organizer Section */}
      <div className="max-w-6xl mx-auto mb-16 px-6">
        <h3 className="text-2xl font-semibold mb-8 text-green-700 text-center">
          For Tournament Organizers
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {organizerSteps.map((step, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <div className="text-green-700 mb-4">{step.icon}</div>

              <h4 className="dark:text-white font-semibold text-lg">
                {step.title}
              </h4>

              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Player / Team Section */}
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-2xl font-semibold mb-8 text-orange-600 text-center">
          For Teams & Players
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamSteps.map((step, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <div className="text-orange-500 mb-4">{step.icon}</div>

              <h4 className="dark:text-white font-semibold text-lg">
                {step.title}
              </h4>

              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
