
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import FreelancerManagementContent from "./freelancer/FreelancerManagement";

const FreelancerManagement: React.FC = () => {
  const { isAdminOrSuperAdmin } = useAuth();
  
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

  return <FreelancerManagementContent isAdminOrSuperAdmin={isAdminOrSuperAdmin} />;
};

export default FreelancerManagement;
