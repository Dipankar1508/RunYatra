import { motion } from "framer-motion";
export default function LoadingScreen({ item = "Data" }) {
  return (
    <div className="relative min-h-[40vh] flex flex-col items-center justify-center text-center overflow-hidden rounded-xl">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Loading Text */}
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Loading {item}...
        </motion.h2>

        {/* Animated Dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2, 3].map((dot) => (
            <motion.div
              key={dot}
              className="w-3 h-3 bg-purple-600 rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
