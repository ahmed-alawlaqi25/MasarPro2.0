import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!active) return
      setSession(session)

      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (active) setProfile(data)
      }

      if (active) setLoading(false)
    }

    loadSessionAndProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    
    <AuthContext.Provider
        value={{ session, profile, loading }}
    >
        {children}
    </AuthContext.Provider>

 
  )
}

export const useAuth = () => useContext(AuthContext)