import { motion } from "framer-motion";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Groups2Icon from "@mui/icons-material/Groups2";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

const heroStats = [
  {
    icon: <Groups2Icon sx={{ fontSize: 18 }} />,
    label: "Team Onboarding",
    value: "Join codes + squads",
  },
  {
    icon: <EventAvailableIcon sx={{ fontSize: 18 }} />,
    label: "Stage Control",
    value: "Group to final",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
    label: "Live Structure",
    value: "Tables and tracking",
  },
];

function Hero({ onCreateTournament, onExplorePlatform }) {
  return (
    <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/eden.jpg"
          alt="Floodlit cricket stadium"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.35),rgba(2,6,23,0.92))]" />
        <div className="landing-hero-grid absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl"
        >
          <div className="landing-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
            <SportsCricketIcon sx={{ fontSize: 16 }} />
            Premier Cricket Management
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[1.02] tracking-[-0.04em] text-white md:text-6xl xl:text-7xl">
            Build the full
            <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-purple-300 bg-clip-text text-transparent">
              tournament atmosphere
            </span>
            from fixtures to finals.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            RunYatra helps organizers launch polished cricket tournaments with
            team onboarding, schedule control, results, knockout progression,
            and a tracking experience that actually feels match-day ready.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={onCreateTournament}
              className="landing-shimmer inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] transition hover:scale-[1.02] hover:from-orange-400 hover:to-orange-500"
            >
              <RocketLaunchIcon sx={{ fontSize: 18 }} />
              Launch Tournament
            </button>

            <button
              onClick={onExplorePlatform}
              className="landing-glass inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-100 transition hover:scale-[1.02] hover:border-orange-400/40"
            >
              <TravelExploreIcon sx={{ fontSize: 18 }} />
              Explore Platform
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="landing-glass rounded-2xl px-4 py-4"
              >
                <div className="flex items-center gap-2 text-orange-300">
                  {stat.icon}
                  <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {stat.label}
                  </span>
                </div>
                <p className="mt-3 font-['Space_Grotesk'] text-lg font-bold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative"
        >
          <div className="landing-glass rounded-[28px] p-5">
            <div className="rounded-[24px] border border-white/6 bg-[linear-gradient(135deg,rgba(17,24,39,0.92),rgba(17,24,39,0.65))] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-orange-300">
                    Matchday Control Room
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white">
                    Kinetic Stadium Dashboard
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
                  Live Ready
                </span>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="landing-panel rounded-2xl p-5 transition-all">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Current Snapshot
                  </p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="font-['Space_Grotesk'] text-4xl font-bold text-white">
                        12
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Active fixtures this week
                      </p>
                    </div>
                    <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-300">
                      <EventAvailableIcon />
                    </div>
                  </div>
                </div>

                <div className="landing-panel rounded-2xl p-5 transition-all">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Knockout Progression
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-200">
                      G
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-400 to-orange-400" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-orange-200">
                      SF
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-orange-400 to-emerald-400" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
                      F
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-400">
                    Transition cleanly from group stage to semifinals and the
                    final.
                  </p>
                </div>

                <div className="landing-panel rounded-2xl p-5 transition-all md:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Tournament Ops
                      </p>
                      <p className="mt-3 text-xl font-semibold text-white">
                        One place for organizers, another for teams.
                      </p>
                    </div>
                    <div className="hidden rounded-2xl bg-purple-500/15 p-4 text-purple-200 sm:block">
                      <Groups2Icon sx={{ fontSize: 30 }} />
                    </div>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      "Team setup",
                      "Schedule sections",
                      "Points & results",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -left-3 top-10 hidden rounded-2xl bg-purple-500/15 px-4 py-3 text-sm font-semibold text-purple-100 shadow-[0_0_30px_rgba(124,58,237,0.2)] backdrop-blur-md md:block">
            Group to Final visibility
          </div>
          <div className="absolute -bottom-5 right-6 hidden rounded-2xl bg-orange-500/15 px-4 py-3 text-sm font-semibold text-orange-100 shadow-[0_0_30px_rgba(249,115,22,0.18)] backdrop-blur-md md:block">
            Built for organizers and teams
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
