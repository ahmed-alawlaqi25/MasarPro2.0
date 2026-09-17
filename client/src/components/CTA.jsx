import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from "react-router";



const CTA = () => {

    const {t} = useTranslation();
  return (
        <div className="w-full max-w-5xl  mx-auto px-6 sm:px-10">
        <div className="relative  overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-12 sm:px-10 md:px-14">

       

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
        
        <Link to="/login?state=register" className="flex items-center gap-3 rounded-lg bg-linear-to-l from-[#0874c9] to-[#0eb0b2] px-7 py-3 font-medium text-white transition hover:opacity-90">
                    
        <span>{t('startNow')}</span>
        {document.documentElement.dir == "rtl" ? <ChevronLeft /> : <ChevronRight />}
        
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
        
        </svg>
        </Link>

        </div>
        </div>
        </div>
    )
}

export default CTA