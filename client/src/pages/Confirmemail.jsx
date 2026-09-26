import { Mail } from 'lucide-react'
import React from 'react'
import { useAuth } from '../components/AuthContext'
import { useTranslation } from 'react-i18next'

const Confirmemail = () => {

  const {t} =useTranslation()
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

        <p className="text-lg font-bold">{t('verifyEmailTitle')}</p>

        <p className="mt-2 text-sm text-slate-600">
          {t('verifyEmailSubtitle')}
        </p>
        <p className="mt-1 text-sm font-semibold">{profile?.email}</p>

        <p className="mt-4 text-sm text-slate-600">
          {t('verifyEmailInstructions')}
           <b>{t('spamFolder')}</b>.
        </p>
      </div>
    </div>
  )
}

export default Confirmemail
