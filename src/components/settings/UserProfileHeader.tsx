
import React from "react";

interface UserProfileHeaderProps {
  isCurrentUser: boolean;
  userName: string;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ isCurrentUser, userName }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{isCurrentUser ? "Mon Profil" : `Profil de ${userName}`}</h1>
      <p className="text-muted-foreground mt-1">
        {isCurrentUser 
          ? "Gérez vos informations personnelles et vos paramètres" 
          : "Gérez les informations et les paramètres de cet utilisateur"}
      </p>
    </div>
  );
};

export default UserProfileHeader;
