
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AgencyInformationForm from "./AgencyInformationForm";

const AgencyInformationSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <CardTitle>Informations de l'agence</CardTitle>
        </div>
        <CardDescription>
          Ces informations seront utilisées dans les documents officiels comme les devis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-600">
            Ces informations apparaîtront en pied de page des devis générés par l'application.
          </AlertDescription>
        </Alert>
        
        <AgencyInformationForm />
      </CardContent>
    </Card>
  );
};

export default AgencyInformationSettings;
