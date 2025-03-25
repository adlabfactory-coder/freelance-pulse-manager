
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CalendlySettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Planification des rendez-vous</CardTitle>
        <CardDescription>
          Configuration de la planification des rendez-vous
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            La planification des rendez-vous est maintenant gérée directement dans l'application.
            Vous pouvez planifier vos rendez-vous quotidiens et hebdomadaires dans l'onglet "Rendez-vous".
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CalendlySettings;
