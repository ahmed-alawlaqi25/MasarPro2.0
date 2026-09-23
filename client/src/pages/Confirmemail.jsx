import { Mail } from 'lucide-react'
import React from 'react'
import { useAuth } from '../components/AuthContext'

const Confirmemail = () => {

  const {profile } = useAuth()
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f9fc] px-4 text-[#07133f]">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-600/30 via-sky-500/10 via-50% to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <Mail className="h-7 w-7 text-green-600" />
        </div>

        <p className="text-lg font-bold">Please verify your email</p>

        <p className="mt-2 text-sm text-slate-600">
          You're almost there! We sent an email to
        </p>
        <p className="mt-1 text-sm font-semibold">{profile?.email}</p>

        <p className="mt-4 text-sm text-slate-600">
          Click the link in that email to complete your signup. Don't see it?
          Check your <b>spam folder</b>.
        </p>
      </div>
    </div>
  )
}

export default Confirmemail
