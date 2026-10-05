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
      verifyEmailTitle: "Please verify your email",
      verifyEmailSubtitle: "You're almost there! We sent an email to",
      verifyEmailInstructions: "Click the link in that email to complete your signup. Don't see it? Check your spam folder.",
      spamFolder: "spam folder.",

      // App - Tracker

      jobTracker: "Job Tracker",
      welcomeMessage: "Welcome",
      readyForNewOpportunities: "Ready for new opportunities",
      addNewJobButton: "Add New Job",
      trackApplicationsDescription: "Track every job application in one place,",
      wishListStatus: "Wish List",
      appliedStatus: "Applied",
      interviewStatus: "Interview",
      offerStatus: "Offer",
      acceptStatus: "Accept",
      searchCompanyOrJobTitlePlaceholder: "Search company or job title...",
      deleteApplicationTitle: "Delete application",
      dropToPermanentlyDelete: "Drop here to permanently delete",
      congratsGotJobTitle: "Congrats! You got the job!",
      inspirationalQuote: "Every step you take brings you closer to a better future.",
      loadingApplications: "Loading applications...",
      unableToLoadApplications: "Unable to load applications:",

      //Job Form

      addJobApplicationTitle: "Add Job Application",
      enterJobApplicationDetailsSubtitle: "Enter the job application details below.",
      jobTitleLabel: "Job title",
      companyNamePlaceholder: "Example: Google",
      jobTitlePlaceholder: "Example: Software Engineer",
      statusLabel: "Status",
      locationPlaceholder: "Example: Riyadh", 
      addNotesLabel: "Add notes about the job",
      saveApplicationButton: "Save Application",


      //Job Application

      backToJobTracker: "Back to Job Tracker",
      applicationDetailsTitle: "Application details",
      companyNameLabel: "Company name",
      locationLabel: "Location",
      applicationDateLabel: "Application date",
      jobLinkLabel: "Job Link",
      jobDescriptionLabel: "Job description",
      noJobDescriptionAdded: "No job description added.",
      applicationStatusLabel: "Application status",
      resumeTitle: "Resume",
      noResumeAttached: "No resume attached.",
      notesTitle: "Notes",
      notesSaved: "Notes saved",
      unsavedChanges: "Unsaved changes",
      addNotesPlaceholder: "Add your notes about this application...",
      savingNotes: "Saving...",
      saveNotesButton: "Save notes",
      deleteApplicationButton: "Delete Application",
      deleteButton: "Delete",
      deletingApplication: "Deleting...",
      savingStatus: "Saving status...",

      //Resume Builder

      resumeBuilderTitle:"Resume Builder",
      resumeBuilderSubtitle: "Create, upload, and manage your resumes in one place", 
      yourResumesTitle: "Your resumes",
      updatedLabel: "Updated",
      editResumeButton: "Edit resume",
      searchResumePlaceholder: "Search resume",
      createResumeButton: "Create resume",
      startWithBlankResume: "Start with a blank resume",
      uploadExisting: "Upload existing",
      importYourResume: "Import your resume",
      enterResumeTitlePlaceholder: "Enter resume title",
      creatingResumeLoading: "Creating...",

      //Builder

      backToResumesLink: "Back to resumes",
      templateTab: "Template",
      accentTab: "Accent",
      personalInformationSection: "Personal Information",
      personalInformationSubtitle: "Add your details and see your resume update.",
      photoUploadNotice: "Photo upload coming later",
      nextButton: "Next",
      previousButton: "Previous",
      fullNameLabel: "Full name",
      professionalTitleLabel: "Professional title",
      professionalTitlePlaceholder: "Frontend Developer",
      emailAddressLabel: "Email address",
      phoneNumberLabel: "Phone number",
      locationPlaceholder: "Riyadh, Saudi Arabia",
      websiteLabel: "Website",
      fullNamePlaceholder: "Ahmed Al-Mansoor",
      linkedinLabel: "LinkedIn",
      yourNameLabel: "Your name",
      summaryDescription: "Describe your background, strengths, and career focus.",
      summaryLabel: "Summary",
      summaryPlaceholder: "Frontend developer with experience building...",
      professionalSummarySection: "Professional Summary",
      professionalExperienceSection: "Professional Experience",
      professionalExperienceSubtitle: "Add your work experience, starting with your most recent role.",
      experienceLabel: "Experience",
      endDateLabel: "End date",
      currentlyWorkHereLabel: "I currently work here",
      startDateLabel: "Start date",
      addExperienceButton: "+ Add experience",
      removeExperienceButton: "Remove experience",
      educationTrainingSection: "Education & Training",
      educationTrainingSubtitle: "Add your qualifications, courses, and training.",
      qualificationLabel: "Qualification or course",
      institutionLabel: "Institution or training provider",
      currentlyStudyingLabel: "Currently studying or training",
      detailsLabel: "Details or achievements",
      removeEducationButton: "Remove education or training",
      projectsHelpText: "Highlight projects and explain your contribution.",
      projectLabel: "Project",
      ongoingProjectLabel: "Ongoing project",
      currentlyStudyingLabel: "Currently studying or training",
      projectNameLabel: "Project name",
      companyLabel: "Company",
      yourRoleLabel: "Your role",
      projectLinkLabel: "Project link",
      descriptionAndContributionLabel: "Description and contribution",
      removeButton: "Remove",
      projectsLabel:"Projects",
      educationLabel: "Education",
      educationOrTrainingLabel: "education or training",
      addButton: "+ Add",
      skillsSectionTitle: "Skills",
      skillsHelpText: "Group related skills together. Separate skills with commas.",
      skillsSectionTitle: "Skills",
      skillsHelpText: "Group related skills together. Separate skills with commas.",
      skillGroupLabel: "Skill group",
      categoryLabel: "Category",
      programmingBackendExample: "Programming & Backend",
      removeSkillGroupButton: "Remove skill group",
      addSkillGroupButton: "+ Add skill group",
      optionalLabel: "Optional",

      //Settings 
      settingsTitle: "Settings",
      manageAccountDescription: "Manage your account and personal information.",
      accountInformation: "Account Information",
      emailLabel: "Email",
      joinedDate: "Date Joined",
      languageLabel: "Language",
      dangerZoneTitle: "Danger Zone",
      deleteAccountWarning: "Deleting your account will permanently delete your data.",
      deleteAccountButton: "Delete Account",
      deleteAccountUnavailable: "Account deletion is currently unavailable.",
      signOutButton: "Sign out",
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
      verifyEmailTitle: "يرجى التحقق من بريدك الإلكتروني",
      verifyEmailSubtitle: "أوشكت على الانتهاء! لقد أرسلنا رسالة إلى",
      verifyEmailInstructions: "انقر على الرابط الموجود في تلك الرسالة لإكمال التسجيل. لم تجدها؟ تحقق من مجلد",
      spamFolder: " البريد العشوائي",

      //App Tracker
      jobTracker: "متتبع الوظائف",
      welcomeMessage: "مرحباً",
      readyForNewOpportunities: "مستعد لفرص جديدة",
      addNewJobButton: "إضافة وظيفة جديدة",
      trackApplicationsDescription: "تتبع كل طلبات التوظيف في مكان واحد،",
      wishListStatus: "قائمة الأمنيات ",
      appliedStatus: "تم التقديم",
      interviewStatus: "مقابلة",
      offerStatus: "عرض عمل",
      acceptStatus: "قبول",
      searchCompanyOrJobTitlePlaceholder: "البحث عن شركة أو مسمى وظيفي...",
      deleteApplicationTitle: "حذف الطلب",
      dropToPermanentlyDelete: "إسقاط هنا للحذف النهائي",
      inspirationalQuote: "كل خطوة تتخذها تقربك أكثر من مستقبل أفضل",
      loadingApplications: "جاري تحميل الطلبات...",
      unableToLoadApplications: "تعذر تحميل الطلبات:",

      //job Form 
      addJobApplicationTitle: "إضافة طلب وظيفي",
      enterJobApplicationDetailsSubtitle: "أدخل تفاصيل طلب الوظيفة أدناه.",
      companyNamePlaceholder: "مثال: أرامكو",
      jobTitlePlaceholder: "مثال: مهندس برمجيات",
      locationPlaceholder: "مثال: الرياض",
      statusLabel: "الحالة",
      addNotesLabel: "أضف ملاحظات حول الوظيفة",
      saveApplicationButton: "حفظ الوظيفة",

      //Job Application

      backToJobTracker: "العودة إلى متتبع الوظائف",
      applicationDetailsTitle: "تفاصيل الطلب",
      companyNameLabel: "اسم الشركة",
      locationLabel: "الموقع",
      applicationDateLabel: "تاريخ التقديم",
      jobLinkLabel: "رابط الوظيفة",
      jobDescriptionLabel: "الوصف الوظيفي",
      noJobDescriptionAdded: "لم يتم إضافة وصف وظيفي.",
      applicationStatusLabel: "حالة الطلب",
      resumeTitle: "السيرة الذاتية",
      noResumeAttached: "لا يوجد سيرة ذاتية مرفقة.",
      notesTitle: "ملاحظات",
      notesSaved: "تم حفظ الملاحظات",
      unsavedChanges: "تغييرات غير محفوظة",
      addNotesPlaceholder: "أضف ملاحظاتك حول هذا الطلب...",
      savingNotes: "جاري الحفظ...",
      saveNotesButton: "حفظ الملاحظات",
      deleteApplicationButton: "حذف الطلب",
      deletingApplication: "جاري الحذف...",
      deleteButton: "حذف",
      savingStatus: "جاري حفظ الحالة...",
      congratsGotJobTitle: "تهانينا! على الحصول على الوظيفة!",
      jobTitleLabel: "المسمى الوظيفي",

      // Resume Builder

      resumeBuilderTitle: "منشئ السيرة الذاتية",
      resumeBuilderSubtitle: "أنشئ سيرتك الذاتية وارفعها وإدارتها في مكان واحد",
      yourResumesTitle: "سيرك الذاتية",
      updatedLabel: "اخر التحديث",
      editResumeButton: "تعديل السيرة الذاتية",
      searchResumePlaceholder: "البحث في السير الذاتية",
      createResumeButton: "إنشاء سيرة ذاتية",
      startWithBlankResume: "البدء بالسيرة الذاتية الفارغة",
      uploadExisting: "رفع ملف حالي",
      importYourResume: "استيراد سيرتك الذاتية",
      enterResumeTitlePlaceholder: "أدخل عنوان السيرة الذاتية",
      creatingResumeLoading: "جاري الإنشاء...",
      descriptionAndContributionLabel: "الوصف والمساهمة",
      
      //Builder

      backToResumesLink: "العودة إلى السير الذاتية",
      templateTab: "القالب",
      accentTab: "الالوان",
      personalInformationSection: "البيانات الشخصية",
      personalInformationSubtitle: "أضف تفاصيلك وشاهد تحديث سيرتك الذاتية.",
      photoUploadNotice: "سيتم إضافة خيار رفع الصورة لاحقاً",
      nextButton: "التالي",
      previousButton: "السابق",
      fullNameLabel: "الاسم الكامل",
      professionalTitleLabel: "المسمى الوظيفي",
      professionalTitlePlaceholder: "مطور واجهات أمامية",
      emailAddressLabel: "البريد الإلكتروني",
      phoneNumberLabel: "رقم الهاتف",
      locationPlaceholder: "الرياض، المملكة العربية السعودية",
      websiteLabel: "الموقع الإلكتروني",
      fullNamePlaceholder: "أحمد المنصور",
      linkedinLabel: "لينكد إن",
      yourNameLabel: "اسمك",
      summaryDescription: "صف خلفيتك المهنية، نقاط قوتك، وتركيزك المساري.",
      summaryLabel: "الملخص",
      summaryPlaceholder: "مطور واجهات أمامية ذو خبرة في بناء...",
      professionalSummarySection: "الملخص المهني",
      professionalExperienceSection: "الخبرة المهنية",
      professionalExperienceSubtitle: "أضف خبراتك العملية، بدءاً من أحدث وظيفة.",
      experienceLabel: "الخبرة",
      endDateLabel: "تاريخ الانتهاء",
      currentlyWorkHereLabel: "أعمل هنا حالياً",
      startDateLabel: "تاريخ البدء",
      addExperienceButton: "+ إضافة خبرة",
      jobTitleLabel: "المسمى الوظيفي",
      companyLabel: "الشركة",
      locationLabel: "المدينة",
      responsibilitiesLabel: "المسؤوليات والإنجازات",
      responsibilitiesHelpText: "اكتب نقطة واحدة في كل سطر",
      removeExperienceButton: "حذف الخبرة",
      educationTrainingSection: "التعليم والتدريب",
      educationTrainingSubtitle: "أضف مؤهلاتك، دوراتك، وتدريبك.",
      qualificationLabel: "المؤهل أو الدورة التدريبية",
      institutionLabel: "المؤسسة أو جهة التدريب",
      currentlyStudyingLabel: "أدرس أو أتدرب حالياً",
      detailsLabel: "التفاصيل أو الإنجازات",
      removeEducationButton: "حذف التعليم أو التدريب",
      projectsHelpText: "سلّط الضوء على المشاريع ووضّح مساهمتك فيها.",
      projectLabel: "المشروع",
      projectsLabel: "المشاريع",
      ongoingProjectLabel: "مشروع قائم",
      currentlyStudyingLabel: "أدرس أو أتدرب حالياً",
      projectNameLabel: "اسم المشروع",
      yourRoleLabel: "دورك في المشروع",
      projectLinkLabel: "رابط المشروع",
      removeButton: "حذف",
      educationLabel: "التعليم",
      educationOrTrainingLabel: "التعليم أو التدريب",
      addButton: "+ إضافة",
      skillsSectionTitle: "المهارات",
      skillsHelpText: "جمّع المهارات المترابطة معاً. افصل بين المهارات بفواصل.",
      skillsSectionTitle: "المهارات",
      skillsHelpText: "جمّع المهارات المترابطة معاً. افصل بين المهارات بفواصل.",
      skillGroupLabel: "مجموعة المهارات",
      categoryLabel: "الفئة",
      programmingBackendExample: "البرمجة والتطوير الخلفي",
      removeSkillGroupButton: "حذف مجموعة المهارات",
      addSkillGroupButton: "+ إضافة مجموعة مهارات",
      optionalLabel: "اختياري",

      // Settings
      settingsTitle: "الإعدادات",
      manageAccountDescription: "إدارة حسابك ومعلوماتك الشخصية.",
      accountInformation: "معلومات الحساب",
      emailLabel: "البريد الإلكتروني",
      joinedDate: "تاريخ الانضمام",
      languageLabel: "اللغة",
      dangerZoneTitle: "منطقة الخطر",
      deleteAccountWarning: "سيؤدي حذف الحساب إلى حذف بياناتك بشكل نهائي.",
      deleteAccountButton: "حذف الحساب",
      deleteAccountUnavailable: "حذف الحساب غير متاح حالياً",
      signOutButton: "تسجيل الخروج",
      
    }
  }
};

const browserLanguage = (navigator.languages || [navigator.language])
  .find(language => /^(ar|en)(-|$)/i.test(language));
let savedLanguage = /^ar\b/i.test(browserLanguage || '') ? 'ar' : 'en';
try {
  const stored = localStorage.getItem('masarpro-language');
  if (stored === 'en' || stored === 'ar') savedLanguage = stored;
} catch { /* Browser storage is optional. */ }

const syncLanguage = (language) => {
  const selected = language.startsWith('ar') ? 'ar' : 'en';
  document.documentElement.lang = selected;
  document.documentElement.dir = selected === 'ar' ? 'rtl' : 'ltr';
  try {
    localStorage.setItem('masarpro-language', selected);
  } catch { /* Direction switching still works without storage. */ }
};

syncLanguage(savedLanguage);
i18n.on('languageChanged', syncLanguage);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
