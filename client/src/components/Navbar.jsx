import { FileUser,  Menu, Newspaper, Settings, SquareKanban, X} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from "react-router";


const Navbar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);

    const { t  } = useTranslation();

    const userName = "Ahmed"
    
    const getLinkClass = ({ isActive }) =>
    `flex item-center gap-1 transition hover:text-[#278d8a] ${
      isActive
        ? 'bg-[#e7f5f5] text-[#278d8a] font-bold px-4 py-2 rounded-md'
        : 'text-gray-500 hover:text-[#278d8a]'
    }`;

    const ProfileGreeting = () => (
        <Link
            to="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50"
        >


            <div className="text-right leading-tight">
            <p className="text-sm font-bold text-slate-800">
                {t('welcomeMessage')} {userName}
            </p>

            <p className="text-xs text-slate-400">
                {t('readyForNewOpportunities')}
            </p>
            </div>
                        <img
            src="/Ahmed_Profile_pic3 (4).png"
            alt= {userName}
            className="h-11 w-11 rounded-full object-cover"
            />
        </Link>
    );

    return (
        <nav className="relative z-50 w-full bg-white border-b border-slate-200">
            <div className="mx-auto flex  items-center justify-between px-5  md:px-10 lg:px-16">
            {/* Logo */}
            <a href="/" className="flex items-center">
                <img
                src="/logoNoText.png"
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
                <FileUser />{t('resumeBuilderTitle')} 
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
                <ProfileGreeting />
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