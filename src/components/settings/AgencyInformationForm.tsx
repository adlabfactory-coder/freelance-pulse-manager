
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/use-supabase";
import { Loader2 } from "lucide-react";

interface AgencyInfo {
  legal_name: string;
  registration_number: string;
  tax_id: string;
  capital: string;
  bank_account: string;
  bank_name: string;
}

const AgencyInformationForm: React.FC = () => {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo>({
    legal_name: "",
    registration_number: "",
    tax_id: "",
    capital: "",
    bank_account: "",
    bank_name: ""
  });

  useEffect(() => {
    fetchAgencyInfo();
  }, []);

  const fetchAgencyInfo = async () => {
    setIsLoading(true);
    try {
      // Try to get the agency information from the "agency_info" table
      const { data, error } = await supabase
        .from("agency_info")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching agency info:", error);
        // If agency info doesn't exist, that's OK
      }

      if (data) {
        setAgencyInfo({
          legal_name: data.legal_name || "",
          registration_number: data.registration_number || "",
          tax_id: data.tax_id || "",
          capital: data.capital || "",
          bank_account: data.bank_account || "",
          bank_name: data.bank_name || ""
        });
      }
    } catch (error) {
      console.error("Error fetching agency info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAgencyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Check if data already exists
      const { data: existingData, error: checkError } = await supabase
        .from("agency_info")
        .select("id")
        .limit(1);

      if (checkError) {
        console.error("Error checking agency info:", checkError);
        toast.error("Erreur lors de la vérification des informations de l'agence");
        return;
      }

      let result;

      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from("agency_info")
          .update(agencyInfo)
          .eq("id", existingData[0].id);
      } else {
        // Insert new record
        result = await supabase
          .from("agency_info")
          .insert([agencyInfo]);
      }

      if (result?.error) {
        console.error("Error saving agency info:", result.error);
        toast.error("Erreur lors de l'enregistrement des informations de l'agence");
      } else {
        toast.success("Informations de l'agence enregistrées avec succès");
      }
    } catch (error) {
      console.error("Error saving agency info:", error);
      toast.error("Erreur lors de l'enregistrement des informations de l'agence");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="legal_name">Raison sociale</Label>
          <Input
            id="legal_name"
            name="legal_name"
            value={agencyInfo.legal_name}
            onChange={handleInputChange}
            placeholder="Ex: AdLab Factory SARL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration_number">RC (Registre du commerce)</Label>
          <Input
            id="registration_number"
            name="registration_number"
            value={agencyInfo.registration_number}
            onChange={handleInputChange}
            placeholder="Ex: 123456"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_id">IF (Identifiant fiscal)</Label>
          <Input
            id="tax_id"
            name="tax_id"
            value={agencyInfo.tax_id}
            onChange={handleInputChange}
            placeholder="Ex: 78901234"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capital">Capital</Label>
          <Input
            id="capital"
            name="capital"
            value={agencyInfo.capital}
            onChange={handleInputChange}
            placeholder="Ex: 100,000 MAD"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank_account">RIB bancaire</Label>
          <Input
            id="bank_account"
            name="bank_account"
            value={agencyInfo.bank_account}
            onChange={handleInputChange}
            placeholder="Ex: 181 810 21116 4444444444 44"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank_name">Nom de la banque</Label>
          <Input
            id="bank_name"
            name="bank_name"
            value={agencyInfo.bank_name}
            onChange={handleInputChange}
            placeholder="Ex: Attijariwafa Bank"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les informations"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AgencyInformationForm;
