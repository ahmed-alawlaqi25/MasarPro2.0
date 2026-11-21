import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "../components/AuthContext";
import MasarLogo from "../components/MasarLogo";

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

const Confirmemail = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();
  const [isDark, setIsDark] = useState(getInitialTheme);
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

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 transition-colors duration-300 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      {/* Ambient blue glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full blur-[130px] ${
          isDark ? "bg-blue-600/15" : "bg-blue-500/12"
        }`}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`relative z-10 w-full max-w-md rounded-3xl border p-8 text-center transition-colors duration-300 sm:p-10 ${
          isDark
            ? "border-slate-800/90 bg-[#0f1628] shadow-[0_24px_80px_-18px_rgba(29,85,229,0.28)]"
            : "border-slate-200/90 bg-white shadow-[0_24px_70px_-18px_rgba(37,99,235,0.14)]"
        }`}
      >
        <Link to="/" className="mb-6 inline-flex items-center justify-center">
          <MasarLogo isDark={isDark} isRtl={isRtl} />
        </Link>

        <div
          className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${
            isDark
              ? "border-blue-500/30 bg-[#172544] text-[#60a5fa]"
              : "border-blue-200/80 bg-[#edf3ff] text-[#1d55e5]"
          }`}
        >
          <Mail className="h-7 w-7" aria-hidden="true" />
        </div>

        <h1
          className={`text-xl font-extrabold tracking-tight sm:text-2xl ${
            isDark ? "text-white" : "text-[#0f172a]"
          }`}
        >
          {t("verifyEmailTitle")}
        </h1>

        <p
          className={`mt-3 text-sm leading-relaxed ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t("verifyEmailSubtitle")}
        </p>

        {profile?.email && (
          <p
            dir="ltr"
            className={`mt-1.5 text-sm font-semibold ${
              isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
            }`}
          >
            {profile.email}
          </p>
        )}

        <p
          className={`mt-4 text-sm leading-relaxed ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t("verifyEmailInstructions")}{" "}
          <strong className={isDark ? "text-slate-200" : "text-slate-700"}>
            {t("spamFolder")}
          </strong>
          .
        </p>

        <Link
          to="/login"
          className={`mt-7 inline-flex items-center gap-2 text-xs font-semibold transition ${
            isDark
              ? "text-slate-400 hover:text-[#60a5fa]"
              : "text-slate-500 hover:text-[#1d55e5]"
          }`}
        >
          <ArrowLeft size={14} className="rtl:rotate-180" />
          <span>{isRtl ? "العودة لتسجيل الدخول" : "Back to sign in"}</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default Confirmemail;
