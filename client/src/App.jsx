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


const App = () => {

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="confirm-email" element={<Confirmemail />} />
          <Route path="callback" element={<Callback />} />
          <Route path="contact" element={<Contact />} />
          <Route path="preview/:resumeLink" element={<Preview />}/>

          
        </Route>

        <Route element={<Dashboard />}>
          <Route path="application/:applicationID" element={<Application />} />
          <Route path="tracker" element={<JobTracker />} />
          <Route path="builder/:resumeID" element={<ResumeBuilder />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
    
  )
}

export default App
