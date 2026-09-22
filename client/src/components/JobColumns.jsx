import {useDroppable} from '@dnd-kit/react';

const JobColumns = ({id, children,bgColor, borderColor, text, icon, textBgColor, textColor, ringColor}  ) => {

    const colors = {
        blue: "bg-blue-50",
        green: "bg-green-50",
        violet: "bg-violet-50",
        gray: "bg-gray-50",
        orange:"bg-yellow-50",
    };

        const textBgColors = {
        blue: "bg-blue-200",
        green: "bg-green-200",
        violet: "bg-violet-200",
        gray: "bg-gray-200",
        orange:"bg-orange-200",
    };

    const textColors = {
        blue: "text-blue-700",
        green: "text-green-700",
        violet: "text-violet-700",
        gray: "text-gray-700",
        orange:"text-orange-700",
    };

        const borderColors = {
        blue: "border-blue-500",
        green: "border-green-600",
        violet: "border-violet-500",
        gray: "border-gray-500",
        orange:"border-orange-300", 
    };

    const ringColors = {
        blue: "ring-blue-500",
        green: "ring-green-600",
        violet: "ring-violet-500",
        gray: "ring-gray-500",
        orange:"ring-orange-300", 
    };

    const {ref, isDropTarget} = useDroppable({
    id,
  });


  
  return (

     <div
       ref={ref}
       className={`overflow-y-auto pb-2 transition-[transform,box-shadow] duration-200 west-out sm:h-[12rem] md:h-[22rem] lg:h-136 ${colors[bgColor]} border-t-2 ${borderColors[borderColor]} rounded-lg shadow-[0_8px_24px_rgba(31,52,85,0.06),inset_0_0_0_1px_rgba(220,227,237,0.35)] ${
         isDropTarget ? `scale-[1.01] ring-2 ${ringColors[ringColor]} border-t-1 ` : ''
       }`}
     >
        <div className="flex items-center justify-between mt-4 ml-7 mr-7">
          <p className={`flex gap-3 text-1.5xl font-bold  items-center justify-center ${textColors[textColor]}`}>{icon} {text}</p>
            <p className={`w-8 h-7 rounded-full text-1.5xl font-bold flex items-center justify-center ${textBgColors[textBgColor]} ${textColors[textColor]} ` } >{children.length}</p>
        </div>
      <div className=' flex-col ml-2' >
        {children}
      </div>
    </div>
  )
}

export default JobColumns
