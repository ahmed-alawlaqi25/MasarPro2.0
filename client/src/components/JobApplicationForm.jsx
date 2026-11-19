import { X } from "lucide-react";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useJob } from "./JopContext";
import { useTranslation } from "react-i18next";

const JobApplicationForm = ({ onClose, isDark = false }) => {
  const { refreshJobs } = useJob();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    location: "",
    status: "wishlist",
    created_at: "",
    job_url: "",
    notes: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Please sign in before adding a job.");
      return;
    }

    const allowedStatuses = [
      "wishlist",
      "applied",
      "interview",
      "offer",
      "accepted",
    ];
    const companyName = formData.company_name.trim().slice(0, 120);
    const jobTitle = formData.job_title.trim().slice(0, 150);
    if (
      !companyName ||
      !jobTitle ||
      !allowedStatuses.includes(formData.status)
    ) {
      alert("Please enter valid job application details.");
      return;
    }

    const { error } = await supabase.from("jobs").insert({
      company_name: companyName,
      job_title: jobTitle,
      location: formData.location.trim().slice(0, 120),
      status: formData.status,
      created_at: formData.created_at,
      job_url: formData.job_url.trim().slice(0, 500),
      notes: formData.notes.trim().slice(0, 5000),
      user_id: user.id,
    });

    if (error) {
      alert(error.message);
      return;
    }

    await refreshJobs();
    onClose();
  };

  const inputStyles = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 ${
    isDark
      ? "border-slate-800 bg-[#0a101d] text-slate-100 placeholder:text-slate-500 focus:border-[#4f8ff7] focus:bg-[#0d1424] focus:ring-blue-500/15"
      : "border-slate-200 bg-[#f8fbff] text-[#0f172a] placeholder:text-slate-400 focus:border-[#1d55e5] focus:bg-white focus:ring-blue-500/10"
  }`;

  const labelStyles = `mb-2 block text-sm font-semibold ${
    isDark ? "text-slate-200" : "text-slate-700"
  }`;

  return (
    <div
      onMouseDown={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div
        onMouseDown={(event) => event.stopPropagation()}
        className={`relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border p-6 shadow-2xl md:p-8 ${
          isDark
            ? "border-slate-800 bg-[#0f1628] text-slate-100"
            : "border-slate-200 bg-white text-[#0f172a]"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close form"
          className={`absolute end-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full transition ${
            isDark
              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <X size={20} />
        </button>

        <div className="mb-7 pe-12">
          <h1
            className={`text-2xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {t("addJobApplicationTitle")}
          </h1>

          <p
            className={`mt-1 text-sm ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {t("enterJobApplicationDetailsSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="company_name" className={labelStyles}>
              {t("companyNameLabel")}
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              maxLength={120}
              value={formData.company_name}
              onChange={handleChange}
              placeholder={t("companyNamePlaceholder")}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label htmlFor="job_title" className={labelStyles}>
              {t("jobTitleLabel")}
            </label>
            <input
              id="job_title"
              name="job_title"
              type="text"
              maxLength={150}
              value={formData.job_title}
              onChange={handleChange}
              placeholder={t("jobTitlePlaceholder")}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label htmlFor="location" className={labelStyles}>
              {t("locationLabel")}
            </label>
            <input
              id="location"
              name="location"
              type="text"
              maxLength={120}
              value={formData.location}
              onChange={handleChange}
              placeholder={t("locationPlaceholder")}
              className={inputStyles}
            />
          </div>

          <div>
            <label htmlFor="status" className={labelStyles}>
              {t("statusLabel")}
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputStyles}
            >
              <option value="wishlist">{t("wishListStatus")}</option>
              <option value="applied">{t("appliedStatus")}</option>
              <option value="interview">{t("interviewStatus")}</option>
              <option value="offer">{t("offerStatus")}</option>
              <option value="accepted">{t("acceptStatus")}</option>
            </select>
          </div>

          <div>
            <label htmlFor="created_at" className={labelStyles}>
              {t("applicationDateLabel")}
            </label>
            <input
              id="created_at"
              name="created_at"
              type="date"
              value={formData.created_at}
              onChange={handleChange}
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label htmlFor="job_url" className={labelStyles}>
              {t("jobLinkLabel")}
            </label>
            <input
              id="job_url"
              name="job_url"
              type="url"
              maxLength={500}
              value={formData.job_url}
              onChange={handleChange}
              placeholder="https://example.com/job"
              className={inputStyles}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className={labelStyles}>
              {t("notesTitle")}
            </label>
            <textarea
              id="notes"
              name="notes"
              maxLength={5000}
              value={formData.notes}
              onChange={handleChange}
              placeholder={t("addNotesLabel")}
              rows="5"
              className={`${inputStyles} resize-none`}
            />
          </div>

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-[#1d55e5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1746c4]"
            >
              {t("saveApplicationButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
