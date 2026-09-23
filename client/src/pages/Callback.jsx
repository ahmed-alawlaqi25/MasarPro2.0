import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Callback = () => {
  const navigate = useNavigate()
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const finishLogin = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        setError(error.message)
        return
      }

      if (session) {
        navigate('/job-tracker', { replace: true })
        return
      }

      setError('The sign-in link is invalid or expired.')
    }

    finishLogin()
  }, [navigate])

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f9fc]">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#07133f]" />
    </div>

  )  
}

export default Callback