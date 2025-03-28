
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationSettings from "@/pages/settings/components/NotificationSettings";
import { NotificationSettings as NotificationSettingsType } from "@/types/notification-settings";
import { toast } from "@/components/ui/use-toast";
import { Bell } from "lucide-react";

const NotificationsSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock settings - in a real implementation, this would be fetched from the backend
  const mockSettings: NotificationSettingsType = {
    id: "settings-1",
    email: {
      enabled: true,
      fromEmail: "notifications@adlabhub.com",
      fromName: "AdLab Hub",
      signature: "L'équipe AdLab Hub",
    },
    sms: {
      enabled: false,
      fromNumber: "+33123456789",
      signature: "AdLab Hub",
    },
    rules: []
  };

  const handleSaveSettings = async (settings: NotificationSettingsType) => {
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Saving notification settings:", settings);
      
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres de notification ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des paramètres."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>Paramètres de notification</CardTitle>
        </div>
        <CardDescription>
          Configurez comment et quand vous souhaitez être notifié
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationSettings
          settings={mockSettings}
          onSave={handleSaveSettings}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default NotificationsSettings;
