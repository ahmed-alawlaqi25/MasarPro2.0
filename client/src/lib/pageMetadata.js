const pages = {
  '/': {
    en: {
      title: 'MasarPro | مسار برو - Job Application Tracker & Resume Builder',
      description: 'Organize your job applications and build your resume in Arabic or English with MasarPro. Track your progress, customize your CV, and export as PDF.',
    },
    ar: {
      title: 'مسار برو | متابعة طلبات التوظيف وإنشاء السيرة الذاتية',
      description: 'نظّم طلبات التوظيف وأنشئ سيرتك الذاتية بالعربية أو الإنجليزية مع مسار برو. تابع مراحل التقديم، وخصّص سيرتك الذاتية، واحفظها بصيغة PDF.',
    },
  },
  '/contact': {
    en: {
      title: 'Contact Us | MasarPro - مسار برو',
      description: 'Contact the MasarPro team for support, questions, or feedback about your account, resume builder, or job application tracker.',
    },
    ar: {
      title: 'تواصل معنا | مسار برو - MasarPro',
      description: 'تواصل مع فريق مسار برو للدعم والاستفسارات والملاحظات حول حسابك أو إنشاء السيرة الذاتية أو متابعة طلبات التوظيف.',
    },
  },
};

export function getPageMetadata(pathname, language = 'en') {
  const path = pathname.replace(/\/+$/, '') || '/';
  const locale = language.startsWith('ar') ? 'ar' : 'en';
  const page = pages[path];
  return {
    ...(page ? page[locale] : {
      title: 'MasarPro | مسار برو',
      description: locale === 'ar' ? 'حسابك في مسار برو.' : 'Your MasarPro account.',
    }),
    canonical: `https://masarpro.app${path === '/' ? '/' : path}`,
  };
}

export function syncPageMetadata(pathname, language) {
  const metadata = getPageMetadata(pathname, language);
  document.title = metadata.title;
  for (const [attribute, key, value] of [
    ['name', 'description', metadata.description],
    ['property', 'og:title', metadata.title],
    ['property', 'og:description', metadata.description],
    ['property', 'og:url', metadata.canonical],
    ['name', 'twitter:title', metadata.title],
    ['name', 'twitter:description', metadata.description],
  ]) {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', value);
  }
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = metadata.canonical;
}
