import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FEATURE_COPY = {
  en: {
    eyebrow: "WHAT YOU GET",
    title: "Three tools. One workflow.",
    subtitle:
      "Every part of the search is connected, so nothing lives in a spreadsheet or a forgotten folder.",
    primaryTools: [
      {
        id: "kanban",
        title: "Kanban job tracker",
        description:
          "Five stages: Wish List, Applied, Interview, Offer, Accept. Drag cards between them, search by company or title, and see a live count for every stage.",
      },
      {
        id: "resume",
        title: "Resume builder",
        description:
          "Pick a template and an accent color, fill in the form, and watch the preview update. Import your existing CV text, keep several versions, and download a PDF.",
      },
      {
        id: "letter",
        title: "AI cover letter generator",
        description:
          "Paste the job details and get a tailored draft built from your CV. Edit the wording, see the letter update live, and export it as a PDF.",
        pillLeft: "Job details",
        pillRight: "Edit & save",
      },
    ],
    highlights: [
      {
        title: "Autosave",
        description: "Every edit is saved as you type.",
      },
      {
        title: "PDF export",
        description: "Resumes and letters download ready to send.",
      },
      {
        title: "Arabic and English",
        description: "Switch the interface language in one click.",
      },
      {
        title: "Private by design",
        description: "Row-level security keeps your data yours.",
      },
    ],
  },
  ar: {
    eyebrow: "ماذا ستحصل عليه",
    title: "ثلاث أدوات. سير عمل واحد.",
    subtitle:
      "كل جزء من رحلة بحثك الوظيفي مترابط، فلا يضيع أي طلب في جدول بيانات أو مجلد منسي.",
    primaryTools: [
      {
        id: "kanban",
        title: "متتبع الوظائف بنظام كانبان",
        description:
          "خمس مراحل: قائمة الأمنيات، تم التقديم، مقابلة، عرض عمل، قبول. اسحب البطاقات بينها، ابحث بالشركة أو المسمى، وتابع العدد الفعلي لكل مرحلة.",
      },
      {
        id: "resume",
        title: "منشئ السيرة الذاتية",
        description:
          "اختر قالباً ولوناً مميزاً، عبّئ بياناتك، وشاهد المعاينة تتحدث مباشرة. استورد نص سيرتك الحالية، احتفظ بعدة نسخ، وحمّلها كملف PDF.",
      },
      {
        id: "letter",
        title: "مولد خطابات التقديم بالذكاء الاصطناعي",
        description:
          "الصق تفاصيل الوظيفة واحصل على مسودة مخصصة من سيرتك الذاتية. عدّل الصياغة، شاهد التحديث الفوري، وصدّرها بصيغة PDF.",
        pillLeft: "تفاصيل الوظيفة",
        pillRight: "تعديل وحفظ",
      },
    ],
    highlights: [
      {
        title: "حفظ تلقائي",
        description: "كل تعديل يُحفظ مباشرة أثناء الكتابة.",
      },
      {
        title: "تصدير PDF",
        description: "السير الذاتية والخطابات جاهزة للتحميل والإرسال.",
      },
      {
        title: "العربية والإنجليزية",
        description: "بدّل لغة الواجهة بضغطة زر واحدة.",
      },
      {
        title: "خصوصية مدمجة",
        description: "حماية على مستوى الصفوف تحفظ بياناتك لك وحدك.",
      },
    ],
  },
};

const KANBAN_STAGE_COLORS = ["#6b7280", "#3b82f6", "#f97316", "#8b5cf6", "#059669"];

function ToolPreviewVisual({ tool, isRtl, isDark }) {
  if (tool.id === "kanban") {
    return (
      <div className="mb-5 grid grid-cols-5 gap-1.5">
        {KANBAN_STAGE_COLORS.map((shade) => (
          <span key={shade} style={{ backgroundColor: shade }} className="h-8 rounded-md" />
        ))}
      </div>
    );
  }

  if (tool.id === "resume") {
    return (
      <div className="mb-5 flex h-8 flex-col justify-center gap-2">
        <span className={`h-1.5 w-24 rounded-full ${isDark ? "bg-[#3b82f6]" : "bg-[#1d55e5]"}`} />
        <span className={`h-1.5 w-full rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
        <span className={`h-1.5 w-3/4 rounded-full ${isDark ? "bg-slate-800" : "bg-slate-100"}`} />
      </div>
    );
  }

  return (
    <div className="mb-5 flex h-8 items-center gap-2">
      <span
        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${
          isDark ? "bg-[#172544] text-[#60a5fa]" : "bg-[#eff5ff] text-[#1d55e5]"
        }`}
      >
        {tool.pillLeft}
      </span>
      {isRtl ? (
        <ArrowLeft className={`h-3.5 w-3.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
      ) : (
        <ArrowRight className={`h-3.5 w-3.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
      )}
      <span className="rounded-md bg-[#1d55e5] px-2.5 py-1 text-[11px] font-semibold text-white">
        {tool.pillRight}
      </span>
    </div>
  );
}

const Feature = ({ isDark = false }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const copy = FEATURE_COPY[lang];

  return (
    <section
      id="features"
      dir={isRtl ? "rtl" : "ltr"}
      className={`relative px-5 py-16 transition-colors duration-300 sm:px-8 sm:py-20 ${
        isDark ? "bg-[#080d1a]" : "bg-[#f8fbff]"
      }`}
    >
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <p
            className={`text-[11px] font-bold tracking-[0.16em] uppercase ${
              isDark ? "text-[#4f8ff7]" : "text-[#1d55e5]"
            }`}
          >
            {copy.eyebrow}
          </p>
          <h2
            className={`mt-2.5 text-3xl font-extrabold tracking-tight sm:text-4xl ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {copy.title}
          </h2>
          <p
            className={`mt-3 text-sm leading-relaxed sm:text-base ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {copy.subtitle}
          </p>
        </motion.div>

        {/* Primary 3 Tool Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {copy.primaryTools.map((tool, idx) => (
            <motion.article
              key={tool.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: idx * 0.07, ease: "easeOut" }}
              className={`rounded-2xl border p-6 text-start transition-all ${
                isDark
                  ? "border-slate-800/90 bg-[#0f1628] hover:border-slate-700"
                  : "border-slate-200/80 bg-white shadow-xs hover:shadow-md"
              }`}
            >
              <ToolPreviewVisual tool={tool} isRtl={isRtl} isDark={isDark} />
              <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                {tool.title}
              </h3>
              <p
                className={`mt-2 text-xs leading-relaxed sm:text-[13px] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {tool.description}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Bottom 4 Compact Highlight Cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.highlights.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.1 + idx * 0.05, ease: "easeOut" }}
              className={`rounded-xl border px-5 py-4 text-start transition-all ${
                isDark
                  ? "border-slate-800/90 bg-[#0f1628] hover:border-slate-700"
                  : "border-slate-200/80 bg-white shadow-xs hover:shadow-sm"
              }`}
            >
              <h3
                className={`text-xs font-bold sm:text-sm ${
                  isDark ? "text-white" : "text-[#0f172a]"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`mt-1 text-xs leading-relaxed ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
