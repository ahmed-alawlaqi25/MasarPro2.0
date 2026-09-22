import {useSortable} from '@dnd-kit/react/sortable';
import { CalendarDays, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';







const JobApllicationsCard = ({ id, job, index }) => {

  const navigate = useNavigate();
  const {ref, isDragging} = useSortable({
    id,
    index,
    group: job.status,
  });
  return (
    <div
      
      ref={ref}
      className={`relative box-border mt-4 w-[98%] touch-none select-none rounded-2xl border border-slate-200 bg-white p-3 transition-[opacity,box-shadow,scale] duration-150 ${
        isDragging
          ? 'z-50 cursor-grabbing scale-[1.02] opacity-70 shadow-2xl ring-2 ring-sky-400'
          : 'cursor-grab shadow-[0_3px_14px_rgba(15,23,42,0.08)]'
      }`}
    > 
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white shadow-[0_1px_5px_rgba(15,23,42,0.12)] ring-1 ring-slate-100">
        {/* //logo// */}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 title={job.job_title} className="truncate text-[15px] font-bold leading-5 text-black">
                {job.job_title || 'Job title not provided'}
              </h3>
              <p title={job.company_name} className="truncate text-sm mt-1 leading-4 text-slate-500">
                {job.company_name}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
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
              className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-[#e7f5f5] hover:text-[#278d8a] focus-visible:outline-2 focus-visible:outline-[#278d8a]"
            >
              <ArrowUpRight size={18} />
            </button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 5.25-7.5 10.5-7.5 10.5s-7.5-5.25-7.5-10.5a7.5 7.5 0 1 1 15 0Z"
              />
              <circle cx="12" cy="10.5" r="2.25" />
            </svg>
            
            <span className="min-w-0 break-words">{job.location || 'Location not provided'}</span>
          </div>

          <p  className=" flex items-center gap-1 mt-2 text-sm text-slate-400">
          <CalendarDays width="16" className="shrink-0" />
          <span>{job.created_at ? String(job.created_at).slice(0, 10) : 'Date not provided'}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default JobApllicationsCard
