
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoTab from "./PersonalInfoTab";
import SecurityTab from "./SecurityTab";
import { useAuth } from "@/hooks/use-auth";
import { hasMinimumRole } from "@/types/roles";
import { UserRole } from "@/types";
import ApiKeysTab from "@/components/settings/api-keys/ApiKeysTab";

// Interface for component props
interface UserProfileTabsProps {
  onSelectUser?: (userId: string) => void;
}

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({ onSelectUser }) => {
  const [activeTab, setActiveTab] = useState("general");
  const { user, role } = useAuth();
  
  // State for PersonalInfoTab
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [userRole, setUserRole] = useState<UserRole>(role || UserRole.FREELANCER);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canAccessApiKeys = role && hasMinimumRole(role, UserRole.ACCOUNT_MANAGER);
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
    // In a real implementation, we would submit the data to an API
  };

  return (
    <Tabs
      defaultValue="general"
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="general">Informations générales</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
        {canAccessApiKeys && (
          <TabsTrigger value="api-keys">Clés API</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="general" className="space-y-4">
        <PersonalInfoTab 
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          role={userRole}
          setRole={setUserRole}
          canEdit={true}
          isCurrentUser={true}
          currentUserRole={role || UserRole.FREELANCER}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </TabsContent>
      <TabsContent value="security" className="space-y-4">
        <SecurityTab isCurrentUser={true} />
      </TabsContent>
      {canAccessApiKeys && (
        <TabsContent value="api-keys" className="space-y-4">
          <ApiKeysTab />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default UserProfileTabs;
