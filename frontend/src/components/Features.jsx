import { motion } from "framer-motion";
import { FaTrophy, FaUsers, FaCalendarAlt, FaChartLine } from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaTrophy size={32} />,
      title: "Tournament Management",
      desc: "Create and manage cricket tournaments with structured formats and schedules.",
    },
    {
      icon: <FaUsers size={32} />,
      title: "Team & Player Management",
      desc: "Add teams, register players and maintain squad details easily.",
    },
    {
      icon: <FaCalendarAlt size={32} />,
      title: "Match Scheduling",
      desc: "Automatically generate match schedules for leagues and knockout tournaments.",
    },
    {
      icon: <FaChartLine size={32} />,
      title: "Live Points Table",
      desc: "Track team rankings, wins, losses and tournament progress in real time.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          Powerful Tournament Tools
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mt-4">
          Everything you need to run a professional cricket tournament
        </p>
      </div>
      {/* Features Grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-xl transition"
          >
            {/* Icon */}

            <div
              className="w-14 h-14 flex items-center justify-center 
            bg-green-100 text-green-700 rounded-lg mb-6"
            >
              {feature.icon}
            </div>

            {/* Title */}

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {feature.title}
            </h3>

            {/* Description */}

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Features;
