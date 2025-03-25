
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CompanySettings from "@/components/settings/CompanySettings";
import UsersManagement from "@/components/settings/UsersManagement";
import CommissionSettings from "@/components/settings/CommissionSettings";
import CalendlySettings from "@/components/settings/CalendlySettings";
import DatabaseStatus from "@/components/settings/DatabaseStatus";
import { User } from "@/types";

interface SettingsTabContentProps {
  value: string;
  users: User[];
  currentUser: User;
  onUserSelected: (userId: string) => void;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({ 
  value, 
  users, 
  currentUser,
  onUserSelected
}) => {
  return (
    <div className="w-full">
      <Tabs defaultValue={value} className="w-full">
        <TabsContent value="company" className="mt-0">
          <CompanySettings />
        </TabsContent>
        <TabsContent value="users" className="mt-0">
          <UsersManagement 
            users={users} 
            currentUser={currentUser} 
            onUserSelected={onUserSelected}
          />
        </TabsContent>
        <TabsContent value="commissions" className="mt-0">
          <CommissionSettings />
        </TabsContent>
        <TabsContent value="calendly" className="mt-0">
          <CalendlySettings />
        </TabsContent>
        <TabsContent value="database" className="mt-0">
          <DatabaseStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTabContent;
