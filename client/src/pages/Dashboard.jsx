import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'

const Dashboard = () => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (active) {
        setSession(session)
        setLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
        setLoading(false)
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Dashboard