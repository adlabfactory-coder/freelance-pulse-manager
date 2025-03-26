
import React from "react";
import { User } from "@/types";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileTabs from "./UserProfileTabs";
import UserProfileLoading from "./UserProfileLoading";
import UserProfileError from "./UserProfileError";
import { useUserProfileData } from "./hooks/useUserProfileData";

interface UserProfileProps {
  userId: string;
  currentUser: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, currentUser }) => {
  const {
    user,
    name,
    setName,
    email,
    setEmail,
    role,
    setRole,
    isLoading,
    isSubmitting,
    error,
    isCurrentUser,
    canEdit,
    handleSubmit
  } = useUserProfileData(userId, currentUser);

  if (isLoading) {
    return <UserProfileLoading />;
  }

  if (error || !user) {
    return <UserProfileError error={error} />;
  }

  return (
    <div className="space-y-6">
      <UserProfileHeader isCurrentUser={isCurrentUser} userName={user.name} />
      <UserProfileTabs
        user={user}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        role={role}
        setRole={setRole}
        isCurrentUser={isCurrentUser}
        canEdit={canEdit}
        currentUserRole={currentUser.role}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default UserProfile;
