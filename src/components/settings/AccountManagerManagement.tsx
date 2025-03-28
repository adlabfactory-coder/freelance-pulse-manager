
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import UsersByRole from "./roles/UsersByRole";
import { UserRole } from "@/types/roles";
import { User } from "@/types";

const AccountManagerManagement: React.FC = () => {
  const [accountManagers, setAccountManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdminOrSuperAdmin } = useAuth();
  
  useEffect(() => {
    loadAccountManagers();
  }, []);
  
  const loadAccountManagers = async () => {
    setLoading(true);
    try {
      // Simulation de chargement des données
      // Dans une application réelle, remplacer par un appel API
      setTimeout(() => {
        const demoAccountManagers: User[] = [
          {
            id: "acc-1",
            name: "Compte Manager 1",
            email: "manager1@adlabhub.com",
            role: UserRole.ACCOUNT_MANAGER
          },
          {
            id: "acc-2",
            name: "Compte Manager 2",
            email: "manager2@adlabhub.com",
            role: UserRole.ACCOUNT_MANAGER
          }
        ];
        
        setAccountManagers(demoAccountManagers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors du chargement des chargés d'affaires:", error);
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger la liste des chargés d'affaires."
      });
      setLoading(false);
    }
  };
  
  // Vérification des permissions administrateur
  if (!isAdminOrSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des chargés d'affaires</CardTitle>
          <CardDescription>
            Vous n'avez pas les droits nécessaires pour accéder à cette section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des chargés d'affaires</CardTitle>
        <CardDescription>
          Gérez les comptes et les permissions des chargés d'affaires
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersByRole forceUsers={accountManagers} />
      </CardContent>
    </Card>
  );
};

export default AccountManagerManagement;
