import { motion } from "framer-motion";

function Hero() {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/eden.jpg')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
      <div className="relative max-w-6xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold"
        >
          Manage Cricket Tournaments with
          <span className="text-orange-400"> RunYatra</span>
        </motion.h1>

        <p className="mt-6 text-lg max-w-2xl mx-auto">
          Create teams, schedule matches, update results and track points tables
          — everything for your cricket tournament in one platform.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-600">
            Create Tournament
          </button>

          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black">
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
