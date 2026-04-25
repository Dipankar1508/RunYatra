import { motion } from "framer-motion";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function CTA({ onCreateTournament, onJoinTournament }) {
  return (
    <section className="px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="cta-glass overflow-hidden rounded-[32px] border border-purple-500/20 px-6 py-12 md:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300 shadow-[0_0_30px_rgba(249,115,22,0.12)]">
              {/* <SportsCricketIcon sx={{ fontSize: 34 }} /> */}
              <img
                src="/images/RunyatraPoster.jpg"
                alt="foot"
                className="rounded-xl"
              />
            </div>

            <h2 className="mt-8 text-4xl font-black leading-tight tracking-[-0.03em] md:text-5xl">
              Ready to turn your tournament into a proper match-day product?
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Launch the organizer flow, onboard teams, manage schedules, and
              keep every stage visible from the first group fixture to the
              final.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCreateTournament}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_32px_rgba(249,115,22,0.24)]"
              >
                Create Tournament
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onJoinTournament}
                className="landing-glass inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white"
              >
                Join As Team
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
