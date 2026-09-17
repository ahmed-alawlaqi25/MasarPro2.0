import { Heart } from 'lucide-react'
import React from 'react'

const colors = {
  blue: "bg-blue-100",
  red: "bg-amber-100",
  green: "bg-green-100",
  indigo: "bg-indigo-100",
  gray: "bg-gray-100",
  orange:"bg-orange-100",
};

const Card = ({icon, text, bgColor}) => {
  return (
    <div
      className={`flex h-[60px] mt-2 w-[140px] flex-col rounded-2xl border border-white ${colors[bgColor] || ''} shadow-[0_8px_24px_rgba(31,52,85,0.09),inset_0_0_0_1px_rgba(220,227,237,0.35)]`}
    >
      <div className="flex items-center mt-2 gap-4">
        <span
          aria-hidden="true"
          className="text-[32px] ml-4 leading-none text-[#617696]"
        >
          {icon}
        </span>

        <strong className="text-[18px] leading-none mt-1">1</strong>
      </div>

      <p className=" text-[14px] self-center font-semibold text-[#4c6180]">
        {text}
      </p>
    </div>
  )
}

export default Card