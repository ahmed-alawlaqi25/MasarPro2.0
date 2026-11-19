import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Languages, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_COPY = {
  en: {
    badge: "Job tracker + resume builder + cover letters",
    titleStart: "Stop juggling tabs.",
    titleHighlight: "Run your whole job search",
    titleEnd: "from one board.",
    subtitle:
      "Track every application on a Kanban board, build a tailored resume from a template, and generate a cover letter from your CV and the job description.",
    ctaPrimary: "Get started free",
    ctaSecondary: "See the features",
    offerBadge: "Offer received",
    tabs: [
      { id: "tracker", label: "Job tracker" },
      { id: "resume", label: "Resume builder" },
      { id: "letter", label: "Cover letter" },
    ],
    resumePanel: {
      heading: "Template & accent",
      templates: [
        { id: "modern", label: "Modern" },
        { id: "classic", label: "Classic" },
        { id: "compact", label: "Compact" },
      ],
      hint: "Click a color. The preview updates instantly.",
      saved: "All changes saved",
      name: "YOUR NAME",
      role: "Full-Stack Developer | React | Node.js",
      summaryHeading: "PROFESSIONAL SUMMARY",
      projectsHeading: "PROJECTS",
    },
    trackerPanel: {
      columns: [
        { title: "Wish List", count: 3, role: "Frontend Engineer", company: "Careem" },
        { title: "Applied", count: 4, role: "React Developer", company: "STC" },
        { title: "Interview", count: 2, role: "Full-Stack Dev", company: "Tabby" },
        { title: "Offer", count: 1, role: "Software Engineer", company: "Tamara" },
      ],
    },
    letterPanel: {
      inputTitle: "Job description",
      inputLine: "Looking for a React & Node.js engineer to scale customer workflows...",
      outputTitle: "Tailored cover letter",
      outputGreeting: "Dear Hiring Team,",
      outputBody:
        "With experience building full-stack React & Node.js products, I'm excited to bring clean UI engineering and reliable APIs to your team.",
      badge: "Synced with CV",
    },
  },
  ar: {
    badge: "متتبع الوظائف + منشئ السيرة الذاتية + خطابات التقديم",
    titleStart: "توقف عن تشتت التبويبات.",
    titleHighlight: "أدر بحثك الوظيفي بالكامل",
    titleEnd: "من لوحة واحدة.",
    subtitle:
      "تابع كل طلب على لوحة كانبان، أنشئ سيرة ذاتية مخصصة من قالب جاهز، وولد خطاب تقديم متوافق مع سيرتك والوصف الوظيفي.",
    ctaPrimary: "ابدأ مجاناً",
    ctaSecondary: "استعرض المزايا",
    offerBadge: "تم استلام عرض",
    tabs: [
      { id: "tracker", label: "متتبع الوظائف" },
      { id: "resume", label: "منشئ السيرة" },
      { id: "letter", label: "خطاب التقديم" },
    ],
    resumePanel: {
      heading: "القالب واللون",
      templates: [
        { id: "modern", label: "عصري" },
        { id: "classic", label: "كلاسيكي" },
        { id: "compact", label: "مكثف" },
      ],
      hint: "اختر لوناً لتتحدث المعاينة فوراً.",
      saved: "تم حفظ التعديلات",
      name: "اسمك الكامل",
      role: "مطور ويب متكامل | React | Node.js",
      summaryHeading: "الملخص المهني",
      projectsHeading: "المشاريع",
    },
    trackerPanel: {
      columns: [
        { title: "الأمنيات", count: 3, role: "مهندس واجهات", company: "كريم" },
        { title: "تم التقديم", count: 4, role: "مطور React", company: "STC" },
        { title: "مقابلة", count: 2, role: "مطور متكامل", company: "تابي" },
        { title: "عرض عمل", count: 1, role: "مهندس برمجيات", company: "تمارا" },
      ],
    },
    letterPanel: {
      inputTitle: "الوصف الوظيفي",
      inputLine: "نبحث عن مهندس React و Node.js لتطوير تجربة العملاء...",
      outputTitle: "خطاب تقديم مخصص",
      outputGreeting: "السادة فريق التوظيف،",
      outputBody:
        "بخبرتي في بناء تطبيقات React و Node.js، يسعدني المساهمة في تطوير منتجاتكم بكفاءة وجودة عالية.",
      badge: "متزامن مع السيرة",
    },
  },
};

const ACCENT_COLORS = ["#1d55e5", "#0f2942", "#0284c7", "#334155"];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: "easeOut" },
});

function getEffectiveAccent(color, isDark) {
  if (!isDark) return color;
  if (color === "#1d55e5") return "#60a5fa";
  if (color === "#0f2942") return "#93c5fd";
  if (color === "#334155") return "#cbd5e1";
  return color;
}

const Hero = ({ isDark = false, onToggleTheme }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");
  const [template, setTemplate] = useState("modern");
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const copy = HERO_COPY[lang];
  const displayAccent = getEffectiveAccent(accentColor, isDark);

  const changeLanguage = () => {
    i18n.changeLanguage(isRtl ? "en" : "ar");
  };

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className={`relative overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      {/* NAVBAR */}
      <nav
        className={`relative z-50 w-full border-b backdrop-blur-sm transition-colors duration-300 ${
          isDark
            ? "border-slate-800/80 bg-[#080d1a]/95 text-slate-200"
            : "border-slate-200/80 bg-white/95 text-[#0f172a]"
        }`}
      >
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-4 md:px-10 lg:px-16">
          <Link
            to="/"
            className={`flex items-center transition ${
              isDark ? "rounded-xl" : ""
            }`}
          >
            
            <img
              src="/icons.svg"
              alt="MasarPro Logo"
              className="w-[70px] object-contain sm:w-[60px]"
            />
            <p className="mt-1 ml-1 font-bold text-lg text-blue-500">
              {isRtl ? "مسار برو" : "MasarPro"}
            </p>
          </Link>

          {/* Desktop menu */}
          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <Link
              to="/"
              className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                isDark
                  ? "bg-[#172544] text-[#60a5fa]"
                  : "bg-[#e8edf7] text-[#1d55e5]"
              }`}
            >
              {t("main")}
            </Link>
            <a
              href="#features"
              className={`transition ${isDark ? "hover:text-[#60a5fa]" : "hover:text-[#1d55e5]"}`}
            >
              {t("feature")}
            </a>
            <Link
              to="/contact"
              className={`transition ${isDark ? "hover:text-[#60a5fa]" : "hover:text-[#1d55e5]"}`}
            >
              {t("contact")}
            </Link>
            <button
              type="button"
              onClick={changeLanguage}
              className={`flex cursor-pointer items-center gap-1.5 transition ${
                isDark ? "text-slate-200 hover:text-[#60a5fa]" : "text-[#0f172a] hover:text-[#1d55e5]"
              }`}
            >
              <Languages className="h-4 w-4" />
              <span>{isRtl ? "EN" : "AR"}</span>
            </button>

            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
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
            )}
          </div>

          {/* Desktop buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login?state=login"
              className={`rounded-lg border px-6 py-2.5 text-sm font-medium transition ${
                isDark
                  ? "border-slate-700 text-slate-200 hover:bg-slate-800/80"
                  : "border-slate-200 text-[#0f172a] hover:bg-slate-50"
              }`}
            >
              {t("loginMain")}
            </Link>
            <Link
              to="/login?state=register"
              className="rounded-lg bg-[#1d55e5] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1746c4]"
            >
              {t("startNow")}
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition ${
                  isDark
                    ? "border-slate-800 bg-[#0f1628] text-amber-400"
                    : "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={`rounded-lg p-2 transition ${
                isDark ? "text-slate-100 hover:text-[#60a5fa]" : "text-[#0f172a] hover:text-[#1d55e5]"
              }`}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 backdrop-blur-md md:hidden ${
              isDark ? "bg-[#080d1a]/95 text-slate-100" : "bg-white/95 text-[#0f172a]"
            }`}
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute left-6 top-6 text-3xl"
              aria-label="Close menu"
            >
              <X className="hover:text-[#1d55e5]" />
            </button>

            <Link
              onClick={() => setMobileOpen(false)}
              className={`rounded-full px-8 py-2 text-sm font-medium ${
                isDark ? "bg-[#172544] text-[#60a5fa]" : "bg-[#e8edf7] text-[#1d55e5]"
              }`}
              to="/"
            >
              {t("main")}
            </Link>
            <a onClick={() => setMobileOpen(false)} className="hover:text-[#1d55e5]" href="#features">
              {t("feature")}
            </a>
            <Link onClick={() => setMobileOpen(false)} className="hover:text-[#1d55e5]" to="/contact">
              {t("contact")}
            </Link>
            <button
              type="button"
              onClick={changeLanguage}
              className="flex cursor-pointer items-center gap-1.5 transition hover:text-[#1d55e5]"
            >
              <Languages className="h-4 w-4" />
              <span>{isRtl ? "EN" : "AR"}</span>
            </button>
            <Link
              to="/login?state=login"
              className={`rounded-lg border px-10 py-2 font-medium transition ${
                isDark ? "border-slate-700 hover:bg-slate-800" : "border-[#0b86c6] hover:bg-sky-50"
              }`}
            >
              {t("loginMain")}
            </Link>
          </div>
        )}
      </nav>

      {/* HERO CONTENT */}
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 pb-20 pt-14 text-center sm:pt-18">
        <motion.div
          {...fadeUp(0)}
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold ${
            isDark
              ? "border border-blue-500/30 bg-[#121c33] text-[#60a5fa]"
              : "bg-[#e8efff] text-[#1d55e5]"
          }`}
        >
          {copy.badge}
        </motion.div>

        <motion.h1
          {...fadeUp(0.06)}
          className={`mt-6 max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[54px] ${
            isDark ? "text-white" : "text-[#0f172a]"
          }`}
        >
          {copy.titleStart}{" "}
          <span className={isDark ? "text-[#4f8ff7]" : "text-[#1d55e5]"}>
            {copy.titleHighlight}
          </span>{" "}
          {copy.titleEnd}
        </motion.h1>

        <motion.p
          {...fadeUp(0.12)}
          className={`mt-5 max-w-2xl text-sm leading-relaxed sm:text-base ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {copy.subtitle}
        </motion.p>

        <motion.div
          {...fadeUp(0.18)}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link
            to="/login?state=register"
            className="rounded-xl bg-[#1d55e5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1746c4]"
          >
            {copy.ctaPrimary}
          </Link>

          <a
            href="#features"
            className={`rounded-xl border px-6 py-3 text-sm font-semibold shadow-xs transition hover:-translate-y-0.5 ${
              isDark
                ? "border-slate-700/90 bg-[#0f1628] text-slate-200 hover:bg-[#162038]"
                : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
            }`}
          >
            {copy.ctaSecondary}
          </a>
        </motion.div>

        {/* INTERACTIVE MOCKUP BOARD */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: "easeOut" }}
          className="relative mt-12 w-full max-w-4xl"
        >
          {/* Ambient blue glow */}
          <div
            className={`pointer-events-none absolute -inset-x-6 -bottom-10 top-6 rounded-full blur-3xl ${
              isDark ? "bg-blue-600/18" : "bg-blue-500/12"
            }`}
          />

          {/* Floating "Offer received" pill */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -top-3.5 z-20 rounded-xl bg-[#1d55e5] px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 ${
              isRtl ? "left-4 sm:-left-3" : "right-4 sm:-right-3"
            }`}
          >
            {copy.offerBadge}
          </motion.div>

          {/* Browser window */}
          <div
            className={`relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
              isDark
                ? "border-slate-800/90 bg-[#0d1424] shadow-[0_24px_80px_-18px_rgba(29,85,229,0.28)]"
                : "border-slate-200/90 bg-white shadow-[0_24px_70px_-18px_rgba(37,99,235,0.18)]"
            }`}
          >
            {/* Window header bar */}
            <div
              className={`flex flex-wrap items-center gap-4 border-b px-4 py-3 ${
                isDark
                  ? "border-slate-800/90 bg-[#0a101d]"
                  : "border-slate-100 bg-slate-50/70"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <span className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {copy.tabs.map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isSelected
                          ? "text-white"
                          : isDark
                            ? "text-slate-400 hover:text-slate-200"
                            : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="hero-mockup-tab"
                          transition={{ type: "spring", stiffness: 360, damping: 30 }}
                          className="absolute inset-0 rounded-lg bg-[#1d55e5]"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Panels */}
            <div className={`p-4 sm:p-5 ${isDark ? "bg-[#0a101d]" : "bg-[#f9fbff]"}`}>
              <AnimatePresence mode="wait">
                {activeTab === "resume" && (
                  <motion.div
                    key="resume"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 gap-4 md:grid-cols-[260px_1fr]"
                  >
                    {/* Left controls panel */}
                    <div
                      className={`rounded-xl border p-4 text-start ${
                        isDark
                          ? "border-slate-800/90 bg-[#11192c]"
                          : "border-slate-200/80 bg-white"
                      }`}
                    >
                      <p className={`text-xs font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                        {copy.resumePanel.heading}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {copy.resumePanel.templates.map((item) => {
                          const selected = template === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setTemplate(item.id)}
                              className={`cursor-pointer rounded-md border px-2.5 py-1 text-[11px] font-semibold transition ${
                                selected
                                  ? isDark
                                    ? "border-blue-500/40 bg-[#182747] text-[#60a5fa]"
                                    : "border-blue-200 bg-[#edf3ff] text-[#1d55e5]"
                                  : isDark
                                    ? "border-transparent bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                                    : "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>

                      <p className="mt-4 text-[11px] text-slate-400">{copy.resumePanel.hint}</p>

                      <div className="mt-2.5 flex items-center gap-2.5">
                        {ACCENT_COLORS.map((color) => {
                          const active = accentColor === color;
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setAccentColor(color)}
                              aria-label={`Select accent color ${color}`}
                              style={{ backgroundColor: color }}
                              className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110 ${
                                isDark ? "ring-1 ring-white/15" : ""
                              } ${
                                active
                                  ? isDark
                                    ? "ring-2 ring-[#60a5fa] ring-offset-2 ring-offset-[#11192c]"
                                    : "ring-2 ring-[#1d55e5] ring-offset-2 ring-offset-white"
                                  : ""
                              }`}
                            >
                              {active && <Check className="h-3 w-3 text-white" />}
                            </button>
                          );
                        })}
                      </div>

                      <p className={`mt-5 text-[11px] font-semibold ${isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"}`}>
                        {copy.resumePanel.saved}
                      </p>
                    </div>

                    {/* Right live resume preview */}
                    <div
                      className={`rounded-xl border p-5 text-start transition-all ${
                        isDark
                          ? "border-slate-800/90 bg-[#11192c]"
                          : "border-slate-200/80 bg-white"
                      } ${template === "compact" ? "space-y-2.5 py-4" : "space-y-3.5"}`}
                    >
                      <div className={template === "classic" ? "text-center" : ""}>
                        <p
                          style={{ color: displayAccent }}
                          className="text-base font-extrabold tracking-tight transition-colors"
                        >
                          {copy.resumePanel.name}
                        </p>
                        <p className={`mt-0.5 text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {copy.resumePanel.role}
                        </p>
                      </div>

                      <div
                        style={{ borderColor: displayAccent }}
                        className="border-t opacity-40 transition-colors"
                      />

                      <div>
                        <p
                          style={{ color: displayAccent }}
                          className="text-[10px] font-bold tracking-wider uppercase transition-colors"
                        >
                          {copy.resumePanel.summaryHeading}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          <div className={`h-2 w-full rounded-full ${isDark ? "bg-slate-700/70" : "bg-slate-200/85"}`} />
                          <div className={`h-2 w-4/5 rounded-full ${isDark ? "bg-slate-800/90" : "bg-slate-100"}`} />
                        </div>
                      </div>

                      <div>
                        <p
                          style={{ color: displayAccent }}
                          className="text-[10px] font-bold tracking-wider uppercase transition-colors"
                        >
                          {copy.resumePanel.projectsHeading}
                        </p>
                        <div className="mt-2 space-y-1.5">
                          <div className={`h-2 w-full rounded-full ${isDark ? "bg-slate-700/70" : "bg-slate-200/85"}`} />
                          <div className={`h-2 w-3/5 rounded-full ${isDark ? "bg-slate-800/90" : "bg-slate-100"}`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "tracker" && (
                  <motion.div
                    key="tracker"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-3 text-start sm:grid-cols-4"
                  >
                    {copy.trackerPanel.columns.map((col, idx) => (
                      <div
                        key={col.title}
                        className={`rounded-xl border p-3 ${
                          isDark
                            ? "border-slate-800/90 bg-[#11192c]"
                            : "border-slate-200/80 bg-white"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between text-[11px] font-bold ${
                            isDark ? "text-slate-200" : "text-slate-700"
                          }`}
                        >
                          <span>{col.title}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] ${
                              isDark
                                ? "bg-[#182747] text-[#60a5fa]"
                                : "bg-[#edf3ff] text-[#1d55e5]"
                            }`}
                          >
                            {col.count}
                          </span>
                        </div>
                        <div
                          className={`mt-3 rounded-lg border p-2.5 ${
                            idx === 3
                              ? isDark
                                ? "border-blue-500/40 bg-[#16223d]"
                                : "border-blue-200 bg-[#f4f8ff]"
                              : isDark
                                ? "border-slate-800 bg-[#0d1424]"
                                : "border-slate-100 bg-slate-50/70"
                          }`}
                        >
                          <p className={`text-xs font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                            {col.role}
                          </p>
                          <p className={`mt-0.5 text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {col.company}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "letter" && (
                  <motion.div
                    key="letter"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 gap-4 text-start md:grid-cols-[240px_1fr]"
                  >
                    <div
                      className={`rounded-xl border p-4 ${
                        isDark
                          ? "border-slate-800/90 bg-[#11192c]"
                          : "border-slate-200/80 bg-white"
                      }`}
                    >
                      <p className={`text-xs font-bold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                        {copy.letterPanel.inputTitle}
                      </p>
                      <p
                        className={`mt-2 rounded-lg p-2.5 text-[11px] leading-relaxed ${
                          isDark ? "bg-[#0d1424] text-slate-400" : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        {copy.letterPanel.inputLine}
                      </p>
                      <span
                        className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          isDark
                            ? "bg-[#182747] text-[#60a5fa]"
                            : "bg-[#edf3ff] text-[#1d55e5]"
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        {copy.letterPanel.badge}
                      </span>
                    </div>

                    <div
                      className={`rounded-xl border p-5 ${
                        isDark
                          ? "border-slate-800/90 bg-[#11192c]"
                          : "border-slate-200/80 bg-white"
                      }`}
                    >
                      <p className={`text-xs font-bold ${isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"}`}>
                        {copy.letterPanel.outputTitle}
                      </p>
                      <p className={`mt-3 text-xs font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                        {copy.letterPanel.outputGreeting}
                      </p>
                      <p className={`mt-2 text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {copy.letterPanel.outputBody}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
