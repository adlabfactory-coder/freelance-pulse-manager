
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Search, Trash2, UserPlus } from "lucide-react";
import { UserRole } from "@/types/roles";
import { fetchAccountManagers } from "@/services/user/fetch-users";
import { User } from "@/types";

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

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const loadAccountManagers = async () => {
      try {
        const data = await fetchAccountManagers();
        setAccountManagers(data);
        setFilteredManagers(data);
      } catch (error) {
        console.error("Erreur lors du chargement des chargés de compte:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les chargés de compte"
        });
      } finally {
        setIsLoading(false);
      }
    };

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

  const handleAddAccountManager = async (values: UserFormValues) => {
    try {
      // Simuler l'ajout d'un chargé de compte
      const newManager: User = {
        id: `temp-id-${Date.now()}`,
        name: values.name,
        email: values.email,
        role: UserRole.ACCOUNT_MANAGER,
      };
      
      setAccountManagers(prev => [...prev, newManager]);
      form.reset();
      setIsDialogOpen(false);
      
      toast({
        title: "Chargé de compte ajouté",
        description: `${values.name} a été ajouté avec succès`
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du chargé de compte:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le chargé de compte"
      });
    }
  };

  const handleDeleteAccountManager = async (id: string) => {
    try {
      // Simuler la suppression
      setAccountManagers(prev => prev.filter(manager => manager.id !== id));
      
      toast({
        title: "Chargé de compte supprimé",
        description: "Le chargé de compte a été supprimé avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du chargé de compte:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le chargé de compte"
      });
    }
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouveau chargé de compte
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
                    <Button type="submit">Ajouter</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManagers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell className="font-medium">{manager.name}</TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Actif</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccountManager(manager.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
