import React from 'react'
import Card from '../components/Card'
import { Heart, Plus } from 'lucide-react'

const JobTracker = () => {
  return (
    <section className='bg-[#f4f9fc] '>
      <div className='px-5  md:px-10 lg:px-22 pt-4'>
        <div className='flex justify-between '>
          <div>
            <h1 className='text-4xl font-bold'>Job-Tracker</h1>
          </div>
            <button className=" flex items-center gap-3 rounded-lg bg-linear-to-l from-[#0874c9] to-[#0eb0b2] px-10   text-white transition hover:opacity-90">
                <Plus /><p>Add New Job </p>
            </button>
          </div>
              <small className='text-slate-600'>Tracker every job application in one place, </small>
        <div className='flex gap-3 '>
          <Card icon = {<Heart />} text= "Wish List" bgColor="gray" />
          <Card icon = {<Heart />} text= "Wish List" bgColor="blue" />
          <Card icon = {<Heart />} text= "Wish List" bgColor="orange" />
          <Card icon = {<Heart />} text= "Wish List" bgColor="indigo" />
          <Card icon = {<Heart />} text= "Wish List" bgColor="green" />
        </div>
      </div>
    </section>
  )
}

export default JobTracker