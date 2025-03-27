
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NotificationType, NotificationSettings as NotificationSettingsType } from '@/types/notification-settings';
import { Loader2 } from 'lucide-react';

// Définition de l'objet de messagerie par défaut pour chaque type de notification
const defaultTemplates: Record<NotificationType, string> = {
  lead_created: "Un nouveau lead {{name}} a été créé.",
  lead_converted: "Le lead {{name}} a été converti en prospect.",
  quote_created: "Un nouveau devis a été créé pour {{client_name}}.",
  quote_accepted: "Le devis #{{quote_id}} a été accepté par {{client_name}}.",
  quote_rejected: "Le devis #{{quote_id}} a été refusé par {{client_name}}.",
  appointment_created: "Un nouveau rendez-vous a été programmé avec {{client_name}} le {{date}} à {{time}}.",
  appointment_updated: "Le rendez-vous avec {{client_name}} a été mis à jour pour le {{date}} à {{time}}.",
  appointment_reminder: "Rappel: Vous avez un rendez-vous avec {{client_name}} demain à {{time}}.",
  appointment_pending_assignment: "Un nouveau rendez-vous est en attente d'attribution.",
  appointment_completed: "Le rendez-vous avec {{client_name}} a été marqué comme terminé.",
  appointment_cancelled: "Le rendez-vous avec {{client_name}} a été annulé.",
  appointment_no_show: "Le client {{client_name}} ne s'est pas présenté au rendez-vous prévu le {{date}} à {{time}}.",
  subscription_renewed: "L'abonnement de {{client_name}} a été renouvelé pour la période {{period}}.",
  subscription_created: "Un nouvel abonnement a été créé pour {{client_name}}.",
  subscription_cancelled: "L'abonnement de {{client_name}} a été annulé.",
  payment_received: "Un paiement de {{amount}} a été reçu de {{client_name}}.",
  commission_paid: "Une commission de {{amount}} a été payée à {{freelancer_name}}.",
  contract_signed: "Un contrat a été signé par {{client_name}}."
};

// Définition de l'objet de messagerie par défaut pour chaque type de notification (SMS version)
const defaultSmsTemplates: Record<NotificationType, string> = {
  lead_created: "Nouveau lead créé: {{name}}",
  lead_converted: "Lead converti: {{name}}",
  quote_created: "Nouveau devis pour {{client_name}}",
  quote_accepted: "Devis #{{quote_id}} accepté par {{client_name}}",
  quote_rejected: "Devis #{{quote_id}} refusé par {{client_name}}",
  appointment_created: "RDV créé: {{client_name}} le {{date}} à {{time}}",
  appointment_updated: "RDV modifié: {{client_name}} le {{date}} à {{time}}",
  appointment_reminder: "Rappel RDV: {{client_name}} demain à {{time}}",
  appointment_pending_assignment: "Nouveau RDV en attente d'attribution",
  appointment_completed: "RDV avec {{client_name}} terminé",
  appointment_cancelled: "RDV avec {{client_name}} annulé",
  appointment_no_show: "Client {{client_name}} absent au RDV du {{date}}",
  subscription_renewed: "Abonnement renouvelé: {{client_name}} pour {{period}}",
  subscription_created: "Nouvel abonnement: {{client_name}}",
  subscription_cancelled: "Abonnement annulé: {{client_name}}",
  payment_received: "Paiement reçu: {{amount}} de {{client_name}}",
  commission_paid: "Commission payée: {{amount}} à {{freelancer_name}}",
  contract_signed: "Contrat signé par {{client_name}}"
};

interface NotificationSettingsProps {
  settings?: NotificationSettingsType;
  onSave: (settings: NotificationSettingsType) => Promise<void>;
  isLoading?: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings,
  onSave,
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState<string>("email");
  const [emailEnabled, setEmailEnabled] = useState<boolean>(settings?.email.enabled || false);
  const [smsEnabled, setSmsEnabled] = useState<boolean>(settings?.sms.enabled || false);
  const [emailSettings, setEmailSettings] = useState({
    fromEmail: settings?.email.fromEmail || "",
    fromName: settings?.email.fromName || "",
    signature: settings?.email.signature || "",
  });
  const [smsSettings, setSmsSettings] = useState({
    fromNumber: settings?.sms.fromNumber || "",
    signature: settings?.sms.signature || ""
  });
  const [rules, setRules] = useState(settings?.rules || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    const updatedSettings: NotificationSettingsType = {
      id: settings?.id || "new-settings",
      email: {
        enabled: emailEnabled,
        ...emailSettings
      },
      sms: {
        enabled: smsEnabled,
        ...smsSettings
      },
      rules: rules
    };
    
    try {
      await onSave(updatedSettings);
    } catch (error) {
      console.error("Error saving notification settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Chargement des paramètres de notification...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Paramètres de notifications</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Enregistrer les paramètres
        </Button>
      </div>
      
      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="rules">Règles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des emails</CardTitle>
              <CardDescription>
                Configurez les paramètres d'envoi des emails de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="email-enabled" 
                  checked={emailEnabled} 
                  onCheckedChange={setEmailEnabled} 
                />
                <Label htmlFor="email-enabled">Activer les notifications par email</Label>
              </div>
              
              {emailEnabled && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-email">Email d'expédition</Label>
                      <input
                        id="from-email"
                        type="email"
                        className="w-full p-2 border rounded-md"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                        placeholder="contact@votreentreprise.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-name">Nom d'expéditeur</Label>
                      <input
                        id="from-name"
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                        placeholder="Votre Entreprise"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-signature">Signature d'email (optionnel)</Label>
                    <Textarea
                      id="email-signature"
                      value={emailSettings.signature}
                      onChange={(e) => setEmailSettings({...emailSettings, signature: e.target.value})}
                      placeholder="L'équipe de Votre Entreprise"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des SMS</CardTitle>
              <CardDescription>
                Configurez les paramètres d'envoi des notifications par SMS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="sms-enabled" 
                  checked={smsEnabled} 
                  onCheckedChange={setSmsEnabled} 
                />
                <Label htmlFor="sms-enabled">Activer les notifications par SMS</Label>
              </div>
              
              {smsEnabled && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-number">Numéro d'expédition</Label>
                    <input
                      id="from-number"
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={smsSettings.fromNumber}
                      onChange={(e) => setSmsSettings({...smsSettings, fromNumber: e.target.value})}
                      placeholder="+33612345678"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sms-signature">Signature SMS (optionnel)</Label>
                    <Textarea
                      id="sms-signature"
                      value={smsSettings.signature}
                      onChange={(e) => setSmsSettings({...smsSettings, signature: e.target.value})}
                      placeholder="Votre Entreprise"
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Règles de notification</CardTitle>
              <CardDescription>
                Configurez quels types de notifications sont envoyés et à qui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cette fonctionnalité sera disponible prochainement. Vous pourrez configurer des règles 
                pour chaque type d'événement, définir les destinataires et personnaliser les modèles de messages.
              </p>
              
              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-medium mb-2">Évènements configurables</h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {Object.keys(defaultTemplates).map(key => (
                    <li key={key} className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-primary/40 mr-2" />
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSettings;
