import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { avatarPath, AVATAR_BUCKET, DEFAULT_AVATAR } from '../lib/avatar'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [profileOwner, setProfileOwner] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const userId = session?.user?.id
  const currentProfile = profileOwner === userId ? profile : null
  const storedAvatar = currentProfile?.avatar_url

  useEffect(() => {
    let active = true

    let authChanged = false
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!active || authChanged) return
      setSession(session)
      setSessionReady(true)
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        authChanged = true
        setSession(nextSession)
        setSessionReady(true)
        if (!nextSession) {
          setProfile(null)
          setProfileOwner(null)
          setAvatar(null)
        }
      }
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!userId) return
    let active = true
    supabase.from('profiles').select('*').eq('user_id', userId).single()
      .then(({ data }) => {
        if (!active) return
        setProfile(data)
        setProfileOwner(userId)
      })
    return () => { active = false }
  }, [userId])

  useEffect(() => {
    const path = avatarPath(supabase, storedAvatar, userId)
    if (!path) return
    let active = true
    let objectUrl
    supabase.storage.from(AVATAR_BUCKET).download(path).then(({ data, error }) => {
      if (!active || error) return
      objectUrl = URL.createObjectURL(data)
      setAvatar({ userId, storedAvatar, src: objectUrl })
    }).catch(() => { /* The default avatar remains available on download failure. */ })
    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [userId, storedAvatar])

  const updateProfile = (nextProfile) => {
    if (nextProfile?.user_id !== userId) return
    setProfile(nextProfile)
    setProfileOwner(userId)
  }
  const avatarSrc = userId && storedAvatar && avatar?.userId === userId && avatar.storedAvatar === storedAvatar
    ? avatar.src : DEFAULT_AVATAR
  const loading = !sessionReady || Boolean(userId && profileOwner !== userId)

  return (
    
    <AuthContext.Provider
        value={{ session, profile: currentProfile, loading, updateProfile, avatarSrc }}
    >
        {children}
    </AuthContext.Provider>

 
  )
}

// The shared hook intentionally lives beside its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
