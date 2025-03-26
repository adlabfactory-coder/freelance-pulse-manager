
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // Collapse sidebar by default on mobile only
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    } else {
      // Pour les non-mobiles, on garde la sidebar visible par défaut
      setSidebarCollapsed(false);
    }
  }, [isMobile]);
  
  // Close sidebar when navigating on mobile only
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          isDarkMode={theme === 'dark'} 
          toggleDarkMode={toggleDarkMode} 
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 overflow-auto">
          <div className={`container mx-auto ${isMobile ? 'px-2 py-3 pb-20' : 'p-4 md:p-6'} animate-scale-in`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
