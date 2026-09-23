import { X } from "lucide-react";
import { useState } from "react";
import { supabase } from '../lib/supabase'
import { useJob } from './JopContext';


const JobApplicationForm = ({ onClose }) => {
  const { refreshJobs } = useJob();
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

  const { error } = await supabase.from("jobs").insert({
    ...formData,
    user_id: user.id,
  });

  if (error) {
    alert(error.message);
    return;
  }

  await refreshJobs();
  onClose();
};


  
  const inputStyles =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
  <div

    onMouseDown={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <div
      onMouseDown={(event) => event.stopPropagation()}
      className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close form"
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
        <X size={22} />
      </button>

      <div className="mb-7 pr-12">
        <h1 className="text-2xl font-bold text-slate-900">
          Add Job Application
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Enter the job application details below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="company_name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Company name
            </label>

            <input
              id="company_name"
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Example: Google"
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label
              htmlFor="job_title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Job title
            </label>

            <input
              id="job_title"
              name="job_title"
              type="text"
              value={formData.job_title}
              onChange={handleChange}
              placeholder="Example: Software Engineer"
              className={inputStyles}
              required
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Riyadh"
              className={inputStyles}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputStyles}
            >
              <option value="wishlist">Wish List</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="created_at"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Application date
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
            <label
              htmlFor="job_url"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Job link
            </label>

            <input
              id="job_url"
              name="job_url"
              type="url"
              value={formData.job_url}
              onChange={handleChange}
              placeholder="https://example.com/job"
              className={inputStyles}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes about the job"
              rows="5"
              className={`${inputStyles} resize-none`}
            />
          </div>

          <div className="flex justify-end md:col-span-2">
            <button
              type="submit"
              className="rounded-lg cursor-pointer bg-linear-to-l from-[#0874c9] to-[#0eb0b2] px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Save Application
            </button>
          </div>
      </form>
    </div>
  </div>
  );
  };

export default JobApplicationForm;

