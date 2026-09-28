import { CloudUpload, Plus, Search, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import ResumeCard from '../components/ResumeCard'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ResumeBuilder = () => {

  const { session } = useAuth()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setshowUploadResume] = useState(false)
  const [title, setTitle] = useState("")
  const [resumes, setResumes] = useState([])
  const [resumeError, setResumeError] = useState('')
  const userId = session?.user?.id

  const {t} = useTranslation()


  useEffect(() => {
  let active = true

  const fetchResumes = async () => {
    setResumes([])
    setResumeError('')

    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('resume_id, title, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      if (active) setResumes(data ?? [])
    } catch (err) {
      if (active) {
        setResumeError(err.message || 'Unable to load resumes.')
      }
    }
  }

  fetchResumes()

  return () => {
    active = false
  }
}, [userId])
  const navigate = useNavigate()

  const createResume = async (event) => {
  event.preventDefault()

  if (creating) return

  setError('')

  if (!session?.user?.id) {
    setError('Please sign in before creating a resume.')
    return
  }

  if (!title.trim()) {
    setError('Enter a resume title.')
    return
  }

  setCreating(true)

  try {
    const { data, error: insertError } = await supabase
      .from('resumes')
      .insert({
        user_id: session.user.id,
        title: title.trim(),
        content: {},
      })
      .select('resume_id')
      .single()

    if (insertError) throw insertError

    setShowCreateResume(false)
    setTitle('')

    navigate(`/resume-builder/${data.resume_id}`)
  } catch (err) {
    setError(err.message || 'Unable to create your resume.')
  } finally {
    setCreating(false)
  }
  }

  const renderResumes = () =>
  resumes.map((resume) => (
    <ResumeCard
      key={resume.resume_id}
      id={resume.resume_id}
      resume={resume}
      onEdit={() =>
        navigate(`/resume-builder/${resume.resume_id}`)
      }
    />
  ))

  return (
    <section className="min-h-screen bg-[#f4f9fc] px-8 py-10 lg:px-18 text-[#0c1945]">
        <div className='mb-8'>
          <p className='text-4xl font-bold'>{t('resumeBuilderTitle')}</p>
          <p className='text-gray-500 mt-1'>{t('resumeBuilderSubtitle')}</p>
        
      </div>

      <div className='flex flex-col lg:flex-row md:flex-row items-center gap-6 mb-6'>
        <div onClick={() => setShowCreateResume(true)} className='flex flex-col rounded-lg items-center justify-center w-[18rem] h-[12rem] border-2 border-dashed border-teal-500 bg-white/85 cursor-pointer hover:border-teal-300'>
            <div className='p-2 bg-teal-100 rounded-full text-teal-600 inline-block'>
              <Plus size={60} strokeWidth={1.4} />
            </div>
          <p className='text-2xl font-bold mt-1'>{t('createResumeButton')}</p>
          <p className='text-gray-400 text-sm'>{t('startWithBlankResume')}</p>
        </div>

        <div className='flex flex-col rounded-lg items-center justify-center w-[18rem] h-[12rem] border-2 border-[#e3edfa] bg-white/85 cursor-pointer hover:border-blue-300 shadow-[0_3px_10px_rgba(31,52,85,0.07)]'>
          <div className='p-2 bg-sky-100 rounded-full text-blue-500 inline-block'>
            <CloudUpload size={60} strokeWidth={1.4}/>
          </div>
          <p className='text-2xl font-bold mt-1'>{t('uploadExisting')}</p>
          <p className='text-gray-400 text-sm'>{t('importYourResume')}</p>
        </div>     
      </div>      
      <hr className='text-gray-300 mb-6'/>
      <div className='flex flex-row  justify-between items-center mb-8'>
        <div className='flex gap-2'>
          <p className='sm:text-md lg:text-2xl font-bold '>{t('yourResumesTitle')}</p>
          <p className='w-8 h-7 rounded-full lg:mt-1 font-bold flex items-center justify-center bg-gray-200'>{resumes.length}</p>
          </div>
          <div className='relative'>
            <Search aria-hidden="true" className="pointer-events-none absolute mr-2 ml-2 top-1/2 -translate-y-1/2 text-slate-400"  />
            <input type="text" 
              aria-label="Search resume by resume title"
              placeholder={t('searchResumePlaceholder')}
            className='h-[40px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 [&::-webkit-search-cancel-button]:appearance-none' />
          </div>
      </div>

      {showCreateResume && (
        <form onSubmit={createResume} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className=' relative border border-[#e3edfa] bg-white shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>{t('createResumeButton')}</h2>
              <input
                  type="text"
                  placeholder= {t('enterResumeTitlePlaceholder')}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="w-full rounded-lg border border-[#e3edfa] px-4 py-2 mb-4"
                />
              {error && (
                <p role="alert" className="mb-3 text-sm text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={creating}
                className="w-full rounded bg-linear-to-l from-[#0874c9] to-[#0eb0b2] py-2 text-white disabled:opacity-50"
              >
                {creating ? `${t('creatingResumeLoading')}` : `${t('createResumeButton')}`}
              </button>
              <XIcon className={`absolute top-4  text-slate-400 hover:text-slate-600 cursor-pointer transition-colors ${document.documentElement.dir === "ltr"? "right-4": "left-4"}`} onClick={() => {setShowCreateResume(false); setTitle("")}}/>
            </div>
        </form>
      )}

      {resumeError && (
      <p role="alert" className="mb-4 text-sm text-red-600">
        {resumeError}
      </p>
    )}

    <div className="flex flex-wrap gap-8">
      {renderResumes()}
    </div>
    </section>
  )
}

export default ResumeBuilder