import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CTA_COPY = {
  en: {
    title: "Ready to organize your job search?",
    subtitle: "Create your account and add your first application in a minute.",
    button: "Get started free",
  },
  ar: {
    title: "هل أنت مستعد لتنظيم بحثك الوظيفي؟",
    subtitle: "أنشئ حسابك وأضف أول طلب توظيف لك في دقيقة واحدة.",
    button: "ابدأ مجاناً",
  },
};

const CTA = ({ isDark = false }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const copy = CTA_COPY[lang];

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      className={`w-full py-16 transition-colors duration-300 ${
        isDark ? "bg-[#080d1a]" : "bg-[#f8fbff]"
      }`}
    >
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-3xl bg-[#1d55e5] px-6 py-14 text-center text-white shadow-[0_24px_60px_-20px_rgba(29,85,229,0.45)] sm:px-12 sm:py-16"
        >
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            {copy.title}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-blue-100 sm:text-base">
            {copy.subtitle}
          </p>

          <Link
            to="/login?state=register"
            className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-semibold text-[#1d55e5] shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            {copy.button}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
