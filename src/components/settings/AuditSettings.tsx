
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollText } from "lucide-react";
import AuditPage from "@/pages/AuditPage";

const AuditSettings: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  
  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Accès restreint</CardTitle>
          <CardDescription>
            Seuls les super administrateurs peuvent accéder à l'audit du système.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={() => navigate("/settings/profile")}
          >
            Retour aux paramètres du profil
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            <CardTitle>Journal d'audit du système</CardTitle>
          </div>
          <CardDescription>
            Consultez toutes les activités et les modifications importantes dans le système
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="-mx-6">
        <AuditPage />
      </div>
    </div>
  );
};

export default AuditSettings;
