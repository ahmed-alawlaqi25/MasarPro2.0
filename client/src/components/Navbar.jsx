import { ChevronLeft, ChevronRight, FileUser, Languages, Menu, Newspaper, Settings, SquareKanban, X} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from "react-router";


const Navbar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);

    const { t ,i18n } = useTranslation();
    
        const changeLanguage = () => {
        const newLanguage = i18n.language === "ar" ? "en" : "ar";
    
        i18n.changeLanguage(newLanguage);
    
        document.documentElement.dir =
            newLanguage === "ar" ? "rtl" : "ltr";
    
        document.documentElement.lang = newLanguage;
    };

    const getLinkClass = ({ isActive }) =>
    `flex item-center gap-1 transition hover:text-[#278d8a] ${
      isActive
        ? 'bg-[#e7f5f5] text-[#278d8a] font-bold px-4 py-2 rounded-md'
        : 'text-gray-500 hover:text-[#278d8a]'
    }`;

    return (
        <nav className="relative z-50 w-full bg-white">
            <div className="mx-auto flex  items-center justify-between px-5 py-2 md:px-10 lg:px-16">
            {/* Logo */}
            <a href="/" className="flex items-center">
                <img
                src="/logo.png"
                alt="MasarPro Logo"
                className="w-[220px] object-contain"
                />
            </a>

            {/* Desktop menu */}
            <div className="hidden items-center gap-9 text-sm font-bold text-gray-500 font-bold md:flex">
                <NavLink to="/job-tracker" className={getLinkClass}>
                <SquareKanban /> {t('jobTracker')}
                </NavLink>
                <NavLink to="/resume-builde" className={getLinkClass}>
                <FileUser />{t('resumeBuilder')} 
                </NavLink>
                <NavLink to="/blog" className={getLinkClass}>
                <Newspaper />{t('Blog')}
                </NavLink>
                <NavLink to="/settings" className={getLinkClass}>
                <Settings />{t('settings')}
                </NavLink>
            </div>

            {/* Desktop buttons */}
            <div className="hidden items-center gap-4 md:flex">
                <Link to="/login?state=login" className="rounded-lg border border-[#0b86c6] px-7 py-3 font-medium transition hover:bg-sky-50">
                {t('loginMain')}
                </Link>

                <Link to="/login?state=register" className="flex items-center gap-3 rounded-lg bg-linear-to-l from-[#0874c9] to-[#0eb0b2] px-7 py-3 font-medium text-white transition hover:opacity-90">
                {t('startNow')}
                <span className="text-xl">{i18n.language === "ar" ? <ChevronLeft /> : <ChevronRight />}</span>
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

                <NavLink to="/job-tracker" className={getLinkClass}>
                <SquareKanban /> {t('jobTracker')}
                </NavLink>
                <NavLink to="/resume-builde" className={getLinkClass}>
                <FileUser />{t('resumeBuilder')} 
                </NavLink>
                <NavLink to="/blog" className={getLinkClass}>
                <Newspaper />{t('Blog')}
                </NavLink>
                <NavLink to="/settings" className={getLinkClass}>
                <Settings />{t('settings')}
                </NavLink>
            </div>
            )}
        </nav>
    )
}

export default Navbar