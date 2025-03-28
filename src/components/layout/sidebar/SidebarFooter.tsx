
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SidebarFooterProps {
  collapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed }) => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    console.log("Bouton de déconnexion cliqué dans SidebarFooter");
    try {
      await logout();
      // Le processus complet de déconnexion est géré par le hook useLogout
    } catch (err) {
      console.error("Erreur lors de la déconnexion depuis SidebarFooter:", err);
    }
  };

  return (
    <div className="mt-auto border-t px-2 py-2">
      <Button
        variant="destructive"
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
