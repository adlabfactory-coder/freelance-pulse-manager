
import React from "react";
import { Button } from "@/components/ui/button";

// Données de démo pour les connexions
export const mockData = [
  { role: "admin", email: "admin@example.com", password: "password" },
  { role: "freelancer", email: "freelancer@example.com", password: "password" },
  { role: "client", email: "client@example.com", password: "password" },
  { role: "super_admin", email: "superadmin@example.com", password: "password" },
];

interface DemoLoginOptionsProps {
  onSelectRole: (role: string) => void;
}

const DemoLoginOptions: React.FC<DemoLoginOptionsProps> = ({ onSelectRole }) => {
  return (
    <>
      <div className="text-sm text-muted-foreground mb-2">
        Pour la démonstration, vous pouvez vous connecter avec :
      </div>
      <div className="grid grid-cols-2 gap-2 w-full mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectRole("admin")}
        >
          Admin
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectRole("freelancer")}
        >
          Freelancer
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectRole("super_admin")}
        >
          Super Admin
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectRole("client")}
        >
          Client
        </Button>
      </div>
    </>
  );
};

export default DemoLoginOptions;
