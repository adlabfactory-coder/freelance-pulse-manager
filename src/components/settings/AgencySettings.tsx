
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAgencySettings from "@/hooks/settings/use-agency-settings";
import { AgencySettings as AgencySettingsType } from "@/services/supabase/agency-settings";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AgencySettings: React.FC = () => {
  const { settings, loading, saving, updateSettings } = useAgencySettings();
  const [formData, setFormData] = useState<AgencySettingsType | null>(null);
  const { isAdminOrSuperAdmin } = useAuth();

  // Une fois que les paramètres sont chargés, initialiser le formulaire
  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSave = async () => {
    if (formData) {
      await updateSettings(formData);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'agence</CardTitle>
          <CardDescription>Chargement des informations...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'agence</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Accès restreint</AlertTitle>
            <AlertDescription>
              Vous n'avez pas les droits nécessaires pour modifier les informations de l'agence.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!formData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'agence</CardTitle>
          <CardDescription>
            Erreur lors du chargement des informations de l'agence
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'agence</CardTitle>
        <CardDescription>
          Ces informations apparaîtront sur les documents générés comme les devis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Raison sociale</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rc">RC (Registre du commerce)</Label>
            <Input
              id="rc"
              name="rc"
              value={formData.rc}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="if_number">IF (Identifiant fiscal)</Label>
            <Input
              id="if_number"
              name="if_number"
              value={formData.if_number}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capital">Capital</Label>
          <Input
            id="capital"
            name="capital"
            value={formData.capital}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rib">RIB bancaire</Label>
            <Input
              id="rib"
              name="rib"
              value={formData.rib}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank_name">Nom de la banque</Label>
            <Input
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgencySettings;
