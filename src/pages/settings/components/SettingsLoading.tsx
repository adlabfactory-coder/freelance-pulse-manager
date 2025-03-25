
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

const SettingsLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Chargement des paramètres...
        </p>
      </div>
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <p>Chargement des paramètres...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsLoading;
