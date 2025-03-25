
import React from "react";
import SidebarHeader from "./sidebar/SidebarHeader";
import Navigation from "./sidebar/Navigation";
import SidebarFooter from "./sidebar/SidebarFooter";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const renderIcon = (Icon: React.ElementType) => {
    return <Icon className="h-5 w-5" aria-hidden="true" />;
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-screen bg-sidebar sticky top-0 border-r border-sidebar-border transition-all duration-300 ease-in-out",
          collapsed ? "w-[70px]" : "w-[250px]"
        )}
      >
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

        <div className="flex-1 overflow-auto py-4">
          <Navigation collapsed={collapsed} />
        </div>

        <SidebarFooter collapsed={collapsed} renderIcon={renderIcon} />
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
