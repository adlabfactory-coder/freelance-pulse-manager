
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import { User, UserRole } from "@/types";
import { toast } from "sonner";
import { Edit, PlusCircle, Loader2, Trash2 } from "lucide-react";
import CreateFreelancerForm from "./CreateFreelancerForm";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Freelancer {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

const FreelancerManagement: React.FC = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [freelancerToDelete, setFreelancerToDelete] = useState<string | null>(null);
  const [deletingFreelancer, setDeletingFreelancer] = useState(false);
  const { isAdminOrSuperAdmin } = useAuth();

  useEffect(() => {
    if (isAdminOrSuperAdmin) {
      fetchFreelancers();
    }
  }, [isAdminOrSuperAdmin]);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("role", UserRole.FREELANCER);

      if (error) throw error;

      setFreelancers(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des freelances:", error);
      toast.error("Impossible de récupérer la liste des freelances");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFreelancer = async () => {
    if (!freelancerToDelete) return;

    try {
      setDeletingFreelancer(true);
      
      // D'abord supprimer l'authentification pour l'utilisateur
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("id", freelancerToDelete)
        .single();

      if (userError) throw userError;

      // Supprimer l'utilisateur de la table users
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", freelancerToDelete);

      if (deleteError) throw deleteError;

      // Mettre à jour l'interface
      setFreelancers(prevFreelancers => 
        prevFreelancers.filter(freelancer => freelancer.id !== freelancerToDelete)
      );
      
      toast.success("Le freelance a été supprimé avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la suppression du freelance:", error);
      toast.error("Impossible de supprimer le freelance");
    } finally {
      setDeletingFreelancer(false);
      setFreelancerToDelete(null);
    }
  };

  const handleCreateSuccess = (newFreelancer: Freelancer) => {
    setFreelancers(prev => [...prev, newFreelancer]);
    setShowCreateForm(false);
    toast.success(`Le freelance ${newFreelancer.name} a été ajouté avec succès`);
  };

  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des freelances</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits pour accéder à cette section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des freelances</CardTitle>
            <CardDescription>
              Liste des freelances ayant accès à la plateforme
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {showCreateForm ? "Annuler" : "Ajouter un freelance"}
          </Button>
        </CardHeader>
        
        <CardContent>
          {showCreateForm && (
            <div className="mb-6">
              <CreateFreelancerForm onSuccess={handleCreateSuccess} />
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableCaption>Liste des freelances</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freelancers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Aucun freelance trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  freelancers.map((freelancer) => (
                    <TableRow key={freelancer.id}>
                      <TableCell className="font-medium">{freelancer.name}</TableCell>
                      <TableCell>{freelancer.email}</TableCell>
                      <TableCell>
                        {freelancer.createdAt 
                          ? new Date(freelancer.createdAt).toLocaleDateString() 
                          : "Non disponible"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setFreelancerToDelete(freelancer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={!!freelancerToDelete} onOpenChange={(open) => !open && setFreelancerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce freelance ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingFreelancer}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteFreelancer}
              disabled={deletingFreelancer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingFreelancer ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FreelancerManagement;
