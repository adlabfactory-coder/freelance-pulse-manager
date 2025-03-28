
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const NotificationsSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [quoteUpdates, setQuoteUpdates] = useState(true);
  const [commissionAlerts, setCommissionAlerts] = useState(true);
  const [newsletterSubscription, setNewsletterSubscription] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Paramètres de notifications mis à jour",
        description: "Vos préférences de notifications ont été enregistrées"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notifications</CardTitle>
        <CardDescription>
          Configurez comment et quand vous souhaitez être notifié
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications par email
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-reminders">Rappels de rendez-vous</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des rappels avant vos rendez-vous
              </p>
            </div>
            <Switch 
              id="appointment-reminders" 
              checked={appointmentReminders}
              onCheckedChange={setAppointmentReminders}
              disabled={!emailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quote-updates">Mises à jour des devis</Label>
              <p className="text-sm text-muted-foreground">
                Être notifié des modifications de statut des devis
              </p>
            </div>
            <Switch 
              id="quote-updates" 
              checked={quoteUpdates}
              onCheckedChange={setQuoteUpdates}
              disabled={!emailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="commission-alerts">Alertes de commissions</Label>
              <p className="text-sm text-muted-foreground">
                Être alerté des nouveaux calculs de commissions
              </p>
            </div>
            <Switch 
              id="commission-alerts" 
              checked={commissionAlerts}
              onCheckedChange={setCommissionAlerts}
              disabled={!emailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newsletter">Lettre d'information</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des actualités et mises à jour de l'application
              </p>
            </div>
            <Switch 
              id="newsletter" 
              checked={newsletterSubscription}
              onCheckedChange={setNewsletterSubscription}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer les préférences"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationsSettings;
