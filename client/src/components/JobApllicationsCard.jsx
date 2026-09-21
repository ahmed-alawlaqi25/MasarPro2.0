import {useDraggable} from '@dnd-kit/react';
import { CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const JobApllicationsCard = ({ id }) => {

  const navigate = useNavigate();
  const {ref, isDragging} = useDraggable({
    id,
  });
  return (
    <div
      onClick={() => navigate(id)}
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
              <h3 className="truncate text-[15px] font-bold leading-5 text-slate-900">
                Senior DevOps Engineer
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-500">Google</p>
            </div>

            <button
              type="button"
              aria-label="Save job"
              className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >

            </button>
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
            <span >Jeddah, Saudi Arabia</span>
          </div>

          <p  className=" flex items-center gap-1 mt-2 text-sm text-slate-400">
          <CalendarDays width="16" /><span> 2026-07-15</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default JobApllicationsCard
