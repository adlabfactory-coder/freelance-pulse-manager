
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Info, ShieldAlert, Shield, Filter } from "lucide-react";
import { 
  UserRole, 
  USER_ROLE_LABELS, 
  ROLE_HIERARCHY, 
  DEFAULT_PERMISSIONS, 
  RolePermission, 
  PermissionCategory 
} from "@/types/roles";
import { toast } from "@/components/ui/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const RoleManagement: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<RolePermission[]>(DEFAULT_PERMISSIONS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<RolePermission | null>(null);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PermissionCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Obtenir toutes les catégories de permissions
  const allCategories = Object.values(PermissionCategory);

  // Filtrer les permissions par catégorie et terme de recherche
  const filteredPermissions = permissions.filter(permission => {
    const matchesCategory = selectedCategory === "all" || permission.category === selectedCategory;
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Regrouper les permissions par catégorie
  const permissionsByCategory = filteredPermissions.reduce((acc, permission) => {
    const category = permission.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<PermissionCategory, RolePermission[]>);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };
  
  const handleEditPermission = (permission: RolePermission) => {
    setEditingPermission({...permission});
    setDialogOpen(true);
  };
  
  const handleSavePermission = () => {
    if (editingPermission) {
      setPermissions(permissions.map(p => 
        p.id === editingPermission.id ? editingPermission : p
      ));
      setDialogOpen(false);
      setEditingPermission(null);
      
      toast({
        title: "Permission mise à jour",
        description: "La permission a été mise à jour avec succès.",
      });
    }
  };
  
  const handleToggleRole = (permission: RolePermission, role: UserRole) => {
    const updatedPermission = {...permission};
    
    if (updatedPermission.roles.includes(role)) {
      // Ne pas permettre de retirer une permission au Super Admin
      if (role === UserRole.SUPER_ADMIN) {
        toast({
          title: "Action non autorisée",
          description: "Les permissions du Super Admin ne peuvent pas être modifiées pour des raisons de sécurité.",
          variant: "destructive",
        });
        return;
      }
      updatedPermission.roles = updatedPermission.roles.filter(r => r !== role);
    } else {
      updatedPermission.roles = [...updatedPermission.roles, role];
    }
    
    setPermissions(permissions.map(p => 
      p.id === permission.id ? updatedPermission : p
    ));
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as PermissionCategory | "all");
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSaveAllChanges = () => {
    setSaveInProgress(true);
    
    // Simulation d'un appel API pour enregistrer les permissions
    setTimeout(() => {
      toast({
        title: "Configuration enregistrée",
        description: "Les permissions des rôles ont été mises à jour avec succès.",
      });
      setSaveInProgress(false);
    }, 1000);
  };

  const renderPermissionTables = () => {
    if (selectedCategory !== "all") {
      // Afficher une seule catégorie
      const categoryPermissions = permissionsByCategory[selectedCategory as PermissionCategory] || [];
      return renderPermissionTable(selectedCategory as PermissionCategory, categoryPermissions);
    } else {
      // Afficher toutes les catégories
      return Object.entries(permissionsByCategory).map(([category, perms]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          {renderPermissionTable(category as PermissionCategory, perms)}
        </div>
      ));
    }
  };

  const renderPermissionTable = (category: PermissionCategory, permissions: RolePermission[]) => {
    return (
      <Table key={category}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Permission</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            {ROLE_HIERARCHY.map((role) => (
              <TableHead key={role} className="text-center">
                {USER_ROLE_LABELS[role]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">{permission.name}</TableCell>
              <TableCell>{permission.description}</TableCell>
              {ROLE_HIERARCHY.map((role) => (
                <TableCell key={role} className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleToggleRole(permission, role)}
                    disabled={role === UserRole.SUPER_ADMIN} // Super Admin a toujours toutes les permissions
                  >
                    {permission.roles.includes(role) || role === UserRole.SUPER_ADMIN ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                    )}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Gestion des permissions
          </CardTitle>
          <CardDescription>
            Configurez les permissions pour chaque rôle utilisateur
          </CardDescription>
        </div>
        <Button 
          onClick={handleSaveAllChanges}
          disabled={saveInProgress}
        >
          {saveInProgress ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Les modifications apportées à cette configuration s'appliquent à l'ensemble de l'application.
            Les utilisateurs Super Admin conservent toujours tous les droits pour des raisons de sécurité.
          </AlertDescription>
        </Alert>
        
        <div className="flex space-x-2 mb-6 flex-wrap gap-2">
          {ROLE_HIERARCHY.map((role) => (
            <Button 
              key={role}
              variant={selectedRole === role ? "default" : "outline"} 
              onClick={() => handleRoleSelect(role)}
              className={role === UserRole.SUPER_ADMIN ? "border-amber-500 text-amber-700" : ""}
            >
              {role === UserRole.SUPER_ADMIN && <ShieldAlert className="mr-2 h-4 w-4 text-amber-500" />}
              {USER_ROLE_LABELS[role]}
            </Button>
          ))}
        </div>

        <div className="grid gap-4 mb-6 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="category-filter" className="w-24">Catégorie:</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter" className="flex-1">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="search-permissions" className="w-24">Rechercher:</Label>
            <div className="relative flex-1">
              <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-permissions"
                placeholder="Rechercher une permission..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="overflow-auto">
          {filteredPermissions.length > 0 ? (
            renderPermissionTables()
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune permission trouvée pour ces critères
            </div>
          )}
        </div>
      </CardContent>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la permission</DialogTitle>
            <DialogDescription>
              Définissez les rôles qui ont accès à cette permission
            </DialogDescription>
          </DialogHeader>
          
          {editingPermission && (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input 
                    id="name" 
                    value={editingPermission.name} 
                    onChange={(e) => setEditingPermission({...editingPermission, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    value={editingPermission.description} 
                    onChange={(e) => setEditingPermission({...editingPermission, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={editingPermission.category} 
                    onValueChange={(value) => setEditingPermission({
                      ...editingPermission, 
                      category: value as PermissionCategory
                    })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Rôles avec cette permission</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ROLE_HIERARCHY.map((role) => (
                      <Button
                        key={role}
                        type="button"
                        variant={editingPermission.roles.includes(role) || role === UserRole.SUPER_ADMIN ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (role === UserRole.SUPER_ADMIN) return; // Super Admin a toujours toutes les permissions
                          
                          const updatedRoles = editingPermission.roles.includes(role)
                            ? editingPermission.roles.filter(r => r !== role)
                            : [...editingPermission.roles, role];
                          setEditingPermission({...editingPermission, roles: updatedRoles});
                        }}
                        disabled={role === UserRole.SUPER_ADMIN} // Super Admin a toujours toutes les permissions
                        className={role === UserRole.SUPER_ADMIN ? "border-amber-500 text-amber-700" : ""}
                      >
                        {role === UserRole.SUPER_ADMIN && <ShieldAlert className="mr-2 h-3 w-3 text-amber-500" />}
                        {USER_ROLE_LABELS[role]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSavePermission}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RoleManagement;
