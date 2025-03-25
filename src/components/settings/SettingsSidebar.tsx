
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import {
  Building2,
  Users,
  CalendarClock,
  BadgeDollarSign,
  Database
} from "lucide-react";

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  currentUser?: User;
  users?: User[];
  selectedUserId?: string;
  isLoading?: boolean;
  onUserSelect?: (userId: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  onTabChange,
  // Nouveaux props optionnels
  currentUser,
  users,
  selectedUserId,
  isLoading,
  onUserSelect
}) => {
  const tabs = [
    {
      value: "company",
      label: "Entreprise",
      icon: <Building2 className="h-5 w-5 mr-2" />,
    },
    {
      value: "users",
      label: "Utilisateurs",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      value: "commissions",
      label: "Commissions",
      icon: <BadgeDollarSign className="h-5 w-5 mr-2" />,
    },
    {
      value: "calendly",
      label: "Calendly",
      icon: <CalendarClock className="h-5 w-5 mr-2" />,
    },
    {
      value: "database",
      label: "Base de données",
      icon: <Database className="h-5 w-5 mr-2" />,
    }
  ];

  return (
    <div className="w-64 flex-shrink-0 border-r">
      <div className="p-6 space-y-2">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              activeTab === tab.value && "bg-muted"
            )}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;
