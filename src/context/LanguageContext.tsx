import React, { createContext, useContext, useState } from 'react';

export type ProgrammingLanguage = 'python' | 'java' | 'cpp' | 'c' | 'javascript' | 'csharp' | 'go';

export interface LanguageOption {
  id: ProgrammingLanguage;
  name: string;
  shortName: string;
  version: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'python', name: 'Python 3', shortName: 'Python', version: '3.11' },
  { id: 'java', name: 'Java 17', shortName: 'Java', version: '17.0' },
  { id: 'cpp', name: 'C++ 20', shortName: 'C++', version: '20.0' },
  { id: 'c', name: 'C (GCC)', shortName: 'C', version: 'GCC 13' },
  { id: 'javascript', name: 'JavaScript (ES6)', shortName: 'JavaScript', version: 'ES6' },
  { id: 'csharp', name: 'C# (.NET 8)', shortName: 'C#', version: '.NET 8' },
  { id: 'go', name: 'Go 1.21', shortName: 'Go', version: '1.21' }
];

interface LanguageContextType {
  preferredLanguage: ProgrammingLanguage;
  setPreferredLanguage: (lang: ProgrammingLanguage) => void;
  languageObj: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType>({
  preferredLanguage: 'python',
  setPreferredLanguage: () => {},
  languageObj: LANGUAGE_OPTIONS[0]
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferredLanguage, setPreferredLanguageState] = useState<ProgrammingLanguage>(() => {
    try {
      const saved = localStorage.getItem('algorise_preferred_language');
      if (saved && LANGUAGE_OPTIONS.some(l => l.id === saved)) {
        return saved as ProgrammingLanguage;
      }
    } catch {
      // Ignore
    }
    return 'python';
  });

  const setPreferredLanguage = (lang: ProgrammingLanguage) => {
    setPreferredLanguageState(lang);
    try {
      localStorage.setItem('algorise_preferred_language', lang);
    } catch {
      // Ignore
    }
  };

  const languageObj = LANGUAGE_OPTIONS.find(l => l.id === preferredLanguage) || LANGUAGE_OPTIONS[0];

  return (
    <LanguageContext.Provider value={{ preferredLanguage, setPreferredLanguage, languageObj }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
