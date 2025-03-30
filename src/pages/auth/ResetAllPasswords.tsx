
import React, { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ResetResult {
  email: string;
  status: "success" | "error";
  message: string;
}

const ResetAllPasswords: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResetResult[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [resetAllUsers, setResetAllUsers] = useState(false);

  const handleResetPasswords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("reset-demo-passwords", {
        body: { allUsers: resetAllUsers }
      });
      
      if (error) {
        throw error;
      }
      
      setResults(data.results);
      setSummary(data.summary);
      
      toast.success(
        resetAllUsers 
          ? "Réinitialisation des mots de passe pour tous les utilisateurs" 
          : "Réinitialisation des mots de passe des comptes de démonstration",
        {
          description: data.summary
        }
      );
      
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation des mots de passe:", error);
      
      toast.error("Erreur", {
        description: error.message || "Impossible de réinitialiser les mots de passe. Veuillez réessayer plus tard."
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
            Réinitialiser les mots de passe des comptes à "123456"
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="reset-all-users" 
                checked={resetAllUsers} 
                onCheckedChange={setResetAllUsers} 
              />
              <Label htmlFor="reset-all-users">
                Réinitialiser tous les utilisateurs (pas uniquement les comptes démo)
              </Label>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {resetAllUsers 
                ? "Cette action va réinitialiser les mots de passe de TOUS les utilisateurs à '123456'."
                : "Cette action va réinitialiser les mots de passe des comptes de démonstration à '123456':"
              }
            </p>
            
            {!resetAllUsers && (
              <ul className="list-disc pl-6 space-y-1">
                <li>admin@example.com (Administrateur)</li>
                <li>commercial@example.com (Chargé(e) d'affaires)</li>
                <li>client@example.com (Client)</li>
                <li>freelance@example.com (Chargé(e) d'affaires)</li>
              </ul>
            )}
            
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
              resetAllUsers ? "Réinitialiser tous les mots de passe" : "Réinitialiser les mots de passe démo"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetAllPasswords;
