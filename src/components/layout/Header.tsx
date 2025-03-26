
import React from 'react';
import SidebarToggle from './header/SidebarToggle';
import NavigationMenu from './header/NavigationMenu';
import ThemeToggle from './header/ThemeToggle';
import SupportButton from './header/SupportButton';
import UserProfileMenu from './header/UserProfileMenu';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
  sidebarVisible?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleDarkMode,
  toggleSidebar,
  sidebarCollapsed,
  sidebarVisible = true
}) => {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 border-b bg-background shadow-sm">
      <div className="flex items-center">
        <SidebarToggle 
          toggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed} 
          sidebarVisible={sidebarVisible} 
        />
        <NavigationMenu />
      </div>
      
      <div className="flex items-center space-x-2">
        <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <SupportButton />
        <UserProfileMenu />
      </div>
    </header>
  );
};

export default Header;
