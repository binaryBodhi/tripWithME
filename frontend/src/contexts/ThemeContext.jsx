import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (targetTheme) => {
      let resolvedTheme = targetTheme;
      if (targetTheme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      root.setAttribute('data-theme', resolvedTheme);
      
      // Force Safari to paint the body background to match the theme (fixes overscroll and bottom bar)
      document.body.style.backgroundColor = resolvedTheme === 'dark' ? '#0f172a' : '#ffffff';
      
      // Update theme-color meta tags dynamically
      const lightMeta = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
      const darkMeta = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]');
      
      if (lightMeta && darkMeta) {
        if (targetTheme === 'dark') {
          lightMeta.setAttribute('content', '#0f172a');
          darkMeta.setAttribute('content', '#0f172a');
        } else if (targetTheme === 'light') {
          lightMeta.setAttribute('content', '#ffffff');
          darkMeta.setAttribute('content', '#ffffff');
        } else {
          // System mode: restore media queries
          lightMeta.setAttribute('content', '#ffffff');
          darkMeta.setAttribute('content', '#0f172a');
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
