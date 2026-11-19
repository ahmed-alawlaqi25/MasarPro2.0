import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Languages,
  LoaderCircle,
  Mail,
  Moon,
  Sun,
  User2,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthContext";
import MasarLogo from "../components/MasarLogo";

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = searchParams.get("state") === "register" ? "register" : "login";
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isDark, setIsDark] = useState(getInitialTheme);
  const { session, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitError("");
    const isRegistering = state === "register";
    if (isRegistering && !agreedToTerms) {
      setSubmitError("terms");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
          shouldCreateUser: isRegistering,
          data: isRegistering ? { name: formData.name } : undefined,
        },
      });

      if (error) {
        setSubmitError(
          error.status === 429 ? "rate" : isRegistering ? "register" : "login",
        );
        return;
      }

      window.location.href = "/confirm-email";
    } catch {
      setSubmitError("network");
    } finally {
      setSubmitting(false);
    }
  };

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const errorMessages = isRtl
    ? {
        login:
          "تعذر تسجيل الدخول. تحقق من بريدك الإلكتروني، أو أنشئ حساباً إذا لم تكن مسجلاً.",
        register:
          "تعذر إرسال رابط التسجيل. تحقق من بريدك الإلكتروني وحاول مجدداً.",
        rate: "طلبات كثيرة. انتظر قليلاً ثم حاول مجدداً.",
        network: "تعذر الاتصال. تحقق من اتصال الإنترنت وحاول مجدداً.",
        exists: "هذا البريد مسجّل مسبقاً. سجّل الدخول بدلاً من ذلك.",
        terms: "يرجى الموافقة على شروط الخدمة للمتابعة.",
      }
    : {
        login:
          "Unable to sign in. Check your email address, or sign up if you are not registered.",
        register:
          "Unable to send the sign-up link. Check your email address and try again.",
        rate: "Too many requests. Please wait before trying again.",
        network:
          "Unable to connect. Check your internet connection and try again.",
        exists: "This email is already registered. Please log in instead.",
        terms: "Please agree to the Terms of Service to continue.",
      };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#080d1a] text-slate-300" : "bg-[#f8fbff] text-slate-600"
        }`}
      >
        <LoaderCircle className="h-6 w-6 animate-spin text-[#1d55e5]" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/resume-builder" replace />;
  }

  const inputWrapperClass = `flex h-12 w-full items-center gap-3 rounded-xl border px-4 transition focus-within:ring-4 ${
    isDark
      ? "border-slate-800 bg-[#0a101d] text-slate-100 focus-within:border-[#4f8ff7] focus-within:bg-[#0d1424] focus-within:ring-blue-500/15"
      : "border-slate-200 bg-[#f8fbff] text-[#0f172a] focus-within:border-[#1d55e5] focus-within:bg-white focus-within:ring-blue-500/10"
  }`;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`relative flex min-h-screen flex-col overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      {/* Ambient blue glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full blur-[130px] ${
          isDark ? "bg-blue-600/15" : "bg-blue-500/12"
        }`}
      />

      {/* Minimal Top Navbar */}
      <nav
        className={`relative z-50 border-b backdrop-blur-sm transition-colors duration-300 ${
          isDark
            ? "border-slate-800/80 bg-[#080d1a]/95 text-slate-200"
            : "border-slate-200/80 bg-white/95 text-[#0f172a]"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center">
            <MasarLogo isDark={isDark} isRtl={isRtl} />
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isDark
                  ? "text-slate-300 hover:text-[#60a5fa]"
                  : "text-slate-600 hover:text-[#1d55e5]"
              }`}
            >
              <ArrowLeft size={16} className="rtl:rotate-180" />
              <span className="hidden sm:inline">
                {isRtl ? "العودة للرئيسية" : "Back to home"}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => i18n.changeLanguage(isRtl ? "en" : "ar")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isDark
                  ? "text-slate-200 hover:bg-slate-800/80 hover:text-[#60a5fa]"
                  : "text-[#0f172a] hover:bg-blue-50/80 hover:text-[#1d55e5]"
              }`}
            >
              <Languages size={17} />
              <span>{isRtl ? "EN" : "العربية"}</span>
            </button>

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
          </div>
        </div>
      </nav>

      {/* Main Centered Login Card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-12">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className={`w-full max-w-[420px] rounded-3xl border p-8 text-center transition-colors duration-300 sm:p-10 ${
            isDark
              ? "border-slate-800/90 bg-[#0f1628] shadow-[0_24px_80px_-18px_rgba(29,85,229,0.28)]"
              : "border-slate-200/90 bg-white shadow-[0_24px_70px_-18px_rgba(37,99,235,0.14)]"
          }`}
        >
          <Link to="/" className="inline-flex items-center justify-center">
            <MasarLogo isDark={isDark} isRtl={isRtl} size="lg" />
          </Link>

          <h1
            className={`mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {state === "login" ? t("loginTitle") : t("signUpTitle")}
          </h1>

          <p
            className={`mt-2 text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {t("signInButton")}
          </p>

          <div className="mt-7 space-y-4">
            {state !== "login" && (
              <div className={inputWrapperClass}>
                <User2
                  size={17}
                  className={`shrink-0 ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                />
                <input
                  type="text"
                  name="name"
                  maxLength={80}
                  placeholder={t("nameLabel")}
                  className={`w-full border-none bg-transparent text-sm outline-none ring-0 ${
                    isDark
                      ? "text-slate-100 placeholder:text-slate-500"
                      : "text-[#0f172a] placeholder:text-slate-400"
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className={inputWrapperClass}>
              <Mail
                size={17}
                className={`shrink-0 ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              />
              <input
                type="email"
                name="email"
                dir="ltr"
                maxLength={254}
                aria-label={t("emailLabel")}
                aria-describedby={submitError ? "email-error" : undefined}
                placeholder={t("emailLabel")}
                className={`w-full border-none bg-transparent text-sm outline-none ring-0 ${
                  isDark
                    ? "text-slate-100 placeholder:text-slate-500"
                    : "text-[#0f172a] placeholder:text-slate-400"
                }`}
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                required
              />
            </div>

            {state !== "login" && (
              <label
                htmlFor="agree-terms"
                className={`flex cursor-pointer items-start gap-2.5 pt-1 text-start text-xs leading-relaxed sm:text-sm ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setSubmitError("");
                  }}
                  disabled={submitting}
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-[#1d55e5]"
                />
                <span>
                  {isRtl ? "أوافق على " : "I agree to the "}
                  <Link
                    to="/terms"
                    onClick={(e) => e.stopPropagation()}
                    className={`font-semibold hover:underline ${
                      isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
                    }`}
                  >
                    {isRtl ? "شروط الخدمة" : "Terms of Service"}
                  </Link>
                  .
                </span>
              </label>
            )}
          </div>

          {submitError && (
            <p
              id="email-error"
              role="alert"
              dir={isRtl ? "rtl" : "ltr"}
              className={`mt-4 rounded-xl border p-3 text-start text-xs leading-relaxed sm:text-sm ${
                isDark
                  ? "border-red-500/30 bg-red-950/50 text-red-300"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {errorMessages[submitError]}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1d55e5] px-6 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1746c4] disabled:cursor-wait disabled:opacity-60"
          >
            {submitting && <LoaderCircle size={17} className="animate-spin" />}
            <span>
              {submitting
                ? isRtl
                  ? "جارٍ الإرسال..."
                  : "Sending..."
                : state === "login"
                  ? t("loginTitle")
                  : t("signUpTitle")}
            </span>
          </button>

          <p
            className={`mt-6 text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {state === "login"
              ? t("dontHaveAccount")
              : t("alreadyHaveAccount")}{" "}
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set("state", state === "login" ? "register" : "login");
                setSearchParams(next);
                setSubmitError("");
              }}
              className={`cursor-pointer font-semibold hover:underline disabled:opacity-60 ${
                isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
              }`}
            >
              {t("clickHereLink")}
            </button>
          </p>
        </motion.form>
      </main>
    </div>
  );
};

export default Login;
