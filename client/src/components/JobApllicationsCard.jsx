import { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { ArrowUpRight, Building, CalendarDays, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LOGO_DEV_KEY = import.meta.env.VITE_LOGO_DEV_KEY;

function CompanyLogo({ job, isDark }) {
  const companyName = String(job?.company_name ?? "").trim();
  const [failedFor, setFailedFor] = useState(null);

  if (!LOGO_DEV_KEY || !companyName || failedFor === companyName) {
    return (
      <span
        className={`text-sm font-bold uppercase ${
          isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
        }`}
        aria-hidden="true"
      >
        {companyName ? companyName.charAt(0) : <Building size={18} />}
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

const JobApllicationsCard = ({ id, job, index, isDark = false }) => {
  const navigate = useNavigate();
  const { ref, isDragging } = useSortable({
    id,
    index,
    group: job.status,
  });

  return (
    <div
      ref={ref}
      className={`relative mt-3 box-border w-full touch-none select-none rounded-xl border p-3.5 transition-all duration-150 ${
        isDark
          ? "border-slate-800/90 bg-[#131d33] text-slate-100 hover:border-blue-500/40"
          : "border-slate-200/90 bg-white text-[#0f172a] hover:border-blue-300/80"
      } ${
        isDragging
          ? "z-50 scale-[1.02] cursor-grabbing opacity-75 shadow-2xl ring-2 ring-[#1d55e5]"
          : "cursor-grab shadow-xs"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 items-center">
          <div
            className={`grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ${
              isDark
                ? "bg-[#0f1628] ring-slate-700"
                : "bg-white shadow-xs ring-slate-100"
            }`}
          >
            <CompanyLogo job={job} isDark={isDark} />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                title={job.job_title}
                className={`truncate text-sm font-bold leading-5 ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
              >
                {job.job_title || "Job title not provided"}
              </h3>
              <div
                className={`mt-0.5 flex items-center gap-1 text-xs ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Building size={13} className="shrink-0" />
                <p title={job.company_name} className="truncate">
                  {job.company_name}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label={`Open application for ${job.company_name}`}
              title="Open application"
              onPointerDown={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/job-tracker/${id}`);
              }}
              className={`grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#1d55e5] ${
                isDark
                  ? "text-slate-400 hover:bg-[#182747] hover:text-[#60a5fa]"
                  : "text-slate-400 hover:bg-[#edf3ff] hover:text-[#1d55e5]"
              }`}
            >
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div
            className={`mt-2 flex items-center gap-1 text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <MapPin size={13} className="shrink-0" />
            <span className="min-w-0 truncate">
              {job.location || "Location not provided"}
            </span>
          </div>

          <p
            className={`mt-1 flex items-center gap-1 text-xs ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <CalendarDays size={13} className="shrink-0" />
            <span>
              {job.created_at
                ? String(job.created_at).slice(0, 10)
                : "Date not provided"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobApllicationsCard;
