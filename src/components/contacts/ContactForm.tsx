
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./schema/contactFormSchema";
import { Loader2 } from "lucide-react";
import ContactStatusSelector from "./ContactStatusSelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase-client";
import { User } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { fetchAccountManagers } from "@/services/user/fetch-users";
import { Switch } from "@/components/ui/switch";
import { accountManagerService } from "@/services/account-manager/account-manager-service";

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  isEditing?: boolean;
  submitLabel?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditing = false,
  submitLabel = "Soumettre"
}) => {
  const { user } = useAuth();
  const [accountManagers, setAccountManagers] = useState<User[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [useAutoAssign, setUseAutoAssign] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);

  // Charger la liste des chargés de compte
  useEffect(() => {
    const loadAccountManagers = async () => {
      setIsLoadingManagers(true);
      try {
        const managers = await fetchAccountManagers();
        
        if (managers && managers.length > 0) {
          setAccountManagers(managers);
          
          // Si c'est un nouveau contact et qu'on n'a pas d'assignation, on prend le premier chargé de compte
          if (!isEditing && !form.getValues('assignedTo') && managers.length > 0) {
            form.setValue('assignedTo', managers[0].id);
          }
        } else {
          console.warn("Aucun chargé de compte trouvé");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des chargés de compte:", error);
      } finally {
        setIsLoadingManagers(false);
      }
    };
    
    // Si l'utilisateur crée un nouveau contact, on l'assigne automatiquement comme propriétaire
    if (!isEditing && user) {
      form.setValue('createdBy', user.id);
    }
    
    loadAccountManagers();
  }, [user, isEditing, form]);

  // Gérer l'attribution automatique du chargé de compte
  const handleAutoAssignToggle = async (checked: boolean) => {
    setUseAutoAssign(checked);
    
    if (checked && !isEditing) {
      setIsAutoAssigning(true);
      try {
        const nextManager = await accountManagerService.getNextAccountManager();
        
        if (nextManager) {
          form.setValue('assignedTo', nextManager.id);
        } else {
          // Si aucun manager n'est trouvé, revenir au mode manuel
          setUseAutoAssign(false);
        }
      } catch (error) {
        console.error("Erreur lors de l'attribution automatique:", error);
        setUseAutoAssign(false);
      } finally {
        setIsAutoAssigning(false);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom*</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="Téléphone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise</FormLabel>
                  <FormControl>
                    <Input placeholder="Entreprise" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
                  <FormControl>
                    <Input placeholder="Poste occupé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEditing && (
            <div className="flex items-center space-x-2 py-2">
              <Switch 
                id="auto-assign"
                checked={useAutoAssign}
                onCheckedChange={handleAutoAssignToggle}
                disabled={isAutoAssigning || isEditing}
              />
              <label 
                htmlFor="auto-assign" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Attribution automatique du chargé de compte
              </label>
              {isAutoAssigning && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
            </div>
          )}

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chargé de compte*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={useAutoAssign && !isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un chargé de compte" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountManagers.length > 0 ? (
                      accountManagers.map(manager => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-managers" disabled>
                        Aucun chargé de compte disponible
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <ContactStatusSelector
                    value={field.value}
                    onChange={field.onChange}
                    currentStatus={field.value}
                    onStatusChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Notes additionnelles..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En cours...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
