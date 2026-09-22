import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const { session, loading: authLoading } = useAuth();
  const userId = session?.user?.id;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const refreshJobs = useCallback(async () => {
    const currentRequest = ++requestId.current;

    if (authLoading) return;

    if (!userId) {
      setJobs([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("jobs")
        .select("id:job_id, job_title, company_name, location, created_at, status, job_url")
        .eq("user_id", userId);

      if (fetchError) throw fetchError;

      if (currentRequest === requestId.current) {
        setJobs((data ?? []).map((job) => ({
          ...job,
          status: String(job.status ?? '').trim().toLowerCase().replace(/[\s_-]+/g, ''),
        })));
      }
    } catch (fetchError) {
      if (currentRequest === requestId.current) {
        setJobs([]);
        setError(fetchError.message || "Unable to load jobs.");
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, [userId, authLoading]);

  useEffect(() => {
    setJobs([]);
    refreshJobs();

    return () => {
      requestId.current += 1;
    };
  }, [refreshJobs]);

  return (
    <JobContext.Provider value={{ jobs, setJobs, loading, error, refreshJobs }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => {
  const context = useContext(JobContext);

  if (!context) {
    throw new Error("useJob must be used inside JobProvider.");
  }

  return context;
};
