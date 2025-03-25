
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Loader2 } from "lucide-react";
import CreateFreelancerForm from "./CreateFreelancerForm";
import { useAuth } from "@/hooks/use-auth";

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
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchFreelancers();
  }, []);

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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer la liste des commerciaux",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des commerciaux</CardTitle>
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
            <CardTitle>Gestion des commerciaux</CardTitle>
            <CardDescription>
              Liste des commerciaux ayant accès à la plateforme
            </CardDescription>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {showCreateForm ? "Annuler" : "Ajouter un commercial"}
          </Button>
        </CardHeader>
        
        <CardContent>
          {showCreateForm && (
            <div className="mb-6">
              <CreateFreelancerForm />
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableCaption>Liste des commerciaux</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date de création</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freelancers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Aucun commercial trouvé
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelancerManagement;
