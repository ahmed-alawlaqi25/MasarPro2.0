import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ExternalLink,
  FileText,
  Link2,
  LoaderCircle,
  MapPin,
  StickyNote,
  Trash2,
  UserRound,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthContext";
import { useJob } from "../components/JopContext";
import { useTranslation } from "react-i18next";

const statuses = ["wishlist", "applied", "interview", "offer", "accepted"];
const statusKeys = [
  "wishListStatus",
  "appliedStatus",
  "interviewStatus",
  "offerStatus",
  "acceptStatus",
];
const LOGO_DEV_KEY = import.meta.env.VITE_LOGO_DEV_KEY;

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

function CompanyLogo({ job, isDark = false }) {
  const companyName = String(job?.company_name ?? "").trim();
  const [failedFor, setFailedFor] = useState(null);

  if (!LOGO_DEV_KEY || !companyName || failedFor === companyName) {
    return (
      <span
        className={`text-base font-bold uppercase ${
          isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
        }`}
        aria-hidden="true"
      >
        {companyName ? companyName.charAt(0) : <Building2 size={20} />}
      </span>
    );
  }

  return (
    <img
      src={`https://img.logo.dev/name/${encodeURIComponent(companyName)}?token=${encodeURIComponent(LOGO_DEV_KEY)}`}
      alt={`${companyName} logo`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailedFor(companyName)}
      className="h-full w-full rounded-full object-cover"
    />
  );
}

const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

const JobDetails = ({ applicationID, userId, isDark = false }) => {
  const { setJobs } = useJob();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const [saved, setSaved] = useState(false);
  const busy = useRef(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [{ data, error: queryError }, { data: resumesData }] =
          await Promise.all([
            supabase
              .from("jobs")
              .select("*")
              .eq("job_id", applicationID)
              .eq("user_id", userId)
              .maybeSingle(),
            supabase
              .from("resumes")
              .select("resume_id, title")
              .eq("user_id", userId)
              .order("updated_at", { ascending: false }),
          ]);
        if (queryError) throw queryError;
        if (active) {
          setJob(data);
          setResumes(resumesData ?? []);
          setNotes(data?.notes ?? "");
        }
      } catch (queryError) {
        if (active) setLoadError(queryError.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [applicationID, userId]);

  const updateJob = async (changes, action) => {
    if (busy.current) return;
    busy.current = true;
    setPending(action);
    setError("");
    setSaved(false);
    try {
      const { data, error: updateError } = await supabase
        .from("jobs")
        .update(changes)
        .eq("job_id", applicationID)
        .eq("user_id", userId)
        .select("*")
        .single();
      if (updateError) throw updateError;
      setJob(data);
      setJobs((current) =>
        current.map((item) =>
          String(item.id) === String(applicationID)
            ? { ...item, ...changes }
            : item,
        ),
      );
      if (action === "notes") setSaved(true);
    } catch (updateError) {
      setError(updateError.message || "Unable to save changes.");
    } finally {
      busy.current = false;
      setPending("");
    }
  };

  const deleteJob = async () => {
    if (busy.current) return;
    busy.current = true;
    setPending("delete");
    setError("");
    try {
      const { error: deleteError } = await supabase
        .from("jobs")
        .delete()
        .eq("job_id", applicationID)
        .eq("user_id", userId)
        .select("job_id")
        .single();
      if (deleteError) throw deleteError;
      setJobs((current) =>
        current.filter((item) => String(item.id) !== String(applicationID)),
      );
      navigate("/job-tracker", { replace: true });
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete the application.");
    } finally {
      busy.current = false;
      setPending("");
    }
  };

  const pageSurfaceClass = `min-h-[calc(100vh-73px)] px-4 py-6 transition-colors duration-300 sm:px-8 lg:py-8 ${
    isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
  }`;

  if (loading) {
    return (
      <section className={pageSurfaceClass}>
        <div className="mx-auto flex max-w-[1280px] items-center gap-2.5 p-6 text-sm text-slate-400">
          <LoaderCircle className="h-4 w-4 animate-spin text-[#1d55e5]" />
          <p role="status">Loading application...</p>
        </div>
      </section>
    );
  }

  if (loadError || !job) {
    return (
      <section className={pageSurfaceClass}>
        <div className="mx-auto max-w-[1280px] p-6">
          <p
            role="alert"
            className={`mb-4 rounded-xl border p-3.5 text-sm ${
              isDark
                ? "border-red-500/30 bg-red-950/50 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {loadError || "Application not found or unavailable."}
          </p>
          <Link
            to="/job-tracker"
            className={`text-sm font-semibold underline ${
              isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
            }`}
          >
            {t("backToJobTracker")}
          </Link>
        </div>
      </section>
    );
  }

  const jobUrl = safeUrl(job.job_url);
  const description = job.job_description || job.description;
  const status = String(job.status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  const dirty = notes !== (job.notes ?? "");

  const panelClass = `rounded-2xl border p-4 transition-colors duration-300 sm:p-5 ${
    isDark
      ? "border-slate-800/90 bg-[#0f1628] shadow-[0_14px_34px_-15px_rgba(0,0,0,0.4)]"
      : "border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
  }`;

  const fieldClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 disabled:opacity-60 ${
    isDark
      ? "border-slate-800 bg-[#0a101d] text-slate-100 placeholder:text-slate-500 focus:border-[#4f8ff7] focus:bg-[#0d1424] focus:ring-blue-500/15"
      : "border-slate-200 bg-[#f8fbff] text-[#0f172a] placeholder:text-slate-400 focus:border-[#1d55e5] focus:bg-white focus:ring-blue-500/10"
  }`;

  const iconAccent = isDark ? "text-[#60a5fa]" : "text-[#1d55e5]";
  const statusNoteClass = `text-xs font-medium ${
    isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
  }`;

  return (
    <section className={pageSurfaceClass}>
      <div
        className={`mx-auto max-w-[1280px] rounded-3xl border p-4 transition-colors duration-300 sm:p-6 ${
          isDark
            ? "border-slate-800/90 bg-[#0d1424]/90 shadow-[0_20px_50px_-20px_rgba(29,85,229,0.22)]"
            : "border-slate-200/90 bg-white/90 shadow-[0_14px_40px_-18px_rgba(37,99,235,0.08)]"
        }`}
      >
        <Link
          to="/job-tracker"
          className={`mb-5 inline-flex items-center gap-2 text-sm font-medium transition ${
            isDark
              ? "text-slate-400 hover:text-[#60a5fa]"
              : "text-slate-500 hover:text-[#1d55e5]"
          }`}
        >
          {i18n.dir() !== "rtl" ? (
            <ArrowLeft size={16} />
          ) : (
            <ArrowRight size={16} />
          )}
          <span>{t("backToJobTracker")}</span>
        </Link>

        <header className="mb-5">
          <span
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
              isDark
                ? "border-blue-500/30 bg-[#172544] text-[#60a5fa]"
                : "border-blue-200/80 bg-[#edf3ff] text-[#1d55e5]"
            }`}
          >
            <FileText size={16} />
            <span>{t("applicationDetailsTitle")}</span>
          </span>
          <h1
            className={`mt-3 break-words text-xl font-extrabold tracking-tight sm:text-2xl ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {job.job_title || "Untitled application"}
          </h1>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex min-w-0 flex-col gap-4">
            {/* Company Details Card */}
            <section className={panelClass} aria-label="Company details">
              <div className="grid gap-4 sm:grid-cols-2">
                <dl
                  className={`min-w-0 space-y-4 border-b pb-4 text-sm sm:border-e sm:border-b-0 sm:pe-4 sm:pb-0 ${
                    isDark
                      ? "border-slate-800/80 text-slate-400"
                      : "border-slate-100 text-slate-500"
                  }`}
                >
                  <div className="flex h-7 items-center">
                    <dt className="flex items-center gap-2.5 font-medium">
                      <Building2 size={17} className={iconAccent} />
                      <span>{t("companyNameLabel")}</span>
                    </dt>
                  </div>
                  <div className="flex h-5 items-center">
                    <dt className="flex items-center gap-2.5 font-medium">
                      <MapPin size={17} className={iconAccent} />
                      <span>{t("locationLabel")}</span>
                    </dt>
                  </div>
                  <div className="flex h-5 items-center">
                    <dt className="flex items-center gap-2.5 font-medium">
                      <CalendarDays size={17} className={iconAccent} />
                      <span>{t("applicationDateLabel")}</span>
                    </dt>
                  </div>
                  <div className="flex h-5 items-center">
                    <dt className="flex items-center gap-2.5 font-medium">
                      <Link2 size={17} className={iconAccent} />
                      <span>{t("jobLinkLabel")}</span>
                    </dt>
                  </div>
                </dl>

                <div className="flex min-w-0 items-center justify-between gap-4 sm:ps-2">
                  <div className="min-w-0 flex-1 space-y-4">
                    <div className="flex h-7 items-center">
                      <p
                        className={`truncate text-base font-bold sm:text-lg ${
                          isDark ? "text-white" : "text-[#0f172a]"
                        }`}
                      >
                        {job.company_name || "Company not provided"}
                      </p>
                    </div>
                    <div className="flex h-5 items-center">
                      <p
                        className={`truncate text-sm ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {job.location || "Location not provided"}
                      </p>
                    </div>
                    <div className="flex h-5 items-center">
                      <dd
                        className={`text-sm ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        <time dateTime={job.created_at || undefined}>
                          {job.created_at
                            ? String(job.created_at).slice(0, 10)
                            : "Not provided"}
                        </time>
                      </dd>
                    </div>
                    <div className="flex h-5 items-center">
                      {jobUrl ? (
                        <a
                          href={jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 truncate text-sm font-medium hover:underline ${
                            isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
                          }`}
                        >
                          <ExternalLink size={15} className="shrink-0" />
                          <span className="truncate">
                            {new URL(jobUrl).hostname}
                          </span>
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className={`mb-10 me-2 grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full text-2xl font-bold ring-2 ${
                      isDark
                        ? "bg-[#172544] text-[#60a5fa] ring-slate-700"
                        : "bg-[#edf3ff] text-[#1d55e5] ring-blue-100"
                    }`}
                  >
                    <CompanyLogo job={job} isDark={isDark} />
                  </div>
                </div>
              </div>
            </section>

            {/* Job Description Card */}
            <section className={`${panelClass} flex-1`}>
              <h2
                className={`mb-4 flex items-center gap-2.5 text-base font-bold sm:text-lg ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
              >
                <FileText size={20} className={iconAccent} />
                <span>{t("jobDescriptionLabel")}</span>
              </h2>
              <p
                dir="auto"
                className={`whitespace-pre-wrap break-words text-sm leading-6 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {description || t("noJobDescriptionAdded")}
              </p>
            </section>
          </div>

          {/* Right Column: Status, Resume & Notes */}
          <section className={`${panelClass} flex min-w-0 flex-col`}>
            <label
              htmlFor="application-status"
              className={`mb-3 flex items-center gap-2.5 text-base font-bold sm:text-lg ${
                isDark ? "text-white" : "text-[#0f172a]"
              }`}
            >
              <BriefcaseBusiness size={20} className={iconAccent} />
              <span>{t("applicationStatusLabel")}</span>
            </label>
            <select
              id="application-status"
              value={status}
              disabled={Boolean(pending)}
              onChange={(event) =>
                updateJob({ status: event.target.value }, "status")
              }
              className={fieldClass}
            >
              {!statuses.includes(status) && (
                <option value={status}>{job.status || "Select status"}</option>
              )}
              {statuses.map((value, index) => (
                <option key={value} value={value}>
                  {t(statusKeys[index])}
                </option>
              ))}
            </select>
            {pending === "status" && (
              <p role="status" className={`mt-2 ${statusNoteClass}`}>
                {t("savingStatus")}
              </p>
            )}

            <div
              className={`my-6 border-t ${
                isDark ? "border-slate-800/80" : "border-slate-100"
              }`}
            />

            <div className="mb-3 flex items-center justify-between gap-3">
              <label
                htmlFor="application-resume"
                className={`flex items-center gap-2.5 text-base font-bold sm:text-lg ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
              >
                <UserRound size={20} className={iconAccent} />
                <span>{t("resumeTitle")}</span>
              </label>
              {job.resume_id && (
                <Link
                  to={`/resume-builder/${job.resume_id}`}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline sm:text-sm ${
                    isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
                  }`}
                >
                  <span>{t("openResumeLink")}</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </Link>
              )}
            </div>

            <select
              id="application-resume"
              value={job.resume_id ?? ""}
              disabled={Boolean(pending)}
              onChange={(event) =>
                updateJob(
                  { resume_id: event.target.value || null },
                  "resume",
                )
              }
              className={fieldClass}
            >
              <option value="">{t("noResumeAttached")}</option>
              {resumes.map((resume) => (
                <option key={resume.resume_id} value={resume.resume_id}>
                  {resume.title}
                </option>
              ))}
            </select>
            {pending === "resume" && (
              <p role="status" className={`mt-2 ${statusNoteClass}`}>
                {t("savingResume")}
              </p>
            )}

            <form
              className="mt-7 flex flex-1 flex-col"
              onSubmit={(event) => {
                event.preventDefault();
                updateJob({ notes: notes.slice(0, 5000) }, "notes");
              }}
            >
              <label
                htmlFor="application-notes"
                className={`mb-3 flex items-center gap-2.5 text-base font-bold sm:text-lg ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
              >
                <StickyNote size={20} className={iconAccent} />
                <span>{t("notesTitle")}</span>
              </label>
              <textarea
                id="application-notes"
                maxLength={5000}
                value={notes}
                disabled={Boolean(pending)}
                onChange={(event) => {
                  setNotes(event.target.value);
                  setSaved(false);
                }}
                placeholder={t("addNotesPlaceholder")}
                rows={5}
                className={`${fieldClass} min-h-32 flex-1 resize-y p-4 leading-6`}
              />
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
                <span role="status" className={statusNoteClass}>
                  {saved
                    ? t("notesSaved")
                    : dirty
                      ? t("unsavedChanges")
                      : ""}
                </span>
                <button
                  type="submit"
                  disabled={!dirty || Boolean(pending)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1d55e5] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1746c4] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                >
                  <Check size={16} />
                  <span>
                    {pending === "notes"
                      ? t("savingNotes")
                      : t("saveNotesButton")}
                  </span>
                </button>
              </div>
            </form>
          </section>
        </div>

        {error && (
          <p
            role="alert"
            className={`mt-5 rounded-xl border p-3.5 text-sm ${
              isDark
                ? "border-red-500/30 bg-red-950/50 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </p>
        )}

        <footer className="mt-6 flex justify-start">
          <button
            type="button"
            disabled={Boolean(pending)}
            onClick={deleteJob}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-semibold transition disabled:opacity-50 sm:text-sm ${
              isDark
                ? "border-red-500/30 bg-red-950/50 text-red-400 hover:border-red-500/50 hover:bg-red-900/50"
                : "border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100"
            }`}
          >
            <Trash2 size={17} />
            <span>
              {pending === "delete"
                ? t("deletingApplication")
                : t("deleteApplicationButton")}
            </span>
          </button>
        </footer>
      </div>
    </section>
  );
};

const JobApplication = () => {
  const { applicationID } = useParams();
  const { session, loading } = useAuth();
  const { t } = useTranslation();
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
        <p role="status">{t("loadingApplications")}</p>
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
        {t("loginMain")}
      </Link>
    );
  }

  return (
    <JobDetails
      key={session.user.id + ":" + applicationID}
      applicationID={applicationID}
      userId={session.user.id}
      isDark={isDark}
    />
  );
};

export default JobApplication;
