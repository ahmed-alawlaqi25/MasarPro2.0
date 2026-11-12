import Home from './pages/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Contact from './pages/Contact'
import JobApplication from './pages/JobApplication'
import JobTracker from './pages/JobTracker'
import ResumeBuilder from './pages/ResumeBuilder'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import PublicLayout from './pages/PublicLayout'
import Builder from './pages/Builder'
import Confirmemail from './pages/Confirmemail'
import { AuthProvider } from './components/AuthContext'
import { JobProvider } from './components/JopContext'
import PageMetadata from './components/PageMetadata'
import CoverLetter from './pages/CoverLetter'



const App = () => {

  return (
    <AuthProvider>
      <PageMetadata />
    
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="confirm-email" element={<Confirmemail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="callback" element={<Callback />} />
        </Route>

        
          <Route
            element={
              <JobProvider>
                <Dashboard />
              </JobProvider>
            }
          >
            <Route path="job-tracker/:applicationID" element={<JobApplication />} />
            <Route path="job-tracker" element={<JobTracker />} />
            <Route path="resume-builder" element={<ResumeBuilder/>}/>
            <Route path="cover-letter" element={<CoverLetter />}/>
            <Route path="cover-letter/:resumeID" element={<CoverLetter />}/>
            <Route path="resume-builder/:resumeID" element={<Builder />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    
  )
}

export default App
