import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Languages,
  LoaderCircle,
  LogOut,
  Mail,
  Pencil,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { supabase } from "../lib/supabase";
import {
  AVATAR_BUCKET,
  MAX_AVATAR_SIZE,
  avatarPath,
  changeAvatar,
} from "../lib/avatar";

const avatarCopy = {
  en: {
    edit: "Edit",
    upload: "Upload photo",
    remove: "Remove photo",
    hint: "JPEG or PNG, up to 1 MB.",
    saving: "Saving photo...",
    saved: "Profile photo updated.",
    removed: "Profile photo removed.",
    invalid: "Choose a valid JPEG or PNG image up to 1 MB.",
    failed: "Unable to update your photo. Please try again.",
  },
  ar: {
    edit: "تعديل",
    upload: "رفع صورة",
    remove: "إزالة الصورة",
    hint: "JPEG أو PNG، بحد أقصى 1 ميجابايت.",
    saving: "جارٍ حفظ الصورة...",
    saved: "تم تحديث صورة الملف الشخصي.",
    removed: "تمت إزالة صورة الملف الشخصي.",
    invalid: "اختر صورة JPEG أو PNG صالحة بحجم لا يتجاوز 1 ميجابايت.",
    failed: "تعذر تحديث الصورة. يرجى المحاولة مرة أخرى.",
  },
};

const copy = {
  en: {
    title: "Settings",
    subtitle: "Manage your account and personal information.",
    account: "Account information",
    email: "Email address",
    joined: "Date joined",
    signOut: "Sign out",
    signingOut: "Signing out...",
    danger: "Danger zone",
    warning: "Deleting your account permanently removes your data.",
    delete: "Delete account",
    unavailable: "Account deletion is not available yet.",
    loading: "Loading account...",
    unknown: "Not provided",
    name: "Your account",
    save: "Save",
    saving: "Saving...",
  },
  ar: {
    title: "الإعدادات",
    subtitle: "إدارة حسابك ومعلوماتك الشخصية.",
    account: "معلومات الحساب",
    email: "البريد الإلكتروني",
    joined: "تاريخ الانضمام",
    signOut: "تسجيل الخروج",
    signingOut: "جارٍ تسجيل الخروج...",
    danger: "منطقة الخطر",
    warning: "سيؤدي حذف الحساب إلى حذف بياناتك بشكل نهائي.",
    delete: "حذف الحساب",
    unavailable: "حذف الحساب غير متاح حالياً.",
    loading: "جارٍ تحميل الحساب...",
    unknown: "غير متوفر",
    name: "حسابك",
    save: "حفظ",
    saving: "جارٍ الحفظ...",
  },
};

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

const Settings = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const { session, profile, loading, updateProfile, avatarSrc } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [error, setError] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState("");
  const fileInput = useRef(null);
  const avatarMenu = useRef(null);
  const editButton = useRef(null);
  const avatarLock = useRef(false);

  const rtl = i18n.language.startsWith("ar");
  const text = copy[rtl ? "ar" : "en"];
  const photoText = avatarCopy[rtl ? "ar" : "en"];
  const name = profile?.name || session?.user?.user_metadata?.name || text.name;
  const joined = session?.user?.created_at
    ? new Date(session.user.created_at)
    : null;
  const joinedLabel =
    joined && !Number.isNaN(joined.getTime())
      ? new Intl.DateTimeFormat(rtl ? "ar-SA-u-ca-gregory" : "en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(joined)
      : text.unknown;

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(getInitialTheme());
    };
    window.addEventListener("masarpro-theme-change", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("masarpro-theme-change", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  useEffect(() => {
    if (!avatarMenuOpen) return;
    const dismiss = (event) => {
      if (!avatarMenu.current?.contains(event.target)) setAvatarMenuOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setAvatarMenuOpen(false);
        editButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [avatarMenuOpen]);

  useEffect(() => {
    if (!showDeleteModal) return;
    const handleEscape = (event) => {
      if (event.key === "Escape" && !deletingAccount) {
        setShowDeleteModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showDeleteModal, deletingAccount]);

  const saveAvatar = async (file) => {
    if (avatarLock.current || !session?.user?.id) return;
    avatarLock.current = true;
    setAvatarMenuOpen(false);
    setAvatarBusy(true);
    setAvatarStatus("");
    setError("");
    try {
      if (file) {
        if (
          !["image/jpeg", "image/png"].includes(file.type) ||
          !file.size ||
          file.size > MAX_AVATAR_SIZE
        ) {
          throw new Error(photoText.invalid);
        }
        try {
          const bitmap = await createImageBitmap(file);
          bitmap.close();
        } catch {
          throw new Error(photoText.invalid);
        }
      }
      const nextProfile = await changeAvatar(
        supabase,
        session.user.id,
        profile?.avatar_url,
        file,
      );
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
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      navigate("/login", { replace: true });
    } catch (signOutError) {
      setError(signOutError.message);
      setSigningOut(false);
    }
  };

  const saveName = async () => {
    const nextName = editedName.trim();
    if (!nextName || !session?.user?.id) return;

    setSavingName(true);
    setError("");

    try {
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({ name: nextName })
        .eq("user_id", session.user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      updateProfile(data);
      setEditingName(false);
    } catch (err) {
      setError(err.message || "Unable to update your name.");
    } finally {
      setSavingName(false);
    }
  };

  const deleteAccount = async () => {
    if (deletingAccount || !session?.user?.id) return;
    setDeletingAccount(true);
    setError("");
    try {
      if (profile?.avatar_url) {
        const path = avatarPath(supabase, profile.avatar_url, session.user.id);
        if (path) {
          await supabase.storage
            .from(AVATAR_BUCKET)
            .remove([path])
            .catch(() => {});
        }
      }

      const { error: rpcError } = await supabase.rpc("delete_user");
      if (rpcError) throw rpcError;

      await supabase.auth.signOut().catch(() => {});
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          (rtl
            ? "تعذر حذف الحساب. يرجى المحاولة لاحقاً."
            : "Unable to delete account. Please try again."),
      );
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  const cardClass = `rounded-2xl border transition-colors duration-300 ${
    isDark
      ? "border-slate-800/90 bg-[#0f1628] shadow-[0_20px_50px_-20px_rgba(29,85,229,0.22)]"
      : "border-slate-200/90 bg-white shadow-[0_14px_40px_-18px_rgba(37,99,235,0.08)]"
  }`;

  const iconAccentClass = isDark ? "text-[#60a5fa]" : "text-[#1d55e5]";

  return (
    <section
      className={`relative min-h-[calc(100vh-73px)] overflow-hidden px-5 py-10 transition-colors duration-300 sm:px-10 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      {/* Ambient blue glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full blur-[130px] ${
          isDark ? "bg-blue-600/12" : "bg-blue-500/8"
        }`}
      />

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 mx-auto mb-8 max-w-4xl"
      >
        <h1
          className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
            isDark ? "text-white" : "text-[#0f172a]"
          }`}
        >
          {t("settingsTitle")}
        </h1>
        <p
          className={`mt-1.5 text-sm ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {t("manageAccountDescription")}
        </p>
      </motion.header>

      <div className="relative z-10 mx-auto max-w-4xl space-y-5">
        {loading ? (
          <div className={`${cardClass} flex items-center gap-3 p-6`}>
            <LoaderCircle className="h-5 w-5 animate-spin text-[#1d55e5]" />
            <p
              role="status"
              className={`text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {text.loading}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
            className={`${cardClass} grid p-6 sm:grid-cols-[minmax(0,1fr)_240px] sm:p-8`}
          >
            <section
              className="min-w-0 pb-6 sm:pe-8 sm:pb-0"
              aria-labelledby="account-heading"
            >
              <h2
                id="account-heading"
                className={`mb-6 text-base font-bold ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
              >
                {t("accountInformation")}
              </h2>

              <dl
                className={`divide-y text-sm ${
                  isDark
                    ? "divide-slate-800/80 text-slate-400"
                    : "divide-slate-100 text-slate-600"
                }`}
              >
                <div className="grid gap-3 pb-5 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                  <dt className="flex items-center gap-3 font-medium">
                    <Mail
                      size={18}
                      className={iconAccentClass}
                      aria-hidden="true"
                    />
                    <span>{t("emailLabel")}</span>
                  </dt>
                  <dd
                    className={`min-w-0 break-all text-start font-semibold lg:text-end ${
                      isDark ? "text-slate-100" : "text-[#0f172a]"
                    }`}
                  >
                    {session?.user?.email || text.unknown}
                  </dd>
                </div>

                <div className="grid gap-3 py-5 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                  <dt className="flex items-center gap-3 font-medium">
                    <CalendarDays
                      size={18}
                      className={iconAccentClass}
                      aria-hidden="true"
                    />
                    <span>{t("joinedDate")}</span>
                  </dt>
                  <dd
                    className={`font-semibold lg:text-end ${
                      isDark ? "text-slate-100" : "text-[#0f172a]"
                    }`}
                  >
                    <time dateTime={session?.user?.created_at}>
                      {joinedLabel}
                    </time>
                  </dd>
                </div>

                <div className="grid gap-3 pt-5 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                  <dt className="flex items-center gap-3 font-medium">
                    <Languages
                      size={18}
                      className={iconAccentClass}
                      aria-hidden="true"
                    />
                    <span>{t("languageLabel")}</span>
                  </dt>
                  <dd className="lg:text-end">
                    <button
                      type="button"
                      onClick={() => i18n.changeLanguage(rtl ? "en" : "ar")}
                      aria-label={
                        rtl ? "Switch to English" : "Switch to Arabic"
                      }
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        isDark
                          ? "border-slate-700 bg-[#0a101d] text-slate-200 hover:border-blue-500/50 hover:bg-[#172544] hover:text-[#60a5fa]"
                          : "border-slate-200 bg-[#f8fbff] text-[#0f172a] hover:border-blue-200 hover:bg-[#edf3ff] hover:text-[#1d55e5]"
                      }`}
                    >
                      <Languages size={15} aria-hidden="true" />
                      <span lang={rtl ? "en" : "ar"}>
                        {rtl ? "English" : "العربية"}
                      </span>
                    </button>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Right Profile / Avatar Column */}
            <aside
              className={`flex flex-col items-center justify-center border-t pt-6 text-center sm:border-s sm:border-t-0 sm:ps-7 sm:pt-0 ${
                isDark ? "border-slate-800/80" : "border-slate-100"
              }`}
            >
              <div
                ref={avatarMenu}
                className="relative"
                aria-busy={avatarBusy}
              >
                <img
                  src={avatarSrc}
                  alt={name}
                  className={`h-24 w-24 rounded-full object-cover ring-4 ${
                    isDark
                      ? "bg-[#172544] ring-blue-500/20"
                      : "bg-[#e8efff] ring-blue-500/15"
                  }`}
                />
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png"
                  aria-label={photoText.upload}
                  className="hidden"
                  disabled={avatarBusy || signingOut}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) saveAvatar(file);
                  }}
                />
                <button
                  ref={editButton}
                  type="button"
                  aria-expanded={avatarMenuOpen}
                  aria-controls="avatar-actions"
                  disabled={avatarBusy || signingOut || !profile || !session}
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className={`absolute -bottom-1 -start-2 inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-sm transition focus-visible:outline-2 focus-visible:outline-[#1d55e5] disabled:cursor-wait disabled:opacity-60 ${
                    isDark
                      ? "border-slate-700 bg-[#172544] text-slate-200 hover:bg-[#1e315c] hover:text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#1d55e5]"
                  }`}
                >
                  {avatarBusy ? (
                    <LoaderCircle
                      size={13}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Pencil size={13} aria-hidden="true" />
                  )}
                  {photoText.edit}
                </button>

                {avatarMenuOpen && (
                  <div
                    id="avatar-actions"
                    className={`absolute start-1/2 top-full z-20 mt-3 w-44 -translate-x-1/2 rounded-xl border p-1.5 text-start shadow-xl rtl:translate-x-1/2 ${
                      isDark
                        ? "border-slate-700 bg-[#131d33] text-slate-200"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        fileInput.current?.click();
                      }}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                        isDark
                          ? "hover:bg-slate-800"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <Upload size={14} aria-hidden="true" />
                      {photoText.upload}
                    </button>
                    <button
                      type="button"
                      disabled={!profile?.avatar_url}
                      onClick={() => saveAvatar(null)}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        isDark
                          ? "text-red-400 hover:bg-red-950/50"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      {photoText.remove}
                    </button>
                  </div>
                )}
              </div>

              <p
                className={`mt-3 text-xs ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {photoText.hint}
              </p>
              <p
                role="status"
                className={`mt-1 text-xs font-medium ${
                  isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
                }`}
              >
                {avatarBusy ? photoText.saving : avatarStatus}
              </p>

              {editingName ? (
                <div className="mt-3 flex w-full max-w-56 flex-col gap-2">
                  <input
                    dir="auto"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    maxLength={80}
                    autoFocus
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition ${
                      isDark
                        ? "border-slate-700 bg-[#0a101d] text-slate-100 focus:border-[#4f8ff7]"
                        : "border-slate-200 bg-[#f8fbff] text-[#0f172a] focus:border-[#1d55e5] focus:bg-white"
                    }`}
                    aria-label="Display name"
                  />

                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={saveName}
                      disabled={savingName || !editedName.trim()}
                      className="cursor-pointer rounded-lg bg-[#1d55e5] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1746c4] disabled:opacity-50"
                    >
                      {savingName ? text.saving : text.save}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditedName(name);
                        setEditingName(false);
                      }}
                      disabled={savingName}
                      className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-xs font-medium transition ${
                        isDark
                          ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                          : "border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {t("cancelButton")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2">
                  <p
                    dir="auto"
                    className={`break-words text-base font-bold ${
                      isDark ? "text-white" : "text-[#0f172a]"
                    }`}
                  >
                    {name}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(name);
                      setEditingName(true);
                    }}
                    disabled={savingName || signingOut}
                    aria-label="Edit name"
                    className={`cursor-pointer rounded-lg p-1.5 transition ${
                      isDark
                        ? "text-slate-400 hover:bg-slate-800 hover:text-[#60a5fa]"
                        : "text-slate-400 hover:bg-slate-100 hover:text-[#1d55e5]"
                    }`}
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}

              <button
                type="button"
                disabled={signingOut || avatarBusy}
                onClick={signOut}
                className={`mt-5 inline-flex w-full max-w-48 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-50 ${
                  isDark
                    ? "border-slate-700 bg-[#0a101d] text-slate-300 hover:border-red-500/40 hover:bg-red-950/40 hover:text-red-400"
                    : "border-slate-200 bg-[#f8fbff] text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-red-600"
                }`}
              >
                <LogOut size={16} />
                {signingOut ? text.signingOut : t("signOutButton")}
              </button>
            </aside>
          </motion.div>
        )}

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className={`flex flex-col justify-between gap-5 rounded-2xl border px-6 py-5 transition-colors duration-300 sm:flex-row sm:items-center sm:px-8 ${
            isDark
              ? "border-red-900/50 bg-[#0f1628]"
              : "border-red-200/80 bg-white shadow-[0_14px_40px_-18px_rgba(239,68,68,0.08)]"
          }`}
          aria-labelledby="danger-heading"
        >
          <div>
            <h2
              id="danger-heading"
              className={`flex items-center gap-2 text-base font-bold ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              <TriangleAlert size={19} />
              <span>{t("dangerZoneTitle")}</span>
            </h2>
            <p
              className={`mt-1.5 text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {t("deleteAccountWarning")}
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              disabled={deletingAccount || signingOut}
              onClick={() => setShowDeleteModal(true)}
              className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                isDark
                  ? "border-red-500/30 bg-red-950/50 text-red-400 hover:border-red-500/50 hover:bg-red-900/50"
                  : "border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100"
              }`}
            >
              <Trash2 size={16} />
              <span>{t("deleteAccountButton")}</span>
            </button>
          </div>
        </motion.section>

        {error && (
          <p
            role="alert"
            className={`rounded-xl border p-3.5 text-sm ${
              isDark
                ? "border-red-500/30 bg-red-950/50 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs"
          onClick={() => !deletingAccount && setShowDeleteModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? "border-slate-800 bg-[#0f1628] text-slate-100"
                : "border-slate-200 bg-white text-[#0f172a]"
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                  isDark ? "bg-red-950/70" : "bg-red-100"
                }`}
              >
                <TriangleAlert size={20} aria-hidden="true" />
              </div>
              <h3
                id="modal-delete-title"
                className={`text-lg font-bold ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
              >
                {t("confirmDeleteTitle")}
              </h3>
            </div>

            <p
              className={`mt-4 text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {t("confirmDeleteDescription")}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => setShowDeleteModal(false)}
                className={`cursor-pointer rounded-xl border px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                  isDark
                    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t("cancelButton")}
              </button>
              <button
                type="button"
                disabled={deletingAccount}
                onClick={deleteAccount}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-50"
              >
                {deletingAccount ? (
                  <>
                    <LoaderCircle
                      size={15}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    {t("deletingAccount")}
                  </>
                ) : (
                  <>
                    <Trash2 size={15} aria-hidden="true" />
                    {t("confirmDeleteButton")}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Settings;
