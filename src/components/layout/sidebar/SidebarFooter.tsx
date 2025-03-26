
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  const { logout } = useAuth();

  return (
    <div className="mt-auto border-t px-2 py-2">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className={`${collapsed ? 'w-full justify-center' : 'w-1/2'}`}
        >
          <Link to="/settings">
            <Settings className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Paramètres</span>}
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => logout()}
          className={`${collapsed ? 'w-full justify-center' : 'w-1/2'}`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Déconnexion</span>}
        </Button>
      </div>
    </div>
  );
};

export default SidebarFooter;
