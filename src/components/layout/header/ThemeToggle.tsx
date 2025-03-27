
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
    >
      {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
