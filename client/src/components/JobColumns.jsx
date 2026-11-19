import { useDroppable } from "@dnd-kit/react";

const JobColumns = ({
  id,
  children,
  footer,
  bottomSlot,
  bgColor,
  borderColor,
  text,
  icon,
  textBgColor,
  textColor,
  ringColor,
  isDark = false,
}) => {
  const lightSurface = {
    gray: "bg-slate-100/75",
    blue: "bg-[#eef4ff]/75",
    orange: "bg-amber-50/60",
    violet: "bg-violet-50/60",
    green: "bg-emerald-50/60",
  };

  const darkSurface = {
    gray: "bg-[#0f1628]/90",
    blue: "bg-[#0f182e]/95",
    orange: "bg-[#141624]/90",
    violet: "bg-[#13152a]/90",
    green: "bg-[#0d1a26]/90",
  };

  const topBorders = {
    gray: isDark ? "border-t-slate-400" : "border-t-slate-500",
    blue: isDark ? "border-t-[#3b82f6]" : "border-t-[#1d55e5]",
    orange: isDark ? "border-t-amber-400" : "border-t-amber-500",
    violet: isDark ? "border-t-violet-400" : "border-t-violet-500",
    green: isDark ? "border-t-emerald-400" : "border-t-emerald-500",
  };

  const headerTextColors = {
    gray: isDark ? "text-slate-300" : "text-slate-700",
    blue: isDark ? "text-[#60a5fa]" : "text-[#1d55e5]",
    orange: isDark ? "text-amber-400" : "text-amber-600",
    violet: isDark ? "text-violet-400" : "text-violet-600",
    green: isDark ? "text-emerald-400" : "text-emerald-600",
  };

  const badgeBgColors = {
    gray: isDark ? "bg-slate-800 text-slate-300" : "bg-slate-200/90 text-slate-700",
    blue: isDark ? "bg-[#172544] text-[#60a5fa]" : "bg-blue-100 text-[#1d55e5]",
    orange: isDark ? "bg-amber-950/60 text-amber-300" : "bg-amber-100 text-amber-700",
    violet: isDark ? "bg-violet-950/60 text-violet-300" : "bg-violet-100 text-violet-700",
    green: isDark ? "bg-emerald-950/60 text-emerald-300" : "bg-emerald-100 text-emerald-700",
  };

  const ringColors = {
    gray: "ring-slate-400",
    blue: "ring-[#1d55e5]",
    orange: "ring-amber-400",
    violet: "ring-violet-400",
    green: "ring-emerald-400",
  };

  const { ref, isDropTarget } = useDroppable({
    id,
  });

  const surfaceClass = isDark
    ? darkSurface[bgColor] || darkSurface.gray
    : lightSurface[bgColor] || lightSurface.gray;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-t-3 transition-all duration-200 sm:h-[22rem] md:h-[26rem] lg:h-[calc(100vh-230px)] lg:min-h-[520px] ${surfaceClass} ${
        topBorders[borderColor] || topBorders.gray
      } ${
        isDark
          ? "border-x-slate-800/90 border-b-slate-800/90 shadow-[0_14px_34px_-15px_rgba(0,0,0,0.45)]"
          : "border-x-slate-200/80 border-b-slate-200/80 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
      } ${
        isDropTarget
          ? `scale-[1.01] ring-2 ${ringColors[ringColor] || ringColors.blue}`
          : ""
      }`}
    >
      {/* Column Header */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-2">
        <p
          className={`flex items-center gap-2 text-sm font-bold ${
            headerTextColors[textColor] || headerTextColors.gray
          } [&>svg]:h-4 [&>svg]:w-4`}
        >
          {icon}
          <span>{text}</span>
        </p>
        <span
          className={`flex h-6 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${
            badgeBgColors[textBgColor] || badgeBgColors.gray
          }`}
        >
          {children.length}
        </span>
      </div>

      {/* Droppable Cards List */}
      <div
        ref={ref}
        className="flex flex-1 flex-col overflow-y-auto px-3 pb-3"
      >
        {children}

        {footer && (
          <div className="mt-auto flex flex-col items-center justify-end px-2 pt-6 pb-2 text-center">
            {footer}
          </div>
        )}
      </div>

      {/* Optional bottom slot (e.g. Delete Zone inside Accept column) */}
      {bottomSlot && <div className="shrink-0 p-3 pt-1">{bottomSlot}</div>}
    </div>
  );
};

export default JobColumns;
