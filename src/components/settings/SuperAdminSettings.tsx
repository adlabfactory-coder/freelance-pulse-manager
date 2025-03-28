
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useUserOperations } from "@/hooks/supabase/use-user-operations";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Shield, Settings, User, Mail, LinkIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommissionVerifier from "./CommissionVerifier";
import LoginTester from "./LoginTester";
import { UserRole } from "@/types";

const superAdminFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  avatar: z.string().optional(),
});

type SuperAdminFormData = z.infer<typeof superAdminFormSchema>;

const SuperAdminSettings: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const { updateUserProfile, isLoading } = useUserOperations();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const form = useForm<SuperAdminFormData>({
    resolver: zodResolver(superAdminFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: SuperAdminFormData) => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updatedUser = await updateUserProfile({
        id: user.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: user.role as UserRole,
      });
      
      if (updatedUser) {
        toast.success("Profil Super Admin mis à jour avec succès");
      } else {
        toast.error("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres Super Admin</CardTitle>
          <CardDescription>
            Gérer les paramètres du compte Super Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Accès restreint</AlertTitle>
            <AlertDescription>
              Vous n'avez pas les droits pour accéder à ces paramètres. Seul un Super Admin peut modifier ces informations.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Paramètres Super Admin</CardTitle>
          <CardDescription>
            Gérer les paramètres de votre compte Super Admin et les fonctionnalités système
          </CardDescription>
        </div>
        <div className="bg-primary/10 p-2 rounded-full">
          <Shield className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="tests">Tests Système</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {user?.name ? user.name[0].toUpperCase() : "SA"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <span className="inline-block px-2 py-1 mt-1 text-xs rounded bg-primary/10 text-primary font-medium">
                  Super Admin
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" {...field} />
                        </div>
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
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'avatar</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-9" {...field} placeholder="https://exemple.com/avatar.png" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={saving || isLoading} className="w-full">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Mettre à jour le profil"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="tests">
            <div className="space-y-6">
              <LoginTester />
            </div>
          </TabsContent>

          <TabsContent value="commissions">
            <div className="space-y-6">
              <CommissionVerifier />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SuperAdminSettings;
