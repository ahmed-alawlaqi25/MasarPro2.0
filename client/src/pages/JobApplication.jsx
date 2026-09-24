import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, FileText, MapPin, CalendarDays, BriefcaseBusiness, UserRound, StickyNote, Trash2, ArrowLeft, Check, ExternalLink, Link2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthContext';
import { useJob } from '../components/JopContext';

const statuses = ['wishlist', 'applied', 'interview', 'offer', 'accepted'];
const statusLabels = ['Wish List', 'Applied', 'Interview', 'Offer', 'Accepted'];
const panel = 'rounded-2xl border border-[#e3edfa] bg-white p-4 shadow-[0_4px_20px_rgba(31,52,85,0.025)] sm:p-5';
const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};

const JobDetails = ({ applicationID, userId }) => {
  const { setJobs } = useJob();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState('');
  const [saved, setSaved] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data, error: queryError } = await supabase.from('jobs').select('*')
          .eq('job_id', applicationID).eq('user_id', userId).maybeSingle();
        if (queryError) throw queryError;
        if (active) {
          setJob(data);
          setNotes(data?.notes ?? '');
        }
      } catch (queryError) {
        if (active) setLoadError(queryError.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [applicationID, userId]);

  const updateJob = async (changes, action) => {
    if (busy.current) return;
    busy.current = true;
    setPending(action);
    setError('');
    setSaved(false);
    try {
      const { data, error: updateError } = await supabase.from('jobs').update(changes)
        .eq('job_id', applicationID).eq('user_id', userId).select('*').single();
      if (updateError) throw updateError;
      setJob(data);
      setJobs((current) => current.map((item) => String(item.id) === String(applicationID)
        ? { ...item, ...changes } : item));
      if (action === 'notes') setSaved(true);
    } catch (updateError) {
      setError(updateError.message || 'Unable to save changes.');
    } finally {
      busy.current = false;
      setPending('');
    }
  };

  const deleteJob = async () => {
    if (busy.current) return;
    busy.current = true;
    setPending('delete');
    setError('');
    try {
      const { error: deleteError } = await supabase.from('jobs').delete()
        .eq('job_id', applicationID).eq('user_id', userId).select('job_id').single();
      if (deleteError) throw deleteError;
      setJobs((current) => current.filter((item) => String(item.id) !== String(applicationID)));
      navigate('/job-tracker', { replace: true });
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete the application.');
    } finally {
      busy.current = false;
      setPending('');
    }
  };

  if (loading) return <p role="status" className="p-8 text-slate-500">Loading application...</p>;
  if (loadError || !job) return (
    <div className="p-8">
      <p role="alert" className="mb-4 text-red-600">{loadError || 'Application not found or unavailable.'}</p>
      <Link to="/job-tracker" className="text-teal-700 underline">Back to Job Tracker</Link>
    </div>
  );

  const jobUrl = safeUrl(job.job_url);
  const description = job.job_description || job.description;
  const status = String(job.status ?? '').trim().toLowerCase().replace(/[\s_-]+/g, '');
  const dirty = notes !== (job.notes ?? '');

    function CompanyLogo({ job }) {
  return (
    <img
      src={`https://img.logo.dev/name/${encodeURIComponent(job.company_name)}?token=${import.meta.env.VITE_LOGO_DEV_KEY}`}
      alt={`${job.company_name} logo`}
    />
  );
}


  return (
    <section className="bg-[#f4f9fc] px-4 py-6 text-[#0c1945] sm:px-8 lg:py-8">
      <div className="mx-auto max-w-[1280px] rounded-3xl border border-[#e3edfa] bg-white/85 p-4 shadow-[0_8px_32px_rgba(31,52,85,0.035)] sm:p-5">
        <Link to="/job-tracker" className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700"><ArrowLeft size={16} />Back to Job Tracker</Link>
        <header className="mb-4">
          <span className="inline-flex items-center gap-2 rounded-lg bg-[#e7f5f5] px-3 py-2 text-sm font-semibold text-[#009d96]"><FileText size={18} />Application details</span>
          <h1 dir="auto" className="mt-2 break-words text-xl font-bold sm:text-2xl">{job.job_title || 'Untitled application'}</h1>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <div className="flex min-w-0 flex-col gap-4">
            <section className={panel} aria-label="Company details">
              <div className="grid gap-4 sm:grid-cols-2">
                <dl className="min-w-0 space-y-5 border-b border-[#e3edfa] pb-4  text-sm text-[#596b94] sm:border-b-0 sm:border-r sm:pr-4 sm:pb-0">
                  <div><dt className="flex gap-2 mt-5 "><Building2 size={18} />Company name</dt></div>
                  <div><dt className="flex gap-2 "><MapPin size={18} />Location</dt></div>
                  <div><dt className="flex gap-2"><CalendarDays size={18} />Application date</dt></div>
                  <div><dt className="flex gap-2"><Link2 size={18} />Job Link</dt></div>
                </dl>
                <div className="flex min-w-0 items-start gap-3 sm:pl-2">
                  <div className="min-w-0 pt-1">
                    <div className='flex flex-row justify-between items-center'>
                      <p className=" text-lg font-bold mr-auto">{job.company_name || 'Company not provided'}</p>
                      <div aria-hidden="true" className="grid lg:ml-[13rem] md:ml-[13rem] sm:ml-[10rem] h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e9f6f8] text-2xl font-bold text-teal-600">
                          <CompanyLogo job={job} />
                        </div>
                    </div>
                    
                    <p className="mt-3 text-sm text-[#596b94]">{job.location || 'Location not provided'}</p>
                    <dd className="mt-4 text-sm text-[#596b94]"><time dateTime={job.created_at || undefined}>{job.created_at ? String(job.created_at).slice(0, 10) : 'Not provided'}</time></dd>
                    {jobUrl && <a href={jobUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 break-all text-sm text-teal-600 hover:underline"><ExternalLink size={16} className="shrink-0" />{new URL(jobUrl).hostname}</a>}
                  </div>
                </div>

              </div>
            </section>
            <section className={panel + ' flex-1'}>
              <h2 className="mb-5 flex items-center gap-3 text-lg font-bold"><FileText size={23} className="text-teal-500" />Job description</h2>
              <p dir="auto" className="whitespace-pre-wrap break-words text-sm leading-6 text-[#596b94]">{description || 'No job description added.'}</p>
            </section>
          </div>

          <section className={panel + ' flex min-w-0 flex-col'}>
            <label htmlFor="application-status" className="mb-4 flex items-center gap-3 text-lg font-bold"><BriefcaseBusiness size={23} className="text-teal-500" />Application status</label>
            <select id="application-status" value={status} disabled={Boolean(pending)} onChange={(event) => updateJob({ status: event.target.value }, 'status')} className="w-full rounded-lg border border-[#dce7f7] bg-[#fafcff] px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 disabled:opacity-60">
              {!statuses.includes(status) && <option value={status}>{job.status || 'Select status'}</option>}
              {statuses.map((value, index) => <option key={value} value={value}>{statusLabels[index]}</option>)}
            </select>
            {pending === 'status' && <p role="status" className="mt-2 text-sm text-teal-700">Saving status...</p>}
            <div className="my-6 border-t border-[#e3edfa]" />
            <h2 className="mb-4 flex items-center gap-3 text-lg font-bold"><UserRound size={23} className="text-teal-500" />Resume</h2>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[#dce7f7] bg-[#fafcff] p-4 text-sm">
              <span className="text-[#596b94]">No resume attached.</span>
            </div>

            <form className="mt-7 flex flex-1 flex-col" onSubmit={(event) => { event.preventDefault(); updateJob({ notes }, 'notes'); }}>
              <label htmlFor="application-notes" className="mb-4 flex items-center gap-3 text-lg font-bold"><StickyNote size={23} className="text-teal-500" />Notes</label>
              <textarea id="application-notes" dir="auto" value={notes} disabled={Boolean(pending)} onChange={(event) => { setNotes(event.target.value); setSaved(false); }} placeholder="Add your notes about this application..." rows={5} className="min-h-32 w-full flex-1 resize-y rounded-lg border border-[#dce7f7] bg-[#fafcff] p-4 text-sm leading-6 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 disabled:opacity-60" />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span role="status" className="text-xs text-teal-700">{saved ? 'Notes saved' : dirty ? 'Unsaved changes' : ''}</span>
                <button type="submit" disabled={!dirty || Boolean(pending)} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"><Check size={16} />{pending === 'notes' ? 'Saving...' : 'Save notes'}</button>
              </div>
            </form>
          </section>
        </div>
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <footer className="mt-6 flex justify-start">
          <button type="button" disabled={Boolean(pending)} onClick={deleteJob} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/40 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"><Trash2 size={18} />{pending === 'delete' ? 'Deleting...' : 'Delete application'}</button>
        </footer>
      </div>
    </section>
  );
};

const JobApplication = () => {
  const { applicationID } = useParams();
  const { session, loading } = useAuth();
  if (loading) return <p role="status" className="p-8">Loading application...</p>;
  if (!session?.user) return <Link to="/login" className="block p-8">Sign in</Link>;
  return <JobDetails key={session.user.id + ':' + applicationID} applicationID={applicationID} userId={session.user.id} />;
};

export default JobApplication;

