
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatabaseStatus from "./DatabaseStatus";
import InitializeDatabase from "./InitializeDatabase";

const DatabaseTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Base de données</h2>
        <p className="text-muted-foreground mt-1">
          Gérez la configuration de la base de données Supabase
        </p>
      </div>
      
      <Tabs defaultValue="status">
        <TabsList>
          <TabsTrigger value="status">Statut</TabsTrigger>
          <TabsTrigger value="initialize">Initialisation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-4 mt-4">
          <DatabaseStatus />
        </TabsContent>
        
        <TabsContent value="initialize" className="space-y-4 mt-4">
          <InitializeDatabase />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseTab;
