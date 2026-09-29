import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from './supabase'
import { normalizeResumeContent } from './resumeContent'

export function useResumeDraft(resumeId, userId) {
  const [content, setValue] = useState(() => normalizeResumeContent({}))
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const draft = useRef(null)
  const saved = useRef('')
  const timer = useRef(null)
  const inFlight = useRef(null)
  const active = useRef(false)

  const save = useCallback(async () => {
    clearTimeout(timer.current)
    if (!draft.current) return
    if (inFlight.current) return inFlight.current
    if (saved.current === JSON.stringify(draft.current)) return

    const task = async () => {
      try {
        // Serialize writes so an older request never overwrites a newer edit.
        while (saved.current !== JSON.stringify(draft.current)) {
          const snapshot = draft.current
          const serialized = JSON.stringify(snapshot)
          if (active.current) { setStatus('saving'); setError('') }
          const { data, error } = await supabase.from('resumes')
            .update({ content: snapshot, updated_at: new Date().toISOString() })
            .eq('resume_id', resumeId).eq('user_id', userId)
            .select('resume_id').single().abortSignal(AbortSignal.timeout(15000))
          if (error) throw error
          if (!data) throw new Error('Resume was not saved.')
          saved.current = serialized
        }
        if (active.current) setStatus('saved')
      } catch (error) {
        if (active.current) {
          setError(error.message || 'Unable to save your resume.')
          setStatus('error')
        }
      } finally {
        inFlight.current = null
      }
    }
    inFlight.current = task()
    return inFlight.current
  }, [resumeId, userId])

  useEffect(() => {
    active.current = true
    let cancelled = false
    const load = async () => {
      try {
        const { data, error } = await supabase.from('resumes').select('content')
          .eq('resume_id', resumeId).eq('user_id', userId).single().abortSignal(AbortSignal.timeout(15000))
        if (error) throw error
        if (cancelled) return
        const value = normalizeResumeContent(data.content)
        draft.current = value
        saved.current = JSON.stringify(value)
        setValue(value)
        setStatus('saved')
      } catch (error) {
        if (!cancelled) {
          setError(error.message || 'Unable to open this resume.')
          setStatus('load-error')
        }
      }
    }
    load()
    const beforeUnload = event => {
      if (draft.current && saved.current !== JSON.stringify(draft.current)) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => {
      cancelled = true
      active.current = false
      clearTimeout(timer.current)
      window.removeEventListener('beforeunload', beforeUnload)
      // Flush pending edits on client-side navigation while the page stays alive.
      void save()
    }
  }, [resumeId, userId, save])

  const setContent = useCallback(update => {
    if (!draft.current) return
    const next = typeof update === 'function' ? update(draft.current) : update
    draft.current = next
    setValue(next)
    setStatus('pending')
    setError('')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { void save() }, 700)
  }, [save])

  return { content, setContent, status, error, save }
}
