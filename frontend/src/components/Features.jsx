import { motion } from "framer-motion";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import Groups2Icon from "@mui/icons-material/Groups2";
import EventNoteIcon from "@mui/icons-material/EventNote";
import InsightsIcon from "@mui/icons-material/Insights";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Features({ onPrimaryAction }) {
  const features = [
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 30 }} />,
      title: "Tournament Command",
      desc: "Create events with rules, caps, dates, and knockout progression built into the flow.",
    },
    {
      icon: <Groups2Icon sx={{ fontSize: 30 }} />,
      title: "Team Intake",
      desc: "Onboard squads with join codes, captain-led management, and clear organizer visibility.",
    },
    {
      icon: <EventNoteIcon sx={{ fontSize: 30 }} />,
      title: "Structured Scheduling",
      desc: "Generate the group stage, then move into semifinals and final with stage-safe controls.",
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 30 }} />,
      title: "Visibility For Everyone",
      desc: "Let organizers manage and teams track standings and fixtures through clean stage sections.",
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300">
              Platform Core
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.03em] text-white md:text-5xl">
              Tournament control built for organizers who want the event to feel
              sharp, structured, and match-day ready.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
              RunYatra brings together team onboarding, fixture management,
              standings, and knockout progression in one platform that keeps
              both organizers and teams aligned throughout the tournament.
            </p>
          </div>

          <button
            onClick={onPrimaryAction}
            className="landing-glass inline-flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-orange-400/40"
          >
            Open Platform
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="landing-panel rounded-[24px] p-7 transition-all"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-orange-500/20 text-orange-300">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
