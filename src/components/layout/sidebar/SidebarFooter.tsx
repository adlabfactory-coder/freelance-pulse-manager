
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    // Nous ne faisons pas de navigation explicite ici car le hook useAuth s'en charge
  };

  return (
    <div className="mt-auto border-t px-2 py-2">
      <Button
        variant="ghost"
        size={collapsed ? "icon" : "default"}
        onClick={handleLogout}
        className={`${collapsed ? 'w-full justify-center' : 'w-full'} flex items-center`}
      >
        <LogOut className="h-5 w-5" />
        {!collapsed && <span className="ml-2">Déconnexion</span>}
      </Button>
    </div>
  );
};

export default SidebarFooter;
