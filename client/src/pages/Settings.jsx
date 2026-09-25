import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, CalendarDays, LogOut, TriangleAlert, Trash2, Languages } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../lib/supabase';

const copy = {
  en: { title: 'Settings', subtitle: 'Manage your account and personal information.', account: 'Account information', email: 'Email address', joined: 'Date joined', signOut: 'Sign out', signingOut: 'Signing out...', danger: 'Danger zone', warning: 'Deleting your account permanently removes your data.', delete: 'Delete account', unavailable: 'Account deletion is not available yet.', loading: 'Loading account...', unknown: 'Not provided', name: 'Your account' },
  ar: { title: 'الإعدادات', subtitle: 'إدارة حسابك ومعلوماتك الشخصية.', account: 'معلومات الحساب', email: 'البريد الإلكتروني', joined: 'تاريخ الانضمام', signOut: 'تسجيل الخروج', signingOut: 'جارٍ تسجيل الخروج...', danger: 'منطقة الخطر', warning: 'سيؤدي حذف الحساب إلى حذف بياناتك بشكل نهائي.', delete: 'حذف الحساب', unavailable: 'حذف الحساب غير متاح حالياً.', loading: 'جارٍ تحميل الحساب...', unknown: 'غير متوفر', name: 'حسابك' },
};

const Settings = () => {
  const { session, profile, loading } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');
  const rtl = i18n.language.startsWith('ar');
  const text = copy[rtl ? 'ar' : 'en'];
  const name = profile?.name || session?.user?.user_metadata?.name || text.name;
  const joined = session?.user?.created_at ? new Date(session.user.created_at) : null;
  const joinedLabel = joined && !Number.isNaN(joined.getTime())
    ? new Intl.DateTimeFormat(rtl ? 'ar-SA-u-ca-gregory' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(joined)
    : text.unknown;

  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setError('');
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      navigate('/login', { replace: true });
    } catch (signOutError) {
      setError(signOutError.message);
      setSigningOut(false);
    }
  };

  return (
    <section dir={rtl ? 'rtl' : 'ltr'} className="min-h-[calc(100vh-100px)] bg-[#f4f9fc] px-5 py-7 text-[#0c1945] sm:px-10">
      <header className="mx-auto mb-7 max-w-5xl">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('settingsTitle')}</h1>
        <p className="mt-1 text-sm text-[#7a88a7]">{t('manageAccountDescription')}</p>
      </header>

      <div className="mx-auto max-w-4xl space-y-4">
        {loading ? <p role="status" className="p-6 text-slate-500">{text.loading}</p> : (
          <div className="grid rounded-xl border border-[#e6effb] bg-white p-6 shadow-[0_4px_18px_rgba(31,52,85,0.025)] sm:grid-cols-[minmax(0,1fr)_220px] sm:p-8">
            <section className="min-w-0 pb-6 sm:pe-8 sm:pb-0" aria-labelledby="account-heading">
              <h2 id="account-heading" className="mb-6 text-base font-bold">{t('accountInformation')}</h2>
              <dl className="divide-y divide-[#edf2fa] text-sm text-[#6b7c9e]">
                <div className="grid gap-3 pb-5 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                  <dt className="flex items-center  gap-3"><Mail size={19} aria-hidden="true" />{t('emailLabel')}</dt>
                  <dd className="min-w-0  break-all text-start lg:text-end">{session?.user?.email || text.unknown}</dd>
                </div>
                <div className="grid gap-3 pt-5 pb-5 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                  <dt className="flex items-center gap-3"><CalendarDays size={19} aria-hidden="true" />{t('joinedDate')}</dt>
                  <dd className="lg:text-end"><time dateTime={session?.user?.created_at}>{joinedLabel}</time></dd>
                </div>
                <div className="grid gap-3 pt-5 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                  <dt className="flex items-center gap-3"><Languages size={19} aria-hidden="true" />{t('languageLabel')}</dt>
                  <dd className="lg:text-end">
                    <button
                      type="button"
                      onClick={() => i18n.changeLanguage(rtl ? 'en' : 'ar')}
                      aria-label={rtl ? 'Switch to English' : 'Switch to Arabic'}
                      className="inline-flex items-center gap-2 rounded-md border border-[#b9c6df] px-3 py-1.5 text-sm text-[#43577e] transition-colors hover:border-teal-300 hover:bg-[#e7f5f5] hover:text-teal-700"
                    >
                      <Languages size={16} aria-hidden="true" />
                      <span lang={rtl ? 'en' : 'ar'}>{rtl ? 'English' : 'العربية'}</span>
                    </button>
                  </dd>
                </div>
                
              </dl>
            </section>

            <aside className="flex flex-col items-center justify-center border-t border-[#edf2fa] pt-6 text-center sm:border-s sm:border-t-0 sm:ps-7 sm:pt-0">
              <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" alt={name} className="h-24 w-24 rounded-full bg-[#e7f5f5] object-cover" />
              <p dir="auto" className="mt-3 break-words text-base font-bold">{name}</p>
              <button type="button" disabled={signingOut} onClick={signOut} className="mt-5 inline-flex w-full max-w-48 items-center justify-center gap-2 rounded-md border border-[#b9c6df] px-4 py-2 text-sm text-[#43577e] transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-50">
                <LogOut size={17} />{signingOut ? text.signingOut : t('signOutButton')}
              </button>
            </aside>
          </div>
        )}

        <section className="flex flex-col justify-between gap-5 rounded-xl border border-[#e6effb] bg-white px-6 py-5 shadow-[0_4px_18px_rgba(31,52,85,0.025)] sm:flex-row sm:items-center sm:px-8" aria-labelledby="danger-heading">
          <div>
            <h2 id="danger-heading" className="flex items-center gap-2 font-bold text-red-500"><TriangleAlert size={20} />{t("dangerZoneTitle")}</h2>
            <p className="mt-2 text-sm text-[#7a88a7]">{t('deleteAccountWarning')}</p>
          </div>
          <div className="shrink-0">
            <button type="button" disabled aria-describedby="delete-unavailable" className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50/30 px-4 py-2 text-sm text-red-400"><Trash2 size={17} />{t('deleteAccountButton')}</button>
            <p id="delete-unavailable" className="mt-2 text-xs text-slate-400">{t('deleteAccountUnavailable')}</p>
          </div>
        </section>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
    </section>
  );
};

export default Settings;
