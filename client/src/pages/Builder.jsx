import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Download,
  FileText,
  LayoutList,
  LoaderCircle,
  Palette,
  PanelsTopLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useResumeDraft } from "../lib/useResumeDraft";
import ImproveSummary from "../components/ImproveSummary";
import ClassicTemplate from "../components/templates/ClassicTemplate";
import ExecutiveTemplate from "../components/templates/ExecutiveTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";

const accentColors = [
  ["Blue", "#3b82f6"],
  ["Indigo", "#6366f1"],
  ["Purple", "#8b5cf6"],
  ["Green", "#059669"],
  ["Red", "#ef4444"],
  ["Orange", "#f97316"],
  ["Teal", "#0d9488"],
  ["Pink", "#ec4899"],
  ["Gray", "#6b7280"],
  ["Black", "#1f2937"],
];

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

const Builder = () => {
  const { resumeID } = useParams();
  const { session, loading } = useAuth();
  const [isDark, setIsDark] = useState(getInitialTheme);

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

  if (loading) {
    return (
      <div
        className={`flex min-h-[calc(100vh-73px)] items-center gap-2.5 p-8 text-sm ${
          isDark ? "bg-[#080d1a] text-slate-400" : "bg-[#f8fbff] text-slate-500"
        }`}
      >
        <LoaderCircle className="h-4 w-4 animate-spin text-[#1d55e5]" />
        <p role="status">Loading account...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <Link
        to="/login"
        className={`block min-h-[calc(100vh-73px)] p-8 text-sm font-semibold underline ${
          isDark ? "bg-[#080d1a] text-[#60a5fa]" : "bg-[#f8fbff] text-[#1d55e5]"
        }`}
      >
        Sign in to open your resume.
      </Link>
    );
  }

  return (
    <ResumeEditor
      key={`${session.user.id}:${resumeID}`}
      resumeId={resumeID}
      userId={session.user.id}
      isDark={isDark}
    />
  );
};

const ResumeEditor = ({ resumeId, userId, isDark = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const rtl = i18n.language.startsWith("ar");
  const { content, setContent, status, error: saveError, save } =
    useResumeDraft(resumeId, userId);
  const accentColor = content.accentColor;
  const setAccentColor = (color) =>
    setContent((previous) => ({ ...previous, accentColor: color }));
  const currentTemplate = content.template || "classic";
  const setTemplate = (template) =>
    setContent((previous) => ({ ...previous, template }));
  const [templateOpen, setTemplateOpen] = useState(false);
  const templatePicker = useRef(null);
  const templateButton = useRef(null);
  const [accentOpen, setAccentOpen] = useState(false);
  const accentPicker = useRef(null);
  const accentButton = useRef(null);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (searchParams.get("download") !== "pdf" || status !== "saved") return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      await document.fonts.ready;
      if (cancelled) return;
      const next = new URLSearchParams(searchParams);
      next.delete("download");
      setSearchParams(next, { replace: true });
      const previousTitle = document.title;
      try {
        document.title = `${content.personal.fullName.trim() || "Resume"} - CV`;
        window.print();
      } finally {
        document.title = previousTitle;
      }
    }, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchParams, setSearchParams, status, content.personal.fullName]);

  const downloadPdf = async () => {
    if (printing) return;
    setPrinting(true);
    const previousTitle = document.title;
    try {
      await document.fonts.ready;
      document.title = `${content.personal.fullName.trim() || "Resume"} - CV`;
      window.print();
    } finally {
      document.title = previousTitle;
      setPrinting(false);
    }
  };

  const personal = content.personal;
  const presentLabel = rtl ? "حتى الآن" : "Present";
  const contactDetails = [
    personal.location,
    personal.phone,
    personal.email,
    personal.linkedin,
    personal.website,
  ].filter((value) => typeof value === "string" && value.trim());

  const personalFields = [
    {
      name: "fullName",
      label: t("fullNameLabel"),
      placeholder: t("fullNamePlaceholder"),
      autoComplete: "name",
      maxLength: 100,
    },
    {
      name: "professionalTitle",
      label: t("professionalTitleLabel"),
      placeholder: t("professionalTitlePlaceholder"),
      autoComplete: "organization-title",
      maxLength: 120,
    },
    {
      name: "location",
      label: t("locationLabel"),
      placeholder: "Riyadh, Saudi Arabia",
      autoComplete: "address-level2",
      maxLength: 120,
    },
    {
      name: "phone",
      label: t("phoneNumberLabel"),
      placeholder: "+966 55 555 5555",
      type: "tel",
      autoComplete: "tel",
      maxLength: 40,
    },
    {
      name: "email",
      label: t("emailAddressLabel"),
      placeholder: "email@example.com",
      type: "email",
      autoComplete: "email",
      maxLength: 254,
    },
    {
      name: "website",
      label: t("websiteLabel"),
      placeholder: "https://yourwebsite.com",
      type: "url",
      autoComplete: "url",
      maxLength: 300,
    },
    {
      name: "linkedin",
      label: t("linkedinLabel"),
      placeholder: "https://www.linkedin.com/in/yourname",
      type: "url",
      maxLength: 300,
    },
  ];

  useEffect(() => {
    if (!accentOpen) return;
    const dismiss = (event) => {
      if (!accentPicker.current?.contains(event.target)) setAccentOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setAccentOpen(false);
        accentButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [accentOpen]);

  useEffect(() => {
    if (!templateOpen) return;
    const dismiss = (event) => {
      if (!templatePicker.current?.contains(event.target))
        setTemplateOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setTemplateOpen(false);
        templateButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [templateOpen]);

  const [step, setStep] = useState(0);
  const steps = [
    t("personalInformationSection"),
    t("professionalSummarySection"),
    t("professionalExperienceSection"),
    t("educationTrainingSection"),
    t("projectsLabel"),
    "Skills",
  ];

  const inputClass = `w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-4 ${
    isDark
      ? "border-slate-800 bg-[#0a101d] text-slate-100 placeholder:text-slate-500 focus:border-[#4f8ff7] focus:bg-[#0d1424] focus:ring-blue-500/15"
      : "border-slate-200 bg-[#f8fbff] text-[#0f172a] placeholder:text-slate-400 focus:border-[#1d55e5] focus:bg-white focus:ring-blue-500/10"
  }`;

  const fieldsetClass = `min-w-0 space-y-4 rounded-xl border p-4 ${
    isDark
      ? "border-slate-800 bg-[#0b1120]/60"
      : "border-slate-200 bg-slate-50/40"
  }`;

  const dashedAddBtnClass = `mt-5 w-full cursor-pointer rounded-xl border border-dashed px-4 py-3 text-sm font-semibold transition ${
    isDark
      ? "border-blue-500/40 text-[#60a5fa] hover:bg-[#172544]/60"
      : "border-blue-300 text-[#1d55e5] hover:bg-[#edf3ff]/60"
  }`;

  const addExperience = () => {
    const newExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      highlights: [],
    };

    setContent((previous) => ({
      ...previous,
      experience: [...previous.experience, newExperience],
    }));
  };

  const updateExperience = (id, field, value) => {
    setContent((previous) => ({
      ...previous,
      experience: previous.experience.map((job) =>
        job.id === id
          ? {
              ...job,
              [field]: value,
              ...(field === "isCurrent" && value ? { endDate: "" } : {}),
            }
          : job,
      ),
    }));
  };

  const removeExperience = (id) => {
    setContent((previous) => ({
      ...previous,
      experience: previous.experience.filter((job) => job.id !== id),
    }));
  };

  const addEntry = (section) => {
    const entry =
      section === "education"
        ? {
            id: crypto.randomUUID(),
            qualification: "",
            institution: "",
            location: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            description: "",
          }
        : {
            id: crypto.randomUUID(),
            name: "",
            role: "",
            url: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            description: "",
          };
    setContent((previous) => ({
      ...previous,
      [section]: [...previous[section], entry],
    }));
  };

  const addSkillGroup = () => {
    const group = { id: crypto.randomUUID(), category: "", items: "" };
    setContent((previous) => ({
      ...previous,
      skills: [...previous.skills, group],
    }));
  };

  const updateEntry = (section, id, field, value) => {
    setContent((previous) => ({
      ...previous,
      [section]: previous[section].map((entry) =>
        entry.id === id
          ? {
              ...entry,
              [field]: value,
              ...(field === "isCurrent" && value ? { endDate: "" } : {}),
            }
          : entry,
      ),
    }));
  };

  const removeEntry = (section, id) => {
    setContent((previous) => ({
      ...previous,
      [section]: previous[section].filter((entry) => entry.id !== id),
    }));
  };

  const hasEntryContent = (entry) =>
    Object.entries(entry).some(
      ([key, value]) =>
        key !== "id" && typeof value === "string" && value.trim(),
    );

  const handlePersonalChange = (event) => {
    const { name, value } = event.target;
    setContent((previous) => ({
      ...previous,
      personal: {
        ...previous.personal,
        [name]: value,
      },
    }));
  };

  const surfaceClass = `min-h-[calc(100vh-73px)] p-8 transition-colors duration-300 ${
    isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
  }`;

  if (status === "loading") {
    return (
      <div className={`${surfaceClass} flex items-center gap-2.5 text-sm text-slate-400`}>
        <LoaderCircle className="h-4 w-4 animate-spin text-[#1d55e5]" />
        <p role="status">
          {rtl ? "جارٍ تحميل السيرة الذاتية..." : "Loading resume..."}
        </p>
      </div>
    );
  }

  if (status === "load-error") {
    return (
      <div className={surfaceClass}>
        <p
          role="alert"
          className={`mb-4 max-w-xl rounded-xl border p-3.5 text-sm ${
            isDark
              ? "border-red-500/30 bg-red-950/50 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {rtl ? "تعذر فتح السيرة الذاتية." : "Unable to open this resume."}{" "}
          {saveError}
        </p>
        <Link
          to="/resume-builder"
          className={`text-sm font-semibold underline ${
            isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
          }`}
        >
          {rtl ? "العودة إلى السير الذاتية" : "Back to resumes"}
        </Link>
      </div>
    );
  }

  const templateOptionClass = (tpl) =>
    `flex w-full cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-start transition-colors ${
      currentTemplate === tpl
        ? isDark
          ? "border-[#60a5fa] bg-[#172544] ring-1 ring-[#60a5fa]"
          : "border-[#1d55e5] bg-[#edf3ff]/80 ring-1 ring-[#1d55e5]"
        : isDark
          ? "border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/70"
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
    }`;

  return (
    <section
      id="resume-workspace"
      dir={rtl ? "rtl" : "ltr"}
      className={`min-h-0 flex-1 overflow-hidden px-4 py-4 transition-colors duration-300 sm:px-8 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      <div className="mx-auto flex h-full min-h-0 max-w-7xl flex-col">
        <div className="mb-2 grid gap-3 lg:grid-cols-5 lg:gap-8">
          <p
            role="status"
            className={`text-end text-xs font-medium lg:col-span-3 lg:col-start-3 ${
              status === "error"
                ? isDark
                  ? "text-red-400"
                  : "text-red-600"
                : isDark
                  ? "text-slate-400"
                  : "text-slate-500"
            }`}
          >
            {rtl
              ? {
                  saved: "تم حفظ جميع التغييرات",
                  pending: "تغييرات غير محفوظة",
                  saving: "جارٍ الحفظ...",
                  error: "تعذر الحفظ. يرجى إعادة المحاولة.",
                }[status]
              : {
                  saved: "All changes saved",
                  pending: "Unsaved changes",
                  saving: "Saving...",
                  error: "Save failed. Please retry.",
                }[status]}
          </p>
        </div>

        {saveError && (
          <p
            role="alert"
            className={`mb-4 rounded-xl border p-3 text-sm ${
              isDark
                ? "border-red-500/30 bg-red-950/50 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {saveError}
          </p>
        )}

        <div className="mb-5 grid items-center gap-3 lg:grid-cols-5 lg:gap-8">
          <Link
            to="/resume-builder"
            className={`inline-flex items-center gap-2 text-sm font-medium transition lg:col-span-2 ${
              isDark
                ? "text-slate-400 hover:text-[#60a5fa]"
                : "text-slate-500 hover:text-[#1d55e5]"
            }`}
          >
            {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{t("backToResumesLink")}</span>
          </Link>

          <div className="flex flex-wrap justify-end gap-2 lg:col-span-3">
            <Link
              to={`/cover-letter/${resumeId}`}
              className={`rounded-xl border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                isDark
                  ? "border-slate-700 bg-[#0f1628] text-slate-200 hover:bg-slate-800"
                  : "border-slate-200 bg-white text-[#0f172a] hover:bg-slate-50"
              }`}
            >
              {rtl ? "خطاب التقديم" : "Cover letter"}
            </Link>
            <button
              type="button"
              onClick={() => void save()}
              disabled={status === "saving" || status === "saved"}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
                isDark
                  ? "border-slate-700 bg-[#0f1628] text-slate-200 hover:bg-slate-800"
                  : "border-slate-200 bg-white text-[#0f172a] hover:bg-slate-50"
              }`}
            >
              {rtl ? "حفظ الآن" : "Save now"}
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={printing}
              title={
                rtl
                  ? "اختر حفظ بصيغة PDF في نافذة الطباعة"
                  : "Choose Save as PDF in the print dialog"
              }
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1d55e5] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1746c4] disabled:opacity-50 sm:text-sm"
            >
              <Download size={16} aria-hidden="true" />
              <span>{rtl ? "تنزيل PDF" : "Download PDF"}</span>
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-2 gap-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-6">
          {/* Left Form Panel */}
          <section
            aria-label={rtl ? "حقول السيرة الذاتية" : "Resume fields"}
            tabIndex={0}
            className={`min-h-0 min-w-0 overflow-y-auto overscroll-contain rounded-2xl border border-t-4 px-6 py-5 transition-colors duration-300 lg:col-span-2 ${
              isDark
                ? "border-slate-800/90 border-t-[#3b82f6] bg-[#0f1628] shadow-md"
                : "border-slate-200/90 border-t-[#1d55e5] bg-white shadow-xs"
            }`}
          >
            <div
              className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2"
              role="group"
              aria-label="Resume editor controls"
            >
              <div className="flex items-center gap-2">
                {/* Template Picker */}
                <div ref={templatePicker} className="relative">
                  <button
                    ref={templateButton}
                    type="button"
                    aria-expanded={templateOpen}
                    aria-controls="resume-template-picker"
                    onClick={() => setTemplateOpen((open) => !open)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[#1d55e5] ${
                      isDark
                        ? "border-blue-500/30 bg-[#172544] text-[#60a5fa] hover:bg-[#1e315c]"
                        : "border-blue-200 bg-[#edf3ff] text-[#1d55e5] hover:bg-blue-100/80"
                    }`}
                  >
                    <PanelsTopLeft size={14} aria-hidden="true" />
                    <span>{t("templateTab")}</span>
                  </button>

                  {templateOpen && (
                    <div
                      id="resume-template-picker"
                      role="group"
                      aria-label="Resume template"
                      className={`absolute start-0 top-full z-20 mt-2 w-64 rounded-2xl border p-2.5 shadow-2xl ${
                        isDark
                          ? "border-slate-700 bg-[#131d33] text-slate-100"
                          : "border-slate-200 bg-white text-[#0f172a]"
                      }`}
                    >
                      <p
                        className={`mb-2 px-1 text-xs font-bold ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {t("selectTemplate")}
                      </p>
                      <div className="space-y-1.5">
                        {[
                          [
                            "classic",
                            FileText,
                            t("classicTemplate"),
                            t("classicTemplateDesc"),
                          ],
                          [
                            "executive",
                            Columns2,
                            t("executiveTemplate"),
                            t("executiveTemplateDesc"),
                          ],
                          [
                            "modern",
                            LayoutList,
                            t("modernTemplate"),
                            t("modernTemplateDesc"),
                          ],
                        ].map(([tplId, Icon, tplTitle, tplDesc]) => (
                          <button
                            key={tplId}
                            type="button"
                            onClick={() => {
                              setTemplate(tplId);
                              setTemplateOpen(false);
                              templateButton.current?.focus();
                            }}
                            className={templateOptionClass(tplId)}
                          >
                            <Icon
                              size={18}
                              className={`mt-0.5 shrink-0 ${
                                isDark ? "text-slate-300" : "text-slate-600"
                              }`}
                              aria-hidden="true"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-xs font-bold ${
                                    isDark ? "text-white" : "text-slate-900"
                                  }`}
                                >
                                  {tplTitle}
                                </span>
                                {currentTemplate === tplId && (
                                  <Check
                                    size={14}
                                    className={
                                      isDark
                                        ? "text-[#60a5fa]"
                                        : "text-[#1d55e5]"
                                    }
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              <p
                                className={`mt-0.5 text-[11px] leading-tight ${
                                  isDark ? "text-slate-400" : "text-slate-500"
                                }`}
                              >
                                {tplDesc}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Accent Color Picker */}
                <div ref={accentPicker} className="relative">
                  <button
                    ref={accentButton}
                    type="button"
                    aria-expanded={accentOpen}
                    aria-controls="resume-accent-picker"
                    onClick={() => setAccentOpen((open) => !open)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[#1d55e5] ${
                      isDark
                        ? "border-slate-700 bg-[#131d33] text-slate-200 hover:bg-slate-800"
                        : "border-slate-200 bg-slate-100/80 text-slate-700 hover:bg-slate-200/70"
                    }`}
                  >
                    <Palette size={14} aria-hidden="true" />
                    <span>{t("accentTab")}</span>
                  </button>

                  {accentOpen && (
                    <div
                      id="resume-accent-picker"
                      role="group"
                      aria-label="Resume accent color"
                      className={`absolute -start-16 top-full z-20 mt-2 grid w-56 grid-cols-4 gap-x-2 gap-y-3 rounded-2xl border p-3 shadow-2xl ${
                        isDark
                          ? "border-slate-700 bg-[#131d33]"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      {accentColors.map(([name, color]) => (
                        <button
                          key={name}
                          type="button"
                          aria-label={`${name} accent`}
                          aria-pressed={accentColor === color}
                          onClick={() => {
                            setAccentColor(color);
                            setAccentOpen(false);
                            accentButton.current?.focus();
                          }}
                          className={`flex cursor-pointer flex-col items-center gap-1 rounded-md text-[10px] focus-visible:outline-2 focus-visible:outline-[#1d55e5] ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          <span
                            style={{ backgroundColor: color }}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition hover:scale-105"
                          >
                            {accentColor === color && (
                              <Check
                                size={17}
                                className="text-white"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step Navigation */}
              <div className="ms-auto flex items-center gap-2">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() =>
                    setStep((previous) => Math.max(0, previous - 1))
                  }
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[#1d55e5] disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDark
                      ? "text-slate-300 hover:bg-slate-800 hover:text-[#60a5fa]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#1d55e5]"
                  }`}
                >
                  {rtl ? (
                    <ChevronRight size={14} aria-hidden="true" />
                  ) : (
                    <ChevronLeft size={14} aria-hidden="true" />
                  )}
                  <span>{t("previousButton")}</span>
                </button>

                <button
                  type="button"
                  disabled={step === steps.length - 1}
                  onClick={() =>
                    setStep((previous) =>
                      Math.min(steps.length - 1, previous + 1),
                    )
                  }
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[#1d55e5] disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDark
                      ? "text-slate-300 hover:bg-slate-800 hover:text-[#60a5fa]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#1d55e5]"
                  }`}
                >
                  <span>{t("nextButton")}</span>
                  {rtl ? (
                    <ChevronLeft size={14} aria-hidden="true" />
                  ) : (
                    <ChevronRight size={14} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <hr
              className={
                isDark ? "border-slate-800" : "border-slate-200"
              }
            />

            {content.importSource?.text && (
              <details
                className={`mt-4 rounded-xl border p-3 text-sm ${
                  isDark
                    ? "border-blue-500/30 bg-[#131d33] text-slate-200"
                    : "border-blue-100 bg-[#edf3ff]/60 text-[#0f172a]"
                }`}
              >
                <summary className="cursor-pointer font-semibold">
                  {rtl
                    ? "مراجعة النص المستورد"
                    : "Review imported source text"}
                </summary>
                <p
                  className={`mt-2 text-xs ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {rtl
                    ? "راجع الحقول وصحح التفاصيل الناقصة أو الموضوعة في القسم الخطأ."
                    : "Review each section. Correct missing details or text placed in the wrong field."}
                </p>
                <pre
                  className={`mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-sans text-xs ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {content.importSource.text}
                </pre>
              </details>
            )}

            {step === 0 && (
              <>
                <h2
                  className={`mt-6 text-lg font-bold ${
                    isDark ? "text-white" : "text-[#0f172a]"
                  }`}
                >
                  {t("personalInformationSection")}
                </h2>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {t("personalInformationSubtitle")}
                </p>
                <div className="mt-4 space-y-4">
                  {personalFields.map((field) => (
                    <div key={field.name}>
                      <label
                        htmlFor={field.name}
                        className={`mb-1.5 block text-sm font-medium ${
                          isDark ? "text-slate-200" : "text-slate-700"
                        }`}
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type || "text"}
                        maxLength={field.maxLength}
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        value={personal[field.name]}
                        onChange={handlePersonalChange}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <div className="mt-6">
                <h2
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-[#0f172a]"
                  }`}
                >
                  {t("professionalSummarySection")}
                </h2>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {t("summaryDescription")}
                </p>
                <label
                  htmlFor="professional-summary"
                  className={`mt-6 mb-2 block text-sm font-medium ${
                    isDark ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {t("summaryLabel")}
                </label>
                <textarea
                  id="professional-summary"
                  rows={8}
                  maxLength={5000}
                  value={content.summary}
                  onChange={(event) => {
                    const value = event.target.value;
                    setContent((previous) => ({ ...previous, summary: value }));
                  }}
                  placeholder={t("summaryPlaceholder")}
                  className={`${inputClass} resize-y`}
                />
                <ImproveSummary
                  summary={content.summary}
                  rtl={rtl}
                  isDark={isDark}
                  onApply={(summary) =>
                    setContent((previous) => ({ ...previous, summary }))
                  }
                />
              </div>
            )}

            {step === 2 && (
              <div className="mt-6">
                <h2
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-[#0f172a]"
                  }`}
                >
                  {t("professionalExperienceSection")}
                </h2>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {t("professionalExperienceSubtitle")}
                </p>
                <div className="mt-6 space-y-5">
                  {content.experience.map((job, index) => (
                    <fieldset key={job.id} className={fieldsetClass}>
                      <legend className="px-1 text-sm font-semibold">
                        {t("experienceLabel")} {index + 1}
                      </legend>
                      {[
                        ["position", t("jobTitleLabel")],
                        ["company", t("companyLabel")],
                        ["location", t("locationLabel")],
                      ].map(([field, label]) => (
                        <div key={field}>
                          <label
                            htmlFor={`${job.id}-${field}`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            {label}
                          </label>
                          <input
                            id={`${job.id}-${field}`}
                            maxLength={150}
                            value={job[field]}
                            onChange={(event) =>
                              updateExperience(
                                job.id,
                                field,
                                event.target.value,
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                      ))}
                      <div>
                        <label
                          htmlFor={`${job.id}-start`}
                          className="mb-1.5 block text-sm font-medium"
                        >
                          {t("startDateLabel")}
                        </label>
                        <input
                          id={`${job.id}-start`}
                          type="month"
                          value={job.startDate}
                          onChange={(event) =>
                            updateExperience(
                              job.id,
                              "startDate",
                              event.target.value,
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={job.isCurrent}
                          onChange={(event) =>
                            updateExperience(
                              job.id,
                              "isCurrent",
                              event.target.checked,
                            )
                          }
                          className="accent-[#1d55e5]"
                        />
                        {t("currentlyWorkHereLabel")}
                      </label>
                      {!job.isCurrent && (
                        <div>
                          <label
                            htmlFor={`${job.id}-end`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            {t("endDateLabel")}
                          </label>
                          <input
                            id={`${job.id}-end`}
                            type="month"
                            min={job.startDate || undefined}
                            value={job.endDate}
                            onChange={(event) =>
                              updateExperience(
                                job.id,
                                "endDate",
                                event.target.value,
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                      )}
                      <div>
                        <label
                          htmlFor={`${job.id}-highlights`}
                          className="mb-1.5 block text-sm font-medium"
                        >
                          {t("responsibilitiesLabel")}
                        </label>
                        <textarea
                          id={`${job.id}-highlights`}
                          rows={5}
                          maxLength={3000}
                          value={job.highlights.join("\n")}
                          onChange={(event) =>
                            updateExperience(
                              job.id,
                              "highlights",
                              event.target.value.split("\n"),
                            )
                          }
                          placeholder={t("responsibilitiesHelpText")}
                          className={`${inputClass} resize-y`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExperience(job.id)}
                        className={`cursor-pointer text-sm font-medium ${
                          isDark
                            ? "text-red-400 hover:text-red-300"
                            : "text-red-600 hover:text-red-800"
                        }`}
                      >
                        {t("removeExperienceButton")} {index + 1}
                      </button>
                    </fieldset>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addExperience}
                  className={dashedAddBtnClass}
                >
                  {t("addExperienceButton")}
                </button>
              </div>
            )}

            {(step === 3 || step === 4) &&
              (() => {
                const education = step === 3;
                const section = education ? "education" : "projects";
                const label = education
                  ? t("educationOrTrainingLabel")
                  : t("projectLabel");
                const fields = education
                  ? [
                      ["qualification", t("qualificationLabel"), "text", 150],
                      ["institution", t("institutionLabel"), "text", 150],
                      ["location", t("locationLabel"), "text", 150],
                    ]
                  : [
                      ["name", t("projectNameLabel"), "text", 150],
                      ["role", t("yourRoleLabel"), "text", 150],
                      ["url", t("projectLinkLabel"), "url", 300],
                    ];

                return (
                  <div className="mt-6">
                    <h2
                      className={`text-lg font-bold ${
                        isDark ? "text-white" : "text-[#0f172a]"
                      }`}
                    >
                      {steps[step]}
                    </h2>
                    <p
                      className={`mt-1 text-sm ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {education
                        ? t("educationTrainingSubtitle")
                        : t("projectsHelpText")}
                    </p>
                    <div className="mt-6 space-y-5">
                      {content[section].map((entry, index) => (
                        <fieldset key={entry.id} className={fieldsetClass}>
                          <legend className="px-1 text-sm font-semibold">
                            {education
                              ? t("educationTrainingSection")
                              : t("projectLabel")}{" "}
                            {index + 1}
                          </legend>
                          {fields.map(([field, fieldTitle, type, maxLength]) => (
                            <div key={field}>
                              <label
                                htmlFor={`${entry.id}-${field}`}
                                className="mb-1.5 block text-sm font-medium"
                              >
                                {fieldTitle}
                              </label>
                              <input
                                id={`${entry.id}-${field}`}
                                type={type}
                                maxLength={maxLength}
                                value={entry[field]}
                                onChange={(event) =>
                                  updateEntry(
                                    section,
                                    entry.id,
                                    field,
                                    event.target.value,
                                  )
                                }
                                className={inputClass}
                              />
                            </div>
                          ))}
                          <div>
                            <label
                              htmlFor={`${entry.id}-start`}
                              className="mb-1.5 block text-sm font-medium"
                            >
                              {t("startDateLabel")}
                            </label>
                            <input
                              id={`${entry.id}-start`}
                              type="month"
                              value={entry.startDate}
                              onChange={(event) =>
                                updateEntry(
                                  section,
                                  entry.id,
                                  "startDate",
                                  event.target.value,
                                )
                              }
                              className={inputClass}
                            />
                          </div>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={entry.isCurrent}
                              onChange={(event) =>
                                updateEntry(
                                  section,
                                  entry.id,
                                  "isCurrent",
                                  event.target.checked,
                                )
                              }
                              className="accent-[#1d55e5]"
                            />
                            {education
                              ? t("currentlyStudyingLabel")
                              : t("ongoingProjectLabel")}
                          </label>
                          {!entry.isCurrent && (
                            <div>
                              <label
                                htmlFor={`${entry.id}-end`}
                                className="mb-1.5 block text-sm font-medium"
                              >
                                {t("endDateLabel")}
                              </label>
                              <input
                                id={`${entry.id}-end`}
                                type="month"
                                min={entry.startDate || undefined}
                                value={entry.endDate}
                                onChange={(event) =>
                                  updateEntry(
                                    section,
                                    entry.id,
                                    "endDate",
                                    event.target.value,
                                  )
                                }
                                className={inputClass}
                              />
                            </div>
                          )}
                          <div>
                            <label
                              htmlFor={`${entry.id}-description`}
                              className="mb-1.5 block text-sm font-medium"
                            >
                              {education
                                ? t("detailsLabel")
                                : t("descriptionAndContributionLabel")}
                            </label>
                            <textarea
                              id={`${entry.id}-description`}
                              rows={4}
                              maxLength={2500}
                              value={entry.description}
                              onChange={(event) =>
                                updateEntry(
                                  section,
                                  entry.id,
                                  "description",
                                  event.target.value,
                                )
                              }
                              className={`${inputClass} resize-y`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEntry(section, entry.id)}
                            className={`cursor-pointer text-sm font-medium ${
                              isDark
                                ? "text-red-400 hover:text-red-300"
                                : "text-red-600 hover:text-red-800"
                            }`}
                          >
                            {t("removeButton")} {label} {index + 1}
                          </button>
                        </fieldset>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addEntry(section)}
                      className={dashedAddBtnClass}
                    >
                      {t("addButton")} {label}
                    </button>
                  </div>
                );
              })()}

            {step === 5 && (
              <div className="mt-6">
                <h2
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-[#0f172a]"
                  }`}
                >
                  {t("skillsSectionTitle")}
                </h2>
                <p
                  className={`mt-1 text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {t("skillsHelpText")}
                </p>
                <div className="mt-6 space-y-5">
                  {content.skills.map((group, index) => (
                    <fieldset key={group.id} className={fieldsetClass}>
                      <legend className="px-1 text-sm font-semibold">
                        {t("skillGroupLabel")} {index + 1}
                      </legend>
                      <div>
                        <label
                          htmlFor={`${group.id}-category`}
                          className="mb-1.5 block text-sm font-medium"
                        >
                          {t("categoryLabel")} ( {t("optionalLabel")} )
                        </label>
                        <input
                          id={`${group.id}-category`}
                          maxLength={100}
                          value={group.category}
                          onChange={(event) =>
                            updateEntry(
                              "skills",
                              group.id,
                              "category",
                              event.target.value,
                            )
                          }
                          placeholder={t("programmingBackendExample")}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`${group.id}-items`}
                          className="mb-1.5 block text-sm font-medium"
                        >
                          {t("skillsSectionTitle")}
                        </label>
                        <textarea
                          id={`${group.id}-items`}
                          rows={3}
                          maxLength={1000}
                          value={group.items}
                          onChange={(event) =>
                            updateEntry(
                              "skills",
                              group.id,
                              "items",
                              event.target.value,
                            )
                          }
                          placeholder="JavaScript, Python, Node.js, Express"
                          className={`${inputClass} resize-y`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEntry("skills", group.id)}
                        className={`cursor-pointer text-sm font-medium ${
                          isDark
                            ? "text-red-400 hover:text-red-300"
                            : "text-red-600 hover:text-red-800"
                        }`}
                      >
                        {t("removeSkillGroupButton")} {index + 1}
                      </button>
                    </fieldset>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSkillGroup}
                  className={dashedAddBtnClass}
                >
                  {t("addSkillGroupButton")}
                </button>
              </div>
            )}
          </section>

          {/* Right Scrollable Paper Preview */}
          <div
            tabIndex={0}
            role="region"
            aria-label={
              rtl
                ? "معاينة السيرة الذاتية القابلة للتمرير"
                : "Scrollable resume preview"
            }
            className="min-h-0 min-w-0 overflow-y-auto overscroll-contain lg:col-span-3"
          >
            <section
              id="resume-preview"
              aria-label="Resume preview"
              className={`min-w-0 border bg-white text-slate-900 lg:col-span-3 ${
                isDark
                  ? "border-slate-800 shadow-2xl"
                  : "border-slate-200/90 shadow-sm"
              }`}
            >
              {currentTemplate === "executive" ? (
                <ExecutiveTemplate
                  content={content}
                  accentColor={accentColor}
                  t={t}
                  presentLabel={presentLabel}
                  contactDetails={contactDetails}
                  hasEntryContent={hasEntryContent}
                />
              ) : currentTemplate === "modern" ? (
                <ModernTemplate
                  content={content}
                  accentColor={accentColor}
                  t={t}
                  presentLabel={presentLabel}
                  contactDetails={contactDetails}
                  hasEntryContent={hasEntryContent}
                />
              ) : (
                <ClassicTemplate
                  content={content}
                  accentColor={accentColor}
                  t={t}
                  presentLabel={presentLabel}
                  contactDetails={contactDetails}
                  hasEntryContent={hasEntryContent}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Builder;
