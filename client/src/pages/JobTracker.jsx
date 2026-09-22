import { useState } from 'react'
import Card from '../components/Card'
import {  CircleCheckBig, FileText, Heart, Send, UserRoundGroup, Plus, Search, X } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard'
import JobApplicationForm from '../components/JobApplicationForm';
import { useJob } from '../components/JopContext';





const JobTracker = () => {

  const { jobs, setJobs, loading, error } = useJob();

    const getJobCount = (columnId) =>
    jobs.filter((job) => job.status === columnId).length;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className='bg-[#f4f9fc]'>
      
      <div className='px-5  md:px-10  pt-4'>
        <div className='flex justify-between mt-4'>
          <div>
            <h1 className='text-4xl font-bold'>Job-Tracker</h1>
          </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-3 rounded-lg bg-linear-to-l from-[#0874c9] to-[#0eb0b2] px-10 text-white transition hover:opacity-90">
              <Plus />
              <p>Add New Job</p>
            </button>
          </div>
              <small className='text-slate-600 '>Tracker every job application in one place, </small>
        <div className='flex flex-wrap items-center gap-3 mt-3'>
          <Card icon = {<Heart fill="currentColor"/>} count={getJobCount("wishlist")} text="Wish List" bgColor="gray"  textColor="gray"/>
          <Card icon = {<Send />} count={getJobCount("applied")} text="Applied" bgColor="blue" textColor="blue"/> 
          <Card icon = {<UserRoundGroup />}count={getJobCount("interview")} text="Interview" bgColor="orange" textColor="orange"/>
          <Card icon = {<FileText />}count={getJobCount("offer")} text="Offer" bgColor="violet" textColor="violet"/>
          <Card icon = {<CircleCheckBig />}count={getJobCount("accepted")} text="Accept" bgColor="green" textColor="green" />
          <div className="relative mt-2 w-full md:ml-auto md:w-80">
            <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search applications by company or job title"
              placeholder="Search company or job title..."
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
      {loading && <p className="mx-10 mt-4" role="status">Loading applications...</p>}
      {error && <p className="mx-10 mt-4 text-red-600" role="alert">Unable to load applications: {error}</p>}
      <KanbanBoard jobs={jobs} setJobs={setJobs} searchQuery={searchQuery} />
      {isFormOpen && (
        <JobApplicationForm onClose={() => setIsFormOpen(false)} />
        )}


    </section>
  )
}

export default JobTracker
