
import React from "react";
import { User } from "@/types";

// Définir explicitement les props attendues
export interface SettingsHeaderProps {
  title: string;
  description: string;
  currentUser: User;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ 
  title, 
  description, 
  currentUser, 
  isAdmin, 
  isSuperAdmin 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      
      {currentUser && (
        <div className="flex items-center space-x-2 mt-2">
          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs">
            {currentUser.name}
          </div>
          
          {isAdmin && (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
              Administrateur
            </div>
          )}
          
          {isSuperAdmin && (
            <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs">
              Super Admin
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsHeader;
