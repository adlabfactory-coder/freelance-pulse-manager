
import React from "react";
import { useSettingsData } from "./hooks/useSettingsData";
import SettingsHeader from "./components/SettingsHeader";
import SettingsLoading from "./components/SettingsLoading";
import SettingsError from "./components/SettingsError";
import SettingsContent from "./components/SettingsContent";

const SettingsPage: React.FC = () => {
  const {
    currentUser,
    users,
    selectedUserId,
    isLoading,
    activeTab,
    hasError,
    errorDetails,
    handleUserSelect,
    handleTabChange,
    handleRetry
  } = useSettingsData();

  if (isLoading) {
    return <SettingsLoading />;
  }

  if (hasError || !currentUser) {
    return (
      <SettingsError 
        title={!currentUser ? "Aucun utilisateur trouvé" : errorDetails.title}
        description={errorDetails.description}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SettingsHeader />
      <SettingsContent 
        currentUser={currentUser}
        users={users}
        selectedUserId={selectedUserId || currentUser.id}
        activeTab={activeTab}
        isLoading={isLoading}
        onUserSelect={handleUserSelect}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default SettingsPage;
