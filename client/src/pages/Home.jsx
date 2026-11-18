import { useCallback, useState } from "react";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import MasarFeatures from "../components/MasarFeatures";

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

const Home = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("masarpro-theme", next ? "dark" : "light");
      } catch {
        // Storage is optional.
      }
      return next;
    });
  }, []);

  return (
    <div
      className={`relative flex flex-col overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      <Hero isDark={isDark} onToggleTheme={toggleTheme} />
      <div
        className={`pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-[120px] ${
          isDark ? "bg-[#1d55e5]/15" : "bg-[#1d55e5]/10"
        }`}
      />

      <Feature isDark={isDark} />
      <MasarFeatures isDark={isDark} />

      <div
        className={`pointer-events-none absolute -right-40 top-[35%] h-[500px] w-[500px] rounded-full blur-[130px] ${
          isDark ? "bg-[#1d55e5]/12" : "bg-[#1d55e5]/8"
        }`}
      />
      <CTA isDark={isDark} />
      <Footer isDark={isDark} />
    </div>
  );
};

export default Home;
