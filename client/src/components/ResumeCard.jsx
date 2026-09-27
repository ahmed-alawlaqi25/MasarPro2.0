import { FileText, Pencil, Download, Trash2 } from 'lucide-react';

const ResumeCard = ({
  title = 'Software Engineer',
  updatedAt = 'Sep 27, 2026',
  onEdit,
  onDownload,
  onDelete,
}) => {


  return (
    <article className="w-full max-w-[35.6rem] overflow-hidden rounded-xl border border-[#e0eff0] bg-white shadow-sm hover:scale-[1.01]">
      {/* Empty preview area */}
      <div className="relative h-48 bg-[#e3f7f5]">
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${title}`}
          className="absolute end-3 top-3 rounded-lg p-2 text-slate-500 cursor-pointer transition hover:bg-white/80 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-500"
        >
          <Trash2 size={18} className='cursor-pointer' />
        </button>
      </div>

      <div className="px-5 pb-4 pt-5">
        <div className="flex items-start gap-3">
          <FileText
            size={22}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#35547b]"
          />

          <div className="min-w-0">
            <h3 className="break-words text-sm font-semibold text-[#07133f]">
              {title}
            </h3>
            <p className="mt-1 text-xs text-[#8192ad]">
              Updated {updatedAt}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#edf2fa] pt-3">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 cursor-pointer rounded-md px-1 py-1 text-sm font-medium text-[#0874c9] transition hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <Pencil size={18} aria-hidden="true" />
            Edit resume
          </button>

          <button
            type="button"
            onClick={onDownload}
            aria-label={`Download ${title}`}
            className="rounded-lg p-2 text-[#35547b] cursor-pointer transition hover:bg-sky-50 hover:text-[#0874c9] focus-visible:outline-2 focus-visible:outline-sky-600"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ResumeCard;