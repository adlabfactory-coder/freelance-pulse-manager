
import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import UserProfile from "./UserProfile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface SidebarFooterProps {
  collapsed: boolean;
  renderIcon: (Icon: React.ElementType) => React.ReactNode;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ collapsed, renderIcon }) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        description: "Vous êtes déconnecté avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous déconnecter. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="p-3 mt-auto">
      <Separator className="my-2" />
      <div className="flex flex-col space-y-3">
        <UserProfile collapsed={collapsed} renderIcon={renderIcon} />
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full justify-start gap-2 text-sm"
          onClick={handleSignOut}
        >
          {renderIcon(LogOut)}
          <span className={collapsed ? "hidden" : "inline-block"}>
            Déconnexion
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarFooter;
