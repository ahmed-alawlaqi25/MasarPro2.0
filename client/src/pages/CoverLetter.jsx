import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Download, FileText, Sparkles } from 'lucide-react'
import { useAuth } from '../components/AuthContext'
import { supabase } from '../lib/supabase'
import { useResumeDraft } from '../lib/useResumeDraft'
import { candidateBackground } from '../lib/coverLetter'
import { aiError, requestAi } from '../lib/ai'

const inputClass = 'mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50'
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50'

export default function CoverLetter() {
  const { resumeID } = useParams()
  const { session, loading } = useAuth()
  const { i18n } = useTranslation()
  const rtl = i18n.dir() === 'rtl'
  if (loading) return <p role="status" className="p-8">{rtl ? 'جارٍ التحميل...' : 'Loading...'}</p>
  if (!session?.user) return <Link to="/login">{rtl ? 'تسجيل الدخول' : 'Sign in'}</Link>
  return resumeID
    ? <LetterDraft key={`${session.user.id}:${resumeID}`} resumeId={resumeID} userId={session.user.id} rtl={rtl} />
    : <ResumePicker key={session.user.id} userId={session.user.id} rtl={rtl} />
}

function ResumePicker({ userId, rtl }) {
  const [resumes, setResumes] = useState([])
  const [status, setStatus] = useState('loading')
  const [reload, setReload] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    supabase.from('resumes').select('resume_id, title').eq('user_id', userId)
      .order('updated_at', { ascending: false }).abortSignal(controller.signal)
      .then(({ data, error }) => {
        if (controller.signal.aborted) return
        if (error) setStatus('error')
        else { setResumes(data || []); setStatus('loaded') }
      }).catch(() => { if (!controller.signal.aborted) setStatus('error') })
    return () => controller.abort()
  }, [userId, reload])
  return <section dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f4f9fc] px-6 py-10 text-[#0c1945]">
    <div className="mx-auto max-w-5xl">
      <p className="mb-3 text-sm font-semibold text-teal-700">{rtl ? 'خطوتك التالية' : 'YOUR NEXT APPLICATION'}</p>
      <h1 className="text-3xl font-bold">{rtl ? 'خطاب التقديم' : 'Cover letter'}</h1>
      <p className="mt-3 text-slate-600">{rtl ? 'اختر سيرتك الذاتية لكتابة خطاب يناسب خبراتك والوظيفة. يُحفظ خطاب واحد لكل سيرة.' : 'Choose a CV to write a letter based on your experience and the role. One letter is saved with each CV.'}</p>
      {status === 'loading' && <p role="status" className="mt-8">{rtl ? 'جارٍ تحميل السير الذاتية...' : 'Loading your CVs...'}</p>}
      {status === 'error' && <div role="alert" className="mt-8 text-red-700">
        <p>{rtl ? 'تعذر تحميل السير الذاتية.' : 'Unable to load your CVs.'}</p>
        <button type="button" className="mt-3 underline" onClick={() => { setStatus('loading'); setReload(value => value + 1) }}>{rtl ? 'إعادة المحاولة' : 'Retry'}</button>
      </div>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map(resume => <Link key={resume.resume_id} to={`/cover-letter/${resume.resume_id}`} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-400">
          <FileText aria-hidden="true" className="mb-5 text-teal-600" />
          <h2 className="font-semibold">{resume.title}</h2>
          <p className="mt-2 text-sm text-teal-700">{rtl ? 'فتح خطاب التقديم' : 'Open cover letter'} →</p>
        </Link>)}
      </div>
      {status === 'loaded' && !resumes.length && <div className="mt-8 rounded-xl border border-dashed border-teal-300 bg-white p-8">
        <p className="mb-5">{rtl ? 'أنشئ سيرتك الذاتية أولاً لاستخدام خبراتك في الخطاب.' : 'Create your CV first so the letter reflects your background.'}</p>
        <Link to="/resume-builder" className={buttonClass}>{rtl ? 'إنشاء سيرة ذاتية' : 'Create a CV'}</Link>
      </div>}
    </div>
  </section>
}

function LetterDraft({ resumeId, userId, rtl }) {
  const draft = useResumeDraft(resumeId, userId)
  if (draft.status === 'loading') return <p role="status" className="p-8">{rtl ? 'جارٍ فتح المسودة...' : 'Opening draft...'}</p>
  if (draft.status === 'load-error') return <div className="p-8">
    <p role="alert" className="mb-4 text-red-700">{rtl ? 'تعذر فتح المسودة.' : 'Unable to open this draft.'}</p>
    <Link to="/cover-letter" className="text-teal-700">{rtl ? 'العودة إلى السير الذاتية' : 'Back to CVs'}</Link>
  </div>
  return <LetterEditor {...draft} resumeId={resumeId} rtl={rtl} />
}

function LetterEditor({ content, setContent, status, error: saveError, save, resumeId, rtl }) {
  const letter = content.coverLetter
  const [step, setStep] = useState(letter.body ? 1 : 0)
  const [busy, setBusy] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [error, setError] = useState('')
  const controller = useRef(null)
  const editor = useRef(null)
  const background = candidateBackground(content)
  const letterRtl = letter.language === 'ar'
  const update = (key, value) => setContent(previous => ({ ...previous, coverLetter: { ...previous.coverLetter, [key]: value } }))
  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => { if (step === 1) editor.current?.focus() }, [step])

  const generate = async event => {
    event.preventDefault()
    if (controller.current) return
    if (letter.body && !window.confirm(rtl ? 'استبدال مسودة الخطاب الحالية بخطاب جديد؟' : 'Replace your current letter draft with a new letter?')) return
    const request = new AbortController()
    controller.current = request
    setBusy(true)
    setError('')
    try {
      const body = await requestAi('cover-letter', { company: letter.company, jobDescription: letter.jobDescription, background, language: letter.language }, request.signal)
      if (request.signal.aborted) return
      setContent(previous => ({ ...previous, coverLetter: { ...previous.coverLetter, body, generatedAt: new Date().toISOString() } }))
      setStep(1)
    } catch (error) {
      if (!request.signal.aborted) setError(aiError(error, rtl))
    } finally {
      controller.current = null
      if (!request.signal.aborted) setBusy(false)
    }
  }
  const download = async () => {
    if (printing || !letter.body.trim()) return
    setPrinting(true)
    const title = document.title
    try {
      await document.fonts.ready
      document.title = `${content.personal.fullName.trim() || 'Cover letter'} - ${letter.company.trim() || 'Application'}`
      window.print()
    } finally { document.title = title; setPrinting(false) }
  }
  const savedLabel = rtl
    ? ({ saved: 'تم حفظ جميع التغييرات', pending: 'تغييرات غير محفوظة', saving: 'جارٍ الحفظ...', error: 'تعذر الحفظ. أعد المحاولة.' })[status]
    : ({ saved: 'All changes saved', pending: 'Unsaved changes', saving: 'Saving...', error: 'Save failed. Please retry.' })[status]
  return <section id="cover-letter-workspace" dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f4f9fc] px-4 py-6 text-[#0c1945] sm:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/cover-letter" className="text-sm text-slate-500">{rtl ? 'جميع خطابات التقديم' : 'All cover letters'}</Link>
          <h1 className="mt-2 text-2xl font-bold">{rtl ? 'خطاب التقديم' : 'Cover letter'}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p role="status" className={`text-xs ${status === 'error' ? 'text-red-700' : 'text-slate-500'}`}>{savedLabel}</p>
          <button type="button" onClick={() => void save()} disabled={status === 'saved' || status === 'saving'} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:opacity-50">{rtl ? 'حفظ الآن' : 'Save now'}</button>
          <button type="button" onClick={download} disabled={!letter.body.trim() || busy || printing} className={buttonClass} title={rtl ? 'اختر حفظ بصيغة PDF في نافذة الطباعة' : 'Choose Save as PDF in the print dialog'}><Download size={16} aria-hidden="true" />{rtl ? 'تنزيل PDF' : 'Download PDF'}</button>
        </div>
      </div>
      {saveError && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{rtl ? 'تعذر حفظ آخر التغييرات. اضغط حفظ الآن لإعادة المحاولة.' : 'Your latest changes were not saved. Select Save now to retry.'}</p>}
      <div dir="ltr" className="grid items-start gap-6 lg:grid-cols-5">
        <section dir={rtl ? 'rtl' : 'ltr'} aria-label={rtl ? 'حقول خطاب التقديم' : 'Cover letter fields'} className="min-w-0 rounded-xl border border-slate-200 border-t-4 border-t-teal-600 bg-white p-5 shadow-sm lg:col-span-2 sm:p-6">
          <div className="mb-6 flex gap-2 text-sm" aria-label={rtl ? 'خطوات خطاب التقديم' : 'Cover letter steps'}>
            <button type="button" disabled={busy} aria-current={step === 0 ? 'step' : undefined} onClick={() => setStep(0)} className={`flex-1 rounded-lg px-2 py-3 ${step === 0 ? 'bg-teal-50 font-semibold text-teal-800' : 'text-slate-500'}`}>{rtl ? '١. تفاصيل الوظيفة' : '1. Job details'}</button>
            <button type="button" disabled={!letter.body || busy} aria-current={step === 1 ? 'step' : undefined} onClick={() => setStep(1)} className={`flex-1 rounded-lg px-2 py-3 disabled:opacity-40 ${step === 1 ? 'bg-teal-50 font-semibold text-teal-800' : 'text-slate-500'}`}>{rtl ? '٢. مراجعة وتعديل' : '2. Review & edit'}</button>
          </div>
          {step === 0 ? <form onSubmit={generate} className="space-y-5">
            <div><h2 className="text-lg font-bold">{rtl ? 'لمن تكتب؟' : 'Who are you applying to?'}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{rtl ? 'أضف الشركة ووصف الوظيفة لإنشاء خطاب يعتمد على سيرتك الذاتية.' : 'Add the company and job description to generate a letter based on your CV.'}</p></div>
            <div><label htmlFor="letter-company" className="text-sm font-semibold">{rtl ? 'اسم الشركة' : 'Company name'}</label><input id="letter-company" required maxLength={200} disabled={busy} value={letter.company} onChange={event => update('company', event.target.value)} className={inputClass} placeholder={rtl ? 'مثال: شركة مسار' : 'e.g. Acme'} /></div>
            <div><label htmlFor="letter-job" className="text-sm font-semibold">{rtl ? 'وصف الوظيفة' : 'Job description'}</label><textarea id="letter-job" required maxLength={10000} rows={9} disabled={busy} value={letter.jobDescription} onChange={event => update('jobDescription', event.target.value)} className={inputClass} placeholder={rtl ? 'الصق وصف الوظيفة والمتطلبات هنا...' : 'Paste the role, responsibilities, and requirements...'} /><p className="mt-1 text-end text-xs text-slate-400">{letter.jobDescription.length.toLocaleString()} / 10,000</p></div>
            <div><label htmlFor="letter-language" className="text-sm font-semibold">{rtl ? 'لغة الخطاب' : 'Letter language'}</label><select id="letter-language" value={letter.language} disabled={busy} onChange={event => update('language', event.target.value)} className={inputClass}><option value="en">English</option><option value="ar">العربية</option></select></div>
            <Link to={`/resume-builder/${resumeId}`} className="block text-sm text-teal-700 underline">{rtl ? 'مراجعة خبراتك في السيرة الذاتية' : 'Review the background in your CV'}</Link>
            {background.length > 16000 && <p role="alert" className="text-sm text-red-700">{rtl ? 'تفاصيل السيرة طويلة جداً. اختصرها قبل إنشاء الخطاب.' : 'Your CV background exceeds 16,000 characters. Shorten your CV before generating.'}</p>}
            <button type="submit" disabled={busy || !letter.company.trim() || !letter.jobDescription.trim() || background.length > 16000} className={`${buttonClass} w-full`}><Sparkles size={16} aria-hidden="true" />{busy ? (rtl ? 'جارٍ إنشاء الخطاب...' : 'Generating letter...') : letter.body ? (rtl ? 'إنشاء خطاب جديد' : 'Generate a new letter') : (rtl ? 'إنشاء خطاب التقديم' : 'Generate cover letter')}</button>
            <p className="text-xs leading-5 text-slate-500">{rtl ? 'تُرسل تفاصيل الوظيفة والخبرات إلى Google Gemini. راجع الخطاب قبل استخدامه.' : 'Job details and your career background are sent to Google Gemini. Review the letter before using the draft.'}</p>
            {busy && <p role="status" className="text-sm text-teal-700">{rtl ? 'جارٍ إعداد المسودة...' : 'Preparing your draft...'}</p>}
          </form> : <div className="space-y-4">
            <h2 className="text-lg font-bold">{rtl ? 'اجعل الخطاب بأسلوبك' : 'Make the letter yours'}</h2>
            <p className="text-sm leading-6 text-slate-500">{rtl ? 'راجع التفاصيل وعدّل النص. تظهر تغييراتك في المعاينة وتُحفظ تلقائياً.' : 'Review the details and edit the wording. Your changes update the preview and save automatically.'}</p>
            <label htmlFor="letter-body" className="block text-sm font-semibold">{rtl ? 'نص الخطاب' : 'Letter text'}</label>
            <textarea ref={editor} id="letter-body" dir={letterRtl ? 'rtl' : 'ltr'} rows={20} maxLength={14000} value={letter.body} onChange={event => update('body', event.target.value)} className={`${inputClass} leading-7`} />
            <button type="button" onClick={() => setStep(0)} className="text-sm text-teal-700 underline">{rtl ? 'العودة إلى تفاصيل الوظيفة' : 'Back to job details'}</button>
          </div>}
          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </section>
        <section aria-label={rtl ? 'معاينة الخطاب' : 'Letter preview'} className="min-w-0 lg:col-span-3">
          <p dir={rtl ? 'rtl' : 'ltr'} className="mb-3 text-xs text-slate-500">{rtl ? 'معاينة الخطاب · مقاس Letter ‏(٨٫٥ × ١١ بوصة)' : 'LETTER PREVIEW · US Letter (8.5 × 11 in)'}</p>
          <article id="cover-letter-preview" lang={letter.language} dir={letterRtl ? 'rtl' : 'ltr'} className="bg-white text-slate-800 shadow-md">
            <header className="mb-7 border-b-2 pb-5" style={{ borderColor: content.accentColor }}>
              <h2 className="text-2xl font-bold" style={{ color: content.accentColor }}>{content.personal.fullName || (letterRtl ? 'اسمك' : 'Your name')}</h2>
              <p className="mt-2 text-sm">{content.personal.professionalTitle}</p>
              <p className="mt-2 break-words text-xs text-slate-500">{[content.personal.email, content.personal.phone, content.personal.location].filter(Boolean).join(' · ')}</p>
            </header>
            {letter.body ? <><div className="whitespace-pre-wrap break-words leading-[1.8]">{letter.body}</div><p className="mt-5 font-semibold">{content.personal.fullName}</p></> : <div className="space-y-5 text-slate-400">
              <p className="font-semibold">{letterRtl ? 'فريق التوظيف المحترم،' : 'Dear Hiring Team,'}</p>
              <p>{letterRtl ? 'سيظهر خطابك هنا بعد إضافة تفاصيل الوظيفة والضغط على إنشاء خطاب التقديم.' : 'Your letter will appear here after you add the job details and select Generate cover letter.'}</p>
              <div aria-hidden="true" className="space-y-3 pt-3">{[100, 94, 100, 80, 0, 100, 94, 65].map((width, index) => <div key={index} className="h-2 rounded bg-slate-100" style={{ width: `${width}%` }} />)}</div>
            </div>}
          </article>
          <p dir={rtl ? 'rtl' : 'ltr'} className="mt-3 text-xs text-slate-500">{rtl ? 'للتنزيل، اختر حفظ بصيغة PDF في نافذة الطباعة. النصوص الطويلة تمتد إلى صفحات إضافية.' : 'To download, choose Save as PDF in the print dialog. Longer letters continue onto additional pages.'}</p>
        </section>
      </div>
    </div>
  </section>
}
