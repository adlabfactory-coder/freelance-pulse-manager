
import React from "react";

interface UserProfileErrorProps {
  error: string | null;
}

const UserProfileError: React.FC<UserProfileErrorProps> = ({ error }) => {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="text-destructive text-lg font-medium">
        {error || "Utilisateur non trouvé"}
      </div>
      <p className="text-muted-foreground">
        Veuillez rafraîchir la page ou sélectionner un autre utilisateur.
      </p>
    </div>
  );
};

export default UserProfileError;
