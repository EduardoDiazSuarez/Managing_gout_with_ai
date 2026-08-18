import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKey, NestedTranslation } from './translations';

export type Language = 'en' | 'es' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  tx: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('gout_app_language') as Language;
      if (saved === 'es' || saved === 'en' || saved === 'zh') return saved;
      // Auto-detect browser language
      if (typeof navigator !== 'undefined' && navigator.language) {
        if (navigator.language.startsWith('zh')) return 'zh';
        if (navigator.language.startsWith('es')) return 'es';
      }
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('gout_app_language', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch (e) {
      // ignore
    }
  }, [language]);

  // Nested property lookup for helper function t('dashboard.title')
  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English
        let fallbackCurrent: any = translations.en;
        for (const fbKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbKey in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fbKey];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackCurrent === 'string' ? fallbackCurrent : (fallback || path);
      }
    }
    return typeof current === 'string' ? current : (fallback || path);
  };

  const tx = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tx }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
