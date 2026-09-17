import React from 'react'
import { CalendarDays, FileText, Target } from "lucide-react";
import { useTranslation } from 'react-i18next';


const Feature = () => {

    const {t} = useTranslation();

    return (
    <section id='features'
        dir="rtl"
        className="relative overflow-hidden bg-[#f4f9fc] px-4 py-8"
    >
      {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-[55%] h-[240px] w-[120%] -translate-x-1/2 rounded-[50%] " />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* Badge */}
        <div className="rounded-full bg-[#e9f5ff] px-6 py-2 text-sm font-medium text-[#1683d4]">
          {t('featuresSectionTitle')}
        </div>

        {/* Heading */}
        <h2 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-[#07133f] md:text-5xl">
            {t('allTheToolsYouNeed')}{" "}
          <span className="bg-linear-to-l from-[#0a87c8] to-[#10b09f] bg-clip-text text-transparent">
           {t('inOnePlace')}
          </span>
        </h2>

        {/* Description */}
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
         {t('featuresSectionSubtitle')}
        </p>

        {/* Cards */}
        <div className="mt-10 grid w-full gap-5 md:grid-cols-3">
          <FeatureCard
            icon={<Target className="h-8 w-8 text-[#079c89]" />}
            iconBg="bg-[#ddf7f0]"
            title={t('jobTrackingTitle')}
            description={t('jobTrackingDesc')}
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-[#1675e8]" />}
            iconBg="bg-[#e8f3ff]"
            title={t('resumeBuilderTitle')}
            description={t('resumeBuilderDesc')}
          />

          <FeatureCard
            icon={<CalendarDays className="h-8 w-8 text-[#7c3aed]" />}
            iconBg="bg-[#f1eaff]"
            title={t('interviewOrganizerTitle')}
            description={t('interviewOrganizerTitle')}
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, iconBg, title, description }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg}`}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#07133f]">
        {title}
      </h3>

      <p className="mt-2 leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default Feature




