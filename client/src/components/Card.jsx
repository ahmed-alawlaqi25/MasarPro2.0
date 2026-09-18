import { Heart } from 'lucide-react'
import React from 'react'

const colors = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  violet: "bg-violet-50",
  gray: "bg-gray-50",
  orange:"bg-orange-50",
};

    const textColors = {
        blue: "text-blue-700",
        green: "text-green-700",
        violet: "text-violet-700",
        gray: "text-gray-700",
        orange:"text-orange-700",
    };

const Card = ({icon, text, bgColor, textColor}) => {
  return (
    <div
      className={`flex h-[60px] mt-2 w-[140px] flex-col rounded-2xl border border-white ${colors[bgColor] || ''} shadow-[0_3px_10px_rgba(31,52,85,0.07)]`}
    >
      <div className="flex items-center mt-2 gap-4">
        <span
          aria-hidden="true"
          className={`text-[32px] ml-4 leading-none ${textColors[textColor]}`}
        >
          {icon}
        </span>

        <strong className={`text-[18px] leading-none mt-1 ${textColors[textColor]}`}>1</strong>
      </div>

      <p className={`text-[14px] self-center font-semibold ${textColors[textColor]}`}>
        {text}
      </p>
    </div>
  )
}

export default Card