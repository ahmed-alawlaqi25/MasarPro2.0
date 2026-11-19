import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Languages,
  LoaderCircle,
  Mail,
  MessageSquare,
  Moon,
  Send,
  Sun,
} from "lucide-react";
import Footer from "../components/Footer";

const copy = {
  en: {
    home: "Back to home",
    badge: "CONTACT MASARPRO",
    title: "How can we help?",
    intro: "Have a question, found a problem, or want to share an idea? Send us a message.",
    heading: "We’d like to hear from you.",
    detail: "Tell us what you need. Include details to help us understand your question.",
    reply: "We’ll reply to the email address you provide.",
    form: "Send a message",
    name: "Your name",
    email: "Email address",
    message: "Message",
    namePlaceholder: "Full name",
    messagePlaceholder: "What would you like to tell us?",
    submit: "Send message",
    sending: "Sending...",
    success: "Your message has been sent. Thank you for contacting MasarPro.",
    error: "Your message was not sent. Please try again.",
    limited: "Too many messages. Please try again in 15 minutes.",
    invalid: "Enter your name, a valid email, and a message of up to 5,000 characters.",
    unavailable: "The contact form is temporarily unavailable. Please try again later.",
  },
  ar: {
    home: "العودة للرئيسية",
    badge: "تواصل مع مسار برو",
    title: "كيف نساعدك؟",
    intro: "لديك سؤال أو واجهت مشكلة أو ترغب في مشاركة فكرة؟ أرسل لنا رسالة.",
    heading: "يسعدنا سماعك.",
    detail: "أخبرنا بما تحتاجه، وأضف التفاصيل التي تساعدنا على فهم سؤالك.",
    reply: "سنرد على عنوان البريد الإلكتروني الذي تكتبه.",
    form: "أرسل رسالة",
    name: "اسمك",
    email: "البريد الإلكتروني",
    message: "الرسالة",
    namePlaceholder: "الاسم الكامل",
    messagePlaceholder: "ماذا تود أن تخبرنا؟",
    submit: "إرسال الرسالة",
    sending: "جارٍ الإرسال...",
    success: "تم إرسال رسالتك. شكرًا لتواصلك مع مسار برو.",
    error: "لم يتم إرسال رسالتك. يرجى المحاولة مرة أخرى.",
    limited: "أرسلت رسائل كثيرة. يرجى المحاولة بعد 15 دقيقة.",
    invalid: "أدخل اسمك وبريدًا إلكترونيًا صالحًا ورسالة لا تتجاوز ٥٬٠٠٠ حرف.",
    unavailable: "نموذج التواصل غير متاح مؤقتًا. يرجى المحاولة لاحقًا.",
  },
};

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

export default function Contact() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");
  const text = copy[isRtl ? "ar" : "en"];

  const [isDark, setIsDark] = useState(getInitialTheme);
  const [fields, setFields] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

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

  const update = (event) => {
    setFields((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setStatus("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (lock.current) return;
    if (!fields.name.trim() || !fields.message.trim()) {
      setStatus("invalid");
      return;
    }
    lock.current = true;
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setStatus(
          { RATE_LIMITED: "limited", INVALID_INPUT: "invalid", UNAVAILABLE: "unavailable" }[
            result.code
          ] || "error",
        );
        return;
      }
      setFields({ name: "", email: "", message: "", website: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };

  const inputClass = `mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition disabled:opacity-60 ${
    isDark
      ? "border-slate-800 bg-[#0a101d] text-slate-100 placeholder:text-slate-500 focus:border-[#4f8ff7] focus:bg-[#0d1424] focus:ring-4 focus:ring-blue-500/15"
      : "border-slate-200 bg-[#f8fbff] text-[#0f172a] placeholder:text-slate-400 focus:border-[#1d55e5] focus:bg-white focus:ring-4 focus:ring-blue-500/10"
  }`;

  const labelClass = `text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`relative flex min-h-screen flex-col overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      {/* Ambient background glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-80 w-[620px] -translate-x-1/2 rounded-full blur-[130px] ${
          isDark ? "bg-blue-600/15" : "bg-blue-500/10"
        }`}
      />

      {/* NAVBAR */}
      <nav
        aria-label={text.home}
        className={`relative z-50 border-b backdrop-blur-sm transition-colors duration-300 ${
          isDark
            ? "border-slate-800/80 bg-[#080d1a]/95 text-slate-200"
            : "border-slate-200/80 bg-white/95 text-[#0f172a]"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link
            to="/"
            className={`flex items-center transition ${isDark ? "rounded-xl px-2.5 py-1" : ""}`}
          >
            <img
              src="/icons.svg"
              alt="MasarPro Logo"
              className="w-[70px] object-contain sm:w-[60px]"
            />
            <p className="mt-1 ml-1 text-lg font-bold text-blue-500">
              {isRtl ? "مسار برو" : "MasarPro"}
            </p>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/"
              aria-label={text.home}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isDark ? "text-slate-300 hover:text-[#60a5fa]" : "text-slate-600 hover:text-[#1d55e5]"
              }`}
            >
              <ArrowLeft size={16} className="rtl:rotate-180" />
              <span className="hidden sm:inline">{text.home}</span>
            </Link>

            <button
              type="button"
              aria-label={isRtl ? "Switch to English" : "التبديل إلى العربية"}
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

      {/* MAIN CONTENT */}
      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span
            className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide ${
              isDark
                ? "border border-blue-500/30 bg-[#121c33] text-[#60a5fa]"
                : "bg-[#e8efff] text-[#1d55e5]"
            }`}
          >
            {text.badge}
          </span>
          <h1
            className={`mt-5 text-3xl font-extrabold tracking-tight sm:text-5xl ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {text.title}
          </h1>
          <p
            className={`mt-4 text-sm leading-relaxed sm:text-base ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {text.intro}
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className={`grid overflow-hidden rounded-3xl border transition-colors duration-300 md:grid-cols-[0.85fr_1.15fr] ${
            isDark
              ? "border-slate-800/90 bg-[#0f1628] shadow-[0_24px_80px_-18px_rgba(29,85,229,0.28)]"
              : "border-slate-200/90 bg-white shadow-[0_24px_70px_-18px_rgba(37,99,235,0.14)]"
          }`}
        >
          {/* Left Blue Brand Panel */}
          <aside className="flex flex-col justify-between bg-linear-to-br from-[#1d55e5] to-[#153eb5] p-7 text-white sm:p-10">
            <div>
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/10 shadow-inner">
                <MessageSquare size={26} aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl">
                {text.heading}
              </h2>
              <p className="mt-4 text-sm leading-7 text-blue-100">{text.detail}</p>
            </div>
            <p className="mt-12 flex items-start gap-3 border-t border-white/20 pt-6 text-sm leading-6 text-blue-50">
              <Mail size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>{text.reply}</span>
            </p>
          </aside>

          {/* Right Form */}
          <form
            onSubmit={submit}
            className="p-7 sm:p-10"
            aria-labelledby="contact-form-title"
            aria-busy={busy}
          >
            <h2
              id="contact-form-title"
              className={`mb-6 text-xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}
            >
              {text.form}
            </h2>

            <fieldset disabled={busy} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  {text.name}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={fields.name}
                  onChange={update}
                  placeholder={text.namePlaceholder}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  {text.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={fields.email}
                  onChange={update}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className={labelClass}>
                  {text.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={5000}
                  rows={5}
                  value={fields.message}
                  onChange={update}
                  placeholder={text.messagePlaceholder}
                  className={`${inputClass} min-h-36 resize-y`}
                />
                <p
                  className={`mt-1.5 text-end text-xs ${
                    isDark ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {fields.message.length.toLocaleString(isRtl ? "ar" : "en")} /{" "}
                  {(5000).toLocaleString(isRtl ? "ar" : "en")}
                </p>
              </div>

              <div hidden aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={fields.website}
                  onChange={update}
                />
              </div>

              <button
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1d55e5] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1746c4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d55e5] disabled:cursor-wait disabled:opacity-60"
              >
                {busy ? (
                  <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send size={18} aria-hidden="true" />
                )}
                <span>{busy ? text.sending : text.submit}</span>
              </button>
            </fieldset>

            {status && (
              <p
                role={status === "success" ? "status" : "alert"}
                className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm leading-6 ${
                  status === "success"
                    ? isDark
                      ? "border-blue-500/30 bg-[#172544] text-blue-200"
                      : "border-blue-200 bg-[#edf3ff] text-[#1d55e5]"
                    : isDark
                      ? "border-red-500/30 bg-red-950/50 text-red-300"
                      : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {status === "success" && (
                  <CheckCircle2 size={18} className="mt-1 shrink-0" aria-hidden="true" />
                )}
                <span>{text[status]}</span>
              </p>
            )}
          </form>
        </motion.div>
      </main>

      <Footer isDark={isDark} />
    </div>
  );
}
