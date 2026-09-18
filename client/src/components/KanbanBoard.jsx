import React, { useState } from 'react'
import {DragDropProvider} from '@dnd-kit/react';
import JobApllicationsCard from './JobApllicationsCard';
import JobColumns from './JobColumns';
import {  CircleCheckBig, FileText, Heart, Send, UserRoundGroup } from 'lucide-react';

const KanbanBoard = () => {
  const [isDropped, setIsDropped] = useState(false)
  return (
    <div className='flex gap-4 ml-10 mt-6 mr-10'>
    <DragDropProvider>
      <JobColumns bgColor="gray" borderColor="gray" textBgColor="gray" text="Wish List" textColor="gray" icon={<Heart fill="currentColor"/>}/>
      <JobColumns bgColor="blue" borderColor="blue" textBgColor="blue" textColor="blue" text="Applied" icon={<Send />}/>
      <JobColumns bgColor="orange" borderColor="orange" textBgColor="orange" textColor="orange" text="Interview" icon={<UserRoundGroup />}/>
      <JobColumns bgColor="violet" borderColor="violet" textBgColor="violet" textColor="violet" text="Offer" icon={<FileText />}/>
      <JobColumns bgColor="green" borderColor="green" textBgColor="green" textColor="green" text="Accept" icon={<CircleCheckBig />}/>

      
    </DragDropProvider>
    </div>
  );
}

export default KanbanBoard