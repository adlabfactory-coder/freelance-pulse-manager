
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Shield, Plus } from "lucide-react";
import { 
  UserRole, 
  DEFAULT_PERMISSIONS, 
  RolePermission, 
  PermissionCategory 
} from "@/types/roles";
import { toast } from "@/components/ui/use-toast";
import RoleSelector from "./RoleSelector";
import PermissionFilter from "./PermissionFilter";
import PermissionTablesContainer from "./PermissionTablesContainer";
import PermissionEditDialog from "./PermissionEditDialog";
import { useAuth } from "@/hooks/use-auth";

const RoleManagement: React.FC = () => {
  const { isAdminOrSuperAdmin, isSuperAdmin } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<RolePermission[]>(DEFAULT_PERMISSIONS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<RolePermission | null>(null);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PermissionCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Obtenir toutes les catégories de permissions
  const allCategories = Object.values(PermissionCategory);
  
  // Vérification des permissions administrateur
  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des permissions</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits nécessaires pour accéder à cette section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
  
  const handleCreatePermission = () => {
    const newPermission: RolePermission = {
      id: crypto.randomUUID(),
      name: "Nouvelle permission",
      description: "Description de la nouvelle permission",
      category: PermissionCategory.SYSTEM,
      roles: [UserRole.SUPER_ADMIN]
    };
    
    setEditingPermission(newPermission);
    setDialogOpen(true);
  };
  
  const handleSavePermission = () => {
    if (editingPermission) {
      // Si c'est une nouvelle permission, l'ajouter
      const exists = permissions.some(p => p.id === editingPermission.id);
      
      if (exists) {
        setPermissions(permissions.map(p => 
          p.id === editingPermission.id ? editingPermission : p
        ));
      } else {
        setPermissions([...permissions, editingPermission]);
      }
      
      setDialogOpen(false);
      setEditingPermission(null);
      
      toast({
        title: exists ? "Permission mise à jour" : "Permission créée",
        description: exists 
          ? "La permission a été mise à jour avec succès."
          : "La nouvelle permission a été créée avec succès.",
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
        <div className="flex space-x-2">
          <Button 
            onClick={handleCreatePermission} 
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle permission
          </Button>
          <Button 
            onClick={handleSaveAllChanges}
            disabled={saveInProgress}
          >
            {saveInProgress ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
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
        
        <RoleSelector 
          selectedRole={selectedRole} 
          onRoleSelect={handleRoleSelect} 
        />

        <PermissionFilter 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          allCategories={allCategories}
        />

        <div className="overflow-auto">
          {permissions.length === 0 ? (
            <div className="text-center py-10 bg-muted/20 rounded-md">
              <p className="text-muted-foreground">
                Aucune permission configurée. Utilisez le bouton "Nouvelle permission" pour en créer.
              </p>
            </div>
          ) : (
            <PermissionTablesContainer 
              selectedCategory={selectedCategory}
              permissionsByCategory={permissionsByCategory}
              filteredPermissions={filteredPermissions}
              onToggleRole={handleToggleRole}
              onEditPermission={handleEditPermission}
            />
          )}
        </div>
      </CardContent>
      
      <PermissionEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingPermission={editingPermission}
        setEditingPermission={setEditingPermission}
        onSave={handleSavePermission}
        allCategories={allCategories}
      />
    </Card>
  );
};

export default RoleManagement;
