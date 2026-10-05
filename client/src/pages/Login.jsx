import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useSearchParams } from "react-router";
import { supabase } from '../lib/supabase'
import { User2, Mail} from 'lucide-react'


const Login = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const state = searchParams.get('state') === 'register' ? 'register' : 'login'
    const [submitError, setSubmitError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
    })

    const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitError('')
    setSubmitting(true)

    const isRegistering = state === 'register'

    try {
    const { error } = await supabase.auth.signInWithOtp({
        email: formData.email.trim(),
        options: {
            emailRedirectTo: `${window.location.origin}/callback`,
            shouldCreateUser: isRegistering,
            data: isRegistering
                ? { name: formData.name }
                : undefined,
            },
    })

    if (error) {
        setSubmitError(error.status === 429 ? 'rate' : isRegistering ? 'register' : 'login')
        return
    }

    window.location.href = '/confirm-email'
    } catch {
        setSubmitError('network')
    } finally {
        setSubmitting(false)
    }
    }

    const {t, i18n} = useTranslation();
    const rtl = i18n.dir() === 'rtl'
    const errorMessages = rtl ? {
        login: 'تعذر تسجيل الدخول. تحقق من بريدك الإلكتروني، أو أنشئ حساباً إذا لم تكن مسجلاً.',
        register: 'تعذر إرسال رابط التسجيل. تحقق من بريدك الإلكتروني وحاول مجدداً.',
        rate: 'طلبات كثيرة. انتظر قليلاً ثم حاول مجدداً.',
        network: 'تعذر الاتصال. تحقق من اتصال الإنترنت وحاول مجدداً.',
    } : {
        login: 'Unable to sign in. Check your email address, or sign up if you are not registered.',
        register: 'Unable to send the sign-up link. Check your email address and try again.',
        rate: 'Too many requests. Please wait before trying again.',
        network: 'Unable to connect. Check your internet connection and try again.',
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setSubmitError('')
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
                    <input type="email" name="email" aria-label={t('emailLabel')} aria-describedby={submitError ? 'email-error' : undefined} placeholder={t('emailLabel')} className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} disabled={submitting} required />
                </div>
                {submitError && <p id="email-error" role="alert" dir={rtl ? 'rtl' : 'ltr'} className="mt-2 text-start text-sm leading-relaxed text-red-600">{errorMessages[submitError]}</p>}
                <button type="submit" disabled={submitting} className="cursor-pointer mt-2 w-full h-11 rounded-full text-white bg-linear-to-r from-[#0fc2b3] to-[#114f83] hover:opacity-90 transition-opacity disabled:cursor-wait disabled:opacity-60">
                    {submitting ? (rtl ? 'جارٍ الإرسال...' : 'Sending...') : state === "login" ? `${t('loginTitle')}` : `${t('signUpTitle')}`}
                </button>
                <p className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? `${t('dontHaveAccount')}` : `${t('alreadyHaveAccount')}`} <button type="button" disabled={submitting} onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.set('state', state === 'login' ? 'register' : 'login')
                    setSearchParams(next)
                    setSubmitError('')
                }} className="text-indigo-500 hover:underline disabled:opacity-60">{t('clickHereLink')}</button></p>
            </form>
            </div>
    )
}

export default Login
