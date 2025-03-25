import React, { useState } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { User, UserRole } from "@/types";

interface CalendlySettingsProps {
  user: User;
  isCurrentUser: boolean;
  canEdit: boolean;
}

const CalendlySettings: React.FC<CalendlySettingsProps> = ({ user, isCurrentUser, canEdit }) => {
  const supabase = useSupabase();
  const [calendlyUrl, setCalendlyUrl] = useState(user.calendly_url || "");
  const [syncEmail, setSyncEmail] = useState(user.calendly_sync_email || "");
  const [enabled, setEnabled] = useState(user.calendly_enabled || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!canEdit) return;
    
    setIsSubmitting(true);
    try {
      const success = await supabase.updateUser(user.id, {
        calendly_url: calendlyUrl,
        calendly_sync_email: syncEmail,
        calendly_enabled: enabled
      });

      if (success) {
        toast({
          title: "Paramètres Calendly mis à jour",
          description: "Les paramètres d'intégration Calendly ont été enregistrés avec succès.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres Calendly:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intégration Calendly</CardTitle>
        <CardDescription>
          Configurez votre intégration avec Calendly pour la gestion de vos rendez-vous
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="calendly-enabled" 
            checked={enabled} 
            onCheckedChange={setEnabled}
            disabled={!canEdit}
          />
          <Label htmlFor="calendly-enabled">Activer l'intégration Calendly</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calendly-url">URL Calendly</Label>
          <Input 
            id="calendly-url" 
            placeholder="https://calendly.com/votre-utilisateur" 
            value={calendlyUrl}
            onChange={(e) => setCalendlyUrl(e.target.value)}
            disabled={!canEdit}
          />
          <p className="text-sm text-muted-foreground">
            L'URL de votre page Calendly personnelle
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sync-email">Email de synchronisation</Label>
          <Input 
            id="sync-email" 
            type="email" 
            placeholder="email@example.com" 
            value={syncEmail}
            onChange={(e) => setSyncEmail(e.target.value)}
            disabled={!canEdit}
          />
          <p className="text-sm text-muted-foreground">
            L'adresse email utilisée pour synchroniser vos événements Calendly
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {canEdit && (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CalendlySettings;
