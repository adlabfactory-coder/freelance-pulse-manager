
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ResetResult {
  email: string;
  status: "success" | "error";
  message: string;
}

const ResetDemoPasswords: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResetResult[]>([]);

  const handleResetPasswords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("reset-demo-passwords");
      
      if (error) {
        throw error;
      }
      
      setResults(data.results);
      
      // Afficher un toast avec le résumé
      const successCount = data.results.filter((r: ResetResult) => r.status === "success").length;
      
      toast({
        title: "Réinitialisation des mots de passe",
        description: `${successCount} sur ${data.results.length} mots de passe ont été réinitialisés à "123456"`,
      });
      
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des mots de passe:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de réinitialiser les mots de passe. Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Réinitialisation des mots de passe</CardTitle>
          <CardDescription className="text-center">
            Réinitialiser les mots de passe des comptes de démonstration à "123456"
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cette action va réinitialiser les mots de passe des comptes suivants à "123456":
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>admin@example.com (Administrateur)</li>
              <li>commercial@example.com (Chargé(e) d'affaires)</li>
              <li>client@example.com (Client)</li>
              <li>freelance@example.com (Chargé(e) d'affaires)</li>
            </ul>
            
            {results.length > 0 && (
              <div className="mt-4 border rounded-md p-4">
                <h3 className="font-medium mb-2">Résultats:</h3>
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`text-sm p-2 rounded-md ${
                        result.status === "success" ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <span className="font-medium">{result.email}</span>: {result.message}
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
            onClick={handleResetPasswords}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Réinitialisation en cours...
              </>
            ) : (
              "Réinitialiser les mots de passe"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetDemoPasswords;
