import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Feather, Languages, Menu, MoveDownLeft, X,} from "lucide-react";
import { Link, NavLink } from "react-router";



const Hero = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const { t, i18n } = useTranslation();

      const changeLanguage = () => {
      const newLanguage = i18n.language === "ar" ? "en" : "ar";

      i18n.changeLanguage(newLanguage);

      document.documentElement.dir =
        newLanguage === "ar" ? "rtl" : "ltr";

      document.documentElement.lang = newLanguage;
     };

     

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f4f9fc] text-[#07133f]">
      {/* NAVBAR */}
      <nav className="relative z-50 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-4 md:px-10 lg:px-16">

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/logoNoText.png"
              alt="MasarPro Logo"
              className="w-[170px] object-contain"
            />
          </a>

          {/* Desktop menu */}
          <div className="hidden items-center gap-9 text-sm font-medium md:flex">
            <a href="/" className="rounded-full bg-[#e8f7f5] px-4 py-1.5 text-sm font-medium text-[#0b9f91]">
              {t('main')}
            </a>
            <a href="/#features" className="transition hover:text-[#0fae9d]">
              {t('feature')}
            </a>
            <a href="/contact" className="transition hover:text-[#0fae9d]">
              {t('contact')}
            </a>
             <button onClick={changeLanguage} className="flex items-center text-[#050040] hover:text-[#0fc2b3] transition cursor-pointer">
                <Languages />
                <span>{i18n.language === "ar" ? "EN" : "AR"}</span>
              </button>
          </div>

          {/* Desktop buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <Link to="/login?state=login" className="rounded-lg border border-[#0b86c6] px-7 py-3 font-medium transition hover:bg-sky-50">
              {t('loginMain')}
            </Link>

            <Link to="/login?state=register" className="flex items-center gap-3 rounded-lg bg-linear-to-l from-[#0874c9] to-[#0eb0b2] px-7 py-3 font-medium text-white transition hover:opacity-90">
            
             {t('startNow')}
            
            <span className="text-xl"></span>

            </Link>
          </div>

          {/* Mobile */}
          
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg  p-2 text-[#07133f] md:hidden hover:text-[#0fae9d]"
          >
            <Menu />
          </button>
          
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white/95 backdrop-blur-md md:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute left-6 top-6 text-3xl"
            >
              <X className="hover:text-[#0fae9d]"/>
            </button>

            <a className="rounded-full bg-[#e8f7f5] px-8 py-2 text-sm font-medium text-[#0b9f91]" href="/">{t('main')}</a>
            <a className="hover:text-[#0fae9d]" href="#features">{t('feature')}</a>
            <a className="hover:text-[#0fae9d]" href="/contact">{t('contact')}</a>
              <button onClick={changeLanguage} className="flex items-center text-[#050040] hover:text-[#0fc2b3] transition cursor-pointer">
                <Languages />
                <span>{i18n.language === "ar" ? "EN" : "AR"}</span>
              </button>
            <Link to="/login?state=login" className="rounded-lg border border-[#0b86c6] px-10 py-2 font-medium transition hover:bg-sky-50">
              {t('loginMain')}
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center px-5 pt-11 text-center">

        {/* Badge */}
        <div className="rounded-full bg-[#e6f5ff] px-7 py-2 text-sm font-semibold text-[#1683d4]">
          {t('betterFutureBadge')}
        </div>

        {/* Heading */}
        <h1 className="max-w-5xl text-4xl font-bold leading-[1.35] md:text-5xl lg:text-[62px]">
         {t('heroTitle')}{" "}
          <span className="relative inline-block bg-linear-to-l from-[#0b78c8] to-[#10ae9d] bg-clip-text text-transparent">
            {t('heroSpan')}
          </span>
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-500 md:text-xl">
          {t("heroSupTitle")}
        </p>
        {/* Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login?state=register" className="flex items-center gap-3 rounded-xl bg-linear-to-l from-[#0574ca] to-[#0bafa9] px-8 py-3.5 font-semibold text-white shadow-lg shadow-cyan-100 transition hover:-translate-y-0.5">
            
           {t("startNow")}
           {i18n.language === "ar" ? <ChevronLeft /> : <ChevronRight />}
          </Link>

          <a href="#features" className="flex items-center gap-3 rounded-xl border border-[#82bddd] bg-white px-8 py-3.5 font-semibold text-[#13214e] transition hover:bg-sky-50">
            <Feather />
            {t('viewFeaturesBtn')}
            
          </a>
        </div>

        {/* LEFT NOTE */}
        <div className="absolute left-2 top-[220px] hidden rotate-[-6deg] text-right text-lg leading-7 text-[#344d80] xl:block">
          <p>
            {t('fromApplication')}
            <br />
           {t('toJobOffer')}
            <br />
           {t('andEverythingBetween')}
          </p>

          <div className="mt-4 text-5xl font-light text-sky-400">↘</div>
        </div>

        {/* RIGHT NOTE */}
        <div className="absolute right-14 top-[250px] hidden rotate-[4deg] text-lg leading-7 text-[#344d80] xl:block">
          <div className="mb-1 text-4xl text-sky-400">///</div>
          <p>
            {t('brighterFuture')}
            <br />
            {t('brighterCareer')}
           
          </p>

          <div className="mt-4 text-5xl text-sky-400"><MoveDownLeft /></div>
        </div>

        {/* DASHBOARD AREA */}
        <div className="relative mt-8 w-full max-w-[1100px]">

          {/* Main glow */}
          <div className="pointer-events-none absolute left-1/2 top-[20%] h-[230px] w-[125%] -translate-x-1/2 rounded-[50%] bg-[#28c8c1] opacity-25 blur-[100px]" />

          {/* Side background blobs */}
          <div className="pointer-events-none absolute -left-[160px] top-[10px] h-[260px] w-[260px] rounded-full bg-cyan-200/30 blur-[60px]" />

          <div className="pointer-events-none absolute -right-[160px] top-[10px] h-[260px] w-[260px] rounded-full bg-sky-200/40 blur-[60px]" />

          {/* LEFT FLOATING CARDS */}
          <div className="absolute -left-[230px] top-20 z-20 hidden flex-col gap-5 xl:flex">
            <FeatureCard
              icon="🎯"
              title= {t('trackApplications')}
              description={t('withEase')}
            />

            <FeatureCard
              icon="📅"
              title={t('prepareForInterviews')}
              description={t('neverMissAppointment')}
            />

            <FeatureCard
              icon="📄"
              title= {t('manageResumes')}
              description={t('forMultipleOpportunities')}
            />
          </div>

          {/* RIGHT FLOATING CARDS */}
          <div className="absolute -right-[230px] top-20 z-20 hidden flex-col gap-5 xl:flex">
            <FeatureCard
              icon="📊"
              title={t('makeRealProgress')}
              description={t('inYourCareer')}
            />

            <FeatureCard
              icon="⭐"
              title={t('getBetterOffers')}
              description={t('withBetterOrganization')}
            />

            <FeatureCard
              icon="👥"
              title={t('suitableForEveryone')}
              description={t('fromGraduatesToExperts')}
            />
          </div>

          {/* Dashboard image */}
          <div className="relative z-10 overflow-hidden rounded-t-[22px] border-[12px] border-white/80 bg-white shadow-[0_20px_80px_rgba(27,121,171,0.18)]">
            <img
              src="/hero.png"
              alt="MasarPro Dashboard"
              className="w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Benefit = ({ text }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#58ceb6] text-xs text-white">
        ✓
      </span>
      <span>{text}</span>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex w-[200px] items-center gap-3 rounded-xl bg-white/90 p-4 text-right shadow-lg shadow-sky-100/60 backdrop-blur">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-xl">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold text-[#13214e]">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
};

export default Hero;