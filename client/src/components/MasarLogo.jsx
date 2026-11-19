import { useId } from "react";

const MasarLogo = ({ isDark = false, isRtl = false, size = "md" }) => {
  const uid = useId().replace(/:/g, "");
  const ids = {
    left: `masar-left-${uid}`,
    peak: `masar-peak-${uid}`,
    right: `masar-right-${uid}`,
    front: `masar-front-${uid}`,
    center: `masar-center-${uid}`,
  };

  const iconSize = size === "lg" ? "h-8 w-auto" : "h-7 w-auto";
  const textSize = size === "lg" ? "text-xl" : "text-lg";

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="158 156 658 364"
        fill="none"
        aria-hidden="true"
        className={iconSize}
      >
        <defs>
          <linearGradient
            id={ids.left}
            x1="339"
            y1="345"
            x2="220"
            y2="515"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={isDark ? "#3b82f6" : "#1d4ed8"} />
            <stop offset="1" stopColor={isDark ? "#93c5fd" : "#3b82f6"} />
          </linearGradient>
          <linearGradient
            id={ids.peak}
            x1="549"
            y1="170"
            x2="760"
            y2="480"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={isDark ? "#60a5fa" : "#2563eb"} />
            <stop offset="1" stopColor={isDark ? "#2563eb" : "#1e3a8a"} />
          </linearGradient>
          <linearGradient
            id={ids.right}
            x1="637"
            y1="310"
            x2="798"
            y2="504"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={isDark ? "#1d4ed8" : "#1e3a8a"} />
            <stop offset="1" stopColor={isDark ? "#60a5fa" : "#2563eb"} />
          </linearGradient>
          <linearGradient
            id={ids.front}
            x1="280"
            y1="180"
            x2="510"
            y2="490"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={isDark ? "#93c5fd" : "#3b82f6"} />
            <stop offset="1" stopColor={isDark ? "#2563eb" : "#1d4ed8"} />
          </linearGradient>
          <linearGradient
            id={ids.center}
            x1="439"
            y1="290"
            x2="518"
            y2="509"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={isDark ? "#3b82f6" : "#1e40af"} />
            <stop offset="1" stopColor={isDark ? "#1d4ed8" : "#172554"} />
          </linearGradient>
        </defs>

        <path
          fill={`url(#${ids.left})`}
          d="M198 513H269Q299 513 315 488L397 362L344 309L198 513Z"
        />
        <path
          fill={`url(#${ids.peak})`}
          d="M399 410L540 191Q560 162 590 162Q620 162 640 192L803 445Q819 471 805 493Q794 513 765 513H708Q681 513 665 490L591 378L520 489Q504 513 482 513L399 410Z"
        />
        <path
          fill={`url(#${ids.right})`}
          d="M591 378L622 329Q654 281 702 308Q719 317 733 339L803 445Q819 471 805 493Q794 513 765 513H708Q681 513 665 490L591 378Z"
        />
        <path
          fill={`url(#${ids.front})`}
          d="M173 443L339 192Q359 161 389 161Q419 161 439 193L570 410L520 489Q504 513 482 513Q459 511 445 487L371 363Q360 344 342 344Q324 344 312 364L226 496Q211 516 190 509Q169 502 164 482Q159 463 173 443Z"
        />
        <path
          fill={`url(#${ids.center})`}
          d="M399 410L488 273L570 410L520 489Q504 513 482 513Q459 511 445 487L399 410Z"
        />
      </svg>

      <span
        className={`${textSize} font-extrabold tracking-tight transition-colors duration-300 ${
          isDark ? "text-white" : "text-[#0f172a]"
        }`}
      >
        {isRtl ? "مسار برو" : "MasarPro"}
      </span>
    </span>
  );
};

export default MasarLogo;
