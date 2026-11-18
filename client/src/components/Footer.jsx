import { useTranslation } from "react-i18next";

const Footer = ({ isDark = false }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const year = new Date().getFullYear();

  const copyrightText = isRtl
    ? `جميع الحقوق محفوظة © ${year} MasarPro.app`
    : `© ${year} MasarPro.app. All rights reserved.`;

  const iconClass = `transition-all duration-300 hover:-translate-y-0.5 ${
    isDark ? "text-slate-500 hover:text-[#4f8ff7]" : "text-slate-400 hover:text-[#1d55e5]"
  }`;

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex w-full flex-col items-center justify-center border-t px-5 py-8 transition-colors duration-300 ${
        isDark
          ? "border-slate-800/80 bg-[#080d1a] text-slate-500"
          : "border-slate-200/80 bg-[#f8fafc] text-slate-500"
      }`}
    >
      <p className="text-center text-xs sm:text-sm">{copyrightText}</p>

      <div className="mt-4 flex items-center gap-5">
        <a
          href="https://www.linkedin.com/in/ahmed-alawlaqi-dev/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={iconClass}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <a
          href="https://x.com/Ahmed_k247"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          className={iconClass}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <a
          href="https://github.com/ahmed-alawlaqi25"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={iconClass}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 18c-4.51 2-5-2-7-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
