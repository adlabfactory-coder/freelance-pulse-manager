
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import UserProfileTabs from "./tabs/UserTabs";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileLoading from "./UserProfileLoading";
import UserProfileError from "./UserProfileError";

interface UserProfileSettingsProps {
  currentUser: User | null;
}

const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({ currentUser }) => {
  const { loading: authLoading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(authError || null);

  if (authLoading) {
    return <UserProfileLoading />;
  }

  if (error || !currentUser) {
    return <UserProfileError error={error} />;
  }

  return (
    <Card>
      <CardHeader>
        <UserProfileHeader 
          isCurrentUser={true} 
          userName={currentUser.name || "Utilisateur"} 
        />
      </CardHeader>
      <CardContent>
        <UserProfileTabs 
          onSelectUser={(userId: string) => console.log(`User selected: ${userId}`)} 
        />
      </CardContent>
    </Card>
  );
};

export default UserProfileSettings;
