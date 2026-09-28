import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, PanelsTopLeft, Palette, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'



const personalFields = [
  {
    name: 'fullName',
    label: `${t('fullNameLabel')}`,
    placeholder: 'Ahmed Alawlaqi',
    autoComplete: 'name',
  },
  {
    name: 'professionalTitle', 
    label: 'Professional title',
    placeholder: 'Frontend Developer',
    autoComplete: 'organization-title',
  },
  {
    name: 'email',
    label: 'Email address',
    placeholder: 'ahmed@example.com',
    type: 'email',
    autoComplete: 'email',
  },
  {
    name: 'phone',
    label: 'Phone number',
    placeholder: '+966',
    type: 'tel',
    autoComplete: 'tel',
  },
  {
    name: 'location',
    label: 'Location',
    placeholder: 'Riyadh, Saudi Arabia',
    autoComplete: 'address-level2',
  },
  {
    name: 'website',
    label: 'Website',
    placeholder: 'https://yourwebsite.com',
    type: 'url',
    autoComplete: 'url',
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    placeholder: 'https://www.linkedin.com/in/yourname',
    type: 'url',
  },
]

const accentColors = [
  ['Blue', '#3b82f6'], ['Indigo', '#6366f1'], ['Purple', '#8b5cf6'],
  ['Green', '#059669'], ['Red', '#ef4444'], ['Orange', '#f97316'],
  ['Teal', '#0d9488'], ['Pink', '#ec4899'], ['Gray', '#6b7280'],
  ['Black', '#1f2937'],
]

const Builder = () => {
  const { t ,i18n } = useTranslation()
  const rtl = i18n.language.startsWith('ar')
  const [accentColor, setAccentColor] = useState('#0c1945')
  const [accentOpen, setAccentOpen] = useState(false)
  const accentPicker = useRef(null)
  const accentButton = useRef(null)

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

  const [step, setStep] = useState(0)
  const steps = [
    'Personal Information',
    'Professional Summary',
    'Professional Experience',
    'Education & Training',
    'Projects',
    'Skills',
  ]

const inputClass =
  'w-full rounded-lg border border-[#e3edfa] px-3 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100'

  const [content, setContent] = useState({
    personal: {
      fullName: '',
      professionalTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
    },
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: [],
  })
  
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

  const personal = content.personal

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

  const contactDetails = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    personal.linkedin,
  ].filter((value) => value.trim())



  return (
    <section
      className="min-h-screen bg-[#f4f9fc] px-5 py-8 text-[#0c1945] sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <Link
          to="/resume-builder"
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700"
        >
          {rtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          {t('backToResumesLink')}
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-5">
          <section className="min-w-0 rounded-lg border border-t-4 border-[#e3edfa] bg-white px-6 py-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2" role="group" aria-label="Resume editor controls">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled
                  title="Template selection coming soon"
                  className="inline-flex cursor-not-allowed items-center gap-1 rounded-md border border-sky-100 bg-sky-50 px-2 py-2 text-xs font-medium text-sky-700"
                >
                  <PanelsTopLeft size={14} aria-hidden="true" />
                  {t('templateTab')}
                </button>
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

            {step === 0 && <>
            <h2 className="mt-6 text-lg font-bold">
              {t('personalInformationSection')}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t('personalInformationSubtitle')}
            </p>

            <div className="my-6 flex items-center gap-3">
              <img
                src="/Sample_User_Icon.png"
                alt="Default profile"
                className="h-16 w-16 rounded-full object-cover"
              />
              <p className="text-sm text-slate-400">
                {t('photoUploadNotice')}
              </p>
            </div>

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
                <h2 className="text-lg font-bold">Professional Summary</h2>
                <p className="mt-1 text-sm text-slate-500">Describe your background, strengths, and career focus.</p>
                <label htmlFor="professional-summary" className="mb-2 mt-6 block text-sm font-medium">Summary</label>
                <textarea
                  id="professional-summary"
                  rows={8}
                  value={content.summary}
                  onChange={(event) => {
                    const value = event.target.value
                    setContent((previous) => ({ ...previous, summary: value }))
                  }}
                  placeholder="Frontend developer with experience building..."
                  className={`${inputClass} resize-y`}
                />
              </div>
            )}

            {step === 2 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold">Professional Experience</h2>
                <p className="mt-1 text-sm text-slate-500">Add your work experience, starting with your most recent role.</p>
                <div className="mt-6 space-y-5">
                  {content.experience.map((job, index) => (
                    <fieldset key={job.id} className="min-w-0 space-y-4 rounded-xl border border-slate-200 p-4">
                      <legend className="px-1 text-sm font-semibold">Experience {index + 1}</legend>
                      {[
                        ['position', 'Job title'],
                        ['company', 'Company'],
                        ['location', 'Location'],
                      ].map(([field, label]) => (
                        <div key={field}>
                          <label htmlFor={`${job.id}-${field}`} className="mb-1.5 block text-sm font-medium">{label}</label>
                          <input id={`${job.id}-${field}`} value={job[field]} onChange={(event) => updateExperience(job.id, field, event.target.value)} className={inputClass} />
                        </div>
                      ))}
                      <div>
                        <label htmlFor={`${job.id}-start`} className="mb-1.5 block text-sm font-medium">Start date</label>
                        <input id={`${job.id}-start`} type="month" value={job.startDate} onChange={(event) => updateExperience(job.id, 'startDate', event.target.value)} className={inputClass} />
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={job.isCurrent} onChange={(event) => updateExperience(job.id, 'isCurrent', event.target.checked)} className="accent-teal-600" />
                        I currently work here
                      </label>
                      {!job.isCurrent && (
                        <div>
                          <label htmlFor={`${job.id}-end`} className="mb-1.5 block text-sm font-medium">End date</label>
                          <input id={`${job.id}-end`} type="month" min={job.startDate || undefined} value={job.endDate} onChange={(event) => updateExperience(job.id, 'endDate', event.target.value)} className={inputClass} />
                        </div>
                      )}
                      <div>
                        <label htmlFor={`${job.id}-highlights`} className="mb-1.5 block text-sm font-medium">Responsibilities and achievements</label>
                        <textarea id={`${job.id}-highlights`} rows={5} value={job.highlights.join('\n')} onChange={(event) => updateExperience(job.id, 'highlights', event.target.value.split('\n'))} placeholder="Write one point per line" className={`${inputClass} resize-y`} />
                      </div>
                      <button type="button" onClick={() => removeExperience(job.id)} className="text-sm text-red-600 hover:text-red-800">Remove experience {index + 1}</button>
                    </fieldset>
                  ))}
                </div>
                <button type="button" onClick={addExperience} className="mt-5 w-full rounded-lg border border-dashed border-teal-400 px-4 py-3 text-sm font-medium text-teal-700 hover:bg-teal-50">+ Add experience</button>
              </div>
            )}
            {(step === 3 || step === 4) && (() => {
              const education = step === 3
              const section = education ? 'education' : 'projects'
              const label = education ? 'education or training' : 'project'
              const fields = education
                ? [['qualification', 'Qualification or course', 'text'], ['institution', 'Institution or training provider', 'text'], ['location', 'Location', 'text']]
                : [['name', 'Project name', 'text'], ['role', 'Your role', 'text'], ['url', 'Project link', 'url']]

              return (
                <div className="mt-6">
                  <h2 className="text-lg font-bold">{steps[step]}</h2>
                  <p className="mt-1 text-sm text-slate-500">{education ? 'Add your qualifications, courses, and training.' : 'Highlight projects and explain your contribution.'}</p>
                  <div className="mt-6 space-y-5">
                    {content[section].map((entry, index) => (
                      <fieldset key={entry.id} className="min-w-0 space-y-4 rounded-xl border border-slate-200 p-4">
                        <legend className="px-1 text-sm font-semibold">{education ? 'Education & Training' : 'Project'} {index + 1}</legend>
                        {fields.map(([field, title, type]) => (
                          <div key={field}>
                            <label htmlFor={`${entry.id}-${field}`} className="mb-1.5 block text-sm font-medium">{title}</label>
                            <input id={`${entry.id}-${field}`} type={type} value={entry[field]} onChange={(event) => updateEntry(section, entry.id, field, event.target.value)} className={inputClass} />
                          </div>
                        ))}
                        <div>
                          <label htmlFor={`${entry.id}-start`} className="mb-1.5 block text-sm font-medium">Start date</label>
                          <input id={`${entry.id}-start`} type="month" value={entry.startDate} onChange={(event) => updateEntry(section, entry.id, 'startDate', event.target.value)} className={inputClass} />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={entry.isCurrent} onChange={(event) => updateEntry(section, entry.id, 'isCurrent', event.target.checked)} className="accent-teal-600" />
                          {education ? 'Currently studying or training' : 'Ongoing project'}
                        </label>
                        {!entry.isCurrent && (
                          <div>
                            <label htmlFor={`${entry.id}-end`} className="mb-1.5 block text-sm font-medium">End date</label>
                            <input id={`${entry.id}-end`} type="month" min={entry.startDate || undefined} value={entry.endDate} onChange={(event) => updateEntry(section, entry.id, 'endDate', event.target.value)} className={inputClass} />
                          </div>
                        )}
                        <div>
                          <label htmlFor={`${entry.id}-description`} className="mb-1.5 block text-sm font-medium">{education ? 'Details or achievements' : 'Description and contribution'}</label>
                          <textarea id={`${entry.id}-description`} rows={4} value={entry.description} onChange={(event) => updateEntry(section, entry.id, 'description', event.target.value)} className={`${inputClass} resize-y`} />
                        </div>
                        <button type="button" onClick={() => removeEntry(section, entry.id)} className="text-sm text-red-600 hover:text-red-800">Remove {label} {index + 1}</button>
                      </fieldset>
                    ))}
                  </div>
                  <button type="button" onClick={() => addEntry(section)} className="mt-5 w-full rounded-lg border border-dashed border-teal-400 px-4 py-3 text-sm font-medium text-teal-700 hover:bg-teal-50">+ Add {label}</button>
                </div>
              )
            })()}
            {step === 5 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold">Skills</h2>
                <p className="mt-1 text-sm text-slate-500">Group related skills together. Separate skills with commas.</p>
                <div className="mt-6 space-y-5">
                  {content.skills.map((group, index) => (
                    <fieldset key={group.id} className="min-w-0 space-y-4 rounded-xl border border-slate-200 p-4">
                      <legend className="px-1 text-sm font-semibold">Skill group {index + 1}</legend>
                      <div>
                        <label htmlFor={`${group.id}-category`} className="mb-1.5 block text-sm font-medium">Category (optional)</label>
                        <input id={`${group.id}-category`} value={group.category} onChange={(event) => updateEntry('skills', group.id, 'category', event.target.value)} placeholder="Programming & Backend" className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor={`${group.id}-items`} className="mb-1.5 block text-sm font-medium">Skills</label>
                        <textarea id={`${group.id}-items`} rows={3} value={group.items} onChange={(event) => updateEntry('skills', group.id, 'items', event.target.value)} placeholder="JavaScript, Python, Node.js, Express" className={`${inputClass} resize-y`} />
                      </div>
                      <button type="button" onClick={() => removeEntry('skills', group.id)} className="text-sm text-red-600 hover:text-red-800">Remove skill group {index + 1}</button>
                    </fieldset>
                  ))}
                </div>
                <button type="button" onClick={addSkillGroup} className="mt-5 w-full rounded-lg border border-dashed border-teal-400 px-4 py-3 text-sm font-medium text-teal-700 hover:bg-teal-50">+ Add skill group</button>
              </div>
            )}
          </section>

          <section
            aria-label="Resume preview"
            className="min-h-[700px] min-w-0 border border-[#e3edfa] bg-white px-4 py-6 shadow-sm sm:px-6 lg:col-span-3"
          >
            <header className="text-center">
              <h1
                style={{ color: accentColor }}
                className="break-words text-2xl leading-tight font-bold"
              >
                {personal.fullName.trim() || 'Your name'}
              </h1>

              {personal.professionalTitle.trim() && (
                <p className="mt-1 text-xs font-medium text-slate-600">
                  {personal.professionalTitle}
                </p>
              )}

              {contactDetails.length > 0 && (
                <ul className="mt-1 flex list-none flex-wrap justify-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
                  {contactDetails.map((detail, index) => (
                    <li
                      key={index}
                      className="max-w-full break-words"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </header>

            <hr className="mt-2 border-slate-200" />
            {content.summary.trim() && (
              <section className="mt-2">
                <h2 style={{ color: accentColor }} className="text-xs font-bold">PROFESSIONAL SUMMARY</h2>
                <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-[1.45] text-slate-700">{content.summary}</p>
              </section>
            )}

            {content.experience.some((job) => [job.position, job.company, job.location, job.startDate, job.endDate, ...job.highlights].some((value) => value.trim())) && (
              <section className="mt-2">
                <h2 style={{ color: accentColor }} className="border-t border-slate-200 pt-1.5 text-xs font-bold">PROFESSIONAL EXPERIENCE</h2>
                <div className="mt-1.5 space-y-2.5">
                  {content.experience.map((job) => {
                    const highlights = job.highlights.filter((line) => line.trim())
                    const dates = [job.startDate, job.isCurrent ? 'Present' : job.endDate].filter(Boolean).join(' – ')
                    const hasDetails = [job.position, job.company, job.location, job.startDate, job.endDate, ...highlights].some((value) => value.trim())
                    if (!hasDetails) return null

                    return (
                      <article key={job.id} className="break-words">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-xs font-semibold">{job.position || job.company}</h3>
                          <p className="text-xs text-slate-500">{dates}</p>
                        </div>
                        {(job.company || job.location) && <p className="mt-0.5 text-xs text-slate-600">{[job.position ? job.company : '', job.location].filter(Boolean).join(' · ')}</p>}
                        {highlights.length > 0 && (
                          <ul className="mt-1 list-disc space-y-0.5 ps-4 text-xs leading-[1.45] text-slate-700">
                            {highlights.map((line, index) => <li key={index}>{line}</li>)}
                          </ul>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            )}
            {['education', 'projects'].map((section) => {
              const entries = content[section].filter(hasEntryContent)
              if (!entries.length) return null
              const education = section === 'education'
              return (
                <section key={section} className="mt-2">
                  <h2 style={{ color: accentColor }} className="border-t border-slate-200 pt-1.5 text-xs font-bold">{education ? 'EDUCATION & TRAINING' : 'PROJECTS'}</h2>
                  <div className="mt-1.5 space-y-2.5">
                    {entries.map((entry) => (
                      <article key={entry.id} className="break-words">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h3 className="text-xs font-semibold">{education ? entry.qualification || entry.institution : entry.name}</h3>
                          <p className="text-xs text-slate-500">{[entry.startDate, entry.isCurrent ? 'Present' : entry.endDate].filter(Boolean).join(' – ')}</p>
                        </div>
                        {(education ? entry.location || (entry.qualification && entry.institution) : entry.role) && <p className="mt-0.5 text-xs text-slate-600">{education ? [entry.qualification ? entry.institution : '', entry.location].filter(Boolean).join(' · ') : entry.role}</p>}
                        {!education && entry.url.trim() && <p className="mt-1 break-all text-xs text-slate-500">{entry.url}</p>}
                        {entry.description.trim() && <p className="mt-1 whitespace-pre-wrap text-xs leading-[1.45] text-slate-700">{entry.description}</p>}
                      </article>
                    ))}
                  </div>
                </section>
              )
            })}
            {content.skills.some((group) => group.items.split(/[,\n،]/).some((item) => item.trim())) && (
              <section className="mt-2">
                <h2 style={{ color: accentColor }} className="border-t border-slate-200 pt-1.5 text-xs font-bold">SKILLS</h2>
                <div className="mt-1 space-y-0.5 text-xs leading-[1.45] text-slate-700">
                  {content.skills.map((group) => {
                    const items = group.items.split(/[,\n،]/).map((item) => item.trim()).filter(Boolean)
                    if (!items.length) return null
                    return (
                      <p key={group.id} className="break-words">
                        {group.category.trim() && <span className="font-semibold">{group.category.trim()}: </span>}
                        {items.join(', ')}
                      </p>
                    )
                  })}
                </div>
              </section>
            )}
          </section>
        </div>
      </div>
    </section>
  )
}

export default Builder
