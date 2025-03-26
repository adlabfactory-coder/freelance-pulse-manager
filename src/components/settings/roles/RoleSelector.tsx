
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { ROLE_HIERARCHY, USER_ROLE_LABELS, UserRole } from "@/types/roles";

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  return (
    <div className="flex space-x-2 mb-6 flex-wrap gap-2">
      {ROLE_HIERARCHY.map((role) => (
        <Button 
          key={role}
          variant={selectedRole === role ? "default" : "outline"} 
          onClick={() => onRoleSelect(role)}
          className={role === UserRole.SUPER_ADMIN ? "border-amber-500 text-amber-700" : ""}
        >
          {role === UserRole.SUPER_ADMIN && <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />}
          {USER_ROLE_LABELS[role]}
        </Button>
      ))}
    </div>
  );
};

export default RoleSelector;
