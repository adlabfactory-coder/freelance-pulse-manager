
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAgencySettings } from "@/hooks/settings/use-agency-settings";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Le nom de l'agence est requis"),
  rc: z.string().optional(),
  if_number: z.string().optional(),
  capital: z.string().optional(),
  rib: z.string().optional(),
  bank_name: z.string().optional(),
});

type AgencyFormData = z.infer<typeof formSchema>;

const AgencyInformationSettings = () => {
  const { settings, loading, saving, updateSettings } = useAgencySettings();

  const form = useForm<AgencyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rc: "",
      if_number: "",
      capital: "",
      rib: "",
      bank_name: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        name: settings.name || "",
        rc: settings.rc || "",
        if_number: settings.if_number || "",
        capital: settings.capital || "",
        rib: settings.rib || "",
        bank_name: settings.bank_name || "",
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: AgencyFormData) => {
    try {
      // Ensure name is always provided and not optional
      const settingsData = {
        name: data.name, // This makes it non-optional
        rc: data.rc || "",
        if_number: data.if_number || "",
        capital: data.capital || "",
        rib: data.rib || "",
        bank_name: data.bank_name || ""
      };
      
      const success = await updateSettings(settingsData);
      if (success) {
        toast.success("Informations de l'agence mises à jour avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations:", error);
      toast.error("Une erreur est survenue lors de la mise à jour des informations");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'agence</CardTitle>
        <CardDescription>
          Ces informations apparaîtront sur les devis et factures envoyés aux clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'agence</FormLabel>
                    <FormControl>
                      <Input placeholder="AdLab Factory" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro RC</FormLabel>
                    <FormControl>
                      <Input placeholder="RC123456789" {...field} />
                    </FormControl>
                    <FormDescription>Numéro du registre de commerce</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="if_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifiant fiscal</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital</FormLabel>
                    <FormControl>
                      <Input placeholder="100 000 €" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banque</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de la banque" {...field} />
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
                    <FormLabel>RIB</FormLabel>
                    <FormControl>
                      <Input placeholder="FR76 1234 5678 9012 3456 7890 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full md:w-auto">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AgencyInformationSettings;
