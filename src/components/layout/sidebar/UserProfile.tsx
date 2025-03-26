
import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface UserProfileProps {
  collapsed: boolean;
  renderIcon?: (Icon: React.ElementType) => React.ReactNode;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  collapsed, 
  renderIcon = (Icon) => <Icon className="h-5 w-5" aria-hidden="true" />
}) => {
  const { user } = useAuth();
  
  // Obtenir le nom d'utilisateur à afficher
  const getUserDisplayName = () => {
    if (!user) return "Utilisateur";
    
    if (typeof user === 'object') {
      // Vérifier d'abord si email existe et l'utiliser comme fallback
      if ('email' in user && user.email) {
        return user.email.split('@')[0];
      }
      
      // Essayer les métadonnées (structure Supabase)
      if ('user_metadata' in user && user.user_metadata?.name) {
        return user.user_metadata.name;
      }
    }
    
    return "Utilisateur";
  };
  
  // Obtenir l'email ou un autre identifiant
  const getUserEmail = () => {
    if (!user) return "Connecté";
    
    if (typeof user === 'object' && 'email' in user && user.email) {
      return user.email;
    }
    
    return "Utilisateur connecté";
  };
  
  const displayName = getUserDisplayName();
  const displayEmail = getUserEmail();
  
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-sm text-sidebar-foreground/70 group",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
        {renderIcon(Users)}
      </div>
      <div
        className={cn(
          "transition-opacity",
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}
      >
        <div className="font-medium text-sidebar-foreground truncate max-w-[140px]">
          {displayName}
        </div>
        <div className="text-xs truncate max-w-[140px]">{displayEmail}</div>
      </div>
    </div>
  );
};

export default UserProfile;
