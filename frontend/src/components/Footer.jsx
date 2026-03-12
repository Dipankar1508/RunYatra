import { Link } from "react-router-dom";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <footer className="bg-green-950 dark:bg-black text-gray-300 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* Brand */}

        <div>
          <div className="flex items-center gap-2 text-orange-400 text-xl font-bold">
            <SportsCricketIcon />
            RunYatra
          </div>

          <p className="mt-4 text-sm text-gray-400">
            RunYatra helps organizers manage cricket tournaments while teams
            compete and track rankings easily.
          </p>
        </div>

        {/* Product */}

        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-orange-400">
                Features
              </Link>
            </li>

            <li>
              <Link to="/" className="hover:text-orange-400">
                How it Works
              </Link>
            </li>

            <li>
              <Link to="/register" className="hover:text-orange-400">
                Create Tournament
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}

        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-orange-400">
                Help Center
              </Link>
            </li>

            <li>
              <Link to="/" className="hover:text-orange-400">
                Community
              </Link>
            </li>

            <li>
              <Link to="/" className="hover:text-orange-400">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}

        <div>
          <h3 className="text-white font-semibold mb-4">Connect</h3>

          <div className="flex gap-4">
            <TwitterIcon className="cursor-pointer hover:text-orange-400" />
            <InstagramIcon className="cursor-pointer hover:text-orange-400" />
            <LinkedInIcon className="cursor-pointer hover:text-orange-400" />
          </div>
        </div>
      </div>
      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} RunYatra • Cricket Tournament Platform
      </div>
    </footer>
  );
}

export default Footer;
