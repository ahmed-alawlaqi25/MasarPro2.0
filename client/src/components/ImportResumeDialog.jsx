import { useEffect, useRef, useState } from 'react'
import { CloudUpload, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { parseResumeText } from '../lib/resumeImport'
import { readResumePdf } from '../lib/readResumePdf'

export default function ImportResumeDialog({ userId, onClose, onImported }) {
  const { i18n } = useTranslation()
  const rtl = i18n.dir() === 'rtl'
  const dialog = useRef(null)
  const locked = useRef(false)
  const active = useRef(true)
  const [file, setFile] = useState(null)
  const [phase, setPhase] = useState('')
  const [error, setError] = useState('')
  const busy = Boolean(phase)
  const copy = (en, ar) => rtl ? ar : en

  useEffect(() => {
    active.current = true
    const element = dialog.current
    element.showModal()
    return () => { active.current = false; element.close() }
  }, [])

  async function submit(event) {
    event.preventDefault()
    if (locked.current) return
    if (!userId) { setError(copy('Sign in before importing.', 'سجل الدخول قبل الاستيراد.')); return }
    locked.current = true
    setError('')
    setPhase('reading')
    try {
      const text = await readResumePdf(file)
      if (!active.current) return
      const content = parseResumeText(text, file.name)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || sessionData.session?.user.id !== userId) throw new Error('auth')
      if (!active.current) return
      setPhase('saving')
      const { data, error: insertError } = await supabase.from('resumes').insert({
        user_id: userId,
        title: file.name.replace(/\.pdf$/i, '').slice(0, 120).trim() || 'Imported resume',
        content,
      }).select('resume_id').single()
      if (insertError) throw new Error('save')
      if (active.current) onImported(data.resume_id)
    } catch (err) {
      const messages = {
        file: copy('Choose a valid PDF file.', 'اختر ملف PDF صالحاً.'),
        size: copy('Choose a PDF smaller than 5 MB.', 'اختر ملف PDF بحجم أقل من 5 ميجابايت.'),
        pages: copy('Choose a PDF with 10 pages or fewer.', 'اختر ملف PDF لا يتجاوز 10 صفحات.'),
        length: copy('This PDF contains too much text. Choose a shorter resume.', 'يحتوي الملف على نص طويل جداً. اختر سيرة أقصر.'),
        empty: copy('No readable text found. Use a PDF with selectable text, not a scanned image.', 'لم يتم العثور على نص مقروء. استخدم PDF بنص قابل للتحديد وليس صورة ممسوحة.'),
        auth: copy('Your session changed. Sign in and try again.', 'تغيرت جلسة الدخول. سجل الدخول وحاول مجدداً.'),
        save: copy('Unable to save the imported resume. Check your connection and try again.', 'تعذر حفظ السيرة المستوردة. تحقق من الاتصال وحاول مجدداً.'),
      }
      if (active.current) setError(messages[err.message] || copy('Unable to read this PDF. Use an unlocked, text-based PDF and try again.', 'تعذرت قراءة الملف. استخدم ملف PDF غير محمي يحتوي على نص وحاول مجدداً.'))
    } finally {
      locked.current = false
      if (active.current) setPhase('')
    }
  }

  return <dialog ref={dialog} dir={rtl ? 'rtl' : 'ltr'} aria-labelledby="import-resume-title"
    onCancel={event => { event.preventDefault(); if (!locked.current) onClose() }}
    className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border border-[#e3edfa] bg-white p-6 text-[#0c1945] shadow-md backdrop:bg-black/70 backdrop:backdrop-blur-sm">
    <button type="button" disabled={busy} onClick={onClose} aria-label={copy('Close import', 'إغلاق الاستيراد')} className="absolute end-4 top-4 text-slate-400 hover:text-slate-600 disabled:opacity-40"><X size={20} /></button>
    <h2 id="import-resume-title" className="mb-3 text-xl font-bold">{copy('Import your resume', 'استيراد سيرتك الذاتية')}</h2>
    <p className="mb-4 text-sm text-slate-500">{copy('Upload a text-based PDF. Review the imported fields in the editor. Original formatting is not preserved.', 'ارفع ملف PDF بنص قابل للتحديد، ثم راجع الحقول في المحرر. لن يتم الاحتفاظ بالتنسيق الأصلي.')}</p>
    <form onSubmit={submit} aria-busy={busy}>
      <label className="mb-4 flex flex-col gap-3 rounded-lg border-2 border-dashed border-sky-200 bg-sky-50 p-4 text-sm">
        <CloudUpload className="mx-auto text-sky-500" size={36} aria-hidden="true" />
        <span>{copy('PDF, up to 5 MB and 10 pages', 'PDF، حتى 5 ميجابايت و10 صفحات')}</span>
        <input type="file" accept=".pdf,application/pdf" required disabled={busy} onChange={event => { setFile(event.target.files?.[0] || null); setError('') }} className="w-full min-w-0 text-xs file:me-2 file:rounded file:border-0 file:bg-white file:px-2 file:py-2 file:text-sky-700" />
      </label>
      <p className="mb-4 text-xs text-slate-500">{copy('No AI service. PDF text is read on your device. Extracted text is saved with your resume, not the original PDF.', 'بدون خدمة ذكاء اصطناعي. تتم قراءة النص على جهازك وحفظه مع سيرتك، دون حفظ ملف PDF الأصلي.')}</p>
      {error && <p role="alert" className="mb-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy || !file} className="w-full rounded bg-linear-to-l from-[#0874c9] to-[#0eb0b2] py-2 text-white disabled:opacity-50">
        <span role="status">{phase === 'reading' ? copy('Reading PDF…', 'جارٍ قراءة الملف…') : phase === 'saving' ? copy('Saving resume…', 'جارٍ حفظ السيرة…') : copy('Import resume', 'استيراد السيرة')}</span>
      </button>
    </form>
  </dialog>
}
