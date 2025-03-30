
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUsersSync } from "@/hooks/use-users-sync";
import { Loader2, RefreshCw, Check, X, AlertTriangle, User } from "lucide-react";
import { Link } from "react-router-dom";

const UsersSyncStatus: React.FC = () => {
  const { loading, syncStatus, summary, refreshStatus } = useUsersSync();

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            État de synchronisation des utilisateurs
          </CardTitle>
          <CardDescription className="text-center">
            Vérification de la synchronisation entre la table users et auth.users dans Supabase
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between mb-4">
              <div className="text-sm">
                <span className="font-medium">Total: </span>
                {summary.total} utilisateurs
              </div>
              <div className="text-sm">
                <span className="font-medium">Synchronisés: </span>
                {summary.synced} utilisateurs
              </div>
              <div className="text-sm">
                <span className="font-medium">Non synchronisés: </span>
                {summary.notSynced} utilisateurs
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-2">Vérification en cours...</span>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-center">Table users</th>
                      <th className="px-4 py-2 text-center">Auth.users</th>
                      <th className="px-4 py-2 text-center">État</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncStatus.map((user, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2 text-center">
                          {user.inUsers ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <Check className="h-4 w-4 mr-1" /> Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              <X className="h-4 w-4 mr-1" /> Non
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {user.inAuth ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <Check className="h-4 w-4 mr-1" /> Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              <X className="h-4 w-4 mr-1" /> Non
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {user.synced ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <Check className="h-4 w-4 mr-1" /> Synchronisé
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4 mr-1" /> Désynchronisé
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {syncStatus.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                          Aucun utilisateur trouvé dans la base de données
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={refreshStatus}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button 
              className="flex-1" 
              asChild
            >
              <Link to="/auth/sync-users">
                Synchroniser les utilisateurs
              </Link>
            </Button>
          </div>
          <div className="w-full">
            <Button 
              className="w-full" 
              variant="ghost"
              asChild
            >
              <Link to="/">
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UsersSyncStatus;
