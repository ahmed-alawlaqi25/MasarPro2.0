const Card = ({ icon, text, bgColor, textColor, count, isDark = false }) => {
  const lightStyles = {
    gray: "border-slate-200/90 bg-white text-slate-700",
    blue: "border-blue-200/80 bg-[#eff5ff] text-[#1d55e5]",
    orange: "border-amber-200/80 bg-amber-50/80 text-amber-700",
    violet: "border-violet-200/80 bg-violet-50/80 text-violet-700",
    green: "border-emerald-200/80 bg-emerald-50/80 text-emerald-700",
  };

  const darkStyles = {
    gray: "border-slate-800 bg-[#0f1628] text-slate-300",
    blue: "border-blue-500/30 bg-[#13203d] text-[#60a5fa]",
    orange: "border-amber-500/30 bg-amber-950/35 text-amber-400",
    violet: "border-violet-500/30 bg-violet-950/35 text-violet-400",
    green: "border-emerald-500/30 bg-emerald-950/35 text-emerald-400",
  };

  const palette = isDark
    ? darkStyles[bgColor] || darkStyles[textColor] || darkStyles.gray
    : lightStyles[bgColor] || lightStyles[textColor] || lightStyles.gray;

  return (
    <div
      className={`flex h-14 min-w-[132px] items-center justify-between gap-3 rounded-xl border px-3.5 py-2 shadow-xs transition-colors duration-300 ${palette}`}
    >
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
        <p className="text-xs font-semibold whitespace-nowrap">{text}</p>
      </div>

      <strong className="text-base font-extrabold leading-none">{count}</strong>
    </div>
  );
};

export default Card;
