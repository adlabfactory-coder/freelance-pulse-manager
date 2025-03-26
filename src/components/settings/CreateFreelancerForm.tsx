
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateFreelancerForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Créer un utilisateur dans Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: UserRole.FREELANCER
          },
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Impossible de créer l'utilisateur");
      }
      
      // Notre déclencheur handle_new_user se chargera automatiquement d'ajouter l'utilisateur
      // dans la table users avec le rôle "freelancer"
      
      toast("Freelance créé avec succès", {
        description: `${data.name} (${data.email}) a été ajouté avec le rôle de commercial`
      });
      
      // Réinitialiser le formulaire
      form.reset();
      
    } catch (error: any) {
      console.error("Erreur lors de la création du freelance:", error);
      
      toast("Erreur", {
        description: error.message || "Une erreur est survenue lors de la création du compte freelance",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un nouveau commercial</CardTitle>
        <CardDescription>
          Créez un compte pour un nouveau commercial freelance
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="commercial@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer le compte"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateFreelancerForm;
