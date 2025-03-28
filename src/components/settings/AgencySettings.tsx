
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgencyInformationSettings from "./AgencyInformationSettings";
import { useAuth } from "@/hooks/use-auth";

const AgencySettings: React.FC = () => {
  const { isAdminOrSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = React.useState("information");

  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de l'agence</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits nécessaires pour accéder à ces paramètres.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de l'agence</CardTitle>
          <CardDescription>
            Gérer les informations et paramètres de l'agence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="information">Informations</TabsTrigger>
              <TabsTrigger value="legal">Mentions légales</TabsTrigger>
            </TabsList>

            <TabsContent value="information">
              <AgencyInformationSettings />
            </TabsContent>

            <TabsContent value="legal">
              <Card>
                <CardHeader>
                  <CardTitle>Mentions légales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cette section sera bientôt disponible pour configurer les mentions légales de l'agence.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencySettings;
