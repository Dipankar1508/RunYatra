import {
  EmojiEvents,
  Groups,
  SportsCricket,
  Leaderboard,
  AddCircle,
  Login,
  ArrowOutward,
} from "@mui/icons-material";
import { motion } from "framer-motion";

function HowItWorks({ onOrganizerAction, onTeamAction }) {
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
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-300">
            Workflow
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-white md:text-5xl">
            A split experience for organizers and teams, without confusion.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            The product works best when organizers get command over the
            tournament and teams get a clean, read-only way to follow what’s
            happening.
          </p>
        </div>

        <div className="mt-16 grid gap-8 xl:grid-cols-2">
          <div className="landing-glass rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">
                  For Organizers
                </p>
                <h3 className="mt-3 text-3xl font-bold text-white">
                  Control the tournament like a match director.
                </h3>
              </div>
              <button
                onClick={onOrganizerAction}
                className="hidden rounded-xl bg-orange-500 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-orange-400 md:inline-flex md:items-center md:gap-2"
              >
                Start Here
                <ArrowOutward sx={{ fontSize: 16 }} />
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {organizerSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="landing-panel rounded-2xl p-5"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="landing-glass rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-300">
                  For Teams
                </p>
                <h3 className="mt-3 text-3xl font-bold text-white">
                  Join, play, and track progress without extra friction.
                </h3>
              </div>
              <button
                onClick={onTeamAction}
                className="hidden rounded-xl bg-purple-600 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-purple-500 md:inline-flex md:items-center md:gap-2"
              >
                Join Flow
                <ArrowOutward sx={{ fontSize: 16 }} />
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {teamSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="landing-panel rounded-2xl p-5"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-200">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
