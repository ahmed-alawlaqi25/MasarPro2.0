import { useState } from 'react'
import Card from '../components/Card'
import { FileText, Heart, Send, UserRoundGroup, Plus, Search, X, BadgeCheck } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard'
import JobApplicationForm from '../components/JobApplicationForm';
import { useJob } from '../components/JopContext';
import { useTranslation } from 'react-i18next';





const JobTracker = () => {

  const {t} = useTranslation()

  const { jobs, setJobs, loading, error } = useJob();

    const getJobCount = (columnId) =>
    jobs.filter((job) => job.status === columnId).length;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className='bg-[#f4f9fc] text-[#0c1945]'>
      <div className='px-4 md:px-10 pt-4'>
        <div className='mt-2 flex items-center justify-between gap-2 md:gap-4'>
          <div className="min-w-0">
            <h1 className='text-lg font-bold leading-tight sm:text-2xl md:text-4xl'>{t('jobTracker')}</h1>
          </div>
            <button
              onClick={() => setIsFormOpen(true)}
              type="button"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-linear-to-l from-[#0874c9] to-[#0eb0b2] px-2.5 py-2 text-xs text-white transition hover:opacity-90 sm:gap-2 sm:px-4 sm:text-sm md:gap-3 md:px-10 md:py-3 md:text-base">
              <Plus aria-hidden="true" className="h-4 w-4 shrink-0 md:h-6 md:w-6" />
              <span>{t('addNewJobButton')}</span>
            </button>
          </div>
              <small className='mt-2 block text-xs leading-relaxed text-slate-500 sm:text-sm'>{t('trackApplicationsDescription')}</small>
        <div className='flex flex-wrap items-center gap-3 mt-3'>
          <div className="hidden flex-wrap items-center gap-3 md:flex">
          <Card icon = {<Heart fill="currentColor"/>} count={getJobCount("wishlist")} text={t('wishListStatus')} bgColor="gray"  textColor="gray"/>
          <Card icon = {<Send />} count={getJobCount("applied")} text={t('appliedStatus')} bgColor="blue" textColor="blue"/> 
          <Card icon = {<UserRoundGroup />}count={getJobCount("interview")} text={t('interviewStatus')} bgColor="orange" textColor="orange"/>
          <Card icon = {<FileText />}count={getJobCount("offer")} text={t('offerStatus')} bgColor="violet" textColor="violet"/>
          <Card icon = {<BadgeCheck /> }count={getJobCount("accepted")} text={t('acceptStatus')} bgColor="green" textColor="green" />
          </div>
          <div className={ document.documentElement.dir === "rtl"? "md:mr-auto relative flex mt-2 w-full md:w-80" : "md:ml-auto relative flex mt-2 w-full md:w-80"}>
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute mr-2 ml-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search applications by company or job title"
              placeholder={t('searchCompanyOrJobTitlePlaceholder')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-[60px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searchQuery && (
              <button type="button" aria-label="Clear search" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      {loading && <p className="mx-10 mt-4" role="status">{t('loadingApplications')}</p>}
      {error && <p className="mx-10 mt-4 text-red-600" role="alert">{t('unableToLoadApplications')}{error}</p>}
      <KanbanBoard jobs={jobs} setJobs={setJobs} searchQuery={searchQuery} />
      {isFormOpen && (
        <JobApplicationForm onClose={() => setIsFormOpen(false)} />
        )}
    </section>
  )
}

export default JobTracker
