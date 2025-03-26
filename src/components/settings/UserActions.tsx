
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { MoreHorizontal, Edit, Trash2, UserPlus, UserCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { deleteUser } from "@/services/user";
import { updateUser } from "@/services/user/update-user";
import { hasMinimumRole } from "@/types/roles";

interface UserActionsProps {
  user: User;
  currentUserRole: UserRole;
  onUserUpdated: () => void;
  supervisors?: User[];
}

const UserActions: React.FC<UserActionsProps> = ({ 
  user, 
  currentUserRole, 
  onUserUpdated,
  supervisors = []
}) => {
  const { toast } = useToast();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>(user.supervisor_id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canManageUsers = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SUPER_ADMIN;
  
  // Filtrer les superviseurs potentiels en fonction du rôle de l'utilisateur
  const getPotentialSupervisors = () => {
    if (!supervisors || supervisors.length === 0) return [];
    
    // Règles spécifiques en fonction du rôle
    switch (user.role) {
      case UserRole.FREELANCER:
        // Freelancers peuvent être supervisés par: Chargés de comptes, Admins, Super Admins
        return supervisors.filter(s => 
          s.id !== user.id && 
          (s.role === UserRole.ACCOUNT_MANAGER || 
           s.role === UserRole.ADMIN || 
           s.role === UserRole.SUPER_ADMIN)
        );
      
      case UserRole.ACCOUNT_MANAGER:
        // Chargés de comptes peuvent être supervisés par: Admins, Super Admins
        return supervisors.filter(s => 
          s.id !== user.id && 
          (s.role === UserRole.ADMIN || 
           s.role === UserRole.SUPER_ADMIN)
        );
      
      case UserRole.ADMIN:
        // Admins sont supervisés par: Super Admin uniquement
        return supervisors.filter(s => 
          s.id !== user.id && 
          s.role === UserRole.SUPER_ADMIN
        );
      
      case UserRole.SUPER_ADMIN:
        // Super Admin n'a pas de superviseur
        return [];
      
      default:
        return supervisors.filter(s => s.id !== user.id);
    }
  };
  
  const filteredSupervisors = getPotentialSupervisors();
  
  const handleDeleteUser = async () => {
    if (!canManageUsers) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits pour supprimer un utilisateur."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await deleteUser(user.id, currentUserRole);
      if (result.success) {
        toast({
          title: "Utilisateur supprimé",
          description: `L'utilisateur ${user.name} a été supprimé avec succès.`
        });
        setIsDeleteDialogOpen(false);
        onUserUpdated();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error || "Impossible de supprimer l'utilisateur."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAssignSupervisor = async () => {
    if (!canManageUsers && currentUserRole !== UserRole.ACCOUNT_MANAGER) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les droits pour assigner un superviseur."
      });
      return;
    }
    
    // Vérifier si l'utilisateur actuel peut assigner un superviseur à cet utilisateur
    if (user.role === UserRole.ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Seul un Super Admin peut assigner un superviseur à un Admin."
      });
      return;
    }
    
    // Les chargés de compte ne peuvent superviser que les freelancers
    if (currentUserRole === UserRole.ACCOUNT_MANAGER && user.role !== UserRole.FREELANCER) {
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Les chargés de compte ne peuvent superviser que les freelancers."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await updateUser(user.id, {
        supervisor_id: selectedSupervisorId || null
      });
      
      if (success) {
        toast({
          title: "Superviseur assigné",
          description: `Le superviseur a été assigné avec succès à ${user.name}.`
        });
        setIsAssignDialogOpen(false);
        onUserUpdated();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'assigner le superviseur."
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'assignation:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'assignation du superviseur."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const canAssignSupervisor = () => {
    // Super Admin peut assigner des superviseurs à tous les rôles sauf Super Admin
    if (currentUserRole === UserRole.SUPER_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      return true;
    }
    
    // Admin peut assigner des superviseurs aux Chargés de compte et Freelancers
    if (currentUserRole === UserRole.ADMIN && 
        (user.role === UserRole.ACCOUNT_MANAGER || user.role === UserRole.FREELANCER)) {
      return true;
    }
    
    // Chargé de compte peut assigner uniquement pour les Freelancers
    if (currentUserRole === UserRole.ACCOUNT_MANAGER && user.role === UserRole.FREELANCER) {
      return true;
    }
    
    return false;
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.location.href = `/settings/users/edit/${user.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          
          {canAssignSupervisor() && (
            <DropdownMenuItem onClick={() => setIsAssignDialogOpen(true)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Assigner un superviseur
            </DropdownMenuItem>
          )}
          
          {canManageUsers && (
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Dialogue d'assignation de superviseur */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un superviseur</DialogTitle>
            <DialogDescription>
              Sélectionnez un superviseur pour {user.name}.
              {user.role === UserRole.SUPER_ADMIN && (
                <div className="mt-2 text-amber-500">
                  Les Super Admin ne peuvent pas avoir de superviseur.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {user.role !== UserRole.SUPER_ADMIN && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="supervisor">Superviseur</Label>
                <Select 
                  value={selectedSupervisorId} 
                  onValueChange={setSelectedSupervisorId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un superviseur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun superviseur</SelectItem>
                    {filteredSupervisors.map(supervisor => (
                      <SelectItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.name} ({supervisor.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Annuler
            </Button>
            {user.role !== UserRole.SUPER_ADMIN && (
              <Button 
                onClick={handleAssignSupervisor} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Assignation..." : "Assigner"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur {user.name} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserActions;
