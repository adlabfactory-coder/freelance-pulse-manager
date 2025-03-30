
import React, { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SyncResult {
  email: string;
  status: "success" | "error";
  operation: string;
  message: string;
}

const SyncUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SyncResult[]>([]);
  const [summary, setSummary] = useState<string>("");

  const handleSyncUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-users");
      
      if (error) {
        throw error;
      }
      
      setResults(data.results);
      setSummary(data.summary);
      
      toast.success("Synchronisation des utilisateurs", {
        description: data.summary
      });
      
    } catch (error: any) {
      console.error("Erreur lors de la synchronisation des utilisateurs:", error);
      
      toast.error("Erreur", {
        description: error.message || "Impossible de synchroniser les utilisateurs. Veuillez réessayer plus tard."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Synchronisation des utilisateurs</CardTitle>
          <CardDescription className="text-center">
            Synchronisez les utilisateurs entre la table users et auth.users
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cette action va créer des comptes d'authentification pour tous les utilisateurs 
              existants dans la table users et définir leur mot de passe à "123456".
            </p>
            
            {results.length > 0 && (
              <div className="mt-4 border rounded-md p-4">
                <h3 className="font-medium mb-2">
                  Résultats: {summary}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`text-sm p-2 rounded-md ${
                        result.status === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <span className="font-medium">{result.email}</span> ({result.operation}): {result.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSyncUsers}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Synchronisation en cours...
              </>
            ) : (
              "Synchroniser les utilisateurs"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SyncUsers;
