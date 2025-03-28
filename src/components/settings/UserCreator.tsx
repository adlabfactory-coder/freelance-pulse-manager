
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { UserRole } from "@/types/roles";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.string().min(1, "Veuillez sélectionner un rôle")
});

const UserCreator: React.FC = () => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("freelancer");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.FREELANCER
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Utilisez le service d'inscription pour créer un utilisateur
      const result = await signUp(
        values.email,
        values.password,
        values.name,
        values.role as UserRole
      );
      
      if (result.success) {
        toast.success(`Utilisateur ${values.name} créé avec succès`);
        form.reset();
      } else {
        toast.error(`Erreur lors de la création: ${result.error || "Erreur inconnue"}`);
      }
    } catch (error: any) {
      toast.error(`Erreur: ${error.message || "Une erreur est survenue"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Mise à jour du rôle en fonction de l'onglet
    switch (value) {
      case "freelancer":
        form.setValue("role", UserRole.FREELANCER);
        break;
      case "account_manager":
        form.setValue("role", UserRole.ACCOUNT_MANAGER);
        break;
      case "admin":
        form.setValue("role", UserRole.ADMIN);
        break;
      default:
        form.setValue("role", UserRole.FREELANCER);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouvel utilisateur</CardTitle>
        <CardDescription>
          Ajoutez des freelances, chargés de compte ou administrateurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="freelancer">Freelance</TabsTrigger>
            <TabsTrigger value="account_manager">Chargé de compte</TabsTrigger>
            <TabsTrigger value="admin">Administrateur</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
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
                      <Input placeholder="jean.dupont@example.com" {...field} />
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
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Création en cours..." : "Créer l'utilisateur"}
              </Button>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserCreator;
