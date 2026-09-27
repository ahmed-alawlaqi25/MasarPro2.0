import { CloudUpload, Plus, Search, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import ResumeCard from '../components/ResumeCard'
import { Navigate } from 'react-router-dom'

const ResumeBuilder = () => {

    const [showCreateResume, setShowCreateResume] = useState(false)
    const [showUploadResume, setshowUploadResume] = useState(false)
    const [title, setTitle] = useState("")

  const createResume = async (event) => {
    event.preventDefault()
    setShowCreateResume(false)
    Navigate(`/resume-builde/232`)
  }
  return (
    <section className="min-h-screen bg-[#f4f9fc] px-8 py-10 lg:px-18 text-[#0c1945]">
        <div className='mb-8'>
          <p className='text-4xl font-bold'>Resume Builder</p>
          <p className='text-gray-500 mt-1'>Create, upload, and mangae your resumes in one place</p>
        
      </div>

      <div className='flex flex-col lg:flex-row md:flex-row items-center gap-6 mb-6'>
        <div onClick={() => setShowCreateResume(true)} className='flex flex-col rounded-lg items-center justify-center w-[18rem] h-[12rem] border-2 border-dashed border-teal-500 bg-white/85 cursor-pointer hover:border-teal-300'>
            <div className='p-2 bg-teal-100 rounded-full text-teal-600 inline-block'>
              <Plus size={60} strokeWidth={1.4} />
            </div>
          <p className='text-2xl font-bold mt-1'>Create resume</p>
          <p className='text-gray-400 text-sm'>Start with a blank resume</p>
        </div>

        <div className='flex flex-col rounded-lg items-center justify-center w-[18rem] h-[12rem] border-2 border-[#e3edfa] bg-white/85 cursor-pointer hover:border-blue-300 shadow-[0_3px_10px_rgba(31,52,85,0.07)]'>
          <div className='p-2 bg-sky-100 rounded-full text-blue-500 inline-block'>
            <CloudUpload size={60} strokeWidth={1.4}/>
          </div>
          <p className='text-2xl font-bold mt-1'>Upload existing</p>
          <p className='text-gray-400 text-sm'>Import your resume</p>
        </div>     
      </div>      
      <hr className='text-gray-300 mb-6'/>
      <div className='flex flex-row  justify-between items-center mb-8'>
        <div className='flex gap-2'>
          <p className='sm:text-md lg:text-2xl font-bold '>Your resumes</p>
          <p className='w-8 h-7 rounded-full lg:mt-1 font-bold flex items-center justify-center bg-gray-200'>0</p>
          </div>
          <div className='relative'>
            <Search aria-hidden="true" className="pointer-events-none absolute mr-2 ml-2 top-1/2 -translate-y-1/2 text-slate-400"  />
            <input type="text" 
              aria-label="Search resume by resume title"
              placeholder="Search resume"
            className='h-[40px] w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 [&::-webkit-search-cancel-button]:appearance-none' />
          </div>
      </div>

      {showCreateResume && (
        <form onSubmit={()=> createResume()} onClick={() => setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className=' relative border border-[#e3edfa] bg-white shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
              <input type="text" placeholder='Enter resume title' className='w-full px-4 py-2 rounded-lg mb-4 border focus:border-teal-400    border-[#e3edfa]' required />
              <button className='w-full py-2 bg-linear-to-l from-[#0874c9] to-[#0eb0b2] text-white rounded cursor-pointer hover:opacity-90 transition-colors'>Create Resume</button>
              <XIcon className=' absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={() => {setShowCreateResume(false); setTitle("")}}/>
            </div>
        </form>
      )}

      <div className="flex flex-wrap gap-8  ">
        <ResumeCard />
        <ResumeCard />
        <ResumeCard />



      </div>

    </section>
  )
}

export default ResumeBuilder