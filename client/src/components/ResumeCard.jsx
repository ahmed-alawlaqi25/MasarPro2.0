import { FileText, Pencil, Download, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const accentBackgrounds = {
  '#3b82f6': '#eff6ff', '#6366f1': '#eef2ff', '#8b5cf6': '#f5f3ff',
  '#059669': '#ecfdf5', '#ef4444': '#fef2f2', '#f97316': '#fff7ed',
  '#0d9488': '#f0fdfa', '#ec4899': '#fdf2f8', '#6b7280': '#f9fafb',
  '#1f2937': '#f8fafc', '#0c1945': '#eef2ff',
}

const ResumeCard = ({
  id,
  resume,
  onEdit,
  onDelete,
  onDownload,
  deleting = false,
}) => {

  const {t, i18n} = useTranslation()
  const accent = /^#[0-9a-f]{6}$/i.test(resume.accentColor || '')
    ? resume.accentColor.toLowerCase() : '#0c1945'
  const background = accentBackgrounds[accent] || `color-mix(in srgb, ${accent} 7%, white)`
  const name = typeof resume.personal?.fullName === 'string' && resume.personal.fullName.trim()
    ? resume.personal.fullName : i18n.dir() === 'rtl' ? 'اسمك' : 'Your name'

  return (
    <article key={id} className="w-full max-w-[35.6rem] overflow-hidden rounded-xl border border-[#e0eff0] bg-white shadow-sm hover:scale-[1.01]">
      <div className="relative h-48 overflow-hidden px-12 pt-5" style={{ backgroundColor: background }}>
        <div dir={i18n.dir()} className="mx-auto min-h-64 w-full max-w-64 rounded-t-md bg-white px-5 py-5 shadow-[0_3px_18px_rgba(15,23,42,0.08)]">
          <p dir="auto" title={name} className="line-clamp-2 break-words text-center text-[11px] font-bold uppercase leading-4" style={{ color: accent }}>{name}</p>
          <div aria-hidden="true">
            <div className="mx-auto mt-2 h-1 w-2/3 rounded-full bg-slate-200" />
            <div className="mx-auto mt-1.5 h-0.5 w-4/5 rounded-full bg-slate-100" />
            {[0, 1, 2].map(section => <div key={section} className="mt-4 border-t border-slate-100 pt-2">
              <div className="mb-2 h-1 w-1/3 rounded-full" style={{ backgroundColor: accent, opacity: 0.7 }} />
              <div className="h-1 w-full rounded-full bg-slate-200" />
              <div className="mt-1.5 h-1 w-11/12 rounded-full bg-slate-200" />
              <div className="mt-1.5 h-1 w-3/4 rounded-full bg-slate-200" />
            </div>)}
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={!onDelete || deleting}
          aria-busy={deleting}
          aria-label={`Delete ${resume.title}`}
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
              {resume.title}
            </h3>
            <p className="mt-1 text-xs text-[#8192ad]">
              {t('updatedLabel')} {resume.updated_at.split('T')[0]}
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
            {t('editResumeButton')}
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={!onDownload || deleting}
            title={i18n.dir() === 'rtl' ? 'تنزيل PDF، اختر حفظ بصيغة PDF في نافذة الطباعة' : 'Download PDF, choose Save as PDF in the print dialog'}
            aria-label={`Download ${resume.title}`}
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
