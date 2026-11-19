import {
  FileUser,
  Mail,
  Menu,
  Moon,
  Settings,
  SquareKanban,
  Sun,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";
import MasarLogo from "./MasarLogo";

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(getInitialTheme);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(getInitialTheme());
    };
    window.addEventListener("masarpro-theme-change", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("masarpro-theme-change", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("masarpro-theme", next ? "dark" : "light");
      } catch {
        // Storage is optional.
      }
      window.dispatchEvent(new Event("masarpro-theme-change"));
      return next;
    });
  }, []);

  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? isDark
          ? "bg-[#172544] text-[#60a5fa]"
          : "bg-[#e8edf7] text-[#1d55e5]"
        : isDark
          ? "text-slate-400 hover:bg-slate-800/70 hover:text-[#60a5fa]"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-[#1d55e5]"
    }`;

  const { profile, avatarSrc } = useAuth();

  const profileGreeting = (
    <Link
      to="/settings"
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-3 rounded-xl px-3 py-1.5 transition ${
        isDark ? "hover:bg-[#0f1628]" : "hover:bg-slate-100/80"
      }`}
    >
      <div className="text-end leading-tight">
        <p
          className={`text-sm font-bold ${
            isDark ? "text-slate-100" : "text-[#0f172a]"
          }`}
        >
          {t("welcomeMessage")} {profile?.name}
        </p>
        <p
          className={`text-xs ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t("readyForNewOpportunities")}
        </p>
      </div>

      <img
        src={avatarSrc}
        alt={profile?.name}
        className={`h-10 w-10 rounded-full object-cover ring-2 ${
          isDark ? "ring-blue-400/25" : "ring-blue-500/20"
        }`}
      />
    </Link>
  );

  return (
    <nav
      className={`relative z-50 w-full border-b backdrop-blur-sm transition-colors duration-300 ${
        isDark
          ? "border-slate-800/80 bg-[#080d1a]/95 text-slate-200"
          : "border-slate-200/80 bg-white/95 text-[#0f172a]"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-5 py-3.5 md:px-10 lg:px-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <MasarLogo isDark={isDark} isRtl={isRtl} />
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-2 xl:flex">
          <NavLink to="/resume-builder" className={getLinkClass}>
            <FileUser size={18} />
            <span>{t("resumeBuilderTitle")}</span>
          </NavLink>
          <NavLink to="/cover-letter" className={getLinkClass}>
            <Mail size={18} />
            <span>{isRtl ? "خطاب التقديم" : "Cover letter"}</span>
          </NavLink>
          <NavLink to="/job-tracker" className={getLinkClass}>
            <SquareKanban size={18} />
            <span>{t("jobTracker")}</span>
          </NavLink>
          <NavLink to="/settings" className={getLinkClass}>
            <Settings size={18} />
            <span>{t("settingsTitle")}</span>
          </NavLink>
        </div>

        {/* Desktop right controls */}
        <div className="hidden items-center gap-3 xl:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light version" : "Dark version"}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition ${
              isDark
                ? "border-slate-800 bg-[#0f1628] text-amber-400 hover:border-slate-700 hover:bg-[#162038]"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {profileGreeting}
        </div>

        {/* Mobile buttons */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition ${
              isDark
                ? "border-slate-800 bg-[#0f1628] text-amber-400"
                : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={isRtl ? "فتح القائمة" : "Open menu"}
            aria-expanded={mobileOpen}
            className={`rounded-lg p-2 transition ${
              isDark
                ? "text-slate-100 hover:text-[#60a5fa]"
                : "text-[#0f172a] hover:text-[#1d55e5]"
            }`}
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 backdrop-blur-md xl:hidden ${
            isDark
              ? "bg-[#080d1a]/95 text-slate-100"
              : "bg-white/95 text-[#0f172a]"
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label={isRtl ? "إغلاق القائمة" : "Close menu"}
            className="absolute left-6 top-6 text-3xl"
          >
            <X className="hover:text-[#1d55e5]" />
          </button>

          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center"
          >
            <MasarLogo isDark={isDark} isRtl={isRtl} />
          </Link>

          <NavLink
            to="/resume-builder"
            onClick={() => setMobileOpen(false)}
            className={getLinkClass}
          >
            <FileUser size={18} />
            <span>{t("resumeBuilderTitle")}</span>
          </NavLink>

          <NavLink
            to="/cover-letter"
            onClick={() => setMobileOpen(false)}
            className={getLinkClass}
          >
            <Mail size={18} />
            <span>{isRtl ? "خطاب التقديم" : "Cover letter"}</span>
          </NavLink>

          <NavLink
            to="/job-tracker"
            onClick={() => setMobileOpen(false)}
            className={getLinkClass}
          >
            <SquareKanban size={18} />
            <span>{t("jobTracker")}</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={getLinkClass}
          >
            <Settings size={18} />
            <span>{t("settingsTitle")}</span>
          </NavLink>

          <div className="pt-2">{profileGreeting}</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
