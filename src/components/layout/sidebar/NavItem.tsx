
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem as NavItemType } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface NavItemProps {
  item: NavItemType;
  collapsed: boolean;
  renderIcon: (Icon: React.ElementType) => React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ item, collapsed, renderIcon }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink
            to={item.href}
            className={({ isActive }) =>
              cn(
                "sidebar-nav-item group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-foreground font-medium" 
                  : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                item.disabled && "opacity-50 pointer-events-none"
              )
            }
          >
            {item.icon && (
              <span className="flex-shrink-0">
                {renderIcon(item.icon)}
              </span>
            )}
            <span
              className={cn(
                "transition-opacity",
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              {item.title}
            </span>
          </NavLink>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="ml-1">
            {item.title}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavItem;
