import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import JobApllicationsCard from "./JobApllicationsCard";
import JobColumns from "./JobColumns";
import {
  BadgeCheck,
  FileText,
  Heart,
  Send,
  Trash2,
  Trophy,
  UserRoundGroup,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const DELETE_ZONE = "delete-job-zone";

const DeleteJobZone = ({ isDark = false }) => {
  const { ref, isDropTarget } = useDroppable({ id: DELETE_ZONE });
  const { t } = useTranslation();

  return (
    <div
      ref={ref}
      className={`flex min-h-20 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-3 text-center transition-all duration-200 ${
        isDropTarget
          ? isDark
            ? "border-red-400 bg-red-950/70 text-red-300 ring-2 ring-red-500/40"
            : "border-red-400 bg-red-100 text-red-700 ring-2 ring-red-200"
          : isDark
            ? "border-slate-700/80 bg-[#0a101d]/75 text-slate-400 hover:border-red-500/40 hover:text-red-300"
            : "border-slate-300/90 bg-white/75 text-slate-500 hover:border-red-300 hover:text-red-600"
      }`}
    >
      <Trash2 size={18} aria-hidden="true" />
      <span className="text-xs font-bold">{t("deleteApplicationTitle")}</span>
      <span className="text-[11px] opacity-80">
        {t("dropToPermanentlyDelete")}
      </span>
    </div>
  );
};

const KanbanBoard = ({ jobs, setJobs, searchQuery = "", isDark = false }) => {
  const { t } = useTranslation();

  const query = searchQuery.trim().toLowerCase();
  const matchesSearch = (job) =>
    [job.company_name, job.job_title].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(query),
    );
  const { session } = useAuth();
  const pendingJobs = useRef(new Set());
  const [saveError, setSaveError] = useState(null);

  const handleDragOver = (event) => {
    const { source, target } = event.operation;
    if (
      isSortable(source) &&
      isSortable(target) &&
      source.group !== target.group
    ) {
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
          isDark={isDark}
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

    if (
      !job ||
      (!statuses.includes(targetColumnId) && targetColumnId !== DELETE_ZONE)
    )
      return;
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
        setJobs((currentJobs) =>
          currentJobs.filter((item) => item.id !== jobId),
        );
      } catch (error) {
        setSaveError(
          `Unable to delete the application: ${error.message || "Please try again."}`,
        );
      } finally {
        pendingJobs.current.delete(jobId);
      }
      return;
    }

    const previousStatus = job.status;
    const previousIndex = jobs
      .filter((item) => item.status === previousStatus)
      .findIndex((item) => item.id === jobId);
    let targetIndex =
      isSortable(target) && isSortable(source)
        ? previousStatus === targetColumnId
          ? source.index
          : target.index
        : jobs.filter(
            (item) => item.status === targetColumnId && item.id !== jobId,
          ).length;

    if (query && isSortable(target)) {
      const siblings = jobs.filter(
        (item) => item.status === targetColumnId && item.id !== jobId,
      );
      const nextVisible = siblings.filter(matchesSearch)[targetIndex];
      targetIndex = nextVisible
        ? siblings.findIndex((item) => item.id === nextVisible.id)
        : siblings.length;
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
          ? remaining.findIndex(
              (item) => item.id === siblings[siblings.length - 1].id,
            ) + 1
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
      setJobs((currentJobs) =>
        moveJob(currentJobs, previousStatus, previousIndex),
      );
      setSaveError(
        `Unable to save the move: ${error.message || "Please try again."}`,
      );
    } finally {
      pendingJobs.current.delete(jobId);
    }
  };

  return (
    <>
      {saveError && (
        <p
          role="alert"
          className={`mx-4 mt-4 rounded-xl border p-3 text-sm md:mx-10 ${
            isDark
              ? "border-red-500/30 bg-red-950/50 text-red-300"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {saveError}
        </p>
      )}
      <div className="mx-4 mt-6 grid grid-cols-1 gap-4 pb-6 md:mx-10 md:grid-cols-2 lg:grid-cols-5">
        <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <JobColumns
            id="wishlist"
            bgColor="gray"
            borderColor="gray"
            ringColor="gray"
            textBgColor="gray"
            text={t("wishListStatus")}
            textColor="gray"
            isDark={isDark}
            icon={<Heart fill="currentColor" />}
          >
            {renderJobs("wishlist")}
          </JobColumns>

          <JobColumns
            id="applied"
            bgColor="blue"
            borderColor="blue"
            ringColor="blue"
            textBgColor="blue"
            textColor="blue"
            text={t("appliedStatus")}
            isDark={isDark}
            icon={<Send />}
          >
            {renderJobs("applied")}
          </JobColumns>

          <JobColumns
            id="interview"
            bgColor="orange"
            borderColor="orange"
            ringColor="orange"
            textBgColor="orange"
            textColor="orange"
            text={t("interviewStatus")}
            isDark={isDark}
            icon={<UserRoundGroup />}
          >
            {renderJobs("interview")}
          </JobColumns>

          <JobColumns
            id="offer"
            bgColor="violet"
            borderColor="violet"
            ringColor="violet"
            textBgColor="violet"
            textColor="violet"
            text={t("offerStatus")}
            isDark={isDark}
            icon={<FileText />}
          >
            {renderJobs("offer")}
          </JobColumns>

          <JobColumns
            id="accepted"
            bgColor="green"
            borderColor="green"
            ringColor="green"
            textBgColor="green"
            textColor="green"
            text={t("acceptStatus")}
            isDark={isDark}
            icon={<BadgeCheck />}
            footer={
              jobs.some((job) => job.status === "accepted") ? (
                <div
                  className={`flex flex-col items-center gap-1.5 ${
                    isDark ? "text-emerald-400" : "text-emerald-700"
                  }`}
                >
                  <Trophy
                    size={32}
                    className="text-amber-500"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-bold">
                    {t("congratsGotJobTitle")}
                  </p>
                </div>
              ) : null
            }
            bottomSlot={<DeleteJobZone isDark={isDark} />}
          >
            {renderJobs("accepted")}
          </JobColumns>
        </DragDropProvider>
      </div>
    </>
  );
};

export default KanbanBoard;
