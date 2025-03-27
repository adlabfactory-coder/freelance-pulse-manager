
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { isAdmin, user } = useAuth();
  
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

  // Effet pour vérifier si la sidebar est réellement rendue
  useEffect(() => {
    // Vérifier si l'élément sidebar existe après le montage du composant
    const checkSidebarVisibility = () => {
      const sidebarElement = document.querySelector('aside');
      setSidebarVisible(!!sidebarElement);
    };

    // Attendre que le DOM soit complètement chargé
    setTimeout(checkSidebarVisibility, 200);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Le wrapper de la sidebar avec une visibilité forcée */}
      <div className="block" style={{ 
        zIndex: 50, 
        visibility: "visible",
        display: "block",
        position: isMobile ? "fixed" : "relative",
      }}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar} 
        />
      </div>
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed}
          sidebarVisible={sidebarVisible}
        />
        <main className="flex-1 overflow-auto w-full">
          <div className={`container mx-auto ${isMobile ? 'px-2 py-3 pb-20' : 'p-4 md:p-6'} animate-scale-in`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
