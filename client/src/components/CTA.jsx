import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next'




const CTA = () => {

    const {t} = useTranslation();
  return (
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 sm:px-10 md:px-14">

        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#20baa5] opacity-10 blur-[90px]" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">

        <div className="max-w-lg">
        <span className="mb-3 inline-block rounded-full bg-[#e8f7f5] px-4 py-1.5 text-sm font-medium text-[#0b9f91]">
        {t("startYourJourneyTitle")}
        </span>

        <h2 className="text-2xl font-semibold leading-tight text-[#07133f] sm:text-3xl">
        {t('readyToOrganizeTitle')}
        </h2>

        <p className="mt-3 text-slate-500">
        {t('startYourJourneyDesc')}
        </p>
        </div>

        <a
        href="#"
        className="flex shrink-0 items-center gap-3 rounded-xl bg-linear-to-r from-[#0fc2b3] to-[#114f83] px-7 py-3.5 font-medium text-white shadow-lg shadow-cyan-100 transition hover:-translate-y-0.5 hover:opacity-95"
        >
        <span>{t('startNow')}</span>

        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        {document.documentElement.dir == "rtl" ? <ChevronLeft /> : <ChevronRight />}
        </svg>
        </a>
        </div>
        </div>
        </div>
    )
}

export default CTA