
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, RefreshCw, Search, Trash2, UserPlus } from "lucide-react";
import { UserRole } from "@/types/roles";
import { fetchAccountManagers } from "@/services/user/fetch-users";
import { User } from "@/types";
import { supabase } from "@/lib/supabase-client";

const userFormSchema = z.object({
  name: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  email: z.string().email("Email invalide"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const AccountManagerManagement: React.FC = () => {
  const [accountManagers, setAccountManagers] = useState<User[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    loadAccountManagers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = accountManagers.filter(manager => 
        manager.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        manager.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredManagers(filtered);
    } else {
      setFilteredManagers(accountManagers);
    }
  }, [searchTerm, accountManagers]);

  const loadAccountManagers = async () => {
    try {
      setIsLoading(true);
      
      // Récupérer les chargés de compte depuis Supabase
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, created_at")
        .eq("role", "account_manager");
        
      if (error) throw error;
      
      // Convert the data to the User type with the required role property
      const managersWithRole = (data || []).map(user => ({
        ...user,
        role: UserRole.ACCOUNT_MANAGER,
        // Add explicitly all required fields from the User type
        id: user.id,
        name: user.name,
        email: user.email,
        // Using createdAt for the component to render properly
        createdAt: user.created_at
      })) as User[];
      
      setAccountManagers(managersWithRole);
      setFilteredManagers(managersWithRole);
    } catch (error) {
      console.error("Erreur lors du chargement des chargés de compte:", error);
      toast.error("Impossible de charger les chargés de compte");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAccountManager = async (values: UserFormValues) => {
    try {
      setIsLoading(true);
      
      // Créer le nouvel utilisateur dans Supabase
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: values.name,
            email: values.email,
            role: UserRole.ACCOUNT_MANAGER
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newManager = {
          ...data[0],
          role: UserRole.ACCOUNT_MANAGER
        } as User;
        
        setAccountManagers(prev => [...prev, newManager]);
        form.reset();
        setIsDialogOpen(false);
        
        toast.success(`${values.name} a été ajouté avec succès comme chargé de compte`);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du chargé de compte:", error);
      toast.error("Impossible d'ajouter le chargé de compte: " + (error.message || 'Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccountManager = async (id: string) => {
    try {
      setIsDeleting(true);
      
      // Supprimer l'utilisateur de Supabase
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setAccountManagers(prev => prev.filter(manager => manager.id !== id));
      toast.success("Le chargé de compte a été supprimé avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la suppression du chargé de compte:", error);
      toast.error("Impossible de supprimer le chargé de compte: " + (error.message || 'Erreur inconnue'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    await loadAccountManagers();
    toast.success("Liste des chargés de compte actualisée");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Gestion des chargés de compte</CardTitle>
            <CardDescription>
              Ajoutez, modifiez ou supprimez les chargés de compte
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un chargé de compte
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un chargé de compte</DialogTitle>
                  <DialogDescription>
                    Créez un nouveau compte pour un chargé de compte dans l'application
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddAccountManager)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom complet" {...field} />
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
                            <Input type="email" placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Ajout en cours...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un chargé de compte..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredManagers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun chargé de compte trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="font-medium">{manager.name}</TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>
                      {manager.createdAt
                        ? new Date(manager.createdAt).toLocaleDateString('fr-FR')
                        : "Non disponible"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccountManager(manager.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AccountManagerManagement;
