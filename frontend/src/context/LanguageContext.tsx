import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Try to load from localStorage, default to hi-IN
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('jeevika_language') || 'hi-IN';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('jeevika_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
