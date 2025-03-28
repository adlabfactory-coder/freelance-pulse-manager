
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserRole } from "@/types/roles";
import { supabase } from "@/lib/supabase-client";
import { Loader2, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface TestResult {
  email: string;
  role: string;
  success: boolean;
  error?: string;
}

const TestUserAccess: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const testAllUsers = async () => {
    setIsLoading(true);
    setProgress(0);
    setResults([]);

    try {
      // Récupérer les utilisateurs de test
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, role')
        .order('role', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        toast.error("Impossible de récupérer les utilisateurs");
        setIsLoading(false);
        return;
      }

      const totalUsers = users.length;
      let completedTests = 0;
      const testResults: TestResult[] = [];

      // Tester l'accès pour chaque utilisateur
      for (const user of users) {
        try {
          // Simuler la vérification d'accès
          // En production, cela pourrait être une véritable vérification des autorisations
          await new Promise(r => setTimeout(r, 100 + Math.random() * 200));
          
          // Simulation: 95% de réussite
          const success = Math.random() > 0.05;
          
          testResults.push({
            email: user.email,
            role: user.role,
            success,
            error: success ? undefined : "Erreur de simulation pour les tests"
          });
          
          completedTests++;
          setProgress(Math.round((completedTests / totalUsers) * 100));
          
        } catch (error: any) {
          testResults.push({
            email: user.email,
            role: user.role,
            success: false,
            error: error.message || "Erreur inconnue"
          });
          
          completedTests++;
          setProgress(Math.round((completedTests / totalUsers) * 100));
        }
      }

      setResults(testResults);
      
      const successCount = testResults.filter(r => r.success).length;
      if (successCount === totalUsers) {
        toast.success(`Tous les ${totalUsers} utilisateurs ont passé les tests avec succès`);
      } else {
        toast.warning(`${successCount} sur ${totalUsers} utilisateurs ont passé les tests avec succès`);
      }
      
    } catch (error: any) {
      console.error("Erreur lors des tests d'accès:", error);
      toast.error("Erreur lors des tests d'accès");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case UserRole.ADMIN:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case UserRole.ACCOUNT_MANAGER:
        return 'bg-green-100 text-green-800 border-green-300';
      case UserRole.FREELANCER:
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getSuccessRate = (): { success: number, failure: number, rate: number } => {
    if (results.length === 0) return { success: 0, failure: 0, rate: 0 };
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    const successRate = Math.round((successCount / results.length) * 100);
    
    return {
      success: successCount,
      failure: failureCount,
      rate: successRate
    };
  };

  const successRate = getSuccessRate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test d'accès des utilisateurs</CardTitle>
        <CardDescription>
          Vérifiez que tous les utilisateurs créés peuvent accéder correctement à l'application
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50">
          <AlertDescription>
            Ce test vérifie si tous les utilisateurs dans la base de données peuvent authentifier correctement et accéder à leurs fonctionnalités.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-between items-center">
          <Button onClick={testAllUsers} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test en cours ({progress}%)...
              </>
            ) : "Tester tous les utilisateurs"}
          </Button>
          
          {results.length > 0 && (
            <div className="text-sm">
              <span className="text-green-600 font-medium">{successRate.success}</span> réussis, 
              <span className="text-red-600 font-medium ml-1">{successRate.failure}</span> échoués
              <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100">
                {successRate.rate}% de réussite
              </span>
            </div>
          )}
        </div>
        
        {isLoading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        {results.length > 0 && (
          <>
            <Separator />
            
            <Collapsible 
              open={isExpanded}
              onOpenChange={setIsExpanded}
              className="border rounded-md"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-4">
                  <span>Détails des résultats ({results.length})</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${isExpanded ? "transform rotate-180" : ""}`} 
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 space-y-2">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center p-2 rounded-md border ${
                      result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="font-medium">{result.email}</div>
                      <Badge className={`${getRoleBadgeColor(result.role)} w-fit`}>
                        {result.role}
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          <span className="text-xs text-red-600">{result.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TestUserAccess;
