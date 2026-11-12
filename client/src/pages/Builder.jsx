import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, PanelsTopLeft, Palette, Check, Download, FileText, Columns2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
import { useResumeDraft } from '../lib/useResumeDraft'
import ImproveSummary from '../components/ImproveSummary'
import ClassicTemplate from '../components/templates/ClassicTemplate'
import ExecutiveTemplate from '../components/templates/ExecutiveTemplate'




const accentColors = [
  ['Blue', '#3b82f6'], ['Indigo', '#6366f1'], ['Purple', '#8b5cf6'],
  ['Green', '#059669'], ['Red', '#ef4444'], ['Orange', '#f97316'],
  ['Teal', '#0d9488'], ['Pink', '#ec4899'], ['Gray', '#6b7280'],
  ['Black', '#1f2937'],
]

const Builder = () => {
  const { resumeID } = useParams()
  const { session, loading } = useAuth()
  if (loading) return <p role="status" className="p-8">Loading account...</p>
  if (!session?.user) return <Link to="/login" className="block p-8">Sign in to open your resume.</Link>
  return <ResumeEditor key={`${session.user.id}:${resumeID}`} resumeId={resumeID} userId={session.user.id} />
}

const ResumeEditor = ({ resumeId, userId }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t ,i18n } = useTranslation()
  const rtl = i18n.language.startsWith('ar')
  const { content, setContent, status, error: saveError, save } = useResumeDraft(resumeId, userId)
  const accentColor = content.accentColor
  const setAccentColor = color => setContent(previous => ({ ...previous, accentColor: color }))
  const currentTemplate = content.template || 'classic'
  const setTemplate = template => setContent(previous => ({ ...previous, template }))
  const [templateOpen, setTemplateOpen] = useState(false)
  const templatePicker = useRef(null)
  const templateButton = useRef(null)
  const [accentOpen, setAccentOpen] = useState(false)
  const accentPicker = useRef(null)
  const accentButton = useRef(null)
  const [printing, setPrinting] = useState(false)
  useEffect(() => {
    if (searchParams.get('download') !== 'pdf' || status !== 'saved') return
    let cancelled = false
    const timer = setTimeout(async () => {
      await document.fonts.ready
      if (cancelled) return
      const next = new URLSearchParams(searchParams)
      next.delete('download')
      setSearchParams(next, { replace: true })
      const previousTitle = document.title
      try {
        document.title = `${content.personal.fullName.trim() || 'Resume'} - CV`
        window.print()
      } finally {
        document.title = previousTitle
      }
    }, 150)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [searchParams, setSearchParams, status, content.personal.fullName])

  const downloadPdf = async () => {
    if (printing) return
    setPrinting(true)
    const previousTitle = document.title
    try {
      await document.fonts.ready
      document.title = `${content.personal.fullName.trim() || 'Resume'} - CV`
      window.print()
    } finally {
      document.title = previousTitle
      setPrinting(false)
    }
  }

  const personal = content.personal
  const presentLabel = rtl ? 'حتى الآن' : 'Present'
  const contactDetails = [
  personal.location,
  personal.phone,
  personal.email,
  personal.linkedin,
  personal.website,
].filter(value => typeof value === 'string' && value.trim());

  const personalFields = [
  
  {
    name: 'fullName',
    label: t('fullNameLabel'),
    placeholder: t('fullNamePlaceholder'),
    autoComplete: 'name',
    maxLength: 100,
  },
  {
    name: 'professionalTitle', 
    label: t('professionalTitleLabel'),
    placeholder: t('professionalTitlePlaceholder'),
    autoComplete: 'organization-title',
    maxLength: 120,
  },
  {
    name: 'location',
    label: t('locationLabel'),
    placeholder: 'Riyadh, Saudi Arabia',
    autoComplete: 'address-level2',
    maxLength: 120,
  },
  {
    name: 'phone',
    label: t('phoneNumberLabel'),
    placeholder: '+966 55 555 5555',
    type: 'tel',
    autoComplete: 'tel',
    maxLength: 40,
  },
  {
    name: 'email',
    label: t('emailAddressLabel'),
    placeholder: 'email@example.com',
    type: 'email',
    autoComplete: 'email',
    maxLength: 254,
  },
  {
    name: 'website',
    label: t('websiteLabel'),
    placeholder: 'https://yourwebsite.com',
    type: 'url',
    autoComplete: 'url',
    maxLength: 300,
  },
  {
    name: 'linkedin',
    label: t('linkedinLabel'),
    placeholder: 'https://www.linkedin.com/in/yourname',
    type: 'url',
    maxLength: 300,
  },
]

  useEffect(() => {
    if (!accentOpen) return
    const dismiss = (event) => {
      if (!accentPicker.current?.contains(event.target)) setAccentOpen(false)
    }
    const escape = (event) => {
      if (event.key === 'Escape') {
        setAccentOpen(false)
        accentButton.current?.focus()
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('focusin', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('focusin', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [accentOpen])

  useEffect(() => {
    if (!templateOpen) return
    const dismiss = (event) => {
      if (!templatePicker.current?.contains(event.target)) setTemplateOpen(false)
    }
    const escape = (event) => {
      if (event.key === 'Escape') {
        setTemplateOpen(false)
        templateButton.current?.focus()
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('focusin', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('focusin', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [templateOpen])

  const [step, setStep] = useState(0)
  const steps = [
    t('personalInformationSection'),
    t('professionalSummarySection'),
    t('professionalExperienceSection'),
    t('educationTrainingSection'),
    t('projectsLabel'),
    'Skills',
  ]

const inputClass =
  'w-full rounded-lg border border-[#e3edfa] px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100'

  
  const addExperience = () => {
  const newExperience = {
    id: crypto.randomUUID(),
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    highlights: [],
  }

  setContent((previous) => ({
    ...previous,
    experience: [...previous.experience, newExperience],
  }))
}

  const updateExperience = (id, field, value) => {
    setContent((previous) => ({
      ...previous,
      experience: previous.experience.map((job) =>
        job.id === id
          ? {
              ...job,
              [field]: value,
              ...(field === 'isCurrent' && value
                ? { endDate: '' }
                : {}),
            }
          : job
      ),
    }))
  }

  const removeExperience = (id) => {
    setContent((previous) => ({
      ...previous,
      experience: previous.experience.filter((job) => job.id !== id),
    }))
  }

  const addEntry = (section) => {
    const entry = section === 'education'
      ? { id: crypto.randomUUID(), qualification: '', institution: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '' }
      : { id: crypto.randomUUID(), name: '', role: '', url: '', startDate: '', endDate: '', isCurrent: false, description: '' }
    setContent((previous) => ({ ...previous, [section]: [...previous[section], entry] }))
  }

  const addSkillGroup = () => {
    const group = { id: crypto.randomUUID(), category: '', items: '' }
    setContent((previous) => ({ ...previous, skills: [...previous.skills, group] }))
  }

  const updateEntry = (section, id, field, value) => {
    setContent((previous) => ({
      ...previous,
      [section]: previous[section].map((entry) => entry.id === id
        ? { ...entry, [field]: value, ...(field === 'isCurrent' && value ? { endDate: '' } : {}) }
        : entry),
    }))
  }

  const removeEntry = (section, id) => {
    setContent((previous) => ({ ...previous, [section]: previous[section].filter((entry) => entry.id !== id) }))
  }

  const hasEntryContent = (entry) => Object.entries(entry).some(([key, value]) => key !== 'id' && typeof value === 'string' && value.trim())

  const handlePersonalChange = (event) => {
    const { name, value } = event.target

    setContent((previous) => ({
      ...previous,
      personal: {
        ...previous.personal,
        [name]: value,
      },
    }))
  }



  if (status === 'loading') return <p role="status" className="p-8">{rtl ? 'جارٍ تحميل السيرة الذاتية...' : 'Loading resume...'}</p>
  if (status === 'load-error') return (
    <div className="p-8">
      <p role="alert" className="mb-3 text-red-700">{rtl ? 'تعذر فتح السيرة الذاتية.' : 'Unable to open this resume.'} {saveError}</p>
      <Link to="/resume-builder" className="text-teal-700">{rtl ? 'العودة إلى السير الذاتية' : 'Back to resumes'}</Link>
    </div>
  )

  return (
    <section
      id="resume-workspace"
      dir={rtl ? 'rtl' : 'ltr'}
      className="min-h-0 flex-1 overflow-hidden bg-[#f4f9fc] px-4 py-4 text-[#0c1945] sm:px-8"
    >
      <div className="mx-auto flex h-full min-h-0 max-w-7xl flex-col">
        <div className="mb-2 grid gap-3 lg:grid-cols-5 lg:gap-8">
          <p role="status" className={`text-end text-sm lg:col-span-3 lg:col-start-3 ${status === 'error' ? 'text-red-700' : 'text-slate-500'}`}>
            {rtl
              ? ({ saved: 'تم حفظ جميع التغييرات', pending: 'تغييرات غير محفوظة', saving: 'جارٍ الحفظ...', error: 'تعذر الحفظ. يرجى إعادة المحاولة.' })[status]
              : ({ saved: 'All changes saved', pending: 'Unsaved changes', saving: 'Saving...', error: 'Save failed. Please retry.' })[status]}
          </p>
        </div>
        {saveError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{saveError}</p>}
        <div className="mb-5 grid items-center gap-3 lg:grid-cols-5 lg:gap-8">
        <Link
          to="/resume-builder"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700 lg:col-span-2"
        >
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {t('backToResumesLink')}
        </Link>
        <div className="flex flex-wrap justify-end gap-2 lg:col-span-3">
          <Link to={`/cover-letter/${resumeId}`} className="rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm text-teal-700">{rtl ? 'خطاب التقديم' : 'Cover letter'}</Link>
          <button type="button" onClick={() => void save()} disabled={status === 'saving' || status === 'saved'} className="rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm text-teal-700 hover:bg-teal-50 disabled:opacity-50">
            {rtl ? 'حفظ الآن' : 'Save now'}
          </button>
          <button type="button" onClick={downloadPdf} disabled={printing} title={rtl ? 'اختر حفظ بصيغة PDF في نافذة الطباعة' : 'Choose Save as PDF in the print dialog'} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm text-white hover:bg-teal-700 disabled:opacity-50">
            <Download size={16} aria-hidden="true" />
            {rtl ? 'تنزيل PDF' : 'Download PDF'}
          </button>
        </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-rows-2 gap-4 lg:grid-cols-5 lg:grid-rows-1 lg:gap-6">
          <section aria-label={rtl ? 'حقول السيرة الذاتية' : 'Resume fields'} tabIndex={0} className="min-h-0 min-w-0 overflow-y-auto overscroll-contain rounded-lg border-t-4 border-t-teal-600 bg-white px-6 py-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2" role="group" aria-label="Resume editor controls">
              <div className="flex items-center gap-1.5">
                <div ref={templatePicker} className="relative">
                  <button
                    ref={templateButton}
                    type="button"
                    aria-expanded={templateOpen}
                    aria-controls="resume-template-picker"
                    onClick={() => setTemplateOpen((open) => !open)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-2 text-xs font-medium text-sky-700 hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-sky-600"
                  >
                    <PanelsTopLeft size={14} aria-hidden="true" />
                    {t('templateTab')}
                  </button>
                  {templateOpen && (
                    <div
                      id="resume-template-picker"
                      role="group"
                      aria-label="Resume template"
                      className="absolute start-0 top-full z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl"
                    >
                      <p className="mb-2 text-xs font-bold text-slate-700 px-1">{t('selectTemplate')}</p>
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setTemplate('classic')
                            setTemplateOpen(false)
                            templateButton.current?.focus()
                          }}
                          className={`flex w-full items-start gap-2.5 rounded-lg border p-2 text-start transition-colors cursor-pointer ${
                            currentTemplate === 'classic'
                              ? 'border-teal-500 bg-teal-50/60 ring-1 ring-teal-400'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <FileText size={18} className="mt-0.5 shrink-0 text-slate-600" aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{t('classicTemplate')}</span>
                              {currentTemplate === 'classic' && <Check size={14} className="text-teal-600" aria-hidden="true" />}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{t('classicTemplateDesc')}</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setTemplate('executive')
                            setTemplateOpen(false)
                            templateButton.current?.focus()
                          }}
                          className={`flex w-full items-start gap-2.5 rounded-lg border p-2 text-start transition-colors cursor-pointer ${
                            currentTemplate === 'executive'
                              ? 'border-teal-500 bg-teal-50/60 ring-1 ring-teal-400'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <Columns2 size={18} className="mt-0.5 shrink-0 text-slate-600" aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{t('executiveTemplate')}</span>
                              {currentTemplate === 'executive' && <Check size={14} className="text-teal-600" aria-hidden="true" />}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{t('executiveTemplateDesc')}</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={accentPicker} className="relative">
                  <button
                    ref={accentButton}
                    type="button"
                    aria-expanded={accentOpen}
                    aria-controls="resume-accent-picker"
                    onClick={() => setAccentOpen((open) => !open)}
                    className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2 py-2 text-xs font-medium text-purple-600 hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-purple-600"
                  >
                    <Palette size={14} aria-hidden="true" />
                    {t('accentTab')}
                  </button>
                  {accentOpen && (
                    <div id="resume-accent-picker" role="group" aria-label="Resume accent color" className="absolute -start-20 top-full z-20 mt-2 grid w-56 grid-cols-4 gap-x-2 gap-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                      {accentColors.map(([name, color]) => (
                        <button key={name} type="button" aria-label={`${name} accent`} aria-pressed={accentColor === color} onClick={() => {
                          setAccentColor(color)
                          setAccentOpen(false)
                          accentButton.current?.focus()
                        }} className="flex flex-col items-center gap-1 rounded-md text-[10px] text-slate-600 focus-visible:outline-2 focus-visible:outline-purple-600">
                          <span style={{ backgroundColor: color }} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 transition hover:scale-105">
                            {accentColor === color && <Check size={19} className="text-white" aria-hidden="true" />}
                          </span>
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="ms-auto flex items-center gap-2">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((previous) => Math.max(0, previous - 1))}
                className="inline-flex items-center gap-1 rounded-md py-2 text-xs font-medium text-slate-600 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {rtl ? <ChevronRight size={14} aria-hidden="true" /> : <ChevronLeft size={14} aria-hidden="true" />}
                {t('previousButton')}
              </button>

              <button
                type="button"
                disabled={step === steps.length - 1}
                onClick={() =>
                  setStep((previous) => Math.min(steps.length - 1, previous + 1))
                }
                className="inline-flex items-center gap-1 rounded-md py-2 text-xs font-medium text-slate-600 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('nextButton')}
                {rtl ? <ChevronLeft size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
              </button>
              </div>
            </div>

            <hr className="border-slate-200" />

            {content.importSource?.text && <details className="mt-4 rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm">
              <summary className="cursor-pointer font-medium">{rtl ? 'مراجعة النص المستورد' : 'Review imported source text'}</summary>
              <p className="mt-2 text-xs text-slate-600">{rtl ? 'راجع الحقول وصحح التفاصيل الناقصة أو الموضوعة في القسم الخطأ.' : 'Review each section. Correct missing details or text placed in the wrong field.'}</p>
              <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words font-sans text-xs text-slate-700">{content.importSource.text}</pre>
            </details>}

            {step === 0 && <>
            <h2 className="mt-6 text-lg font-bold">
              {t('personalInformationSection')}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t('personalInformationSubtitle')}
            </p>
            <div className="space-y-4">
              {personalFields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-1.5 block text-sm font-medium"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || 'text'}
                    maxLength={field.maxLength}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={personal[field.name]}
                    onChange={handlePersonalChange}
                    className="w-full rounded-lg border border-[#e3edfa] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              ))}
            </div>
            </>}

            {step === 1 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold">{t('professionalSummarySection')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('summaryDescription')}</p>
                <label htmlFor="professional-summary" className="mb-2 mt-6 block text-sm font-medium">{t('summaryLabel')}</label>
                <textarea
                  id="professional-summary"
                  rows={8}
                  maxLength={5000}
                  value={content.summary}
                  onChange={(event) => {
                    const value = event.target.value
                    setContent((previous) => ({ ...previous, summary: value }))
                  }}
                  placeholder= {t('summaryPlaceholder')}
                  className={`${inputClass} resize-y`}
                />
                <ImproveSummary summary={content.summary} rtl={rtl} onApply={summary => setContent(previous => ({ ...previous, summary }))} />
              </div>
            )}

            {step === 2 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold">{t('professionalExperienceSection')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('professionalExperienceSubtitle')}</p>
                <div className="mt-6 space-y-5">
                  {content.experience.map((job, index) => (
                    <fieldset key={job.id} className="min-w-0 space-y-4 rounded-xl border border-slate-200 p-4">
                      <legend className="px-1 text-sm font-semibold">{t('experienceLabel')} {index + 1}</legend>
                      {[
                        ['position', t('jobTitleLabel')],
                        ['company', t('companyLabel')],
                        ['location', t('locationLabel')],
                      ].map(([field, label]) => (
                        <div key={field}>
                          <label htmlFor={`${job.id}-${field}`} className="mb-1.5 block text-sm font-medium">{label}</label>
                          <input id={`${job.id}-${field}`} maxLength={150} value={job[field]} onChange={(event) => updateExperience(job.id, field, event.target.value)} className={inputClass} />
                        </div>
                      ))}
                      <div>
                        <label htmlFor={`${job.id}-start`} className="mb-1.5 block text-sm font-medium">{t('startDateLabel')}</label>
                        <input id={`${job.id}-start`} type="month" value={job.startDate} onChange={(event) => updateExperience(job.id, 'startDate', event.target.value)} className={inputClass} />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={job.isCurrent} onChange={(event) => updateExperience(job.id, 'isCurrent', event.target.checked)} className="accent-teal-600" />
                        {t('currentlyWorkHereLabel')}
                      </label>
                      {!job.isCurrent && (
                        <div>
                          <label htmlFor={`${job.id}-end`} className="mb-1.5 block text-sm font-medium">{t('endDateLabel')}</label>
                          <input id={`${job.id}-end`} type="month" min={job.startDate || undefined} value={job.endDate} onChange={(event) => updateExperience(job.id, 'endDate', event.target.value)} className={inputClass} />
                        </div>
                      )}
                      <div>
                        <label htmlFor={`${job.id}-highlights`} className="mb-1.5 block text-sm font-medium">{t('responsibilitiesLabel')}</label>
                        <textarea id={`${job.id}-highlights`} rows={5} maxLength={3000} value={job.highlights.join('\n')} onChange={(event) => updateExperience(job.id, 'highlights', event.target.value.split('\n'))} placeholder={t('responsibilitiesHelpText')} className={`${inputClass} resize-y`} />
                      </div>
                      <button type="button" onClick={() => removeExperience(job.id)} className="text-sm text-red-600 hover:text-red-800">{t('removeExperienceButton')} {index + 1}</button>
                    </fieldset>
                  ))}
                </div>
                <button type="button" onClick={addExperience} className="mt-5 w-full rounded-lg border border-dashed border-teal-400 px-4 py-3 text-sm font-medium text-teal-700 hover:bg-teal-50">{t('addExperienceButton')}</button>
              </div>
            )}
            {(step === 3 || step === 4) && (() => {
              const education = step === 3
              const section = education ? 'education' : 'projects'
              const label = education ? t('educationOrTrainingLabel') : t('projectLabel')
              const fields = education
                ? [['qualification', t('qualificationLabel'), 'text', 150], ['institution', t('institutionLabel'), 'text', 150], ['location', t('locationLabel'), 'text', 150]]
                : [['name', t('projectNameLabel'), 'text', 150], ['role', t('yourRoleLabel'), 'text', 150], ['url', t('projectLinkLabel'), 'url', 300]]

              return (
                <div className="mt-6">
                  <h2 className="text-lg font-bold">{steps[step]}</h2>
                  <p className="mt-1 text-sm text-slate-500">{education ? t('educationTrainingSubtitle') : t('projectsHelpText')}</p>
                  <div className="mt-6 space-y-5">
                    {content[section].map((entry, index) => (
                      <fieldset key={entry.id} className="min-w-0 space-y-4 rounded-xl border border-slate-200 p-4">
                        <legend className="px-1 text-sm font-semibold">{education ? t('educationTrainingSection') : t('projectLabel')} {index + 1}</legend>
                        {fields.map(([field, title, type, maxLength]) => (
                          <div key={field}>
                            <label htmlFor={`${entry.id}-${field}`} className="mb-1.5 block text-sm font-medium">{title}</label>
                            <input id={`${entry.id}-${field}`} type={type} maxLength={maxLength} value={entry[field]} onChange={(event) => updateEntry(section, entry.id, field, event.target.value)} className={inputClass} />
                          </div>
                        ))}
                        <div>
                          <label htmlFor={`${entry.id}-start`} className="mb-1.5 block text-sm font-medium">{t('startDateLabel')}</label>
                          <input id={`${entry.id}-start`} type="month" value={entry.startDate} onChange={(event) => updateEntry(section, entry.id, 'startDate', event.target.value)} className={inputClass} />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={entry.isCurrent} onChange={(event) => updateEntry(section, entry.id, 'isCurrent', event.target.checked)} className="accent-teal-600" />
                          {education ? t('currentlyStudyingLabel') : t('ongoingProjectLabel')}
                        </label>
                        {!entry.isCurrent && (
                          <div>
                            <label htmlFor={`${entry.id}-end`} className="mb-1.5 block text-sm font-medium">{t('endDateLabel')}</label>
                            <input id={`${entry.id}-end`} type="month" min={entry.startDate || undefined} value={entry.endDate} onChange={(event) => updateEntry(section, entry.id, 'endDate', event.target.value)} className={inputClass} />
                          </div>
                        )}
                        <div>
                          <label htmlFor={`${entry.id}-description`} className="mb-1.5 block text-sm font-medium">{education ? t('detailsLabel') : t('descriptionAndContributionLabel')}</label>
                          <textarea id={`${entry.id}-description`} rows={4} maxLength={2500} value={entry.description} onChange={(event) => updateEntry(section, entry.id, 'description', event.target.value)} className={`${inputClass} resize-y`} />
                        </div>
                        <button type="button" onClick={() => removeEntry(section, entry.id)} className="text-sm text-red-600 hover:text-red-800">{t('removeButton')} {label} {index + 1}</button>
                      </fieldset>
                    ))}
                  </div>
                  <button type="button" onClick={() => addEntry(section)} className="mt-5 w-full rounded-lg border border-dashed border-teal-400 px-4 py-3 text-sm font-medium text-teal-700 hover:bg-teal-50">{t('addButton')} {label}</button>
                </div>
              )
            })()}
            {step === 5 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold">{t('skillsSectionTitle')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('skillsHelpText')}</p>
                <div className="mt-6 space-y-5">
                  {content.skills.map((group, index) => (
                    <fieldset key={group.id} className="min-w-0 space-y-4 rounded-xl border border-slate-200 p-4">
                      <legend className="px-1 text-sm font-semibold">{t('skillGroupLabel')} {index + 1}</legend>
                      <div>
                        <label htmlFor={`${group.id}-category`} className="mb-1.5 block text-sm font-medium">{t('categoryLabel')} ( {t('optionalLabel')} )</label>
                        <input id={`${group.id}-category`} maxLength={100} value={group.category} onChange={(event) => updateEntry('skills', group.id, 'category', event.target.value)} placeholder={t('programmingBackendExample')} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor={`${group.id}-items`} className="mb-1.5 block text-sm font-medium">{t('skillsSectionTitle')}</label>
                        <textarea id={`${group.id}-items`} rows={3} maxLength={1000} value={group.items} onChange={(event) => updateEntry('skills', group.id, 'items', event.target.value)} placeholder="JavaScript, Python, Node.js, Express" className={`${inputClass} resize-y`} />
                      </div>
                      <button type="button" onClick={() => removeEntry('skills', group.id)} className="text-sm text-red-600 hover:text-red-800">{t('removeSkillGroupButton')} {index + 1}</button>
                    </fieldset>
                  ))}
                </div>
                <button type="button" onClick={addSkillGroup} className="mt-5 w-full rounded-lg border border-dashed border-teal-400 px-4 py-3 text-sm font-medium text-teal-700 hover:bg-teal-50">{t('addSkillGroupButton')}</button>
              </div>
            )}
          </section>

          <div tabIndex={0} role="region" aria-label={rtl ? 'معاينة السيرة الذاتية القابلة للتمرير' : 'Scrollable resume preview'} className="min-h-0 min-w-0 overflow-y-auto overscroll-contain lg:col-span-3">
          <section
            id="resume-preview"
            aria-label="Resume preview"
            className="min-w-0 border border-[#e3edfa] bg-white shadow-sm lg:col-span-3"
          >
            {currentTemplate === 'executive' ? (
              <ExecutiveTemplate
                content={content}
                accentColor={accentColor}
                t={t}
                presentLabel={presentLabel}
                contactDetails={contactDetails}
                hasEntryContent={hasEntryContent}
              />
            ) : (
              <ClassicTemplate
                content={content}
                accentColor={accentColor}
                t={t}
                presentLabel={presentLabel}
                contactDetails={contactDetails}
                hasEntryContent={hasEntryContent}
              />
            )}
          </section>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Builder
