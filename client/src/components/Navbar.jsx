import { FileUser, Mail, Menu, Settings, SquareKanban, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from "react-router";
import { useAuth } from "./AuthContext";


const Navbar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);
    const { t, i18n } = useTranslation();


    
    const getLinkClass = ({ isActive }) =>
    `flex items-center gap-1 rounded-md px-4 py-2 font-bold transition-colors duration-200 hover:border border-teal-300 hover:bg-[#e7f5f5] hover:text-[#278d8a] ${
      isActive
        ? 'bg-[#e7f5f5] text-teal-700 '
        : 'text-gray-500'
    }`;

    
    const {profile, avatarSrc } = useAuth()
    const profileGreeting = (
        
        <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50"
        >

            <div className="text-right leading-tight">
            <p className="text-sm font-bold text-[#0c1945]">
                {t('welcomeMessage')} {profile?.name}
            </p>

            <p className="text-xs text-gray-400">
                {t('readyForNewOpportunities')}
            </p>
            </div>
                        <img
            src={avatarSrc}
            alt= {profile?.name}
            className="h-11 w-11 rounded-full object-cover"
            />
        </Link>
    );

    

    return (
        <nav className="relative z-50 w-full bg-white border-b  border-slate-200">
            <div className="mx-auto flex  items-center justify-between px-5  md:px-10 lg:px-16">
            {/* Logo */}
            <a href="/" className="flex items-center">
                <img
                src="/logoNoText.png"
                alt="MasarPro Logo"
                className="w-54 object-contain"
                />
            </a>

            {/* Desktop menu */}
            <div className="hidden items-center gap-2 text-sm text-gray-500 font-bold xl:flex">
                <NavLink to="/resume-builder" className={getLinkClass}>
                <FileUser />{t('resumeBuilderTitle')} 
                </NavLink>
                <NavLink to="/cover-letter" className={getLinkClass}><Mail />{i18n.dir() === 'rtl' ? 'خطاب التقديم' : 'Cover letter'}</NavLink>
                <NavLink to="/job-tracker" className={getLinkClass} >
                <SquareKanban /> {t('jobTracker')}
                </NavLink>
                
                {/* <NavLink to="/blog" className={getLinkClass}>
                <Newspaper />{t('Blog')}
                </NavLink> */}
                <NavLink to="/settings" className={getLinkClass}>
                <Settings />{t('settingsTitle')}
                </NavLink>
            </div>

            {/* Desktop buttons */}
            <div className="hidden items-center gap-4 xl:flex">
                {profileGreeting}
            </div>

            {/* Mobile */}
            <button
                onClick={() => setMobileOpen(true)}
                aria-label={i18n.dir() === 'rtl' ? 'فتح القائمة' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="rounded-lg p-2 text-[#07133f] xl:hidden hover:text-[#0fae9d]"
            >
                <Menu />
            </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white/95 backdrop-blur-md xl:hidden">
                
                <button
                onClick={() => setMobileOpen(false)}
                aria-label={i18n.dir() === 'rtl' ? 'إغلاق القائمة' : 'Close menu'}
                className="absolute left-6 top-6 text-3xl"
                >
                <X className="hover:text-[#0fae9d]"/>
                </button>
                                <a href="/" className="flex items-center">
                <img
                src="/logoNoText.png"
                alt="MasarPro Logo"
                className="w-54 object-contain absolute right-5 top-0"
                />
                </a>
                <NavLink to="/resume-builder" onClick={() => setMobileOpen(false)} className={getLinkClass}>
                <FileUser />{t('resumeBuilderTitle')} 
                </NavLink>

                <NavLink to="/cover-letter" onClick={() => setMobileOpen(false)} className={getLinkClass}><Mail />{i18n.dir() === 'rtl' ? 'خطاب التقديم' : 'Cover letter'}</NavLink>
                <NavLink to="/job-tracker" onClick={() => setMobileOpen(false)} className={getLinkClass}>
                <SquareKanban /> {t('jobTracker')}
                </NavLink>
                {/* <NavLink to="/blog" onClick={() => setMobileOpen(false)} className={getLinkClass}>
                <Newspaper />{t('Blog')}
                </NavLink> */}
                <NavLink to="/settings" onClick={() => setMobileOpen(false)} className={getLinkClass}>
                <Settings />{t('settingsTitle')}
                </NavLink>
            </div>
            )}
        </nav>
    )
}

export default Navbar
