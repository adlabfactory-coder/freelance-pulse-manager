
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
import { supabase } from "@/lib/supabase-client";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateFreelancerFormProps {
  onSuccess?: (newFreelancer: { id: string; name: string; email: string }) => void;
}

const CreateFreelancerForm: React.FC<CreateFreelancerFormProps> = ({ onSuccess }) => {
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
      // Créer l'utilisateur dans la table users avec le mot de passe
      const { data: insertedUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            name: data.name,
            email: data.email,
            role: UserRole.FREELANCER,
            avatar: null,
            password: data.password // Ajouter le mot de passe
          }
        ])
        .select();
      
      if (insertError) throw insertError;
      
      if (insertedUser && insertedUser.length > 0) {
        const newFreelancer = {
          id: insertedUser[0].id,
          name: insertedUser[0].name,
          email: insertedUser[0].email
        };
        
        // Appeler le callback si fourni
        if (onSuccess) {
          onSuccess(newFreelancer);
        } else {
          toast.success("Freelance créé avec succès", {
            description: `${data.name} (${data.email}) a été ajouté avec le rôle de freelance`
          });
          
          // Réinitialiser le formulaire
          form.reset();
        }
      }
    } catch (error: any) {
      console.error("Erreur lors de la création du freelance:", error);
      
      toast.error("Erreur", {
        description: error.message || "Une erreur est survenue lors de la création du compte freelance"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un nouveau freelance</CardTitle>
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
