import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, CalendarDays, LogOut, TriangleAlert, Trash2, Languages, Pencil, Upload, LoaderCircle } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../lib/supabase';
import { changeAvatar, MAX_AVATAR_SIZE } from '../lib/avatar';

const avatarCopy = {
  en: { edit: 'Edit', upload: 'Upload photo', remove: 'Remove photo', hint: 'JPEG or PNG, up to 1 MB.', saving: 'Saving photo...', saved: 'Profile photo updated.', removed: 'Profile photo removed.', invalid: 'Choose a valid JPEG or PNG image up to 1 MB.', failed: 'Unable to update your photo. Please try again.' },
  ar: { edit: 'تعديل', upload: 'رفع صورة', remove: 'إزالة الصورة', hint: 'JPEG أو PNG، بحد أقصى 1 ميجابايت.', saving: 'جارٍ حفظ الصورة...', saved: 'تم تحديث صورة الملف الشخصي.', removed: 'تمت إزالة صورة الملف الشخصي.', invalid: 'اختر صورة JPEG أو PNG صالحة بحجم لا يتجاوز 1 ميجابايت.', failed: 'تعذر تحديث الصورة. يرجى المحاولة مرة أخرى.' },
};

const copy = {
  en: { title: 'Settings', subtitle: 'Manage your account and personal information.', account: 'Account information', email: 'Email address', joined: 'Date joined', signOut: 'Sign out', signingOut: 'Signing out...', danger: 'Danger zone', warning: 'Deleting your account permanently removes your data.', delete: 'Delete account', unavailable: 'Account deletion is not available yet.', loading: 'Loading account...', unknown: 'Not provided', name: 'Your account' },
  ar: { title: 'الإعدادات', subtitle: 'إدارة حسابك ومعلوماتك الشخصية.', account: 'معلومات الحساب', email: 'البريد الإلكتروني', joined: 'تاريخ الانضمام', signOut: 'تسجيل الخروج', signingOut: 'جارٍ تسجيل الخروج...', danger: 'منطقة الخطر', warning: 'سيؤدي حذف الحساب إلى حذف بياناتك بشكل نهائي.', delete: 'حذف الحساب', unavailable: 'حذف الحساب غير متاح حالياً.', loading: 'جارٍ تحميل الحساب...', unknown: 'غير متوفر', name: 'حسابك' },
};

const Settings = () => {
  const { session, profile, loading, updateProfile, avatarSrc } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState('');
  const fileInput = useRef(null);
  const avatarMenu = useRef(null);
  const editButton = useRef(null);
  const avatarLock = useRef(false);
  const rtl = i18n.language.startsWith('ar');
  const text = copy[rtl ? 'ar' : 'en'];
  const photoText = avatarCopy[rtl ? 'ar' : 'en'];
  const name = profile?.name || session?.user?.user_metadata?.name || text.name;
  const joined = session?.user?.created_at ? new Date(session.user.created_at) : null;
  const joinedLabel = joined && !Number.isNaN(joined.getTime())
    ? new Intl.DateTimeFormat(rtl ? 'ar-SA-u-ca-gregory' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(joined)
    : text.unknown;

  useEffect(() => {
    if (!avatarMenuOpen) return;
    const dismiss = (event) => {
      if (!avatarMenu.current?.contains(event.target)) setAvatarMenuOpen(false);
    };
    const escape = (event) => {
      if (event.key === 'Escape') {
        setAvatarMenuOpen(false);
        editButton.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('focusin', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('focusin', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [avatarMenuOpen]);

  const saveAvatar = async (file) => {
    if (avatarLock.current || !session?.user?.id) return;
    avatarLock.current = true;
    setAvatarMenuOpen(false);
    setAvatarBusy(true);
    setAvatarStatus('');
    setError('');
    try {
      if (file) {
        if (!['image/jpeg', 'image/png'].includes(file.type) || !file.size || file.size > MAX_AVATAR_SIZE) {
          throw new Error(photoText.invalid);
        }
        // Reject corrupt or mislabeled files before removing the existing photo.
        try {
          const bitmap = await createImageBitmap(file);
          bitmap.close();
        } catch { throw new Error(photoText.invalid); }
      }
      const nextProfile = await changeAvatar(supabase, session.user.id, profile?.avatar_url, file);
      updateProfile(nextProfile);
      setAvatarStatus(file ? photoText.saved : photoText.removed);
    } catch (uploadError) {
      setError(uploadError.message || photoText.failed);
    } finally {
      avatarLock.current = false;
      setAvatarBusy(false);
      editButton.current?.focus();
    }
  };

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
              <div ref={avatarMenu} className="relative" aria-busy={avatarBusy}>
                <img src={avatarSrc} alt={name} className="h-24 w-24 rounded-full bg-[#e7f5f5] object-cover" />
                <input ref={fileInput} type="file" accept="image/jpeg,image/png" aria-label={photoText.upload} className="hidden" disabled={avatarBusy || signingOut} onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) saveAvatar(file);
                }} />
                <button ref={editButton} type="button" aria-expanded={avatarMenuOpen} aria-controls="avatar-actions" disabled={avatarBusy || signingOut || !profile || !session} onClick={() => setAvatarMenuOpen(!avatarMenuOpen)} className="absolute -bottom-1 -start-2 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600 disabled:cursor-wait disabled:opacity-60">
                  {avatarBusy ? <LoaderCircle size={13} className="animate-spin" aria-hidden="true" /> : <Pencil size={13} aria-hidden="true" />}{photoText.edit}
                </button>
                {avatarMenuOpen && <div id="avatar-actions" className="absolute start-1/2 top-full z-20 mt-3 w-44 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-1 text-start shadow-lg rtl:translate-x-1/2">
                  <button type="button" onClick={() => { setAvatarMenuOpen(false); fileInput.current?.click(); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-50 focus-visible:bg-slate-50"><Upload size={15} aria-hidden="true" />{photoText.upload}</button>
                  <button type="button" disabled={!profile?.avatar_url} onClick={() => saveAvatar(null)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 focus-visible:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={15} aria-hidden="true" />{photoText.remove}</button>
                </div>}
              </div>
              <p className="mt-3 text-xs text-slate-400">{photoText.hint}</p>
              <p role="status" className="mt-1 text-xs text-teal-700">{avatarBusy ? photoText.saving : avatarStatus}</p>
              <p dir="auto" className="mt-3 break-words text-base font-bold">{name}</p>
              <button type="button" disabled={signingOut || avatarBusy} onClick={signOut} className="mt-5 inline-flex w-full max-w-48 items-center justify-center gap-2 rounded-md border border-[#b9c6df] px-4 py-2 text-sm text-[#43577e] transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-50">
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
