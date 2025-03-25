
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarClock, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ScheduleSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarClock className="mr-2 h-5 w-5" />
          Planification des rendez-vous
        </CardTitle>
        <CardDescription>
          Configuration de vos disponibilités pour les rendez-vous
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-primary/10 border-primary/20">
          <InfoIcon className="h-4 w-4 text-primary" />
          <AlertDescription>
            La planification des rendez-vous est maintenant gérée directement dans l'application. 
            Vous pouvez configurer vos disponibilités quotidiennes et hebdomadaires dans la section dédiée.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-base font-medium">Fonctionnalités de planification</h3>
            <p className="text-sm text-muted-foreground">
              Créez votre planning personnalisé, définissez vos heures de disponibilité et gérez vos rendez-vous dans un seul endroit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Planification quotidienne</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Définissez vos heures de disponibilité pour chaque jour de la semaine.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate("/appointments?tab=schedule")}
                className="w-full"
              >
                Configurer
              </Button>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Planning hebdomadaire</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Visualisez et organisez vos rendez-vous sur une vue hebdomadaire.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate("/appointments?tab=schedule&view=week")}
                className="w-full"
              >
                Accéder
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSettings;
