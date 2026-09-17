import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {

      //Hero


      main:"Home",
      feature:"Features",
      Blog:"Blog",
      contact:"Contact Us",
      loginMain:"Sign In",
      startNow:"Get Started",
      betterFutureBadge:"Your first step towards better opportunities 🚀 ",
      heroTitle:"Your job search",
      heroSpan:"in one place",
      heroSupTitle:"Track applications, manage interviews, and build better resumes with MasarPro so you can apply smarter and land opportunities faster.",
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

      //Feature

      featuresSectionTitle:"✨ Features designed to simplify your journey",
      allTheToolsYouNeed:"All the tools you need",
      inOnePlace:"In One Place",
      featuresSectionSubtitle:"Track your applications, build your resume, and organize your interviews with ease using tools designed to help you advance with speed and confidence",
      jobTrackingTitle:"Job Tracking",
      jobTrackingDesc:"Organize applications, statuses, and notes in a single dashboard",
      resumeBuilderTitle:"Resume Builder",
      resumeBuilderDesc:"Create a professional resume tailored for every opportunity",
      interviewOrganizerTitle:"Interview Organizer",
      interviewOrganizerDesc:"Schedule appointments, set reminders, and prepare for every interview",

      //

      testimonialsTitle: "Testimonials",
      testimonialsSubTitle: "We have collected some testimonials from our users. They are real people who have used our product",

      //CTA

      startYourJourneyTitle: "Start your journey",
      readyToOrganizeTitle: "Ready to organize your job search?",
      startYourJourneyDesc: "Track applications, build better resumes, and stay focused on your next opportunity.",

      //Footer 

      copyrightNotice:"Copyright © " + new Date().getFullYear() + " MasarPro.app. All rights reservered.",

      //Login

      signInButton: "Please sign in to continue",
      loginTitle: "Login",
      signUpTitle: "Sign up",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      emailLabel: "Email",
      nameLabel: "Name",
      clickHereLink: "click here",

      // App

      jobTracker: "Job Tracker",
      welcomeMessage: "Welcome",
      readyForNewOpportunities: "Ready for new opportunities",


    }
  },
  ar: {
    translation: {
      //Hero


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
      heroSupTitle:"تابع طلباتك، نظم مقابلاتك، وأنشئ سيرة ذاتية أفضل مع MasarPro  لتتقدم بذكاء وتزيد فرصك في الحصول على الوظيفة.",
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

      //Feature

      featuresSectionTitle:"  مزايا مصممة لتسهّل رحلتك ✨",
      allTheToolsYouNeed:"  كل الأدوات التي تحتاجها ",
      inOnePlace:"في مكان واحد ",
      featuresSectionSubtitle:" تابع طلباتك، ابنِ سيرتك الذاتية، ونظّم مقابلاتك بسهولة مع أدوات تساعدك على التقدّم بثقة وسرعة. ",
      jobTrackingTitle:"تتبع الوظائف",
      jobTrackingDesc:"نظّم الطلبات، الحالات، والملاحظات في لوحة واحدة.",
      resumeBuilderTitle:"منشئ السيرة الذاتية",
      resumeBuilderDesc:"أنشئ سيرة ذاتية احترافية ومخصّصة لكل فرصة.",
      interviewOrganizerTitle:"تنظيم المقابلات",
      interviewOrganizerDesc:"رتّب المواعيد والتذكيرات واستعد لكل مقابلة.",

      //Testimonials

      testimonialsTitle: "آراء العملاء",
      testimonialsSubTitle: "لقد جمعنا بعض الآراء من مستخدمينا. هم أشخاص حقيقيون قاموا باستخدام منتجنا.",

      //CTA

      startYourJourneyTitle: "ابدأ رحلتك",
      readyToOrganizeTitle: "هل أنت مستعد لتنظيم بحثك الوظيفي؟",
      startYourJourneyDesc: "تتبع طلباتك، أنشئ سيراً ذاتية أفضل، وصبّ تركيزك على فرصتك القادمة.",

       //Footer 

      copyrightNotice: "جميع الحقوق محفوظة © " + new Date().getFullYear() + " MasarPro.app",      

      //Login

      signInButton: "يرجى تسجيل الدخول للمتابعة",
      loginTitle: "تسجيل الدخول",
      signUpTitle: "إنشاء حساب",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      dontHaveAccount: "ليس لديك حساب؟",
      emailLabel: "البريد الإلكتروني",
      nameLabel: "الاسم",
      clickHereLink: "انقر هنا",

      //App

      jobTracker: "متتبع الوظائف",

      welcomeMessage: "مرحباً",
      readyForNewOpportunities: "مستعد لفرص جديدة",

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