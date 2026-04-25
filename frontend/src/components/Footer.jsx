import { Link } from "react-router-dom";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <footer className="border-t border-purple-500/10 bg-[#03060d] text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
              {/* <SportsCricketIcon /> */}
              <img
                src="/images/RunyatraPoster.jpg"
                alt="foot"
                className="rounded-xl"
              />
            </span>
            <div>
              <p className="text-lg font-black tracking-[-0.03em] text-white">
                RunYatra
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Cricket Tournament Platform
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-400">
            A focused platform for organizers who want structure and for teams
            who want a clean way to follow fixtures, standings, and stage
            progress.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Platform
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li>
              <Link to="/" className="transition hover:text-orange-300">
                Landing Page
              </Link>
            </li>
            <li>
              <Link to="/login" className="transition hover:text-orange-300">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="transition hover:text-orange-300">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Product
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li>Team setup</li>
            <li>Schedule control</li>
            <li>Points tracking</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
            Connect
          </h3>
          <div className="mt-5 flex gap-3">
            {[TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
              <button
                key={index}
                className="landing-glass flex h-11 w-11 items-center justify-center rounded-2xl text-slate-300 hover:text-orange-300"
              >
                <Icon fontSize="small" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/6 px-6 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} RunYatra • Built for cricket organizers and
        teams
      </div>
    </footer>
  );
}

export default Footer;
