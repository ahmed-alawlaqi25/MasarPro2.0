import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import JobApllicationsCard from "./JobApllicationsCard";
import JobColumns from "./JobColumns";
import {CircleCheckBig, FileText, Heart, Send, UserRoundGroup, Trash2, Trophy } from "lucide-react";

const DELETE_ZONE = "delete-job-zone";

const DeleteJobZone = () => {
  const { ref, isDropTarget } = useDroppable({ id: DELETE_ZONE });

  return (
    <div
      ref={ref}
      className={`flex min-h-24 w-full flex-col items-center gap-1 rounded-lg border-2 border-dashed p-3 text-center transition-colors duration-200 md:col-start-2 lg:col-start-5 ${
        isDropTarget
          ? 'border-red-400 bg-red-100 text-red-700 ring-2 ring-red-200'
          : 'border-slate-300 bg-white/40 text-slate-500'
      }`}
    >
      <Trash2 size={20} aria-hidden="true" />
      <span className="text-sm font-semibold">Delete application</span>
      <span className="text-xs">Drop here to permanently delete</span>
    </div>
  );
};


const KanbanBoard = ({ jobs, setJobs, searchQuery = '' }) => {
  const query = searchQuery.trim().toLowerCase();
  const matchesSearch = (job) => [job.company_name, job.job_title]
    .some((value) => String(value ?? '').toLowerCase().includes(query));
  const { session } = useAuth();
  const pendingJobs = useRef(new Set());
  const [saveError, setSaveError] = useState(null);
  const handleDragOver = (event) => {
    const { source, target } = event.operation;
    // React owns cross-column mounting. Prevent the sorting plugin from
    // reparenting a card DOM node before React removes the old component.
    if (isSortable(source) && isSortable(target) && source.group !== target.group) {
      event.preventDefault();
    }
  };

  
  const renderJobs = (columnId) =>
    jobs
      .filter((job) => job.status === columnId)
      .filter(matchesSearch)
      .map((job, index) => (
        <JobApllicationsCard
          key={job.id}
          id={job.id}
          job={job}
          index={index}
        />
      ));
  const handleDragEnd = async (event) => {
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source || !target) return;
    const jobId = source.id;
    const targetColumnId = isSortable(target) ? target.group : target.id;
    const userId = session?.user?.id;
    const job = jobs.find((item) => item.id === jobId);
    const statuses = ["wishlist", "applied", "interview", "offer", "accepted"];

    if (!job || (!statuses.includes(targetColumnId) && targetColumnId !== DELETE_ZONE)) return;
    if (pendingJobs.current.has(jobId)) return;
    if (!userId) {
      setSaveError("Please sign in before moving an application.");
      return;
    }

    if (targetColumnId === DELETE_ZONE) {
      pendingJobs.current.add(jobId);
      setSaveError(null);
      try {
        const { data, error } = await supabase
          .from("jobs")
          .delete()
          .eq("job_id", jobId)
          .eq("user_id", userId)
          .select("job_id")
          .single();
        if (error) throw error;
        if (!data) throw new Error("The deletion was not confirmed.");
        setJobs((currentJobs) => currentJobs.filter((item) => item.id !== jobId));
      } catch (error) {
        setSaveError(`Unable to delete the application: ${error.message || "Please try again."}`);
      } finally {
        pendingJobs.current.delete(jobId);
      }
      return;
    }

    const previousStatus = job.status;
    const previousIndex = jobs.filter((item) => item.status === previousStatus).findIndex((item) => item.id === jobId);
    let targetIndex = isSortable(target) && isSortable(source)
      ? previousStatus === targetColumnId ? source.index : target.index
      : jobs.filter((item) => item.status === targetColumnId && item.id !== jobId).length;
    if (query && isSortable(target)) {
      const siblings = jobs.filter((item) => item.status === targetColumnId && item.id !== jobId);
      const nextVisible = siblings.filter(matchesSearch)[targetIndex];
      targetIndex = nextVisible ? siblings.findIndex((item) => item.id === nextVisible.id) : siblings.length;
    }
    const moveJob = (currentJobs, status, index) => {
      const movedJob = currentJobs.find((item) => item.id === jobId);
      if (!movedJob) return currentJobs;
      const remaining = currentJobs.filter((item) => item.id !== jobId);
      const siblings = remaining.filter((item) => item.status === status);
      const nextSibling = siblings[index];
      const insertionIndex = nextSibling
        ? remaining.findIndex((item) => item.id === nextSibling.id)
        : siblings.length
          ? remaining.findIndex((item) => item.id === siblings[siblings.length - 1].id) + 1
          : remaining.length;
      remaining.splice(insertionIndex, 0, { ...movedJob, status });
      return remaining;
    };
    setJobs((currentJobs) => moveJob(currentJobs, targetColumnId, targetIndex));
    if (previousStatus === targetColumnId) return;
    pendingJobs.current.add(jobId);
    setSaveError(null);

    try {
      const { data, error } = await supabase
        .from("jobs")
        .update({ status: targetColumnId })
        .eq("job_id", jobId)
        .eq("user_id", userId)
        .select("job_id, status")
        .single();

      if (error) throw error;
      if (!data || data.status !== targetColumnId) {
        throw new Error("The new status was not confirmed.");
      }
    } catch (error) {
      setJobs((currentJobs) => moveJob(currentJobs, previousStatus, previousIndex));
      setSaveError(`Unable to save the move: ${error.message || "Please try again."}`);
    } finally {
      pendingJobs.current.delete(jobId);
    }
  };
  return (
    <>
    {saveError && <p role="alert" className="mx-10 mt-4 text-red-600">{saveError}</p>}
    <div className="grid grid-cols-1 gap-4 mx-10 mt-6 pb-4 md:grid-cols-2 lg:grid-cols-5">  
      <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <JobColumns
          id="wishlist"
          bgColor="gray"
          borderColor="gray"
          ringColor="gray"
          textBgColor="gray"
          text="Wish List"
          textColor="gray"
          icon={<Heart fill="currentColor" />}>
          {renderJobs("wishlist")}
        </JobColumns>
    <JobColumns
      id="applied"
      bgColor="blue"
      borderColor="blue"
      ringColor="blue"
      textBgColor="blue"
      textColor="blue"
      text="Applied"
      icon={<Send />}>
      {renderJobs("applied")}
    </JobColumns>

    <JobColumns
      id="interview"
      bgColor="orange"
      borderColor="orange"
      ringColor="orange"
      textBgColor="orange"
      textColor="orange"
      text="Interview"
      icon={<UserRoundGroup />}>
      {renderJobs("interview")}
    </JobColumns>

    <JobColumns
      id="offer"
      bgColor="violet"
      borderColor="violet"
      ringColor="violet"
      textBgColor="violet"
      textColor="violet"
      text="Offer"
      icon={<FileText />}>
      {renderJobs("offer")}
    </JobColumns>

    <JobColumns
      id="accepted"
      bgColor="green"
      borderColor="green"
      ringColor="green"
      textBgColor="green"
      textColor="green"
      text="Accept"
      footer={jobs.some((job) => job.status === "accepted") ? (
        <div className="flex flex-col items-center gap-2 text-green-700">
          <Trophy size={38} className="text-amber-500" aria-hidden="true" />
          <p className="text-sm font-bold">Congrats! You got the job!</p>
        </div>
      ) : null}
      icon={<CircleCheckBig />}>
      {renderJobs("accepted")}
    </JobColumns>
      
      <div className="hidden items-center justify-center lg:flex lg:col-start-3">
        <p className="text-lg text-slate-500">
          — Every Step is closeist better future — 
        </p>
      </div>
      <DeleteJobZone />
      

      

  </DragDropProvider>
</div>
    </>
  );
};
export default KanbanBoard;



