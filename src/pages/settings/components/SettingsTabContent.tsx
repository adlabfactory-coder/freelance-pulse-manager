
import React from "react";
import { User, UserRole } from "@/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import UserProfile from "@/components/settings/UserProfile";
import UsersManagement from "@/components/settings/UsersManagement";
import CompanySettings from "@/components/settings/CompanySettings";
import CommissionSettings from "@/components/settings/CommissionSettings";
import CalendlySettings from "@/components/settings/CalendlySettings";
import DatabaseTab from "@/components/settings/DatabaseTab";

interface SettingsTabContentProps {
  activeTab: string;
  users: User[];
  currentUser: User;
  selectedUserId: string;
  onUserSelected: (userId: string) => void;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({
  activeTab,
  users,
  currentUser,
  selectedUserId,
  onUserSelected
}) => {
  // Get the selected user object
  const selectedUser = users.find(user => user.id === selectedUserId) || currentUser;
  const isCurrentUser = selectedUser.id === currentUser.id;
  const canEdit = isCurrentUser || currentUser.role === UserRole.ADMIN;

  return (
    <Tabs value={activeTab}>
      <TabsContent value="profile" className="mt-0">
        {selectedUserId && (
          <UserProfile 
            userId={selectedUserId} 
            currentUser={currentUser} 
          />
        )}
      </TabsContent>

      <TabsContent value="users" className="mt-0">
        <UsersManagement 
          users={users} 
          currentUser={currentUser} 
          onSelectUser={onUserSelected} 
        />
      </TabsContent>

      <TabsContent value="company" className="mt-0">
        <CompanySettings />
      </TabsContent>

      <TabsContent value="calendly" className="mt-0">
        <CalendlySettings 
          user={selectedUser} 
          isCurrentUser={isCurrentUser} 
          canEdit={canEdit} 
        />
      </TabsContent>

      <TabsContent value="commissions" className="mt-0">
        <CommissionSettings />
      </TabsContent>
      
      <TabsContent value="database" className="mt-0">
        <DatabaseTab />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabContent;
