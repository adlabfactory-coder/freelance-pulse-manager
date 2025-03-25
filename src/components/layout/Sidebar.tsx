
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
  const renderIcon = (Icon: React.ElementType) => {
    return <Icon className="h-5 w-5" aria-hidden="true" />;
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-screen bg-sidebar sticky top-0 border-r border-sidebar-border transition-all duration-300 ease-in-out z-50",
          collapsed 
            ? "w-[70px]" 
            : isMobile 
              ? "w-[220px] absolute" 
              : "w-[250px]"
        )}
        style={{ 
          transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)"
        }}
      >
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

        <div className="flex-1 overflow-auto py-4">
          <Navigation collapsed={collapsed} />
        </div>

        <SidebarFooter collapsed={collapsed} renderIcon={renderIcon} />
      </div>
      
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
