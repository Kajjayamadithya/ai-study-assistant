import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl text-slate-400 hover:text-white dark:hover:text-white hover:bg-slate-800/60 dark:hover:bg-slate-800/80 transition-all duration-200 border border-slate-700/50 light:border-slate-300 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100"
      aria-label="Toggle theme mode"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
