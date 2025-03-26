import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/use-supabase";
import { NotificationSettings as NotificationSettingsType, EmailConfig, SmsConfig, NotificationType, NotificationRule } from "@/types/notification-settings";
import { getNotificationSettings, saveNotificationSettings } from "@/services/notification-service";
import { AlertCircle, Check, Info, Mail, MessageSquare, Save } from "lucide-react";

const DEFAULT_EMAIL_TEMPLATES: Record<NotificationType, string> = {
  [NotificationType.APPOINTMENT_CREATED]: `Nouveau rendez-vous planifié
<h2>Un nouveau rendez-vous a été créé</h2>
<p>{{freelancerName}} a planifié un rendez-vous: {{appointmentTitle}}</p>
<p><strong>Date:</strong> {{appointmentDate}} à {{appointmentTime}}</p>
<p><strong>Description:</strong> {{appointmentDescription}}</p>`,
  
  [NotificationType.APPOINTMENT_UPDATED]: `Modification d'un rendez-vous
<h2>Un rendez-vous a été modifié</h2>
<p>Le rendez-vous "{{appointmentTitle}}" prévu le {{appointmentDate}} à {{appointmentTime}} a été modifié.</p>`,
  
  [NotificationType.APPOINTMENT_REMINDER]: `Rappel de rendez-vous
<h2>Rappel: vous avez un rendez-vous demain</h2>
<p>Nous vous rappelons que vous avez un rendez-vous "{{appointmentTitle}}" prévu demain {{appointmentDate}} à {{appointmentTime}}.</p>`,
  
  [NotificationType.QUOTE_CREATED]: `Nouveau devis créé
<h2>Un nouveau devis a été créé</h2>
<p>Un devis d'un montant de {{quoteAmount}}€ a été créé pour {{clientName}}.</p>`,
  
  [NotificationType.QUOTE_ACCEPTED]: `Devis accepté
<h2>Bonne nouvelle! Un devis a été accepté</h2>
<p>Le devis #{{quoteId}} d'un montant de {{quoteAmount}}€ a été accepté par {{clientName}}.</p>`,
  
  [NotificationType.QUOTE_REJECTED]: `Devis refusé
<h2>Un devis a été refusé</h2>
<p>Le devis #{{quoteId}} d'un montant de {{quoteAmount}}€ a été refusé par {{clientName}}.</p>`,
  
  [NotificationType.COMMISSION_PAID]: `Commission payée
<h2>Une commission a été payée</h2>
<p>Une commission de {{commissionAmount}}€ a été payée à {{freelancerName}} pour la période du {{periodStart}} au {{periodEnd}}.</p>`,
  
  [NotificationType.SUBSCRIPTION_CREATED]: `Nouvel abonnement
<h2>Un nouvel abonnement a été créé</h2>
<p>{{clientName}} a souscrit à l'abonnement {{subscriptionName}} ({{subscriptionAmount}}€/{{subscriptionInterval}}).</p>`,
  
  [NotificationType.SUBSCRIPTION_RENEWED]: `Abonnement renouvelé
<h2>Un abonnement a été renouvelé</h2>
<p>L'abonnement {{subscriptionName}} de {{clientName}} a été renouvelé pour un montant de {{subscriptionAmount}}€.</p>`,
  
  [NotificationType.SUBSCRIPTION_CANCELLED]: `Abonnement annulé
<h2>Un abonnement a été annulé</h2>
<p>L'abonnement {{subscriptionName}} de {{clientName}} a été annulé.</p>`
};

const DEFAULT_SMS_TEMPLATES: Record<NotificationType, string> = {
  [NotificationType.APPOINTMENT_CREATED]: `AdLab Hub: Nouveau RDV créé par {{freelancerName}}: {{appointmentTitle}} le {{appointmentDate}} à {{appointmentTime}}.`,
  [NotificationType.APPOINTMENT_UPDATED]: `AdLab Hub: Le RDV "{{appointmentTitle}}" du {{appointmentDate}} à {{appointmentTime}} a été modifié.`,
  [NotificationType.APPOINTMENT_REMINDER]: `AdLab Hub: Rappel RDV "{{appointmentTitle}}" demain {{appointmentDate}} à {{appointmentTime}}.`,
  [NotificationType.QUOTE_CREATED]: `AdLab Hub: Nouveau devis de {{quoteAmount}}€ créé pour {{clientName}}.`,
  [NotificationType.QUOTE_ACCEPTED]: `AdLab Hub: Le devis #{{quoteId}} ({{quoteAmount}}€) a été accepté par {{clientName}}.`,
  [NotificationType.QUOTE_REJECTED]: `AdLab Hub: Le devis #{{quoteId}} ({{quoteAmount}}€) a été refusé par {{clientName}}.`,
  [NotificationType.COMMISSION_PAID]: `AdLab Hub: Commission de {{commissionAmount}}€ payée pour la période du {{periodStart}} au {{periodEnd}}.`,
  [NotificationType.SUBSCRIPTION_CREATED]: `AdLab Hub: {{clientName}} a souscrit à {{subscriptionName}} ({{subscriptionAmount}}€/{{subscriptionInterval}}).`,
  [NotificationType.SUBSCRIPTION_RENEWED]: `AdLab Hub: L'abonnement {{subscriptionName}} de {{clientName}} a été renouvelé ({{subscriptionAmount}}€).`,
  [NotificationType.SUBSCRIPTION_CANCELLED]: `AdLab Hub: L'abonnement {{subscriptionName}} de {{clientName}} a été annulé.`
};

const RECIPIENT_OPTIONS = [
  { value: "admin", label: "Administrateurs" },
  { value: "superadmin", label: "Super Administrateurs" },
  { value: "account_manager", label: "Chargés d'affaires" },
  { value: "freelancer", label: "Freelances" },
  { value: "client", label: "Clients" }
];

const createDefaultRules = (): NotificationRule[] => {
  return Object.values(NotificationType).map(type => ({
    id: crypto.randomUUID(),
    type,
    emailEnabled: true,
    smsEnabled: false,
    recipients: ["admin", "superadmin", "account_manager"],
    emailTemplate: DEFAULT_EMAIL_TEMPLATES[type],
    smsTemplate: DEFAULT_SMS_TEMPLATES[type]
  }));
};

const createDefaultSettings = (): NotificationSettingsType => {
  return {
    id: crypto.randomUUID(),
    email: {
      enabled: true,
      fromEmail: "notifications@adlabhub.com",
      fromName: "AdLab Hub",
      signature: "L'équipe AdLab Hub",
      logoUrl: ""
    },
    sms: {
      enabled: false,
      fromNumber: "",
      signature: "AdLab Hub"
    },
    rules: createDefaultRules()
  };
};

const formatNotificationType = (type: NotificationType): string => {
  const mapping: Record<NotificationType, string> = {
    [NotificationType.APPOINTMENT_CREATED]: "Création d'un rendez-vous",
    [NotificationType.APPOINTMENT_UPDATED]: "Modification d'un rendez-vous",
    [NotificationType.APPOINTMENT_REMINDER]: "Rappel de rendez-vous",
    [NotificationType.QUOTE_CREATED]: "Création d'un devis",
    [NotificationType.QUOTE_ACCEPTED]: "Acceptation d'un devis",
    [NotificationType.QUOTE_REJECTED]: "Refus d'un devis",
    [NotificationType.COMMISSION_PAID]: "Paiement d'une commission",
    [NotificationType.SUBSCRIPTION_CREATED]: "Création d'un abonnement",
    [NotificationType.SUBSCRIPTION_RENEWED]: "Renouvellement d'un abonnement",
    [NotificationType.SUBSCRIPTION_CANCELLED]: "Annulation d'un abonnement"
  };
  
  return mapping[type] || type;
};

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [testTo, setTestTo] = useState("");
  const [testTemplateType, setTestTemplateType] = useState<NotificationType>(NotificationType.APPOINTMENT_CREATED);
  const [testTemplateTab, setTestTemplateTab] = useState("email");
  const supabase = useSupabase();
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await getNotificationSettings();
        
        if (!data) {
          setSettings(createDefaultSettings());
        } else {
          setSettings(data);
          if (data.rules && data.rules.length > 0) {
            setSelectedRuleId(data.rules[0].id);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres de notification:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les paramètres de notification."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      
      const success = await saveNotificationSettings(settings);
      
      if (success) {
        toast({
          title: "Paramètres sauvegardés",
          description: "Les paramètres de notification ont été sauvegardés avec succès."
        });
      } else {
        throw new Error("Échec de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres de notification:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de notification."
      });
    } finally {
      setSaving(false);
    }
  };
  
  const updateEmailSettings = (update: Partial<EmailConfig>) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      email: {
        ...settings.email,
        ...update
      }
    });
  };
  
  const updateSmsSettings = (update: Partial<SmsConfig>) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      sms: {
        ...settings.sms,
        ...update
      }
    });
  };
  
  const updateRule = (ruleId: string, update: Partial<NotificationRule>) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      rules: settings.rules.map(rule => 
        rule.id === ruleId ? { ...rule, ...update } : rule
      )
    });
  };
  
  const selectedRule = settings?.rules.find(rule => rule.id === selectedRuleId);
  
  const handleRecipientsChange = (ruleId: string, value: string[]) => {
    updateRule(ruleId, { recipients: value });
  };
  
  const sendTestEmail = async () => {
    if (!testTo || !settings || !selectedRule) return;
    
    try {
      const testData = {
        freelancerName: "John Doe",
        appointmentTitle: "Consultation initiale",
        appointmentDate: "01/01/2023",
        appointmentTime: "14:00",
        appointmentDescription: "Première consultation pour discuter du projet",
        quoteId: "Q-12345",
        quoteAmount: "1000",
        clientName: "Acme Inc.",
        commissionAmount: "200",
        periodStart: "01/01/2023",
        periodEnd: "31/01/2023",
        subscriptionName: "Plan Entreprise",
        subscriptionAmount: "99",
        subscriptionInterval: "mois"
      };
      
      const rule = settings.rules.find(r => r.type === testTemplateType);
      
      if (!rule) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Type de notification non trouvé."
        });
        return;
      }
      
      let subject = "Test de notification";
      let content = "";
      
      if (testTemplateTab === "email") {
        const emailLines = rule.emailTemplate.split('\n');
        subject = emailLines[0].trim();
        content = emailLines.slice(1).join('\n');
        
        Object.entries(testData).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          content = content.replace(regex, value);
        });
        
        if (settings.email.signature) {
          content += `<br><br>${settings.email.signature}`;
        }
        
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            to: testTo, 
            subject, 
            html: content,
            from: settings.email.fromEmail,
            fromName: settings.email.fromName
          }),
        });
        
        if (!response.ok) throw new Error('Erreur lors de l\'envoi de l\'email');
        
        toast({
          title: "Email envoyé",
          description: `Un email de test a été envoyé à ${testTo}`
        });
      } else {
        content = rule.smsTemplate;
        
        Object.entries(testData).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          content = content.replace(regex, value);
        });
        
        const response = await fetch('/api/send-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            to: testTo, 
            body: content,
            from: settings.sms.fromNumber || undefined
          }),
        });
        
        if (!response.ok) throw new Error('Erreur lors de l\'envoi du SMS');
        
        toast({
          title: "SMS envoyé",
          description: `Un SMS de test a été envoyé à ${testTo}`
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du message de test:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'envoyer le message de test."
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="mt-4 text-lg">Chargement des paramètres de notification...</div>
        </div>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger les paramètres de notification. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Paramètres de notification</h1>
          <p className="text-muted-foreground">
            Configurez comment et quand les notifications sont envoyées aux utilisateurs.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Sauvegarde...
            </span>
          ) : (
            <span className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </span>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="email" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            Configuration Email
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Configuration SMS
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center">
            <Info className="mr-2 h-4 w-4" />
            Règles de notification
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Tester
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des emails</CardTitle>
              <CardDescription>
                Paramétrez les emails de notification envoyés par l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-enabled"
                  checked={settings.email.enabled}
                  onCheckedChange={(checked) => updateEmailSettings({ enabled: checked })}
                />
                <Label htmlFor="email-enabled">Activer les notifications par email</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Email d'expédition</Label>
                  <Input
                    id="fromEmail"
                    placeholder="notifications@votredomaine.com"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateEmailSettings({ fromEmail: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Adresse email utilisée comme expéditeur des notifications.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fromName">Nom d'expédition</Label>
                  <Input
                    id="fromName"
                    placeholder="AdLab Hub"
                    value={settings.email.fromName}
                    onChange={(e) => updateEmailSettings({ fromName: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Nom affiché comme expéditeur des emails.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signature">Signature des emails</Label>
                <Textarea
                  id="signature"
                  placeholder="L'équipe AdLab Hub"
                  value={settings.email.signature}
                  onChange={(e) => updateEmailSettings({ signature: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Signature ajoutée en bas de tous les emails.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL du logo</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://votredomaine.com/logo.png"
                  value={settings.email.logoUrl}
                  onChange={(e) => updateEmailSettings({ logoUrl: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  URL vers le logo à inclure dans les emails (optionnel).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des SMS</CardTitle>
              <CardDescription>
                Paramétrez les SMS de notification envoyés par l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="sms-enabled"
                  checked={settings.sms.enabled}
                  onCheckedChange={(checked) => updateSmsSettings({ enabled: checked })}
                />
                <Label htmlFor="sms-enabled">Activer les notifications par SMS</Label>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Configuration requise</AlertTitle>
                <AlertDescription>
                  Pour envoyer des SMS, vous devez configurer un compte Twilio et ajouter les variables d'environnement TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN et TWILIO_PHONE_NUMBER dans les réglages de votre projet Supabase.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Label htmlFor="fromNumber">Numéro d'expéditeur</Label>
                <Input
                  id="fromNumber"
                  placeholder="+33600000000"
                  value={settings.sms.fromNumber}
                  onChange={(e) => updateSmsSettings({ fromNumber: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Numéro de téléphone utilisé comme expéditeur des SMS. Doit être au format international.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smsSignature">Signature des SMS</Label>
                <Input
                  id="smsSignature"
                  placeholder="AdLab Hub"
                  value={settings.sms.signature}
                  onChange={(e) => updateSmsSettings({ signature: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  Signature ajoutée à la fin de tous les SMS.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rules">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Types de notification</h3>
              <div className="space-y-2">
                {settings.rules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                      selectedRuleId === rule.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedRuleId(rule.id)}
                  >
                    <span>{formatNotificationType(rule.type)}</span>
                    <div className="flex space-x-2">
                      <Badge variant={rule.emailEnabled ? "default" : "outline"}>
                        Email
                      </Badge>
                      <Badge variant={rule.smsEnabled ? "default" : "outline"}>
                        SMS
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              {selectedRule ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{formatNotificationType(selectedRule.type)}</CardTitle>
                    <CardDescription>
                      Configurez les paramètres de cette notification.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`email-enabled-${selectedRule.id}`}
                          checked={selectedRule.emailEnabled}
                          onCheckedChange={(checked) => updateRule(selectedRule.id, { emailEnabled: checked })}
                        />
                        <Label htmlFor={`email-enabled-${selectedRule.id}`}>Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`sms-enabled-${selectedRule.id}`}
                          checked={selectedRule.smsEnabled}
                          onCheckedChange={(checked) => updateRule(selectedRule.id, { smsEnabled: checked })}
                        />
                        <Label htmlFor={`sms-enabled-${selectedRule.id}`}>SMS</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Destinataires</Label>
                      <div className="flex flex-wrap gap-2">
                        {RECIPIENT_OPTIONS.map(option => (
                          <Badge
                            key={option.value}
                            variant={selectedRule.recipients.includes(option.value) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              const currentRecipients = new Set(selectedRule.recipients);
                              if (currentRecipients.has(option.value)) {
                                currentRecipients.delete(option.value);
                              } else {
                                currentRecipients.add(option.value);
                              }
                              handleRecipientsChange(selectedRule.id, Array.from(currentRecipients));
                            }}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Accordion type="single" collapsible defaultValue="email-template">
                      <AccordionItem value="email-template">
                        <AccordionTrigger>Template d'email</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <Textarea
                              value={selectedRule.emailTemplate}
                              onChange={(e) => updateRule(selectedRule.id, { emailTemplate: e.target.value })}
                              rows={10}
                              className="font-mono"
                            />
                            <p className="text-sm text-muted-foreground">
                              La première ligne est utilisée comme sujet de l'email. Utilisez les variables comme {{variable}} pour personnaliser le contenu.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="sms-template">
                        <AccordionTrigger>Template SMS</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <Textarea
                              value={selectedRule.smsTemplate}
                              onChange={(e) => updateRule(selectedRule.id, { smsTemplate: e.target.value })}
                              rows={4}
                              className="font-mono"
                            />
                            <p className="text-sm text-muted-foreground">
                              Utilisez les variables comme {{variable}} pour personnaliser le contenu.
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Sélectionnez un type de notification pour voir ses paramètres.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Tester les notifications</CardTitle>
              <CardDescription>
                Envoyez un email ou un SMS de test pour vérifier votre configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testTo">Destinataire</Label>
                  <Input
                    id="testTo"
                    placeholder={testTemplateTab === "email" ? "email@exemple.com" : "+33600000000"}
                    value={testTo}
                    onChange={(e) => setTestTo(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="testTemplateType">Type de notification</Label>
                  <Select
                    value={testTemplateType}
                    onValueChange={(value) => setTestTemplateType(value as NotificationType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(NotificationType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {formatNotificationType(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={testTemplateTab === "email" ? "default" : "outline"}
                  onClick={() => setTestTemplateTab("email")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={testTemplateTab === "sms" ? "default" : "outline"}
                  onClick={() => setTestTemplateTab("sms")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  SMS
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Aperçu du template</Label>
                <div className="border rounded p-4 bg-muted/50 whitespace-pre-wrap font-mono text-sm">
                  {testTemplateTab === "email"
                    ? settings.rules.find(r => r.type === testTemplateType)?.emailTemplate || "Template non trouvé"
                    : settings.rules.find(r => r.type === testTemplateType)?.smsTemplate || "Template non trouvé"}
                </div>
              </div>
              
              <Button onClick={sendTestEmail} disabled={!testTo}>
                Envoyer un message de test
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSettings;
