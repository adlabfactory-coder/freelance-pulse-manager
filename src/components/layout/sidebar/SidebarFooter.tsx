
import React from "react";
import { cn } from "@/lib/utils";
import UserProfile from "./UserProfile";
import { LogOut, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SidebarFooterProps {
  collapsed: boolean;
  renderIcon: (Icon: React.ElementType) => React.ReactNode;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, renderIcon }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/auth/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/+33612345678', '_blank');
  };

  return (
    <div className="border-t border-sidebar-border pt-4 pb-6 px-4">
      <UserProfile collapsed={collapsed} />
      
      <div className={cn("mt-4 flex gap-2", 
        collapsed ? "flex-col items-center" : "flex-col")}>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground w-full",
            collapsed && "justify-center px-0"
          )}
          onClick={handleWhatsAppContact}
        >
          {renderIcon(MessageCircle)}
          {!collapsed && <span className="ml-3">WhatsApp</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center justify-start text-destructive hover:bg-sidebar-accent hover:text-destructive w-full",
            collapsed && "justify-center px-0"
          )}
          onClick={handleLogout}
        >
          {renderIcon(LogOut)}
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </Button>
      </div>
    </div>
  );
};

export default SidebarFooter;
