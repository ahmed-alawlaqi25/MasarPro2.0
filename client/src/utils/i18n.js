import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      welcomeMessage: "Welcome to React and react-i18next",
      banner: "AI Feature Added",
      bannerSpan: "New",
      main:"Home",
      feature:"Feature",
      Blog:"Blog",
      contact:"Contact Us",
      loginMain:"Sign In",
      startNow:"Get Started",
      betterFutureBadge:"Your first step towards better opportunities 🚀 ",
      heroTitle:"Your job search",
      heroSpan:"in one place",
      heroSupTitle:"Track applications, manage interviews, and build better resumes with MasarPro — so you can apply smarter and land opportunities faster.",
      viewFeaturesBtn:"Explore Features",
      fromApplication:"From Application",
      toJobOffer:"To Job Offer",
      brighterCareer:"Brighter Career",
      brighterFuture:"Brighter Future",
      andEverythingBetween:"And Everything in Between",
      trackApplications:"Track Job Applications",
      withEase:"Easily",
      prepareForInterviews:"Prepare for Interviews",
      neverMissAppointment:"And Never Miss an Appointment",
      manageResumes:"Manage Your Resumes",
      forMultipleOpportunities:"For Multiple Opportunities",
      makeRealProgress:"Make Real Progress",
      inYourCareer:"In Your Career Path",
      getBetterOffers:"Get Better Offers",
      withBetterOrganization:"With Greater Organization",
      suitableForEveryone:"Suitable for Everyone",
      fromGraduatesToExperts:"From Fresh Graduates to Experts",
    }
  },
  ar: {
    translation: {
      welcomeMessage: "هلا بيك في رياكت",
      banner: "ميزة الذكاء الاصطناعي  ",
      bannerSpan: "جديدة",
      main: "الرئيسية",
      feature: "المزايا",
      Blog:"المدونة",
      contact:" تواصل معنى",
      loginMain:"تسجيل الدخول",
      startNow:"ابدأ الآن",
      betterFutureBadge:"خطوتك الأولى نحو فرص أفضل🚀",
      heroTitle:"كل بحثك عن وظيفة في",
      heroSpan:"مكان واحد", 
      heroSupTitle:"تابع طلباتك، نظم مقابلاتك، وأنشئ سيرة ذاتية أفضل مع MasarPro — لتتقدم بذكاء وتزيد فرصك في الحصول على الوظيفة.",
      viewFeaturesBtn:"استعرض المزايا",
      fromApplication:"من التقديم",
      toJobOffer:"إلى العرض الوظيفي ",
      andEverythingBetween:"وكل شيء بينهما ",
      brighterCareer:"أكثر إشراقاً ",
      brighterFuture:"مستقبل مهني",
      trackApplications:"تتبع طلبات التوظيف ",
      withEase:"بسهولة",
      prepareForInterviews:" جهز للمقابلات ",
      neverMissAppointment:" ولا تفوّت أي موعد ",
      manageResumes:" 📄أدر سيرتك الذاتية ",
      forMultipleOpportunities:" لأكثر من فرصة ",
      makeRealProgress:" حقق تقدماً حقيقياً ",
      inYourCareer:" في مسيرتك المهنية ",
      getBetterOffers:" احصل على عروض أفضل ",
      withBetterOrganization:"مع تنظيم أكبر ",
      suitableForEveryone:" مناسب للجميع ",
      fromGraduatesToExperts:" من حديثي التخرج إلى الخبراء ",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "er", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    fallbackLng: "en",
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;