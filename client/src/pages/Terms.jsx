import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Languages, Moon, Sun } from "lucide-react";
import Footer from "../components/Footer";
import MasarLogo from "../components/MasarLogo";

const TERMS_COPY = {
  en: {
    back: "Back",
    title: "Terms of Service",
    updated: "Last updated: November 2026",
    intro:
      "Welcome to MasarPro (masarpro.app). By creating an account or using our website and tools, you agree to these Terms of Service. Please read them carefully.",
    sections: [
      {
        heading: "1. Overview of the Service",
        body: "MasarPro provides personal career-organization tools, including a job application tracker, resume builder, PDF export, and AI-assisted cover letter generator.",
      },
      {
        heading: "2. Accounts & Eligibility",
        body: "You are responsible for providing accurate account details and keeping access to your email account and sign-in links secure. You are responsible for all activity that occurs under your account.",
      },
      {
        heading: "3. Your Content & Ownership",
        body: "You retain full ownership of the resumes, job applications, cover letters, and notes you create or upload. By using MasarPro, you grant us a limited license solely to store, process, and display your content so we can provide the service to you. You agree not to upload unlawful, harmful, or infringing material.",
      },
      {
        heading: "4. AI-Generated Drafts & No Employment Guarantee",
        body: "AI-generated cover letters and suggestions are automated drafts intended to assist you. They may contain inaccuracies or require editing. You are solely responsible for reviewing and verifying all resumes, cover letters, and application materials before submitting them to any employer. MasarPro is not a recruiter or employer and does not guarantee interviews, job offers, or hiring outcomes.",
      },
      {
        heading: "5. Acceptable Use",
        body: "You agree not to misuse MasarPro, interfere with our servers, attempt unauthorized access to other accounts, bypass rate limits, or use automated scripts to scrape or overload the platform.",
      },
      {
        heading: "6. Service Availability & Backups",
        body: "MasarPro is provided on an “as is” and “as available” basis without warranties of any kind. While we take reasonable steps to keep your data secure and available, we do not guarantee uninterrupted or error-free operation. We recommend keeping exported PDF copies of your important resumes and letters.",
      },
      {
        heading: "7. Limitation of Liability",
        body: "To the maximum extent permitted by applicable law, MasarPro and its operators shall not be liable for any indirect, incidental, special, or consequential damages—including loss of data, missed deadlines, or lost employment opportunities—arising out of or related to your use of the service.",
      },
      {
        heading: "8. Account Deletion & Termination",
        body: "You may stop using MasarPro or delete your account at any time. We reserve the right to suspend or terminate accounts that violate these Terms or abuse the platform.",
      },
      {
        heading: "9. Changes to These Terms",
        body: "We may update these Terms from time to time. Continued use of MasarPro after changes are posted constitutes your acceptance of the updated Terms.",
      },
      {
        heading: "10. Contact",
        body: "If you have questions about these Terms, please reach out through our Contact page.",
      },
    ],
    contactLink: "Contact Us",
  },
  ar: {
    back: "رجوع",
    title: "شروط الخدمة",
    updated: "آخر تحديث: نوفمبر ٢٠٢٦",
    intro:
      "مرحباً بك في مسار برو (masarpro.app). بإنشائك لحساب أو استخدامك للموقع وأدواته، فإنك توافق على شروط الخدمة هذه. يرجى قراءتها بعناية.",
    sections: [
      {
        heading: "١. وصف الخدمة",
        body: "يوفر مسار برو أدوات لتنظيم البحث الوظيفي، تشمل متابعة طلبات التوظيف، وإنشاء السيرة الذاتية وتصديرها بصيغة PDF، وإنشاء مسودات خطابات التقديم بالذكاء الاصطناعي.",
      },
      {
        heading: "٢. الحسابات ومسؤولية المستخدم",
        body: "أنت مسؤول عن صحة البيانات التي تدخلها وعن الحفاظ على أمان بريدك الإلكتروني وروابط تسجيل الدخول الخاصة بك، وتتحمل المسؤولية عن جميع الأنشطة التي تتم عبر حسابك.",
      },
      {
        heading: "٣. ملكية المحتوى الخاص بك",
        body: "تحتفظ بملكية كاملة لسيرتك الذاتية وطلبات التوظيف وخطابات التقديم والملاحظات التي تنشئها أو ترفعها. يقتصر استخدامنا لمحتواك على تخزينه ومعالجته وعرضه لتقديم الخدمة لك فقط، وتلتزم بعدم رفع أي محتوى مخالف للقانون أو ينتهك حقوق الغير.",
      },
      {
        heading: "٤. مخرجات الذكاء الاصطناعي وعدم ضمان التوظيف",
        body: "خطابات التقديم والاقتراحات المولدة بالذكاء الاصطناعي هي مسودات مساعدة فقط وقد تحتاج إلى مراجعة وتعديل. أنت المسؤول الوحيد عن مراجعة دقة سيرتك الذاتية وخطاباتك قبل إرسالها لأي جهة عمل. مسار برو ليس جهة توظيف ولا يضمن الحصول على مقابلات أو عروض عمل.",
      },
      {
        heading: "٥. الاستخدام المقبول",
        body: "توافق على عدم إساءة استخدام المنصة، أو محاولة الوصول غير المصرح به إلى الخوادم أو حسابات الآخرين، أو تجاوز حدود الاستخدام، أو إرسال طلبات آلية تضر بأداء الخدمة.",
      },
      {
        heading: "٦. توفر الخدمة والنسخ الاحتياطي",
        body: "تُقدَّم خدمة مسار برو «كما هي» و«حسب توفرها» دون أي ضمانات صريحة أو ضمنية. رغم حرصنا على حماية بياناتك، لا نضمن عمل الخدمة دون انقطاع أو أخطاء، وننصح دائماً بالاحتفاظ بنسخ PDF احتياطية من سيرتك الذاتية ومستنداتك المهمة.",
      },
      {
        heading: "٧. حدود المسؤولية",
        body: "إلى أقصى حد يسمح به القانون، لا يتحمل مسار برو أو القائمون عليه أي مسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية — بما في ذلك فقدان البيانات أو فوات مواعيد التقديم أو فرص العمل — الناتجة عن استخدامك للخدمة.",
      },
      {
        heading: "٨. حذف الحساب وإنهاء الخدمة",
        body: "يمكنك التوقف عن استخدام الخدمة أو حذف حسابك في أي وقت من الإعدادات. كما نحتفظ بالحق في تعليق أو إنهاء أي حساب يخالف هذه الشروط أو يسيء استخدام المنصة.",
      },
      {
        heading: "٩. التعديلات على الشروط",
        body: "قد نقوم بتحديث هذه الشروط من وقت لآخر، ويُعد استمرارك في استخدام مسار برو بعد نشر التحديثات موافقة منك على الشروط المعدلة.",
      },
      {
        heading: "١٠. التواصل معنا",
        body: "إذا كان لديك أي استفسار حول شروط الخدمة، يمكنك مراسلتنا عبر صفحة تواصل معنا.",
      },
    ],
    contactLink: "تواصل معنا",
  },
};

function getInitialTheme() {
  try {
    return localStorage.getItem("masarpro-theme") === "dark";
  } catch {
    return false;
  }
}

export default function Terms() {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const copy = TERMS_COPY[lang];

  const [isDark, setIsDark] = useState(getInitialTheme);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("masarpro-theme", next ? "dark" : "light");
      } catch {
        // Storage is optional.
      }
      return next;
    });
  }, []);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex min-h-screen flex-col transition-colors duration-300 ${
        isDark ? "bg-[#080d1a] text-slate-100" : "bg-[#f8fbff] text-[#0f172a]"
      }`}
    >
      {/* Top Navbar */}
      <nav
        className={`border-b transition-colors duration-300 ${
          isDark
            ? "border-slate-800/80 bg-[#080d1a]/95 text-slate-200"
            : "border-slate-200/80 bg-white/95 text-[#0f172a]"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center">
            <MasarLogo isDark={isDark} isRtl={isRtl} />
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/login?state=register"
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isDark
                  ? "text-slate-300 hover:text-[#60a5fa]"
                  : "text-slate-600 hover:text-[#1d55e5]"
              }`}
            >
              <ArrowLeft size={16} className="rtl:rotate-180" />
              <span>{copy.back}</span>
            </Link>

            <button
              type="button"
              onClick={() => i18n.changeLanguage(isRtl ? "en" : "ar")}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isDark
                  ? "text-slate-200 hover:bg-slate-800/80 hover:text-[#60a5fa]"
                  : "text-[#0f172a] hover:bg-blue-50/80 hover:text-[#1d55e5]"
              }`}
            >
              <Languages size={17} />
              <span>{isRtl ? "EN" : "العربية"}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition ${
                isDark
                  ? "border-slate-800 bg-[#0f1628] text-amber-400 hover:border-slate-700"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">
        <div
          className={`rounded-2xl border p-7 sm:p-10 ${
            isDark
              ? "border-slate-800/90 bg-[#0f1628]"
              : "border-slate-200/90 bg-white shadow-xs"
          }`}
        >
          <h1
            className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
              isDark ? "text-white" : "text-[#0f172a]"
            }`}
          >
            {copy.title}
          </h1>
          <p className={`mt-1.5 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            {copy.updated}
          </p>

          <p
            className={`mt-5 text-sm leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {copy.intro}
          </p>

          <div className="mt-8 space-y-6">
            {copy.sections.map((section) => (
              <section key={section.heading}>
                <h2
                  className={`text-base font-bold ${
                    isDark ? "text-white" : "text-[#0f172a]"
                  }`}
                >
                  {section.heading}
                </h2>
                <p
                  className={`mt-1.5 text-sm leading-relaxed ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div
            className={`mt-8 border-t pt-6 text-sm ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}
          >
            <Link
              to="/contact"
              className={`font-semibold hover:underline ${
                isDark ? "text-[#60a5fa]" : "text-[#1d55e5]"
              }`}
            >
              {copy.contactLink}
            </Link>
          </div>
        </div>
      </main>

      <Footer isDark={isDark} />
    </div>
  );
}
