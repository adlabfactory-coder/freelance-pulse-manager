
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { User } from "@/types";
import { fetchAccountManagers } from "@/services/user/fetch-users";
import { accountManagerService } from "@/services/account-manager/account-manager-service";
import { ContactFormValues } from "../schema/contactFormSchema";

interface AccountManagerSelectorProps {
  form: UseFormReturn<ContactFormValues>;
  isEditing: boolean;
  onAutoAssignChange: (checked: boolean) => void;
  useAutoAssign: boolean;
}

const AccountManagerSelector: React.FC<AccountManagerSelectorProps> = ({ 
  form, 
  isEditing, 
  onAutoAssignChange,
  useAutoAssign
}) => {
  const [accountManagers, setAccountManagers] = useState<User[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
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
          toast.warning("Aucun chargé de compte disponible pour l'assignation");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des chargés de compte:", error);
        toast.error("Impossible de charger la liste des chargés de compte");
      } finally {
        setIsLoadingManagers(false);
      }
    };
        
    loadAccountManagers();
  }, [isEditing, form]);

  // Gérer l'attribution automatique du chargé de compte
  const handleAutoAssignToggle = async (checked: boolean) => {
    onAutoAssignChange(checked);
    
    if (checked && !isEditing) {
      setIsAutoAssigning(true);
      try {
        // Obtenir le prochain gestionnaire disponible
        const nextManager = await accountManagerService.getNextAvailableAccountManager();
        
        if (nextManager) {
          console.log("Attribution automatique au chargé de compte:", nextManager.name);
          form.setValue('assignedTo', nextManager.id);
          toast.success(`Attribution automatique à ${nextManager.name}`);
        } else {
          // Si aucun manager n'est trouvé, revenir au mode manuel
          onAutoAssignChange(false);
          toast.warning("Aucun chargé de compte disponible pour l'attribution automatique");
        }
      } catch (error) {
        console.error("Erreur lors de l'attribution automatique:", error);
        toast.error("Erreur lors de l'attribution automatique du chargé de compte");
        onAutoAssignChange(false);
      } finally {
        setIsAutoAssigning(false);
      }
    }
  };

  return (
    <>
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
    </>
  );
};

export default AccountManagerSelector;
