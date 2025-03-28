
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserRole } from "@/types/roles";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, ShieldAlert } from "lucide-react";

const LoginTester: React.FC = () => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [lastTestedRole, setLastTestedRole] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});

  const testUsers = [
    { role: "super_admin", email: "superadmin@example.com", password: "password", label: "Super Admin", icon: <ShieldAlert className="h-4 w-4 text-purple-600" /> },
    { role: "admin", email: "admin@example.com", password: "password", label: "Admin", icon: <ShieldAlert className="h-4 w-4 text-blue-600" /> },
    { role: "account_manager", email: "manager@example.com", password: "password", label: "Chargé de compte", icon: <ShieldAlert className="h-4 w-4 text-green-600" /> },
    { role: "freelancer", email: "freelancer@example.com", password: "password", label: "Freelance", icon: <ShieldAlert className="h-4 w-4 text-amber-600" /> }
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

  const getResultIcon = (role: string) => {
    if (testResults[role] === undefined) return null;
    return testResults[role] 
      ? <CheckCircle className="h-5 w-5 text-green-500" />
      : <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test de connexion utilisateurs</CardTitle>
        <CardDescription>
          Testez la connexion pour chaque type d'utilisateur sans affecter votre session actuelle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-amber-50">
          <AlertDescription>
            Ces tests vérifient uniquement la validité des identifiants sans affecter votre session actuelle.
          </AlertDescription>
        </Alert>
        
        <div className="grid gap-4">
          {testUsers.map((user) => (
            <div key={user.role} className="flex items-center justify-between p-3 border rounded-md bg-card">
              <div className="flex items-center gap-3">
                {user.icon}
                <div>
                  <p className="font-medium">{user.label}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getResultIcon(user.role)}
                <Button 
                  onClick={() => testLogin(user)} 
                  disabled={isLoading[user.role]}
                  size="sm"
                  variant={testResults[user.role] ? "outline" : "default"}
                >
                  {isLoading[user.role] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Test...
                    </>
                  ) : (
                    testResults[user.role] ? "Retester" : "Tester"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Récapitulatif des tests</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(testResults).map(([role, success]) => {
              const user = testUsers.find(u => u.role === role);
              return user ? (
                <Badge 
                  key={role}
                  variant={success ? "outline" : "destructive"}
                  className="justify-start"
                >
                  {user.label}: {success ? "Réussite" : "Échec"}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginTester;
