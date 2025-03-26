
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

interface UserProfileProps {
  collapsed: boolean;
  onClick?: () => void;
}

const getRoleLabel = (role?: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrateur";
    case UserRole.FREELANCER:
      return "Freelance";
    case UserRole.ACCOUNT_MANAGER:
      return "Chargé d'affaires";
    case UserRole.CLIENT:
      return "Client";
    default:
      return "Utilisateur";
  }
};

const UserProfile: React.FC<UserProfileProps> = ({ collapsed, onClick }) => {
  const { user } = useAuth();

  if (!user) return null;

  const userName = user.name || "Utilisateur";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "U";
  const roleLabel = getRoleLabel(user.role);

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start p-2 ${collapsed ? "justify-center" : ""}`}
      onClick={onClick}
    >
      <div className={`flex items-center ${collapsed ? "" : "w-full"}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} alt={userName} />
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        
        {!collapsed && (
          <div className="ml-2 text-left truncate">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{roleLabel}</p>
          </div>
        )}
      </div>
    </Button>
  );
};

export default UserProfile;
