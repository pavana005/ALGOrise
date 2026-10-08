import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light' | 'cute';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isThemePromptOpen: boolean;
  openThemePrompt: () => void;
  closeThemePrompt: () => void;
  confirmThemeSelection: (theme: Theme) => void;
}

const STORAGE_THEME_KEY = 'algorise_theme_preference';
const STORAGE_CONFIGURED_KEY = 'algorise_theme_configured';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'cute') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'light'; // Default theme for new users and when no preference exists is Light Mode
  });

  const [isThemePromptOpen, setIsThemePromptOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      // Ignore
    }
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, newTheme);
      localStorage.setItem(STORAGE_CONFIGURED_KEY, 'true');
    } catch {
      // Ignore
    }
    document.documentElement.setAttribute('data-theme', newTheme);
    if (document.body) {
      document.body.setAttribute('data-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : prev === 'light' ? 'cute' : 'dark';
      try {
        localStorage.setItem(STORAGE_THEME_KEY, next);
        localStorage.setItem(STORAGE_CONFIGURED_KEY, 'true');
      } catch {
        // Ignore
      }
      document.documentElement.setAttribute('data-theme', next);
      if (document.body) {
        document.body.setAttribute('data-theme', next);
      }
      return next;
    });
  };

  const openThemePrompt = () => {
    setIsThemePromptOpen(true);
  };

  const closeThemePrompt = () => {
    setIsThemePromptOpen(false);
  };

  const confirmThemeSelection = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsThemePromptOpen(false);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isThemePromptOpen,
        openThemePrompt,
        closeThemePrompt,
        confirmThemeSelection
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
