
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContactFormValues } from "../schema/contactFormSchema";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useContactDuplicateCheck } from "@/hooks/useContactDuplicateCheck";

interface DuplicateCheckFieldsProps {
  form: UseFormReturn<ContactFormValues>;
  contactId?: string;
}

const DuplicateCheckFields: React.FC<DuplicateCheckFieldsProps> = ({ form, contactId }) => {
  const {
    emailChecking,
    phoneChecking,
    emailDuplicateInfo,
    phoneDuplicateInfo
  } = useContactDuplicateCheck(form, contactId);

  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email*</FormLabel>
            <FormControl>
              <div className="relative w-full">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  {...field} 
                  className={emailChecking ? "border-orange-300 bg-orange-50" : 
                            emailDuplicateInfo ? "border-red-300 bg-red-50" : 
                            field.value ? "border-green-300 bg-green-50" : ""}
                />
                {emailChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
                  </div>
                )}
                {emailDuplicateInfo && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" 
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Email déjà utilisé par: {emailDuplicateInfo.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {!emailChecking && !emailDuplicateInfo && field.value && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </FormControl>
            {emailChecking && (
              <FormDescription className="text-xs text-orange-500">Vérification en cours...</FormDescription>
            )}
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
              <div className="relative w-full">
                <Input 
                  placeholder="Téléphone" 
                  {...field} 
                  className={phoneChecking ? "border-orange-300 bg-orange-50" : 
                            phoneDuplicateInfo ? "border-red-300 bg-red-50" : 
                            field.value ? "border-green-300 bg-green-50" : ""}
                />
                {phoneChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
                  </div>
                )}
                {phoneDuplicateInfo && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" 
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Téléphone déjà utilisé par: {phoneDuplicateInfo.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {!phoneChecking && !phoneDuplicateInfo && field.value && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </FormControl>
            {phoneChecking && (
              <FormDescription className="text-xs text-orange-500">Vérification en cours...</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default DuplicateCheckFields;
