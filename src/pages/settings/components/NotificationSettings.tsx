
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, MessageSquare, Bell } from "lucide-react";
import { getNotificationSettings, updateNotificationSettings } from "@/services/notification-service";
import { NotificationSettings as Settings, NotificationType } from "@/types/notification-settings";
import { useAuth } from "@/hooks/use-auth";

const NotificationSettingsTab: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [error, setError] = useState<string | null>(null);
  
  // Load notification settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getNotificationSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error("Error loading notification settings:", err);
        setError("Impossible de charger les paramètres de notification");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save notification settings
  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setIsSaving(true);
      const success = await updateNotificationSettings(settings);
      
      if (success) {
        toast({
          title: "Paramètres enregistrés",
          description: "Les paramètres de notification ont été mis à jour avec succès.",
        });
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (err) {
      console.error("Error saving notification settings:", err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update email settings
  const handleEmailChange = (key: keyof Settings["email"], value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        [key]: value
      }
    });
  };
  
  // Update SMS settings
  const handleSmsChange = (key: keyof Settings["sms"], value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      sms: {
        ...settings.sms,
        [key]: value
      }
    });
  };
  
  // Update notification rule
  const handleRuleChange = (index: number, key: string, value: any) => {
    if (!settings) return;
    
    const updatedRules = [...settings.rules];
    updatedRules[index] = {
      ...updatedRules[index],
      [key]: value
    };
    
    setSettings({
      ...settings,
      rules: updatedRules
    });
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de notification</CardTitle>
          <CardDescription>Chargement des paramètres...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de notification</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Access control - Only super admins can access
  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de notification</CardTitle>
          <CardDescription>Configuration des notifications par email et SMS</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Accès restreint</AlertTitle>
            <AlertDescription>
              Seuls les super administrateurs peuvent configurer les paramètres de notification.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Main content
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Paramètres de notification
        </CardTitle>
        <CardDescription>
          Configurez les paramètres d'envoi d'emails et de SMS pour les notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {settings && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="rules">Règles de notification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Configuration Email</h3>
                  <p className="text-sm text-muted-foreground">
                    Paramètres pour l'envoi des notifications par email
                  </p>
                </div>
                <Switch
                  checked={settings.email.enabled}
                  onCheckedChange={(value) => handleEmailChange("enabled", value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email d'expédition</Label>
                    <Input
                      id="fromEmail"
                      placeholder="noreply@votredomaine.com"
                      value={settings.email.fromEmail}
                      onChange={(e) => handleEmailChange("fromEmail", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      L'adresse email utilisée pour envoyer les notifications
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fromName">Nom d'expéditeur</Label>
                    <Input
                      id="fromName"
                      placeholder="AdLab Hub"
                      value={settings.email.fromName}
                      onChange={(e) => handleEmailChange("fromName", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Le nom qui apparaîtra comme expéditeur des emails
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signature">Signature des emails</Label>
                  <Textarea
                    id="signature"
                    placeholder="L'équipe AdLab Hub"
                    value={settings.email.signature}
                    onChange={(e) => handleEmailChange("signature", e.target.value)}
                    className="resize-none h-20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">URL du logo</Label>
                  <Input
                    id="logoUrl"
                    placeholder="https://votredomaine.com/logo.png"
                    value={settings.email.logoUrl}
                    onChange={(e) => handleEmailChange("logoUrl", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    URL vers l'image de votre logo à inclure dans les emails
                  </p>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration requise</AlertTitle>
                <AlertDescription>
                  Pour utiliser cette fonctionnalité, vous devez configurer les clés API Resend dans les paramètres du projet.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="sms" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Configuration SMS</h3>
                  <p className="text-sm text-muted-foreground">
                    Paramètres pour l'envoi des notifications par SMS
                  </p>
                </div>
                <Switch
                  checked={settings.sms.enabled}
                  onCheckedChange={(value) => handleSmsChange("enabled", value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fromNumber">Numéro d'expédition</Label>
                  <Input
                    id="fromNumber"
                    placeholder="+33600000000"
                    value={settings.sms.fromNumber}
                    onChange={(e) => handleSmsChange("fromNumber", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Le numéro de téléphone utilisé pour envoyer les SMS (format international)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smsSignature">Signature des SMS</Label>
                  <Input
                    id="smsSignature"
                    placeholder="AdLab Hub"
                    value={settings.sms.signature}
                    onChange={(e) => handleSmsChange("signature", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    La signature ajoutée à la fin des SMS
                  </p>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration requise</AlertTitle>
                <AlertDescription>
                  Pour utiliser cette fonctionnalité, vous devez configurer les clés API Twilio dans les paramètres du projet.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="rules" className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Règles de notification</h3>
                <p className="text-sm text-muted-foreground">
                  Configurez quand et à qui envoyer les notifications
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-6">
                {settings.rules.map((rule, index) => (
                  <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{getNotificationTypeName(rule.type)}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`email-${rule.id}`} className="text-sm">Email</Label>
                          <Switch
                            id={`email-${rule.id}`}
                            checked={rule.emailEnabled}
                            onCheckedChange={(value) => handleRuleChange(index, "emailEnabled", value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`sms-${rule.id}`} className="text-sm">SMS</Label>
                          <Switch
                            id={`sms-${rule.id}`}
                            checked={rule.smsEnabled}
                            onCheckedChange={(value) => handleRuleChange(index, "smsEnabled", value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-sm">Destinataires</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["admin", "superadmin", "account_manager", "freelancer", "client"].map((role) => (
                          <Button
                            key={role}
                            variant={rule.recipients.includes(role) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const newRecipients = rule.recipients.includes(role)
                                ? rule.recipients.filter(r => r !== role)
                                : [...rule.recipients, role];
                              handleRuleChange(index, "recipients", newRecipients);
                            }}
                          >
                            {getRoleName(role)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {rule.emailEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor={`email-template-${rule.id}`}>Template Email</Label>
                        <Textarea
                          id={`email-template-${rule.id}`}
                          value={rule.emailTemplate}
                          onChange={(e) => handleRuleChange(index, "emailTemplate", e.target.value)}
                          className="h-24 font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Utilisez {{variable}} pour les variables dynamiques.
                        </p>
                      </div>
                    )}
                    
                    {rule.smsEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor={`sms-template-${rule.id}`}>Template SMS</Label>
                        <Textarea
                          id={`sms-template-${rule.id}`}
                          value={rule.smsTemplate}
                          onChange={(e) => handleRuleChange(index, "smsTemplate", e.target.value)}
                          className="h-16 font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Gardez le SMS court (160 caractères max). Utilisez {{variable}} pour les variables dynamiques.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper functions
const getNotificationTypeName = (type: NotificationType): string => {
  const names: Record<NotificationType, string> = {
    [NotificationType.APPOINTMENT_CREATED]: "Création de rendez-vous",
    [NotificationType.APPOINTMENT_UPDATED]: "Modification de rendez-vous",
    [NotificationType.APPOINTMENT_REMINDER]: "Rappel de rendez-vous",
    [NotificationType.QUOTE_CREATED]: "Création de devis",
    [NotificationType.QUOTE_ACCEPTED]: "Devis accepté",
    [NotificationType.QUOTE_REJECTED]: "Devis refusé",
    [NotificationType.COMMISSION_PAID]: "Commission payée",
    [NotificationType.SUBSCRIPTION_CREATED]: "Création d'abonnement",
    [NotificationType.SUBSCRIPTION_RENEWED]: "Renouvellement d'abonnement",
    [NotificationType.SUBSCRIPTION_CANCELLED]: "Annulation d'abonnement"
  };
  
  return names[type] || type;
};

const getRoleName = (role: string): string => {
  const names: Record<string, string> = {
    admin: "Admin",
    superadmin: "Super Admin",
    account_manager: "Chargé d'affaires",
    freelancer: "Freelance",
    client: "Client"
  };
  
  return names[role] || role;
};

export default NotificationSettingsTab;
