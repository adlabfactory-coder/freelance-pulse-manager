
import React from "react";
import { PermissionCategory, RolePermission, UserRole } from "@/types/roles";
import PermissionTable from "./PermissionTable";

interface PermissionTablesContainerProps {
  selectedCategory: PermissionCategory | "all";
  permissionsByCategory: Record<PermissionCategory, RolePermission[]>;
  filteredPermissions: RolePermission[];
  onToggleRole: (permission: RolePermission, role: UserRole) => void;
}

const PermissionTablesContainer: React.FC<PermissionTablesContainerProps> = ({
  selectedCategory,
  permissionsByCategory,
  filteredPermissions,
  onToggleRole
}) => {

  if (filteredPermissions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune permission trouvée pour ces critères
      </div>
    );
  }

  if (selectedCategory !== "all") {
    // Afficher une seule catégorie
    const categoryPermissions = permissionsByCategory[selectedCategory as PermissionCategory] || [];
    return <PermissionTable 
      category={selectedCategory as PermissionCategory} 
      permissions={categoryPermissions}
      onToggleRole={onToggleRole}
    />;
  } 

  // Afficher toutes les catégories
  return (
    <>
      {Object.entries(permissionsByCategory).map(([category, perms]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <PermissionTable 
            category={category as PermissionCategory} 
            permissions={perms}
            onToggleRole={onToggleRole}
          />
        </div>
      ))}
    </>
  );
};

export default PermissionTablesContainer;
