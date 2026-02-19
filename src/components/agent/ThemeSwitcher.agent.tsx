import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const themes = ['light', 'dark', 'system'] as const;
type ThemeOption = (typeof themes)[number];

export interface ThemeSwitcherProps {
  size?: 'sm' | 'md';
  className?: string;
}

export const ThemeSwitcher = ({ size = 'md', className }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const currentIndex = themes.indexOf(theme as ThemeOption);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const iconSize = size === 'sm' ? 16 : 18;

  const label = theme === 'dark' ? 'Tema escuro' : theme === 'light' ? 'Tema claro' : 'Tema do sistema';

  return (
    <button
      type="button"
      onClick={cycle}
      className={`flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-xs font-medium text-slate-200 shadow-inner transition hover:border-slate-500 hover:bg-slate-900 ${className ?? ''}`.trim()}
      aria-label={`Alternar tema (atual: ${label})`}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <Sun
          height={iconSize}
          width={iconSize}
          className={`absolute text-amber-300 transition-opacity ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}
        />
        <Moon
          height={iconSize}
          width={iconSize}
          className={`absolute text-sky-300 transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
        />
        <Sun
          height={iconSize}
          width={iconSize}
          className={`absolute text-slate-400 transition-opacity ${theme === 'system' ? 'opacity-100' : 'opacity-0'}`}
        />
      </span>
      <span className="capitalize">{label}</span>
    </button>
  );
};
