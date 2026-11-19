import { useEffect, useState } from "react";
import Card from "../components/Card";
import {
  BadgeCheck,
  FileText,
  Heart,
  LoaderCircle,
  Plus,
  Search,
  Send,
  UserRoundGroup,
  X,
} from "lucide-react";
import KanbanBoard from "../components/KanbanBoard";
import JobApplicationForm from "../components/JobApplicationForm";
import { useJob } from "../components/JopContext";
import { useTranslation } from "react-i18next";

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

const JobTracker = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const { jobs, setJobs, loading, error } = useJob();

  const [isDark, setIsDark] = useState(getInitialTheme);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const getJobCount = (columnId) =>
    jobs.filter((job) => job.status === columnId).length;

  return (
    <section
      className={`min-h-[calc(100vh-73px)] transition-colors duration-300 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      <div className="px-4 pt-6 md:px-10">
        {/* Top Row: Title & Add Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1
              className={`text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl ${
                isDark ? "text-white" : "text-[#0f172a]"
              }`}
            >
              {t("jobTracker")}
            </h1>
            <p
              className={`mt-1 text-xs leading-relaxed sm:text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {t("trackApplicationsDescription")}
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            type="button"
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#1d55e5] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1746c4] sm:px-6 sm:text-sm"
          >
            <Plus aria-hidden="true" className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
            <span>{t("addNewJobButton")}</span>
          </button>
        </div>

        {/* Second Row: Summary Status Cards & Search Input */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="hidden flex-wrap items-center gap-2.5 md:flex">
            <Card
              icon={<Heart fill="currentColor" />}
              count={getJobCount("wishlist")}
              text={t("wishListStatus")}
              bgColor="gray"
              textColor="gray"
              isDark={isDark}
            />
            <Card
              icon={<Send />}
              count={getJobCount("applied")}
              text={t("appliedStatus")}
              bgColor="blue"
              textColor="blue"
              isDark={isDark}
            />
            <Card
              icon={<UserRoundGroup />}
              count={getJobCount("interview")}
              text={t("interviewStatus")}
              bgColor="orange"
              textColor="orange"
              isDark={isDark}
            />
            <Card
              icon={<FileText />}
              count={getJobCount("offer")}
              text={t("offerStatus")}
              bgColor="violet"
              textColor="violet"
              isDark={isDark}
            />
            <Card
              icon={<BadgeCheck />}
              count={getJobCount("accepted")}
              text={t("acceptStatus")}
              bgColor="green"
              textColor="green"
              isDark={isDark}
            />
          </div>

          <div
            className={`relative flex w-full md:w-80 ${
              isRtl ? "md:mr-auto" : "md:ml-auto"
            }`}
          >
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              aria-label="Search applications by company or job title"
              placeholder={t("searchCompanyOrJobTitlePlaceholder")}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={`h-12 w-full rounded-xl border ps-10 pe-10 text-sm outline-none transition focus:ring-4 [&::-webkit-search-cancel-button]:appearance-none ${
                isDark
                  ? "border-slate-800 bg-[#0f1628] text-slate-100 placeholder:text-slate-500 focus:border-[#4f8ff7] focus:ring-blue-500/15"
                  : "border-slate-200/90 bg-white text-[#0f172a] placeholder:text-slate-400 focus:border-[#1d55e5] focus:ring-blue-500/10 shadow-xs"
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className={`absolute end-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-lg transition ${
                  isDark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="mx-4 mt-4 flex items-center gap-2 text-sm text-slate-400 md:mx-10" role="status">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#1d55e5]" />
          <span>{t("loadingApplications")}</span>
        </div>
      )}

      {error && (
        <p
          className={`mx-4 mt-4 rounded-xl border p-3 text-sm md:mx-10 ${
            isDark
              ? "border-red-500/30 bg-red-950/50 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="alert"
        >
          {t("unableToLoadApplications")} {error}
        </p>
      )}

      <KanbanBoard
        jobs={jobs}
        setJobs={setJobs}
        searchQuery={searchQuery}
        isDark={isDark}
      />

      {isFormOpen && (
        <JobApplicationForm
          onClose={() => setIsFormOpen(false)}
          isDark={isDark}
        />
      )}
    </section>
  );
};

export default JobTracker;
