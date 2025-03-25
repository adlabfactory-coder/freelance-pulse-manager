
import React from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  collapsed: boolean;
  renderIcon: (Icon: React.ElementType) => React.ReactNode;
}

const UserProfile: React.FC<UserProfileProps> = ({ collapsed, renderIcon }) => {
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
        <div className="font-medium text-sidebar-foreground">Admin</div>
        <div className="text-xs">admin@example.com</div>
      </div>
    </div>
  );
};

export default UserProfile;
