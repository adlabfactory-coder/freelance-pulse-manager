
import React, { useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";

const AdminPage: React.FC = () => {
  const { toast } = useToast();
  const supabase = useSupabase();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await supabase.fetchUsers();
      if (fetchedUsers && fetchedUsers.length > 0) {
        setUsers(fetchedUsers);
      } else {
        const mockUsers = supabase.getMockUsers().map(user => ({
          ...user,
          role: user.role as UserRole
        }));
        setUsers(mockUsers);
        toast({
          title: "Mode démo activé",
          description: "Utilisation des données utilisateurs de démonstration",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      const mockUsers = supabase.getMockUsers();
      setUsers(mockUsers);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger les utilisateurs depuis Supabase. Mode démo activé.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser({
      name: "",
      email: "",
      role: UserRole.FREELANCER,
      avatar: null
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser({ ...user });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role: value }));
  };

  const handleSaveUser = async () => {
    if (!currentUser.name || !currentUser.email || !currentUser.role) {
      toast({
        variant: "destructive",
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    try {
      if (isEditing && currentUser.id) {
        await supabase.updateUser(currentUser as User);
        setUsers(users.map(user => 
          user.id === currentUser.id ? { ...user, ...currentUser } as User : user
        ));
        toast({
          title: "Utilisateur mis à jour",
          description: "L'utilisateur a été mis à jour avec succès",
        });
      } else {
        const result = await supabase.createUser(currentUser as Omit<User, "id">);
        if (result && 'data' in result) {
          const newUser = result.data as User;
          setUsers([...users, newUser]);
          toast({
            title: "Utilisateur créé",
            description: "Le nouvel utilisateur a été créé avec succès",
          });
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de l'utilisateur",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentUser.id) return;

    try {
      await supabase.deleteUser(currentUser.id);
      setUsers(users.filter(user => user.id !== currentUser.id));
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administration des Utilisateurs</h1>
        <Button onClick={handleAddUser}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatRole(user.role)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={currentUser.name || ""}
                onChange={handleInputChange}
                placeholder="Nom complet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={currentUser.email || ""}
                onChange={handleInputChange}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={currentUser.role?.toString() || UserRole.FREELANCER}
                onValueChange={(value: string) => handleRoleChange(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>{formatRole(UserRole.ADMIN)}</SelectItem>
                  <SelectItem value={UserRole.SUPER_ADMIN}>{formatRole(UserRole.SUPER_ADMIN)}</SelectItem>
                  <SelectItem value={UserRole.FREELANCER}>{formatRole(UserRole.FREELANCER)}</SelectItem>
                  <SelectItem value={UserRole.ACCOUNT_MANAGER}>{formatRole(UserRole.ACCOUNT_MANAGER)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveUser}>
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{currentUser.name}</strong> ?
              Cette action est irréversible.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const formatRole = (role: UserRole | string): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrateur";
    case UserRole.SUPER_ADMIN:
      return "Super Administrateur";
    case UserRole.FREELANCER:
      return "Freelance";
    case UserRole.ACCOUNT_MANAGER:
      return "Chargé de compte";
    default:
      return role.toString();
  }
};

export default AdminPage;
