
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

  // Afficher l'état de chargement
  if (isLoading) {
    return <SettingsLoading />;
  }

  // Afficher l'erreur si présente ou si aucun utilisateur n'est chargé
  if (hasError || !currentUser) {
    return (
      <SettingsError 
        title={!currentUser ? "Aucun utilisateur trouvé" : errorDetails.title}
        description={errorDetails.description}
        onRetry={handleRetry}
      />
    );
  }

  // Afficher le contenu principal une fois les données chargées
  return (
    <div className="space-y-6">
      <SettingsHeader />
      <SettingsContent 
        currentUser={currentUser}
        selectedUserId={selectedUserId || currentUser.id}
        activeTab={activeTab}
        isLoading={isLoading}
        onUserSelect={handleUserSelect}
        onTabChange={handleTabChange}
        users={users}
        error={null}
      />
    </div>
  );
};

export default SettingsPage;
