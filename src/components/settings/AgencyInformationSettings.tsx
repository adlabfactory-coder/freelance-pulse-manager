
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Building, FileSymlink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/hooks/use-auth";

const agencyFormSchema = z.object({
  name: z.string().min(2, "La raison sociale doit contenir au moins 2 caractères"),
  rc: z.string().min(2, "Le RC doit contenir au moins 2 caractères"),
  if_number: z.string().min(2, "L'identifiant fiscal doit contenir au moins 2 caractères"),
  capital: z.string().min(1, "Le capital doit être spécifié"),
  rib: z.string().min(10, "Le RIB doit contenir au moins 10 caractères"),
  bank_name: z.string().min(2, "Le nom de la banque doit contenir au moins 2 caractères"),
});

type AgencyFormData = z.infer<typeof agencyFormSchema>;

interface AgencyData extends AgencyFormData {
  id?: string;
}

const AgencyInformationSettings: React.FC = () => {
  const { isAdminOrSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const form = useForm<AgencyFormData>({
    resolver: zodResolver(agencyFormSchema),
    defaultValues: {
      name: "AdLab Factory",
      rc: "",
      if_number: "",
      capital: "",
      rib: "",
      bank_name: "",
    },
  });

  useEffect(() => {
    async function fetchAgencySettings() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("agency_settings")
          .select("*")
          .single();
        
        if (error) {
          console.error("Erreur lors de la récupération des paramètres de l'agence:", error);
        } else if (data) {
          // Populate form with existing data
          form.reset({
            name: data.name || "AdLab Factory",
            rc: data.rc || "",
            if_number: data.if_number || "",
            capital: data.capital || "",
            rib: data.rib || "",
            bank_name: data.bank_name || "",
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des paramètres:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgencySettings();
  }, [form]);

  const onSubmit = async (data: AgencyFormData) => {
    if (!isAdminOrSuperAdmin) {
      toast.error("Vous n'avez pas les droits pour effectuer cette action");
      return;
    }

    setSaving(true);
    try {
      // Check if a record already exists
      const { data: existingData, error: fetchError } = await supabase
        .from("agency_settings")
        .select("id")
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which just means we need to create a new record
        console.error("Erreur lors de la vérification des paramètres:", fetchError);
        toast.error("Erreur lors de la mise à jour des paramètres");
        return;
      }

      let updateResult;
      if (existingData?.id) {
        // Update existing record
        updateResult = await supabase
          .from("agency_settings")
          .update({
            name: data.name,
            rc: data.rc,
            if_number: data.if_number,
            capital: data.capital,
            rib: data.rib,
            bank_name: data.bank_name,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData.id);
      } else {
        // Insert new record
        updateResult = await supabase
          .from("agency_settings")
          .insert({
            name: data.name,
            rc: data.rc,
            if_number: data.if_number,
            capital: data.capital,
            rib: data.rib,
            bank_name: data.bank_name,
          });
      }

      if (updateResult.error) {
        console.error("Erreur lors de la mise à jour des paramètres:", updateResult.error);
        toast.error("Erreur lors de la mise à jour des paramètres");
      } else {
        toast.success("Paramètres de l'agence mis à jour avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      toast.error("Erreur lors de la mise à jour des paramètres");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de l'agence</CardTitle>
          <CardDescription>
            Gérer les informations de l'agence qui apparaîtront sur les documents générés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            Vous n'avez pas les droits pour accéder à ces paramètres.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Paramètres de l'agence</CardTitle>
            <CardDescription>
              Gérer les informations de l'agence qui apparaîtront sur les documents générés
            </CardDescription>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Building className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raison sociale</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="AdLab Factory" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RC (Registre du commerce)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123456" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="if_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IF (Identifiant fiscal)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12345678" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="capital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="100 000 MAD" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la banque</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Banque Populaire" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rib"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RIB bancaire</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123456789012345678901234" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <CardFooter className="flex justify-between px-0 pt-4">
                <Button
                  type="submit"
                  disabled={saving || !form.formState.isDirty}
                  className="ml-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default AgencyInformationSettings;
