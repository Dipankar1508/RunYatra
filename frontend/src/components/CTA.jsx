import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";

function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white">
      <div className="max-w-5xl mx-auto text-center px-6">
        {/* Icon */}

        <div className="flex justify-center mb-6 text-orange-400">
          <SportsCricketIcon sx={{ fontSize: 50 }} />
        </div>

        {/* Heading */}

        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
          Ready to start your cricket tournament?
        </h2>

        {/* Description */}

        <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
          RunYatra helps organizers manage tournaments, teams compete easily,
          and everyone track live standings — all in one place.
        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/register"
              className="bg-orange-500 px-8 py-3 rounded-lg 
              font-semibold text-white hover:bg-orange-600 transition"
            >
              Create Tournament
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/login"
              className="border border-white px-8 py-3 rounded-lg 
              hover:bg-white hover:text-green-900 transition"
            >
              Join Tournament
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
