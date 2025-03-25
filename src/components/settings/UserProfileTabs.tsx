
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserRole } from "@/types";
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import CalendlySettings from "./CalendlySettings";
import SecurityTab from "./tabs/SecurityTab";

interface UserProfileTabsProps {
  user: User;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isCurrentUser: boolean;
  canEdit: boolean;
  currentUserRole: UserRole;
  isSubmitting: boolean;
  handleSubmit: () => void;
}

const UserProfileTabs: React.FC<UserProfileTabsProps> = ({
  user,
  name,
  setName,
  email,
  setEmail,
  role,
  setRole,
  isCurrentUser,
  canEdit,
  currentUserRole,
  isSubmitting,
  handleSubmit
}) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-3">
        <TabsTrigger value="personal">Informations Personnelles</TabsTrigger>
        <TabsTrigger value="calendly">Intégration Calendly</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-6">
        <PersonalInfoTab
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          role={role}
          setRole={setRole}
          canEdit={canEdit}
          isCurrentUser={isCurrentUser}
          currentUserRole={currentUserRole}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </TabsContent>

      <TabsContent value="calendly" className="mt-6">
        <CalendlySettings 
          user={user}
          isCurrentUser={isCurrentUser}
          canEdit={canEdit}
        />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <SecurityTab isCurrentUser={isCurrentUser} />
      </TabsContent>
    </Tabs>
  );
};

export default UserProfileTabs;
