
import React from "react";
import SidebarHeader from "./sidebar/SidebarHeader";
import Navigation from "./sidebar/Navigation";
import SidebarFooter from "./sidebar/SidebarFooter";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-50",
          collapsed 
            ? "w-[70px]" 
            : isMobile 
              ? "w-[250px] fixed left-0" 
              : "w-[250px]"
        )}
        style={{ 
          transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
          // Force the visibility to ensure the sidebar is shown
          visibility: "visible",
          display: "flex"
        }}
      >
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

        <div className="flex-1 overflow-auto py-4">
          <Navigation collapsed={collapsed} />
        </div>

        <SidebarFooter collapsed={collapsed} />
      </aside>
      
      {/* Overlay pour mobile quand sidebar est ouverte */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
    </TooltipProvider>
  );
};

export default Sidebar;
