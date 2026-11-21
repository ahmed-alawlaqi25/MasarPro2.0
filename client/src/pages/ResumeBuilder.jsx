import { CloudUpload, Plus, Search, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ResumeCard from "../components/ResumeCard";
import ImportResumeDialog from "../components/ImportResumeDialog";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

const ResumeBuilder = () => {
  const { session } = useAuth();
  const [isDark, setIsDark] = useState(getInitialTheme);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [resumeError, setResumeError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const deleting = useRef(false);
  const userId = session?.user?.id;

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

  useEffect(() => {
    let active = true;

    const fetchResumes = async () => {
      setResumes([]);
      setResumeError("");

      if (!userId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from("resumes")
          .select(
            "resume_id, title, updated_at, personal:content->personal, accentColor:content->>accentColor",
          )
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });

        if (fetchError) throw fetchError;

        if (active) setResumes(data ?? []);
      } catch (err) {
        if (active) {
          setResumeError(err.message || "Unable to load resumes.");
        }
      }
    };

    fetchResumes();

    return () => {
      active = false;
    };
  }, [userId]);

  const navigate = useNavigate();

  const createResume = async (event) => {
    event.preventDefault();
    if (creating) return;
    setError("");

    if (!session?.user?.id) {
      setError("Please sign in before creating a resume.");
      return;
    }

    if (!title.trim()) {
      setError("Enter a resume title.");
      return;
    }

    setCreating(true);

    try {
      const { data, error: insertError } = await supabase
        .from("resumes")
        .insert({
          user_id: session.user.id,
          title: title.trim().slice(0, 120),
          content: {},
        })
        .select("resume_id")
        .single();

      if (insertError) throw insertError;

      setShowCreateResume(false);
      setTitle("");
      navigate(`/resume-builder/${data.resume_id}`);
    } catch (err) {
      setError(err.message || "Unable to create your resume.");
    } finally {
      setCreating(false);
    }
  };

  const deleteResume = async (resume) => {
    if (!userId || deleting.current) return;
    if (
      !window.confirm(
        isRtl
          ? `حذف «${resume.title}» نهائياً؟ لا يمكن التراجع عن الحذف.`
          : `Permanently delete "${resume.title}"? This cannot be undone.`,
      )
    )
      return;
    deleting.current = true;
    setDeletingId(resume.resume_id);
    setResumeError("");
    try {
      const { data, error: delError } = await supabase
        .from("resumes")
        .delete()
        .eq("resume_id", resume.resume_id)
        .eq("user_id", userId)
        .select("resume_id")
        .single();
      if (delError || !data) throw new Error("Delete failed");
      setResumes((previous) =>
        previous.filter((item) => item.resume_id !== resume.resume_id),
      );
    } catch {
      setResumeError(
        isRtl
          ? "تعذر حذف السيرة. تحقق من الاتصال وصلاحية الحذف ثم حاول مجدداً."
          : "Unable to delete the resume. Check your connection and delete permissions, then retry.",
      );
    } finally {
      deleting.current = false;
      setDeletingId(null);
    }
  };

  const query = search.trim().toLocaleLowerCase();
  const filteredResumes = resumes.filter((resume) =>
    [resume.title, resume.personal?.fullName].some((value) =>
      (typeof value === "string" ? value : "")
        .toLocaleLowerCase()
        .includes(query),
    ),
  );

  const renderResumes = () =>
    filteredResumes.map((resume) => (
      <ResumeCard
        key={resume.resume_id}
        id={resume.resume_id}
        resume={resume}
        isDark={isDark}
        deleting={deletingId === resume.resume_id}
        onDelete={deletingId ? undefined : () => void deleteResume(resume)}
        onDownload={() =>
          navigate(`/resume-builder/${resume.resume_id}?download=pdf`)
        }
        onEdit={() => navigate(`/resume-builder/${resume.resume_id}`)}
      />
    ));

  return (
    <section
      className={`min-h-[calc(100vh-73px)] px-6 py-10 transition-colors duration-300 sm:px-10 lg:px-16 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      <div className="mb-8">
        <h1
          className={`text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl ${
            isDark ? "text-white" : "text-[#0f172a]"
          }`}
        >
          {t("resumeBuilderTitle")}
        </h1>
        <p
          className={`mt-1.5 text-sm sm:text-base ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t("resumeBuilderSubtitle")}
        </p>
      </div>

      {/* Create & Upload Cards */}
      <div className="mb-8 flex flex-col items-center gap-5 sm:flex-row">
        <button
          type="button"
          onClick={() => setShowCreateResume(true)}
          className={`flex h-48 w-full max-w-[18.5rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center transition-all duration-200 hover:-translate-y-0.5 ${
            isDark
              ? "border-blue-500/40 bg-[#0f1628] shadow-md hover:border-[#60a5fa] hover:bg-[#131d33]"
              : "border-blue-400/80 bg-white shadow-xs hover:border-[#1d55e5] hover:bg-blue-50/40"
          }`}
        >
          <div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${
              isDark
                ? "border-blue-500/30 bg-[#172544] text-[#60a5fa]"
                : "border-blue-200/80 bg-[#edf3ff] text-[#1d55e5]"
            }`}
          >
            <Plus size={32} strokeWidth={1.8} />
          </div>
          <p
            className={`mt-3 text-lg font-bold ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {t("createResumeButton")}
          </p>
          <p
            className={`mt-1 text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {t("startWithBlankResume")}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setShowUploadResume(true)}
          className={`flex h-48 w-full max-w-[18.5rem] cursor-pointer flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all duration-200 hover:-translate-y-0.5 ${
            isDark
              ? "border-slate-800/90 bg-[#0f1628] shadow-md hover:border-blue-500/50 hover:bg-[#131d33]"
              : "border-slate-200/90 bg-white shadow-xs hover:border-blue-300 hover:shadow-md"
          }`}
        >
          <div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${
              isDark
                ? "border-blue-500/30 bg-[#172544] text-[#60a5fa]"
                : "border-blue-200/80 bg-[#edf3ff] text-[#1d55e5]"
            }`}
          >
            <CloudUpload size={32} strokeWidth={1.8} />
          </div>
          <p
            className={`mt-3 text-lg font-bold ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {t("uploadExisting")}
          </p>
          <p
            className={`mt-1 text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {t("importYourResume")}
          </p>
        </button>
      </div>

      <hr
        className={`mb-7 ${
          isDark ? "border-slate-800/80" : "border-slate-200/80"
        }`}
      />

      {/* Toolbar: Count & Search */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h2
            className={`text-lg font-bold sm:text-xl ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {t("yourResumesTitle")}
          </h2>
          <span
            className={`flex h-6 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${
              isDark
                ? "bg-[#172544] text-[#60a5fa]"
                : "bg-[#edf3ff] text-[#1d55e5]"
            }`}
          >
            {filteredResumes.length}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={
              isRtl
                ? "ابحث بعنوان السيرة أو الاسم"
                : "Search by resume title or name"
            }
            placeholder={t("searchResumePlaceholder")}
            className={`h-11 w-full rounded-xl border ps-10 pe-4 text-sm outline-none transition focus:ring-4 [&::-webkit-search-cancel-button]:appearance-none ${
              isDark
                ? "border-slate-800 bg-[#0f1628] text-slate-100 placeholder:text-slate-500 focus:border-[#4f8ff7] focus:ring-blue-500/15"
                : "border-slate-200/90 bg-white text-[#0f172a] placeholder:text-slate-400 focus:border-[#1d55e5] focus:ring-blue-500/10 shadow-xs"
            }`}
          />
        </div>
      </div>

      {showUploadResume && (
        <ImportResumeDialog
          key={userId}
          userId={userId}
          isDark={isDark}
          onClose={() => setShowUploadResume(false)}
          onImported={(resumeId) => {
            setShowUploadResume(false);
            navigate(`/resume-builder/${resumeId}`);
          }}
        />
      )}

      {showCreateResume && (
        <form
          onSubmit={createResume}
          onClick={() => {
            setShowCreateResume(false);
            setTitle("");
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? "border-slate-800 bg-[#0f1628] text-slate-100"
                : "border-slate-200 bg-white text-[#0f172a]"
            }`}
          >
            <h2
              className={`mb-4 text-xl font-extrabold tracking-tight ${
                isDark ? "text-white" : "text-[#0f172a]"
              }`}
            >
              {t("createResumeButton")}
            </h2>
            <input
              type="text"
              maxLength={120}
              placeholder={t("enterResumeTitlePlaceholder")}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              autoFocus
              className={`mb-4 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-4 ${
                isDark
                  ? "border-slate-800 bg-[#0a101d] text-slate-100 placeholder:text-slate-500 focus:border-[#4f8ff7] focus:ring-blue-500/15"
                  : "border-slate-200 bg-[#f8fbff] text-[#0f172a] placeholder:text-slate-400 focus:border-[#1d55e5] focus:bg-white focus:ring-blue-500/10"
              }`}
            />
            {error && (
              <p
                role="alert"
                className={`mb-3 rounded-xl border p-2.5 text-xs ${
                  isDark
                    ? "border-red-500/30 bg-red-950/50 text-red-300"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={creating}
              className="w-full cursor-pointer rounded-xl bg-[#1d55e5] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1746c4] disabled:opacity-50"
            >
              {creating ? t("creatingResumeLoading") : t("createResumeButton")}
            </button>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => {
                setShowCreateResume(false);
                setTitle("");
              }}
              className={`absolute end-4 top-4 cursor-pointer rounded-lg p-1 transition ${
                isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              <XIcon size={20} />
            </button>
          </div>
        </form>
      )}

      {resumeError && (
        <p
          role="alert"
          className={`mb-5 rounded-xl border p-3.5 text-sm ${
            isDark
              ? "border-red-500/30 bg-red-950/50 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {resumeError}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-8">
        {renderResumes()}
      </div>

      {query && filteredResumes.length === 0 && (
        <p
          role="status"
          className={`py-8 text-center text-sm ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {isRtl
            ? "لا توجد سير ذاتية مطابقة للبحث."
            : "No resumes match your search."}
        </p>
      )}
    </section>
  );
};

export default ResumeBuilder;
