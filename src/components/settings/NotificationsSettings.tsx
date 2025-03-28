
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const NotificationsSettings: React.FC = () => {
  const handleSave = () => {
    toast({
      title: "Préférences enregistrées",
      description: "Vos préférences de notification ont été mises à jour avec succès."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Gérez vos préférences de notifications et alertes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifs">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevez des notifications par email pour les activités importantes
              </p>
            </div>
            <Switch id="email-notifs" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app-notifs">Notifications dans l'application</Label>
              <p className="text-sm text-muted-foreground">
                Affichez des notifications dans l'interface de l'application
              </p>
            </div>
            <Switch id="app-notifs" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-remind">Rappels de rendez-vous</Label>
              <p className="text-sm text-muted-foreground">
                Recevez des rappels avant vos rendez-vous programmés
              </p>
            </div>
            <Switch id="appointment-remind" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quote-updates">Mises à jour des devis</Label>
              <p className="text-sm text-muted-foreground">
                Notifications pour les changements de statut des devis
              </p>
            </div>
            <Switch id="quote-updates" defaultChecked />
          </div>
        </div>

        <Button onClick={handleSave}>Enregistrer les préférences</Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettings;
