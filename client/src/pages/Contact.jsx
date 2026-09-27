import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, Languages, LoaderCircle, Mail, MessageSquare, Send } from 'lucide-react';
import Footer from '../components/Footer';

const copy = {
  en: {
    home: 'Back to home', badge: 'CONTACT MASARPRO', title: 'How can we help?',
    intro: 'Have a question, found a problem, or want to share an idea? Send us a message.',
    heading: 'We’d like to hear from you.', detail: 'Tell us what you need. Include details to help us understand your question.',
    reply: 'We’ll reply to the email address you provide.', form: 'Send a message',
    name: 'Your name', email: 'Email address', message: 'Message', namePlaceholder: 'Full name',
    messagePlaceholder: 'What would you like to tell us?', submit: 'Send message', sending: 'Sending...',
    success: 'Your message has been sent. Thank you for contacting MasarPro.',
    error: 'Your message was not sent. Please try again.', limited: 'Too many messages. Please try again in 15 minutes.',
    invalid: 'Enter your name, a valid email, and a message of up to 5,000 characters.',
    unavailable: 'The contact form is temporarily unavailable. Please try again later.',
  },
  ar: {
    home: 'العودة للرئيسية', badge: 'تواصل مع مسار برو', title: 'كيف نساعدك؟',
    intro: 'لديك سؤال أو واجهت مشكلة أو ترغب في مشاركة فكرة؟ أرسل لنا رسالة.',
    heading: 'يسعدنا سماعك.', detail: 'أخبرنا بما تحتاجه، وأضف التفاصيل التي تساعدنا على فهم سؤالك.',
    reply: 'سنرد على عنوان البريد الإلكتروني الذي تكتبه.', form: 'أرسل رسالة',
    name: 'اسمك', email: 'البريد الإلكتروني', message: 'الرسالة', namePlaceholder: 'الاسم الكامل',
    messagePlaceholder: 'ماذا تود أن تخبرنا؟', submit: 'إرسال الرسالة', sending: 'جارٍ الإرسال...',
    success: 'تم إرسال رسالتك. شكرًا لتواصلك مع مسار برو.',
    error: 'لم يتم إرسال رسالتك. يرجى المحاولة مرة أخرى.', limited: 'أرسلت رسائل كثيرة. يرجى المحاولة بعد 15 دقيقة.',
    invalid: 'أدخل اسمك وبريدًا إلكترونيًا صالحًا ورسالة لا تتجاوز ٥٬٠٠٠ حرف.',
    unavailable: 'نموذج التواصل غير متاح مؤقتًا. يرجى المحاولة لاحقًا.',
  },
};

export default function Contact() {
  const { i18n } = useTranslation();
  const rtl = i18n.language.startsWith('ar');
  const text = copy[rtl ? 'ar' : 'en'];
  const [fields, setFields] = useState({ name: '', email: '', message: '', website: '' });
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const update = event => {
    setFields(previous => ({ ...previous, [event.target.name]: event.target.value }));
    setStatus('');
  };
  const submit = async event => {
    event.preventDefault();
    if (lock.current) return;
    if (!fields.name.trim() || !fields.message.trim()) { setStatus('invalid'); return; }
    lock.current = true;
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fields),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setStatus(({ RATE_LIMITED: 'limited', INVALID_INPUT: 'invalid', UNAVAILABLE: 'unavailable' })[result.code] || 'error');
        return;
      }
      setFields({ name: '', email: '', message: '', website: '' });
      setStatus('success');
    } catch { setStatus('error'); }
    finally { lock.current = false; setBusy(false); }
  };
  const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-[#f8fbfd] px-4 py-3 text-sm text-[#07133f] outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 disabled:opacity-60';

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#f4f9fc] text-[#07133f]">
      <nav className="border-b border-slate-200 bg-white" aria-label={text.home}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link to="/"><img src="/logoNoText.png" alt="MasarPro" className="w-36 sm:w-44" /></Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" aria-label={text.home} className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700"><ArrowLeft size={16} className="rtl:rotate-180" /><span className="hidden sm:inline">{text.home}</span></Link>
            <button type="button" aria-label={rtl ? 'Switch to English' : 'التبديل إلى العربية'} onClick={() => i18n.changeLanguage(rtl ? 'en' : 'ar')} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-teal-50"><Languages size={18} />{rtl ? 'EN' : 'العربية'}</button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-[#e6f5ff] px-4 py-2 text-xs font-semibold tracking-wide text-[#1683d4]">{text.badge}</span>
          <h1 className="mt-5 text-3xl font-bold sm:text-5xl">{text.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-500">{text.intro}</p>
        </header>
        <div className="grid overflow-hidden rounded-3xl border border-[#e6effb] bg-white shadow-[0_16px_60px_rgba(31,52,85,0.06)] md:grid-cols-[0.85fr_1.15fr]">
          <aside className="flex flex-col justify-between bg-linear-to-br from-[#0874c9] to-[#0ba99d] p-7 text-white sm:p-10">
            <div>
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/10"><MessageSquare size={26} aria-hidden="true" /></div>
              <h2 className="text-2xl font-bold leading-snug sm:text-3xl">{text.heading}</h2>
              <p className="mt-4 text-sm leading-7 text-white/85">{text.detail}</p>
            </div>
            <p className="mt-12 flex items-start gap-3 border-t border-white/20 pt-6 text-sm leading-6 text-white/90"><Mail size={20} className="mt-0.5 shrink-0" aria-hidden="true" />{text.reply}</p>
          </aside>
          <form onSubmit={submit} className="p-7 sm:p-10" aria-labelledby="contact-form-title" aria-busy={busy}>
            <h2 id="contact-form-title" className="mb-6 text-xl font-bold">{text.form}</h2>
            <fieldset disabled={busy} className="space-y-5">
              <div><label htmlFor="contact-name" className="text-sm font-medium">{text.name}</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} value={fields.name} onChange={update} placeholder={text.namePlaceholder} className={inputClass} /></div>
              <div><label htmlFor="contact-email" className="text-sm font-medium">{text.email}</label><input id="contact-email" name="email" type="email" dir="ltr" autoComplete="email" required maxLength={254} value={fields.email} onChange={update} placeholder="you@example.com" className={inputClass} /></div>
              <div><label htmlFor="contact-message" className="text-sm font-medium">{text.message}</label><textarea id="contact-message" name="message" required maxLength={5000} rows={5} value={fields.message} onChange={update} placeholder={text.messagePlaceholder} className={`${inputClass} min-h-36 resize-y`} /><p className="mt-1 text-end text-xs text-slate-400">{fields.message.length.toLocaleString(rtl ? 'ar' : 'en')} / {(5000).toLocaleString(rtl ? 'ar' : 'en')}</p></div>
              <div hidden aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={update} /></div>
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-l from-[#0874c9] to-[#0ba99d] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 disabled:cursor-wait disabled:opacity-60">{busy ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}{busy ? text.sending : text.submit}</button>
            </fieldset>
            {status && <p role={status === 'success' ? 'status' : 'alert'} className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm leading-6 ${status === 'success' ? 'bg-teal-50 text-teal-800' : 'bg-red-50 text-red-700'}`}>{status === 'success' && <CheckCircle2 size={18} className="mt-1 shrink-0" aria-hidden="true" />}{text[status]}</p>}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
