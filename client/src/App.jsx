import React from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Confirmemail from './pages/Confirmemail'
import Callback from './pages/Callback'
import Contact from './pages/Contact'
import Application from './pages/Application'
import JobTracker from './pages/JobTracker'
import ResumeBuilder from './pages/ResumeBuilder'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import PublicLayout from './pages/PublicLayout'
import Preview from './pages/Preview'
import Blog from './pages/Blog'
import Builder from './pages/Builder'


const App = () => {

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="confirm-email" element={<Confirmemail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="preview/:resumeLink" element={<Preview />}/>
          <Route path="preview/:resumeLink" element={<Preview />}/>
        </Route>

        <Route element={<Dashboard />}>
          <Route path="application/:applicationID" element={<Application />} />
          <Route path="callback" element={<Callback />} />
          <Route path="job-tracker" element={<JobTracker />} />
          <Route path="resume-builde" element={<ResumeBuilder/>}/>
          <Route path="builder/:resumeID" element={<Builder />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
    
  )
}

export default App
