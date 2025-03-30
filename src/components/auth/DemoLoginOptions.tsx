
import React from "react";
import { demoUsers, DemoUser } from "@/utils/user-list";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/roles";

// Données préremplies pour le mode démo
export const mockData = [
  {
    email: "admin@example.com",
    password: "123456",
    role: "admin",
  },
  {
    email: "commercial@example.com",
    password: "123456",
    role: "account_manager",
  },
  {
    email: "freelance@example.com",
    password: "123456",
    role: "freelancer",
  },
  {
    email: "super@example.com",
    password: "123456",
    role: "super_admin",
  },
];

interface DemoLoginOptionsProps {
  onSelectRole: (role: string) => void;
}

const DemoLoginOptions: React.FC<DemoLoginOptionsProps> = ({ onSelectRole }) => {
  return (
    <div className="w-full">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Comptes de démonstration
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {demoUsers.map((user: DemoUser, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelectRole(user.role)}
            className="flex flex-col items-start text-left h-auto p-3 space-y-1"
          >
            <div className="font-medium w-full truncate text-primary">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
            <div className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">
              {getRoleName(user.role)}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

function getRoleName(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrateur";
    case UserRole.ACCOUNT_MANAGER:
      return "Chargé d'affaires";
    case UserRole.FREELANCER:
      return "Freelance";
    case UserRole.SUPER_ADMIN:
      return "Super Admin";
    default:
      return "Utilisateur";
  }
}

export default DemoLoginOptions;
