import React from 'react'
import Card from '../components/Card'
import {  CircleCheckBig, FileText, Heart, Send, UserRoundGroup, Plus } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard'

const JobTracker = () => {
  return (
    <section className='bg-[#f4f9fc] h-screen '>
      <div className='px-5  md:px-10  pt-4'>
        <div className='flex justify-between mt-4'>
          <div>
            <h1 className='text-4xl font-bold'>Job-Tracker</h1>
          </div>
            <button className=" flex items-center gap-3 rounded-lg bg-linear-to-l from-[#0874c9] to-[#0eb0b2] px-10   text-white transition hover:opacity-90">
                <Plus /><p>Add New Job </p>
            </button>
          </div>
              <small className='text-slate-600 '>Tracker every job application in one place, </small>
        <div className='flex gap-3 mt-3'>
          <Card icon = {<Heart fill="currentColor"/>} text= "Wish List" bgColor="gray"  textColor="gray"/>
          <Card icon = {<Send />} text= "Applied" bgColor="blue" textColor="blue"/>
          <Card icon = {<UserRoundGroup />} text= "Interview" bgColor="orange" textColor="orange"/>
          <Card icon = {<FileText />} text= "Offer" bgColor="violet" textColor="violet"/>
          <Card icon = {<CircleCheckBig />} text= "Accept" bgColor="green" textColor="green"/>
        </div>
      </div>
      <KanbanBoard />
    </section>
  )
}

export default JobTracker