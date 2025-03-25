
import React from "react";
import { Bell, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarActionsProps {
  collapsed: boolean;
}

const SidebarActions: React.FC<SidebarActionsProps> = ({ collapsed }) => {
  return (
    <div className={cn("mt-4 flex flex-col gap-2", 
      collapsed ? "items-center" : "items-start")}>
      <Button variant="ghost" size="sm" className="w-full justify-start">
        <Bell className="h-4 w-4 mr-2" />
        {!collapsed && <span>Notifications</span>}
      </Button>
      <Button variant="ghost" size="sm" className="w-full justify-start">
        <HelpCircle className="h-4 w-4 mr-2" />
        {!collapsed && <span>Aide</span>}
      </Button>
      <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
        <LogOut className="h-4 w-4 mr-2" />
        {!collapsed && <span>Déconnexion</span>}
      </Button>
    </div>
  );
};

export default SidebarActions;
