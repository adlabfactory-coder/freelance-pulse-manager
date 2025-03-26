
import React from "react";
import { useSettingsData } from "./hooks/useSettingsData";
import SettingsHeader from "./components/SettingsHeader";
import SettingsLoading from "./components/SettingsLoading";
import SettingsError from "./components/SettingsError";
import SettingsContent from "./components/SettingsContent";
import { Card, CardContent } from "@/components/ui/card";
import { getMockUsers } from "@/utils/supabase-mock-data";

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

  // Afficher l'erreur si présente et aucun utilisateur n'est chargé
  if (hasError && !currentUser) {
    return (
      <SettingsError 
        title={errorDetails.title}
        description={errorDetails.description}
        onRetry={handleRetry}
      />
    );
  }

  // Si nous avons une erreur mais aussi un utilisateur (en mode démo), continuer avec les données disponibles
  // Si nous n'avons pas d'utilisateur mais pas d'erreur, utiliser un utilisateur de démo
  const displayUser = currentUser || getMockUsers()[0];
  const displayUserId = selectedUserId || displayUser.id;

  // Afficher le contenu principal avec les données disponibles
  return (
    <div className="space-y-6">
      <SettingsHeader />
      
      {hasError && (
        <Card className="mb-6 border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardContent className="pt-6">
            <p className="text-amber-800 dark:text-amber-300">
              Mode hors-ligne activé. Certaines fonctionnalités peuvent être limitées.
            </p>
          </CardContent>
        </Card>
      )}
      
      <SettingsContent 
        onSelectUser={handleUserSelect}
        currentUser={displayUser}
      />
    </div>
  );
};

export default SettingsPage;
