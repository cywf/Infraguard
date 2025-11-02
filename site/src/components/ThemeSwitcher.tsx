import { useState, useEffect } from 'react';

const themes = [
  'nightfall',
  'dracula',
  'cyberpunk',
  'dark-neon',
  'hackerman',
  'gamecore',
  'neon-accent',
] as const;

type Theme = typeof themes[number];

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('nightfall');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const defaultTheme = (import.meta.env.PUBLIC_DEFAULT_THEME || 'nightfall') as Theme;
    
    if (savedTheme && themes.includes(savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check prefers-color-scheme (all our themes are dark)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? defaultTheme : defaultTheme;
      setCurrentTheme(theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="dropdown dropdown-end">
        <button className="btn btn-ghost btn-circle" aria-label="Theme selector">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost btn-circle" aria-label="Theme selector" aria-haspopup="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-52 mt-4" role="menu">
        {themes.map((theme) => (
          <li key={theme} role="none">
            <button
              role="menuitem"
              onClick={() => handleThemeChange(theme)}
              className={`capitalize ${currentTheme === theme ? 'active' : ''}`}
            >
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSwitcher;
