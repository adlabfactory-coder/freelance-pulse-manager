
import React from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ collapsed, onToggle }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
      <div
        className={cn(
          "flex items-center gap-2 transition-opacity",
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}
      >
        <div className="h-8 w-8 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold text-lg">
          A
        </div>
        <h1 className="font-semibold text-sidebar-foreground">
          AdLab Hub
        </h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="text-sidebar-foreground hover:bg-sidebar-accent"
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default SidebarHeader;
