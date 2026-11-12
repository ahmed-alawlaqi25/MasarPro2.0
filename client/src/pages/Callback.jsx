import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Callback = () => {
  const navigate = useNavigate()
  const [error, setError] = React.useState('')

  React.useEffect(() => {
  let done = false

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (done) return
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        done = true
        navigate('/resume-builder', { replace: true })
      }
    }
  )

  // fallback: if no event fires, check once, then fail
  const timer = setTimeout(async () => {
    if (done) return
    const { data: { session }, error } = await supabase.auth.getSession()
    done = true
    if (session) navigate('/resume-builder', { replace: true })
    else setError(error?.message ?? 'The sign-in link is invalid or expired.')
  }, 3000)

  return () => {
    subscription.unsubscribe()
    clearTimeout(timer)
  }
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