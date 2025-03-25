
import React, { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/use-supabase";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const DatabaseStatus: React.FC = () => {
  const supabase = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [tablesStatus, setTablesStatus] = useState<{ table: string; exists: boolean }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const tables = [
        'users', 
        'contacts', 
        'appointments', 
        'quotes', 
        'quote_items',
        'subscriptions', 
        'commissions', 
        'commission_rules'
      ];
      
      const results = await Promise.all(
        tables.map(async (table) => {
          try {
            const { error } = await supabase.from(table).select('id').limit(1);
            return { table, exists: !error || error.code !== '42P01' };
          } catch (error) {
            return { table, exists: false };
          }
        })
      );
      
      setTablesStatus(results);
    } catch (error) {
      console.error("Erreur lors de la vérification des tables:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStatus();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  };
  
  const getOverallStatus = () => {
    if (isLoading) return "loading";
    if (tablesStatus.length === 0) return "unknown";
    const missingTables = tablesStatus.filter(t => !t.exists);
    if (missingTables.length === 0) return "ok";
    if (missingTables.length === tablesStatus.length) return "not_configured";
    return "partial";
  };
  
  const status = getOverallStatus();
  
  const getStatusBadge = (exists: boolean) => {
    if (exists) {
      return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> OK</Badge>;
    }
    return <Badge variant="destructive"><X className="h-3 w-3 mr-1" /> Manquante</Badge>;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Statut de la base de données
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading || refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
        <CardDescription>
          État des tables et des données dans Supabase
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center">
              <span className="font-medium mr-3">Statut global:</span>
              {status === "ok" && (
                <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Base de données configurée</Badge>
              )}
              {status === "partial" && (
                <Badge variant="outline" className="border-orange-400 text-orange-500">Configuration partielle</Badge>
              )}
              {status === "not_configured" && (
                <Badge variant="destructive">Non configurée</Badge>
              )}
              {status === "unknown" && (
                <Badge variant="outline">Statut inconnu</Badge>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tablesStatus.map(({ table, exists }) => (
                    <TableRow key={table}>
                      <TableCell className="font-medium">{table}</TableCell>
                      <TableCell>{getStatusBadge(exists)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {getTableDescription(table)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

function getTableDescription(table: string): string {
  const descriptions: Record<string, string> = {
    users: "Utilisateurs de l'application (admins, freelances, clients)",
    contacts: "Prospects et clients potentiels",
    appointments: "Rendez-vous avec les contacts/clients",
    quotes: "Devis envoyés aux prospects",
    quote_items: "Éléments détaillés des devis",
    subscriptions: "Abonnements et contrats actifs",
    commissions: "Commissions des freelances",
    commission_rules: "Règles de calcul des commissions par palier"
  };
  
  return descriptions[table] || "Table de l'application";
}

export default DatabaseStatus;
