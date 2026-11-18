import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Briefcase, FileText, Kanban, Sparkles } from "lucide-react";

const COPY = {
  en: {
    eyebrow: "THE MASAR JOURNEY",
    title: "A living trail from application to offer.",
    subtitle: "Four milestones take you from a saved job to an accepted offer.",
    steps: [
      {
        num: "1",
        title: "Add your jobs",
        description: "Save roles to your Wish List with company, city and date.",
        previewLabel: "Frontend Engineer · Riyadh",
        previewTag: "Wish List",
      },
      {
        num: "2",
        title: "Build your resume",
        description: "Choose a template, set an accent color and keep a version per role.",
        previewLabel: "Executive Template · Blue Accent",
        previewTag: "CV v3",
      },
      {
        num: "3",
        title: "Generate a letter",
        description: "Paste the job details and edit the tailored draft.",
        previewLabel: "Tailored cover letter ready",
        previewTag: "Drafted",
      },
      {
        num: "4",
        title: "Track to an offer",
        description: "Drag each card from Applied to Interview to Offer to Accept.",
        previewLabel: "Signed & Accepted",
        previewTag: "Offer Won",
      },
    ],
  },
  ar: {
    eyebrow: "رحلة مسار",
    title: "مسار حي يربط التقديم بالعرض الوظيفي.",
    subtitle: "أربع محطات تنقلك من حفظ الفرصة الوظيفية إلى قبول العرض.",
    steps: [
      {
        num: "1",
        title: "أضف وظائفك",
        description: "احفظ الفرص في قائمة الأمنيات مع الشركة والمدينة والتاريخ.",
        previewLabel: "مهندس واجهات · الرياض",
        previewTag: "الأمنيات",
      },
      {
        num: "2",
        title: "ابنِ سيرتك الذاتية",
        description: "اختر قالباً، حدد لوناً مميزاً واحتفظ بنسخة مخصصة لكل وظيفة.",
        previewLabel: "قالب تنفيذي · لون أزرق",
        previewTag: "نسخة ٣",
      },
      {
        num: "3",
        title: "أنشئ خطاب التقديم",
        description: "الصق تفاصيل الوظيفة وعدّل المسودة المصممة خصيصاً لها.",
        previewLabel: "خطاب تقديم مخصص جاهز",
        previewTag: "جاهز",
      },
      {
        num: "4",
        title: "تتبع حتى العرض",
        description: "اسحب كل بطاقة من تم التقديم إلى المقابلة إلى العرض ثم القبول.",
        previewLabel: "تم التوقيع والقبول",
        previewTag: "تم القبول",
      },
    ],
  },
};

const STEP_ICONS = [Briefcase, FileText, Sparkles, Kanban];
const DEFAULT_THRESHOLDS = [0, 0.33, 0.66, 0.95];

function buildWindingPath(points, boxWidth, isRtl) {
  if (points.length < 4) {
    return { d: "", thresholds: DEFAULT_THRESHOLDS };
  }

  const isCentered = Math.abs(points[0].x - boxWidth / 2) < 40;
  const sway = isCentered ? 72 * (isRtl ? -1 : 1) : 0;
  const commands = [`M ${points[0].x} ${points[0].y}`];
  const segmentLengths = [];

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const dy = end.y - start.y;
    const direction = i % 2 === 0 ? 1 : -1;
    const cx = (start.x + end.x) / 2 + sway * direction;
    const c1y = start.y + dy * 0.42;
    const c2y = start.y + dy * 0.58;

    commands.push(`C ${cx} ${c1y}, ${cx} ${c2y}, ${end.x} ${end.y}`);
    segmentLengths.push(Math.hypot(end.x - start.x, dy) + Math.abs(sway) * 0.35);
  }

  const total = Math.max(
    1,
    segmentLengths.reduce((acc, len) => acc + len, 0),
  );
  const cum1 = segmentLengths[0] / total;
  const cum2 = (segmentLengths[0] + segmentLengths[1]) / total;

  return {
    d: commands.join(" "),
    thresholds: [0, cum1, cum2, 0.96],
  };
}

function StepMiniArtifact({ index, step, isActive, isDark }) {
  if (index === 0) {
    return (
      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          isActive
            ? isDark
              ? "border-blue-500/35 bg-[#172544] text-[#60a5fa]"
              : "border-blue-200/70 bg-[#e8efff] text-[#1d55e5]"
            : isDark
              ? "border-slate-800 bg-slate-900/60 text-slate-500"
              : "border-slate-200 bg-slate-50 text-slate-400"
        }`}
      >
        <Briefcase className="h-3.5 w-3.5" />
        <span>{step.previewLabel}</span>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          isActive
            ? isDark
              ? "border-blue-500/35 bg-[#172544] text-[#60a5fa]"
              : "border-blue-200/70 bg-[#e8efff] text-[#1d55e5]"
            : isDark
              ? "border-slate-800 bg-slate-900/60 text-slate-500"
              : "border-slate-200 bg-slate-50 text-slate-400"
        }`}
      >
        <span>{step.previewLabel}</span>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          isActive
            ? isDark
              ? "border-blue-500/35 bg-[#172544] text-[#60a5fa]"
              : "border-blue-200/70 bg-[#e8efff] text-[#1d55e5]"
            : isDark
              ? "border-slate-800 bg-slate-900/60 text-slate-500"
              : "border-slate-200 bg-slate-50 text-slate-400"
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{step.previewLabel}</span>
      </div>
    );
  }

  return null;
}

function WindingStation({ step, index, isLit, isRtl, isDark, nodeRef }) {
  const Icon = STEP_ICONS[index];
  const isEven = index % 2 === 0;
  const slideOffset = isEven ? (isRtl ? 32 : -32) : isRtl ? -32 : 32;

  return (
    <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10">
      <div className={isEven ? "md:order-1" : "md:order-3"}>
        <motion.div
          animate={{
            opacity: isLit ? 1 : 0.45,
            x: isLit ? 0 : slideOffset,
            scale: isLit ? 1 : 0.97,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className={`rounded-2xl border p-6 transition-colors duration-300 ${
            isDark
              ? isLit
                ? "border-blue-500/60 bg-[#0f172a] shadow-[0_0_40px_-10px_rgba(37,99,235,0.4)]"
                : "border-slate-800/80 bg-[#0d1424]/90"
              : isLit
                ? "border-blue-500/50 bg-white shadow-[0_14px_38px_-14px_rgba(29,85,229,0.22)]"
                : "border-slate-200/90 bg-white/90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                isLit
                  ? "border-[#1d55e5] bg-[#1d55e5] text-white"
                  : isDark
                    ? "border-slate-700/70 bg-slate-800/90 text-slate-300"
                    : "border-slate-200 bg-slate-100 text-slate-500"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{step.previewTag}</span>
            </span>
            <span
              className={`font-mono text-xs font-semibold ${
                isDark ? "text-slate-400" : "text-slate-400"
              }`}
            >
              0{step.num}
            </span>
          </div>

          <h3 className={`mt-4 text-xl font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>
            {step.title}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {step.description}
          </p>
          <StepMiniArtifact index={index} step={step} isActive={isLit} isDark={isDark} />
        </motion.div>
      </div>

      {/* Center milestone node */}
      <div className="relative z-20 flex items-center justify-start md:order-2 md:justify-center">
        <div ref={nodeRef} className="relative inline-flex h-12 w-12 items-center justify-center">
          <motion.div
            animate={{
              scale: isLit ? 1.1 : 0.92,
              backgroundColor: isLit
                ? isDark
                  ? "#2563eb"
                  : "#1d55e5"
                : isDark
                  ? "#1e293b"
                  : "#cbd5e1",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold text-white shadow-lg"
          >
            {isLit && (
              <motion.span
                className="absolute inset-0 rounded-2xl border-2 border-blue-400"
                initial={{ scale: 1, opacity: 0.75 }}
                animate={{ scale: 1.45, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            {step.num}
          </motion.div>
        </div>
      </div>

      {/* Spacer on opposite side for alternating rhythm */}
      <div className={`hidden md:block ${isEven ? "md:order-3" : "md:order-1"}`} />
    </div>
  );
}

function MasarFeatures({ isDark = false }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const copy = COPY[lang];

  const sectionRef = useRef(null);
  const trailBoxRef = useRef(null);
  const windingPathRef = useRef(null);
  const nodeRefs = useRef([null, null, null, null]);

  const [litCount, setLitCount] = useState(1);
  const [trailData, setTrailData] = useState({
    d: "",
    width: 0,
    height: 0,
    thresholds: DEFAULT_THRESHOLDS,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 75%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    restDelta: 0.001,
  });

  const orbX = useMotionValue(0);
  const orbY = useMotionValue(0);
  const orbOpacity = useMotionValue(0);

  const measureGeometry = useCallback(() => {
    const boxEl = trailBoxRef.current;
    const nodes = nodeRefs.current;
    if (!boxEl || nodes.some((n) => !n)) return;

    const boxRect = boxEl.getBoundingClientRect();
    const points = nodes.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - boxRect.left + r.width / 2,
        y: r.top - boxRect.top + r.height / 2,
      };
    });

    const built = buildWindingPath(points, boxRect.width, isRtl);
    setTrailData({
      d: built.d,
      width: boxRect.width,
      height: boxRect.height,
      thresholds: built.thresholds,
    });
  }, [isRtl]);

  useLayoutEffect(() => {
    const boxEl = trailBoxRef.current;
    if (!boxEl) return;

    const rafId = requestAnimationFrame(measureGeometry);
    const observer = new ResizeObserver(() => {
      measureGeometry();
    });
    observer.observe(boxEl);
    window.addEventListener("resize", measureGeometry);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", measureGeometry);
    };
  }, [measureGeometry]);

  const syncOrbAndMilestones = useCallback(
    (latest) => {
      const clamped = Math.max(0, Math.min(1, latest));
      const pathEl = windingPathRef.current;
      if (pathEl && trailData.d) {
        try {
          const len = pathEl.getTotalLength();
          if (len > 0) {
            const pt = pathEl.getPointAtLength(clamped * len);
            orbX.set(pt.x);
            orbY.set(pt.y);
            orbOpacity.set(clamped > 0.01 && clamped < 0.99 ? 1 : 0);
          }
        } catch {
          // Path might not be ready on first paint
        }
      }

      const [, t2, t3, t4] = trailData.thresholds;
      let count = 1;
      if (clamped >= t4) count = 4;
      else if (clamped >= t3) count = 3;
      else if (clamped >= t2) count = 2;
      setLitCount((prev) => (prev === count ? prev : count));
    },
    [orbOpacity, orbX, orbY, trailData.d, trailData.thresholds],
  );

  useMotionValueEvent(smoothProgress, "change", syncOrbAndMilestones);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      syncOrbAndMilestones(smoothProgress.get());
    });
    return () => cancelAnimationFrame(rafId);
  }, [smoothProgress, syncOrbAndMilestones]);

  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      dir={isRtl ? "rtl" : "ltr"}
      className={`relative overflow-hidden px-6 py-24 transition-colors duration-300 sm:px-10 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#eef4ff] text-[#0f172a]"
      }`}
    >
      <div
        className={`pointer-events-none absolute left-1/2 top-0 h-80 w-[620px] -translate-x-1/2 rounded-full blur-[130px] ${
          isDark ? "bg-blue-600/15" : "bg-blue-400/15"
        }`}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className={`text-xs font-bold tracking-[0.18em] uppercase ${
              isDark ? "text-[#4f8ff7]" : "text-[#1d55e5]"
            }`}
          >
            {copy.eyebrow}
          </p>
          <h2
            className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {copy.title}
          </h2>
          <p
            className={`mt-3 text-base leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {copy.subtitle}
          </p>

          <div
            className={`mx-auto mt-6 h-1.5 w-44 overflow-hidden rounded-full ${
              isDark ? "bg-slate-800" : "bg-blue-100"
            }`}
          >
            <motion.div
              style={{ width: progressWidth }}
              className="h-full rounded-full bg-gradient-to-r from-[#1d55e5] via-[#3b82f6] to-[#0ea5e9]"
            />
          </div>
        </div>

        {/* Winding road + alternating milestones */}
        <div ref={trailBoxRef} className="relative mt-20">
          {trailData.d && (
            <svg
              className="pointer-events-none absolute inset-0 z-10 overflow-visible"
              width={trailData.width}
              height={trailData.height}
              viewBox={`0 0 ${Math.max(1, trailData.width)} ${Math.max(1, trailData.height)}`}
              fill="none"
            >
              <defs>
                <linearGradient id="masar-winding-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? "#2563eb" : "#1d55e5"} />
                  <stop offset="50%" stopColor={isDark ? "#38bdf8" : "#3b82f6"} />
                  <stop offset="100%" stopColor={isDark ? "#0fc2b3" : "#0ea5e9"} />
                </linearGradient>
              </defs>

              <path
                d={trailData.d}
                stroke={isDark ? "rgba(148, 163, 184, 0.18)" : "rgba(29, 85, 229, 0.16)"}
                strokeWidth="3.5"
                strokeDasharray="10 10"
                strokeLinecap="round"
              />
              <motion.path
                d={trailData.d}
                stroke="url(#masar-winding-grad)"
                strokeWidth="12"
                strokeLinecap="round"
                opacity={isDark ? 0.22 : 0.14}
                style={{ pathLength: smoothProgress }}
              />
              <motion.path
                ref={windingPathRef}
                d={trailData.d}
                stroke="url(#masar-winding-grad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                style={{ pathLength: smoothProgress }}
              />
              <motion.circle
                cx={orbX}
                cy={orbY}
                r="13"
                fill={isDark ? "#0fc2b3" : "#3b82f6"}
                fillOpacity={0.3}
                style={{ opacity: orbOpacity }}
              />
              <motion.circle
                cx={orbX}
                cy={orbY}
                r="6"
                fill="#ffffff"
                stroke="#1d55e5"
                strokeWidth="2.5"
                style={{ opacity: orbOpacity }}
              />
            </svg>
          )}

          <div className="relative z-20 flex flex-col gap-20 md:gap-24">
            {copy.steps.map((step, idx) => (
              <WindingStation
                key={step.num}
                step={step}
                index={idx}
                isLit={litCount >= idx + 1}
                isRtl={isRtl}
                isDark={isDark}
                nodeRef={(el) => {
                  nodeRefs.current[idx] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MasarFeatures;
