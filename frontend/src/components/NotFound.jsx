import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center 
    bg-gradient-to-br from-black via-emerald-800 to-black text-white px-6"
    >
      {/* Animated 404 */}
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-7xl md:text-9xl font-extrabold tracking-widest"
      >
        404
      </motion.h1>

      {/* Cricket Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg md:text-xl text-center max-w-xl"
      >
        <p className="text-lg">
          Looks like the ball went out of the stadium! 🏏
        </p>

        <p className="mt-2 text-lg">
          The page you are looking for does not exist.
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex gap-4"
      >
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition"
        >
          Go to Home
        </Link>
      </motion.div>

      {/* Extra decorative text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.7 }}
        className="mt-12 text-sm text-gray-200"
      >
        RunYatra • Cricket Tournament Platform
      </motion.div>
    </div>
  );
}

export default NotFound;
