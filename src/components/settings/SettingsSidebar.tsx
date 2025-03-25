
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
      value: "schedule",
      label: "Planification",
      icon: <CalendarClock className="h-5 w-5 mr-2" />,
    },
    {
      value: "database",
      label: "Base de données",
      icon: <Database className="h-5 w-5 mr-2" />,
    }
  ];

  if (isMobile) {
    return (
      <div className="w-full mb-6">
        <div className="grid grid-cols-2 gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant="ghost"
              className={cn(
                "justify-start",
                activeTab === tab.value && "bg-muted"
              )}
              onClick={() => onTabChange(tab.value)}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

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
