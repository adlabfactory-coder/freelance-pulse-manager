
import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { User as AppUser } from "@/types"; // Import our custom User type

interface UserProfileProps {
  collapsed: boolean;
  renderIcon?: (Icon: React.ElementType) => React.ReactNode;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  collapsed, 
  renderIcon = (Icon) => <Icon className="h-5 w-5" aria-hidden="true" />
}) => {
  const { user } = useAuth();
  
  // Safety check for user object and its properties
  const displayName = user ? (
    'name' in user ? user.name : (user as any).user_metadata?.name || "Utilisateur"
  ) : "Utilisateur";
  
  const displayEmail = user ? (
    'email' in user ? user.email : (user as any).email || "Connecté"
  ) : "Connecté";
  
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
        <div className="font-medium text-sidebar-foreground">
          {displayName}
        </div>
        <div className="text-xs">{displayEmail}</div>
      </div>
    </div>
  );
};

export default UserProfile;
