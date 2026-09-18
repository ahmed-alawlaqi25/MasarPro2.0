import React from 'react'
import {useDraggable} from '@dnd-kit/react';

const JobApllicationsCard = () => {

  const {ref} = useDraggable({
    id: 'draggable',
  });
  return (
    <div ref={ref}>JobApllicationsCard</div>
  )
}

export default JobApllicationsCard