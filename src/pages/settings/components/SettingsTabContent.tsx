
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import UserProfile from "@/components/settings/UserProfile";
import UsersManagement from "@/components/settings/UsersManagement";
import CompanySettings from "@/components/settings/CompanySettings";
import CommissionSettings from "@/components/settings/CommissionSettings";
import DatabaseTab from "@/components/settings/DatabaseTab";
import { User } from "@/types";

// Create an interface for UserProfile props
interface UserProfileProps {
  userId: string;
  currentUser: User;
  user?: User;
  isCurrentUser?: boolean;
  canEdit?: boolean;
}

interface SettingsContentProps {
  currentUser: User;
  users: User[];
  selectedUserId: string;
  activeTab: string;
  isLoading: boolean;
  onUserSelect: (userId: string) => void;
  onTabChange: (value: string) => void;
}

const SettingsContent: React.FC<SettingsContentProps> = ({
  currentUser,
  users,
  selectedUserId,
  activeTab,
  isLoading,
  onUserSelect,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <SettingsSidebar 
            currentUser={currentUser}
            users={users}
            selectedUserId={selectedUserId}
            activeTab={activeTab}
            isLoading={isLoading}
            onUserSelect={onUserSelect}
            onTabChange={onTabChange}
          />
        </div>

        <div className="md:col-span-3">
          <TabsContent value="profile" className="mt-0">
            {selectedUserId && (
              <UserProfile 
                userId={selectedUserId} 
                currentUser={currentUser} 
              />
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            <UsersManagement onSelectUser={onUserSelect} />
          </TabsContent>

          <TabsContent value="company" className="mt-0">
            <CompanySettings />
          </TabsContent>

          <TabsContent value="commissions" className="mt-0">
            <CommissionSettings />
          </TabsContent>
          
          <TabsContent value="database" className="mt-0">
            <DatabaseTab />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
};

export default SettingsContent;
