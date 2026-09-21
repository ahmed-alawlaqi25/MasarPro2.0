import React, { Children, useEffect, useState } from 'react'
import Card from '../components/Card'
import {  CircleCheckBig, FileText, Heart, Send, UserRoundGroup, Plus } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard'
import JobApplicationForm from '../components/JobApplicationForm';




const JobTracker = () => {

  const [jobs, setJobs] = useState([
    { id: crypto.randomUUID(), columnId: "wishlist" }
  ]);

  const addJob = () => {
    setJobs((jobs) => [
      ...jobs,
      { id: crypto.randomUUID(), columnId: "wishlist" },
    ]);
  };

  const getJobCount = (columnId) =>
    jobs.filter((job) => job.columnId === columnId).length;

  const [isFormOpen, setIsFormOpen] = useState(false);

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
        <div className='flex gap-3 mt-3'>
          <Card icon = {<Heart fill="currentColor"/>} count={getJobCount("wishlist")} text="Wish List" bgColor="gray"  textColor="gray"/>
          <Card icon = {<Send />} count={getJobCount("applied")} text="Applied" bgColor="blue" textColor="blue"/> 
          <Card icon = {<UserRoundGroup />}count={getJobCount("interview")} text="Interview" bgColor="orange" textColor="orange"/>
          <Card icon = {<FileText />}count={getJobCount("offer")} text="Offer" bgColor="violet" textColor="violet"/>
          <Card icon = {<CircleCheckBig />}count={getJobCount("accepted")} text="Accept" bgColor="green" textColor="green" />
        </div>
      </div>
      <KanbanBoard jobs={jobs} setJobs={setJobs} />
      {isFormOpen && (
        <JobApplicationForm onClose={() => setIsFormOpen(false)} />
        )}
    </section>
  )
}

export default JobTracker