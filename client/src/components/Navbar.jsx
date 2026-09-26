import { FileUser,  Menu, Newspaper, Settings, SquareKanban, X,  LogOut} from "lucide-react";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useNavigate } from "react-router";
import { supabase } from '../lib/supabase'
import { useAuth } from "./AuthContext";


const Navbar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate()
    const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error(error.message)
        return
    }
      navigate('/login', { replace: true })
    }
    const { t  } = useTranslation();


    
    const getLinkClass = ({ isActive }) =>
    `flex items-center gap-1 rounded-md px-4 py-2 font-bold transition-colors duration-200 hover:border border-teal-300 hover:bg-[#e7f5f5] hover:text-[#278d8a] ${
      isActive
        ? 'bg-[#e7f5f5] text-[#278d8a] '
        : 'text-gray-500'
    }`;

    
    const {profile, avatarSrc } = useAuth()
    const ProfileGreeting = () => (
        
        <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50"
        >

            <div className="text-right leading-tight">
            <p className="text-sm font-bold text-slate-800">
                {t('welcomeMessage')} {profile?.name}
            </p>

            <p className="text-xs text-slate-400">
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
            <div className="hidden items-center gap-4 text-sm   text-gray-500 font-bold md:flex">
                <NavLink to="/job-tracker" className={getLinkClass} >
                <SquareKanban /> {t('jobTracker')}
                </NavLink>
                <NavLink to="/resume-builde" className={getLinkClass}>
                <FileUser />{t('resumeBuilderTitle')} 
                </NavLink>
                <NavLink to="/blog" className={getLinkClass}>
                <Newspaper />{t('Blog')}
                </NavLink>
                <NavLink to="/settings" className={getLinkClass}>
                <Settings />{t('settingsTitle')}
                </NavLink>
            </div>

            {/* Desktop buttons */}
            <div className="hidden items-center gap-4 md:flex">
                <ProfileGreeting />
            </div>

            {/* Mobile */}
            <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg  p-2 text-[#07133f] md:hidden  hover:text-[#0fae9d]"
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
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold text-gray-500 transition-colors duration-200 hover:bg-rose-50 hover:text-red-600 cursor-pointer"
                    >
                    <LogOut size={18} />
                    Sign out
                </button>
                
            </div>
            )}
        </nav>
    )
}

export default Navbar
