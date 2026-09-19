import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Contact from './pages/Contact'
import JobApplication from './pages/JobApplication'
import JobTracker from './pages/JobTracker'
import ResumeBuilder from './pages/ResumeBuilder'
import Settings from './pages/Settings'
import Dashboard from './pages/Dashboard'
import PublicLayout from './pages/PublicLayout'
import Preview from './pages/Preview'
import Blog from './pages/Blog'
import Builder from './pages/Builder'
import Confirmemail from './pages/Confirmemail'


const App = () => {

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="confirm-email" element={<Confirmemail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="preview/:resumeLink" element={<Preview />}/>
          <Route path="callback" element={<Callback />} />
        </Route>

        <Route element={<Dashboard />}>
          <Route path="job-tracker/:applicationID" element={<JobApplication />} />
          <Route path="job-tracker" element={<JobTracker />} />
          <Route path="resume-builde" element={<ResumeBuilder/>}/>
          <Route path="blog" element={<Blog />} />
          <Route path="builder/:resumeID" element={<Builder />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
    
  )
}

export default App
