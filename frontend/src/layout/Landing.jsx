import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Landing() {
  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 dark:from-gray-900 dark:to-black">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
}

export default Landing;
