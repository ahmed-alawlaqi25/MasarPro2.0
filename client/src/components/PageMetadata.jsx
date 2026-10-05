import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { syncPageMetadata } from '../lib/pageMetadata';

export default function PageMetadata() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language || 'en';
  useEffect(() => {
    syncPageMetadata(pathname, language);
  }, [pathname, language]);
  return null;
}
