
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserRole } from "@/types/roles";
import { useAuth } from "@/hooks/use-auth";

const LoginTester: React.FC = () => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [lastTestedRole, setLastTestedRole] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});

  const testUsers = [
    { role: "super_admin", email: "superadmin@example.com", password: "password", label: "Super Admin" },
    { role: "admin", email: "admin@example.com", password: "password", label: "Admin" },
    { role: "account_manager", email: "manager@example.com", password: "password", label: "Chargé de compte" },
    { role: "freelancer", email: "freelancer@example.com", password: "password", label: "Freelance" }
  ];

  const testLogin = async (user: typeof testUsers[0]) => {
    setIsLoading(prev => ({ ...prev, [user.role]: true }));
    setLastTestedRole(user.role);
    
    try {
      const result = await signIn(user.email, user.password);
      
      setTestResults(prev => ({ 
        ...prev, 
        [user.role]: result.success 
      }));
      
      if (result.success) {
        toast.success(`Test de connexion réussi pour ${user.label}`);
      } else {
        toast.error(`Échec du test de connexion pour ${user.label}: ${result.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [user.role]: false }));
      toast.error(`Erreur lors du test pour ${user.label}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [user.role]: false }));
    }
  };

  const getResultText = (role: string) => {
    if (testResults[role] === undefined) return "";
    return testResults[role] ? "Réussi ✅" : "Échec ❌";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test de connexion utilisateurs</CardTitle>
        <CardDescription>
          Testez la connexion pour chaque type d'utilisateur
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50">
          <AlertDescription>
            Ces tests n'affectent pas votre session actuelle. Ils vérifient uniquement si les identifiants fonctionnent.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-4">
          {testUsers.map((user) => (
            <div key={user.role} className="flex items-center justify-between p-2 border rounded-md">
              <div>
                <p className="font-medium">{user.label}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {getResultText(user.role)}
                </span>
                <Button 
                  onClick={() => testLogin(user)} 
                  disabled={isLoading[user.role]}
                  size="sm"
                >
                  {isLoading[user.role] ? "Test..." : "Tester"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginTester;
