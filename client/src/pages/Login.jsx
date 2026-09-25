import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, Navigate} from "react-router";
import { supabase } from '../lib/supabase'
import { User2, Mail} from 'lucide-react'


const Login = () => {

    const query = new URLSearchParams(window.location.search)
    const urlState = query.get('state')
    const [state, setState] = React.useState(urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
    })

    const handleSubmit = async (e) => {
    e.preventDefault()

    const isRegistering = state === 'register'

    const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
            emailRedirectTo: `${window.location.origin}/callback`,
            shouldCreateUser: isRegistering,
            data: isRegistering
                ? { name: formData.name }
                : undefined,
            },
    })

    if (error) {
        console.error(error.message)
        return
    }

    window.location.href = '/confirm-email'
    }

    const {t} = useTranslation();

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }


    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setLoading(false);
    });

    return () => subscription.unsubscribe();
    }, []);

    if (loading) {
    return <p>Loading...</p>;
    }

    if (session) {
    return <Navigate to="/job-tracker" replace />;
    }



    return (
            <div className='flex items-center justify-center min-h-screen bg-[#f4f9fc]'>

            <div 
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-600/30 via-sky-500/10 to-transparent via-50%" 
                aria-hidden="true"
            />
            <form onSubmit={handleSubmit} className="relative sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <Link to="/" className=' flex justify-center mt-5'>
                    <img
                    src="/logoNoText.png"
                    alt="MasarPro Logo"
                    className="w-[170px] object-contain"
                    />
                </Link>
                <h1 className="text-gray-900 text-3xl mt-6 font-medium">{state === "login" ? `${t('loginTitle')}` : `${t('signUpTitle')}` }</h1>
                <p className="text-gray-500 text-sm mt-2">{t('signInButton')}</p>
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <User2 size={16} color='#6B7280' className='mr-2'/>
                        <input type="text" name="name" placeholder={t('nameLabel')} className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Mail size={16} color='#6B7280' className='mr-2'/>
                    <input type="email" name="email" placeholder={t('emailLabel')} className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
                </div>
                <button type="submit" className="cursor-pointer mt-2 w-full h-11 rounded-full text-white bg-linear-to-r from-[#0fc2b3] to-[#114f83] hover:opacity-90 transition-opacity">
                    {state === "login" ? `${t('loginTitle')}` : `${t('signUpTitle')}`}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500  text-sm mt-3 mb-11">{state === "login" ? `${t('dontHaveAccount')}` : `${t('alreadyHaveAccount')}`} <a href={`login?state=${state}`} className="text-indigo-500 hover:underline">{t('clickHereLink')}</a></p>
            </form>
            </div>
    )
}

export default Login