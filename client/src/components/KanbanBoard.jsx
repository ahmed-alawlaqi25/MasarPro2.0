import { DragDropProvider } from "@dnd-kit/react";
import JobApllicationsCard from "./JobApllicationsCard";
import JobColumns from "./JobColumns";
import {CircleCheckBig, FileText, Heart, Send, UserRoundGroup, } from "lucide-react";


const KanbanBoard = ({ jobs, setJobs }) => {
  const renderJobs = (columnId) =>
    jobs
      .filter((job) => job.columnId === columnId)
      .map((job) => (
        <JobApllicationsCard
          key={job.id}
          id={job.id}
        />
      ));
  const handleDragEnd = (event) => {
    if (event.canceled) return;
const jobId = event.operation.source?.id;
const targetColumnId = event.operation.target?.id;

if (!jobId || !targetColumnId) return;

setJobs((currentJobs) =>
  currentJobs.map((job) =>
    job.id === jobId
      ? { ...job, columnId: targetColumnId }
      : job
  )
);
  };
  return (
    <div className="gap-4 mx-10 mt-6  md:grid md:grid-cols-2 lg:grid-cols-5 sm:flex-col ">  
      <DragDropProvider onDragEnd={handleDragEnd}>
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
      icon={<CircleCheckBig />}>
      {renderJobs("accepted")}
    </JobColumns>
  </DragDropProvider>
</div>
  );
};
export default KanbanBoard;
